import { NextRequest, NextResponse } from "next/server";
import { searchParts, slugify } from "@/lib/data-loader";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    try {
        // Execute Search (Reusing the Server-Side Cache)
        const { results } = await searchParts(query);

        // Return Top 5 Matches (Slim Response)
        // Return Top 5 Matches with Smart Display Name
        const suggestions = results.slice(0, 5).map(part => {
            let displayName = part.name;

            // Logic: If name starts with Brand (e.g. "Volvo Filter"), strip "Volvo" to avoid "VOLVO Volvo Filter" in UI
            if (displayName.toLowerCase().startsWith(part.brand.toLowerCase())) {
                displayName = displayName.substring(part.brand.length).trim();
                // Remove leading punctuation like ": " or "- "
                displayName = displayName.replace(/^[-:]+\s*/, "");
            }

            // If cleaning resulted in empty string or just the part number, revert or fix
            if (!displayName || displayName === part.partNumber || displayName.length < 3) {
                // Try description fallback
                displayName = part.description && part.description.length < 40 ? part.description : displayName;

                // If still bad, use "Spare Part" or keep original (if distinct)
                if (!displayName || displayName === part.partNumber) {
                    displayName = part.name !== part.partNumber ? part.name : "Spare Part";
                }
            }

            return {
                id: part.id,
                partNumber: part.partNumber,
                brand: part.brand,
                name: displayName,
                url: `/p/${slugify(part.brand)}-${slugify(part.partNumber)}`
            };
        });

        return NextResponse.json({ results: suggestions });
    } catch (error) {
        console.error("Suggestion Error:", error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
