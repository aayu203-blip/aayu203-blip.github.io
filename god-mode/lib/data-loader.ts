import fs from 'fs';
import path from 'path';
import STATIC_DB from '../data/parts-database.json';

// --- TYPE DEFINITIONS ---
export type Part = {
    id: string;
    // Core Identity
    partNumber: string; // The "Hero"
    brand: string;      // Normalized (Volvo, CAT, etc.)
    name: string;       // Enriched Name or Raw Name
    description: string;

    // Commerce
    stock: number;
    price: number | "On Request";

    // Taxonomy
    category: string;
    compatibility: string[];

    // God Mode Specs
    technical_specs?: Record<string, string | number>;

    // Cross Reference Data (New)
    oem_cross_references?: { brand: string, partNumber: string }[];
    cross_reference_numbers?: string[]; // For Fuse.js Indexing

    // Metadata
    source: "static" | "harvest";
};

// --- CACHE (Server-Side Only) ---
let CACHED_DB: Part[] = [];

// --- HELPER: Slugify ---
export function slugify(text: string): string {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
}

// --- MAIN LOADER ---
export async function getParts(): Promise<Part[]> {
    if (CACHED_DB.length > 0) return CACHED_DB;

    console.log("🔥 Loading God Mode Database...");

    // 1. Load AI Enrichment Data (The "Brain")
    let enrichedSpecs: Record<string, any> = {};
    try {
        // Changed to normalized 'enriched_product_data.json'
        const enrichedPath = path.join(process.cwd(), 'data', 'enriched_product_data.json');
        if (fs.existsSync(enrichedPath)) {
            const raw = fs.readFileSync(enrichedPath, 'utf-8');
            enrichedSpecs = JSON.parse(raw);
            console.log(`✅ Loaded ${Object.keys(enrichedSpecs).length} AI-Enriched Specs.`);
        }
    } catch (e) {
        console.error("⚠️ Failed to load AI Specs:", e);
    }

    // 2. Process Static DB
    const staticParts: Part[] = (STATIC_DB as any[]).map(p => {
        // Enrichment Key is just Part Number in the new format
        const partNum = p.partNumber || p.id;
        const enrichment = enrichedSpecs[partNum];

        // Extract Cross Refs for Search
        const xRefs = enrichment?.cross_references || [];
        const xRefNums = xRefs.map((x: any) => x.part_number);

        return {
            id: `static-${p.id}`,
            partNumber: partNum,
            brand: p.brand || "Volvo",
            // Use AI Label if available, else static
            name: enrichment?.part_label || p.name,
            description: enrichment?.description || p.description || "",
            stock: 10,
            price: "On Request",
            category: p.category || "Uncategorized",
            compatibility: p.compatibility || [],

            // New Cross Reference Fields
            oem_cross_references: xRefs,
            cross_reference_numbers: xRefNums,

            // AI Features joined as spec if available
            technical_specs: enrichment ? {
                "Application": enrichment.application,
                "Key Features": (enrichment.features || []).join(", ")
            } : undefined,
            source: "static"
        };
    });

    // 3. Process Harvested DB (JSONL)
    let harvestedParts: Part[] = [];
    try {
        const livePath = path.join(process.cwd(), 'data', 'full_dataset.jsonl');
        if (fs.existsSync(livePath)) {
            const fileContent = fs.readFileSync(livePath, 'utf-8');
            harvestedParts = fileContent.split('\n')
                .filter(line => line.trim().length > 0)
                .map((line, idx) => {
                    try {
                        const raw = JSON.parse(line);
                        // Normalize Brand
                        let brand = "Generic";
                        const lowerComp = (raw.compatibility || "").toLowerCase();
                        if (lowerComp.includes("volvo")) brand = "Volvo";
                        else if (lowerComp.includes("scania")) brand = "Scania";
                        else if (lowerComp.includes("cat")) brand = "CAT";
                        else if (lowerComp.includes("komatsu")) brand = "Komatsu";
                        else if (lowerComp.includes("hitachi")) brand = "Hitachi";
                        else if (lowerComp.includes("beml")) brand = "BEML";
                        else if (lowerComp.includes("hyundai")) brand = "Hyundai";
                        else if (lowerComp.includes("sany")) brand = "Sany";
                        else if (lowerComp.includes("liugong")) brand = "Liugong";
                        else if (lowerComp.includes("mait")) brand = "Mait";
                        else if (lowerComp.includes("soilmec")) brand = "Soilmec";

                        if (brand === "Generic") return null; // Strict Quality Control

                        const partNumber = raw.part_number || "unknown";

                        // Check Enrichment
                        const enrichment = enrichedSpecs[partNumber];

                        // Extract Cross Refs for Search
                        const xRefs = enrichment?.cross_references || [];
                        const xRefNums = xRefs.map((x: any) => x.part_number);

                        return {
                            id: `harvest-${idx}`,
                            partNumber: partNumber,
                            brand: brand,
                            name: enrichment?.part_label || raw.name || "Industrial Component",
                            description: enrichment?.description || raw.marketing_description || raw.description || "Authentic aftermarket part.",
                            stock: 50, // Simulation
                            price: "On Request",
                            category: "Engine Parts", // TODO: AI Categorization
                            compatibility: raw.compatibility ? [raw.compatibility] : [],
                            oem_cross_references: xRefs,
                            cross_reference_numbers: xRefNums,
                            technical_specs: enrichment ? {
                                "Application": enrichment.application,
                                "Key Features": (enrichment.features || []).join(", ")
                            } : undefined,
                            source: "harvest"
                        };
                    } catch (e) { return null; }
                })
                .filter(p => p !== null) as Part[];
        }
    } catch (e) {
        console.error("⚠️ Failed to load Harvest Data:", e);
    }

    CACHED_DB = [...staticParts, ...harvestedParts];
    console.log(`✅ Loaded ${CACHED_DB.length} parts into memory.`);
    return CACHED_DB;
}

