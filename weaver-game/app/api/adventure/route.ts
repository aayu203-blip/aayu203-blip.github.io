import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { WEAVER_SYSTEM_PROMPT } from "@/lib/systemPrompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { history, currentStats, turnCount } = await request.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: WEAVER_SYSTEM_PROMPT,
    });

    // Construct the prompt
    const memorySeed = "User has affinity for vanilla skies, messy charcoal, old bookstores.";
    const context = `Turn: ${turnCount}/18. Stats: ${JSON.stringify(currentStats)}.`;

    let arcInstructions = "";
    if (turnCount >= 1 && turnCount <= 5) {
      arcInstructions = "Phase: Disorientation. Keep choices observant.";
    } else if (turnCount >= 13 && turnCount <= 18) {
      arcInstructions = "Phase: Convergence. Begin settling. Move toward a soft close.";
    }

    // Build conversation history for context
    let historyContext = "";
    if (history && history.length > 0) {
      historyContext = "\n\nPrevious conversation:\n" + history.map((h: string) => `- ${h}`).join("\n");
    }

    const fullPrompt = `${memorySeed}

${context}

${arcInstructions}

${historyContext}

Generate the next turn. Remember: Output MUST be valid JSON only.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        response_mime_type: "application/json",
      },
    });

    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonResponse = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Failed to parse JSON response from AI");
      }
    }

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Error in adventure API:", error);
    return NextResponse.json(
      { error: "Failed to generate adventure" },
      { status: 500 }
    );
  }
}

