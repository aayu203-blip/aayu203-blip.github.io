import { getParts } from '@/lib/data-loader';
import { NextResponse } from 'next/server';
import Fuse from 'fuse.js';

// Fuzzy search configuration
const fuseOptions = {
    keys: [
        { name: 'partNumber', weight: 2.0 },      // Highest priority
        { name: 'brand', weight: 1.5 },
        { name: 'name', weight: 1.0 },
        { name: 'category', weight: 0.8 },
        { name: 'compatibility', weight: 0.5 },
    ],
    threshold: 0.3,  // Lower = stricter matching (0.3 allows typos)
    ignoreLocation: true,
    useExtendedSearch: true,
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
        return NextResponse.json({ results: [] });
    }

    const allParts = await getParts();

    // Initialize Fuse with all parts
    const fuse = new Fuse(allParts, fuseOptions);

    // Perform fuzzy search
    const fuseResults = fuse.search(q, { limit: 20 });

    // Extract the actual items from Fuse results and format them
    const results = fuseResults.map(result => ({
        ...result.item,
        display_name: result.item.name // Simple display name
    }));

    return NextResponse.json({ results });
}