export async function getPartBySlug(brand: string, partNumber: string): Promise<Part | undefined> {
    const parts = await getParts();
    // Fuzzy-ish match
    return parts.find(p =>
        slugify(p.brand) === slugify(brand) &&
        slugify(p.partNumber) === slugify(partNumber)
    );
}

export async function getPartsByBrand(brandSlug: string): Promise<Part[]> {
    const parts = await getParts();
    return parts.filter(p => slugify(p.brand) === slugify(brandSlug));
}

export async function getPartsByCategory(categorySlug: string): Promise<Part[]> {
    const parts = await getParts();
    // Fuzzy matching for category or compatibility
    const target = slugify(categorySlug);
    return parts.filter(p =>
        slugify(p.category).includes(target) ||
        p.compatibility.some(c => slugify(c).includes(target))
    );
}

export async function getFeaturedParts(): Promise<Part[]> {
    const parts = await getParts();
    // Specific high-quality parts for the homepage
    const targets = [
        { brand: "CAT", pn: "1R-0716" },
        { brand: "Volvo", pn: "14524125" },
        { brand: "Komatsu", pn: "205-70-19570" }
    ];

    const featured: Part[] = [];

    for (const t of targets) {
        // Try strict match first
        let match = parts.find(p =>
            p.partNumber.toUpperCase() === t.pn &&
            slugify(p.brand).includes(slugify(t.brand))
        );

        // Fallback to purely static object if not found (Safety for Demo)
        if (!match) {
            match = {
                id: `featured-mock-${t.pn}`,
                partNumber: t.pn,
                brand: t.brand,
                name: "Premium Component",
                description: "High-performance OEM specification part.",
                category: "Featured",
                stock: 50,
                price: "On Request",
                compatibility: [],
                source: "static",
                technical_specs: { "Status": "Catalog Item" }
            };
        }
        featured.push(match);
    }
    return featured;
}

import Fuse from 'fuse.js';

// God Mode Search (Fuse.js for Fuzzy Matching Phase 2)
let FUSE_INSTANCE: Fuse<Part> | null = null;

export async function searchParts(query: string): Promise<{ results: Part[], duration: number }> {
    const parts = await getParts();

    if (!FUSE_INSTANCE) {
        console.log("🚀 Initializing Fuse.js Engine...");
        const options = {
            includeScore: true,
            keys: [
                { name: 'partNumber', weight: 1.0 },
                { name: 'cross_reference_numbers', weight: 1.0 }, // HIGH WEIGHT for Hybrid Search
                { name: 'brand', weight: 0.4 },
                { name: 'name', weight: 0.3 },
                { name: 'category', weight: 0.2 },
                { name: 'compatibility', weight: 0.1 }
            ],
            threshold: 0.3, // 0.0 = Exact match, 1.0 = Match anything. 0.3 is good for lenient typos.
            ignoreLocation: true // Search anywhere in the string
        };
        FUSE_INSTANCE = new Fuse(parts, options);
    }

    const start = performance.now();
    const fuseResults = FUSE_INSTANCE.search(query);
    const end = performance.now();
    const duration = end - start;

    console.log(`🔎 Search for "${query}" took ${duration.toFixed(2)}ms. Found ${fuseResults.length}.`);

    return {
        results: fuseResults.slice(0, 50).map(r => r.item),
        duration: duration
    };
}
