import fs from 'fs';
import path from 'path';
import STATIC_DB from '../data/parts-database.json';

export type Part = {
    id: string;
    name: string;
    partNumber: string;
    brand: string;
    description: string;
    price: number;
    stock: number;
    compatibility: string[];
    category: string;
    image?: string;
    tier: 1 | 2;
    // Extended fields for rich display
    technical_specs?: Record<string, string | number | undefined>;
    application?: string;
};

let CACHED_DB: Part[] = [];

export async function getParts(): Promise<Part[]> {
    if (CACHED_DB.length > 0) return CACHED_DB;

    // 1. Convert Static DB
    const staticParts = (STATIC_DB as any[]).map(p => ({
        id: `static-${p.id}`,
        name: p.name,
        partNumber: p.partNumber || p.id,
        brand: p.brand || "Volvo", // Default to Volvo if missing
        description: p.description || "",
        price: 0, // Request Quote
        stock: 10,
        compatibility: p.compatibility || [],
        category: p.category || "Parts",
        tier: 1 as const
    }));

    // 2. Load Enriched Specs (The "Intelligence" Layer)
    let enrichedSpecs: Record<string, any> = {};
    try {
        const enrichedPath = path.join(process.cwd(), 'data', 'enriched_specs.json');
        if (fs.existsSync(enrichedPath)) {
            enrichedSpecs = JSON.parse(fs.readFileSync(enrichedPath, 'utf-8'));
        }
    } catch (e) {
        console.error("Failed to load enriched specs:", e);
    }

    // 3. Load Live Harvest
    let liveParts: Part[] = [];
    try {
        const livePath = path.join(process.cwd(), 'full_dataset.jsonl');
        if (fs.existsSync(livePath)) {
            const fileContent = fs.readFileSync(livePath, 'utf-8');

            liveParts = fileContent.split('\n')
                .filter(line => line.trim().length > 0)
                .map((line, idx) => {
                    try {
                        const raw = JSON.parse(line);

                        // Extract Brand
                        let brand = "Generic";
                        const lowerComp = (raw.compatibility || "").toLowerCase();
                        if (lowerComp.includes("volvo")) brand = "Volvo";
                        else if (lowerComp.includes("scania")) brand = "Scania";
                        else if (lowerComp.includes("cat")) brand = "CAT";
                        else if (lowerComp.includes("komatsu")) brand = "Komatsu";

                        // 🛡️ THE CLEANER: Strict Brand Filter
                        // If it's not one of our core brands, SKIP IT.
                        if (brand === "Generic") return null;

                        const partNumber = raw.part_number || "N/A";

                        // Check for enrichment
                        const enrichKey = `${brand}_${partNumber}`.replace(/ /g, "_");
                        const enrichment = enrichedSpecs[enrichKey];

                        return {
                            id: `harvest-${idx}`,
                            name: raw.name || "Unknown Part",
                            partNumber: partNumber,
                            brand: brand,
                            description: enrichment?.marketing_description || raw.description || "Aftermarket Part",
                            price: 0,
                            stock: 5,
                            compatibility: raw.compatibility ? [raw.compatibility] : [],
                            category: "Engine Parts",
                            tier: 2 as const,
                            // Injected Intelligence
                            technical_specs: enrichment?.technical_specs,
                            application: enrichment?.application || raw.compatibility
                        };
                    } catch (e) { return null; }
                })
                .filter(p => p !== null) as Part[];
        }
    } catch (e) {
        console.error("Failed to load live harvest data:", e);
    }

    CACHED_DB = [...staticParts, ...liveParts];
    console.log(`🔥 Loaded Database: ${staticParts.length} Static + ${liveParts.length} Live Records.`);

    return CACHED_DB;
}

// Helper to safe-url
export function slugify(text: string): string {
    return text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
        .replace(/(^-|-$)+/g, ''); // Remove leading/trailing dashes
}

export async function getPartBySlug(slug: string): Promise<Part | undefined> {
    const parts = await getParts();
    return parts.find(p => {
        const s = slugify(`${p.brand}-${p.partNumber}`);
        return s === slug;
    });
}

export async function getPartsByBrand(brandName: string): Promise<Part[]> {
    const parts = await getParts();
    return parts.filter(p => p.brand.toLowerCase() === brandName.toLowerCase());
}

export function getDisplayName(part: Part): string {
    if (!part) return "Unknown Part";

    // Naming Strategy: [Part Number] [Brand] [Enriched Application/Raw Name]
    // Example: "1521725 Volvo Oil Filter Housing"

    let descriptiveName = part.name;

    // If we have an enriched "Application" (e.g. "Rock Drill Buffer Ring"), use it.
    // Otherwise check if raw name is generic ("Ring") and try to make it better? 
    // For now we rely on the enriched application if present.
    if (part.application && part.application.length < 50) {
        descriptiveName = part.application;
    }

    return `${part.partNumber} ${part.brand} ${descriptiveName}`.trim();
}
