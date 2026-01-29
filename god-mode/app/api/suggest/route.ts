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
        const suggestions = results.slice(0, 5).map(part => ({
            id: part.id,
            partNumber: part.partNumber,
            brand: part.brand,
            name: part.name,
            url: `/p/${slugify(part.brand)}-${slugify(part.partNumber)}`
        }));

        return NextResponse.json({ results: suggestions });
    } catch (error) {
        console.error("Suggestion Error:", error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
