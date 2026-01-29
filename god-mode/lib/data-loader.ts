import fs from 'fs';
import path from 'path';
import STATIC_DB from '../data/parts-database.json';
import Fuse from 'fuse.js';

// --- TYPE DEFINITIONS ---
import { Part, slugify } from './utils';
import { translateTitle, translateTerm } from './dictionary';

export type { Part }; // Re-export for convenience
export { slugify };   // Re-export for convenience

// --- CACHE (Server-Side Only) ---
let CACHED_DB: Part[] = [];

export async function getPartsCount(): Promise<number> {
    if (CACHED_DB.length > 0) return CACHED_DB.length;

    // Quick load for count logic
    const enrichedPath = path.join(process.cwd(), 'data', 'enriched_product_data.json');
    let enrichedCount = 0;
    try {
        if (fs.existsSync(enrichedPath)) {
            // Read only needed bytes or parse roughly
            const raw = fs.readFileSync(enrichedPath, 'utf-8');
            enrichedCount = Object.keys(JSON.parse(raw)).length;
        }
    } catch { }

    return (STATIC_DB as any[]).length + enrichedCount;
}

// --- MAIN LOADER ---
export async function getParts(locale: string = 'en'): Promise<Part[]> {
    try {
        if (CACHED_DB.length > 0) {
            if (locale === 'en') return CACHED_DB;
            return CACHED_DB.map(part => ({
                ...part,
                name: translateTitle(part.name, locale),
                category: translateTerm(part.category, locale),
            }));
        }

        console.log("🔥 Loading God Mode Database...");

        // VERCEL PRODUCTION MODE: Skip large file loading to prevent OOM
        const isVercelProduction = process.env.VERCEL_ENV === 'production';
        if (isVercelProduction) {
            console.log("⚡ Running in Vercel production - using minimal dataset");
            // Return only first 50 items from static DB to prevent memory issues
            CACHED_DB = (STATIC_DB as any[]).slice(0, 50).map((p, idx) => ({
                id: `static-${idx}`,
                partNumber: p.partNumber || p.id,
                brand: p.brand || "Volvo",
                name: p.name,
                description: p.description || "",
                stock: 10,
                price: "On Request" as const,
                category: p.category || "Uncategorized",
                compatibility: p.compatibility || [],
                oem_cross_references: [],
                cross_reference_numbers: [],
                technical_specs: undefined,
                source: "static" as const
            }));
            console.log(`✅ Loaded ${CACHED_DB.length} parts (minimal mode).`);
            return CACHED_DB;
        }

        // DEVELOPMENT MODE: Full data loading
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

        // 3. Process Harvested DB (JSONL) - DISABLED FOR MEMORY OPTIMIZATION
        // TODO: Move to database or API endpoint for production
        let harvestedParts: Part[] = [];
        /* TEMPORARILY DISABLED - CAUSES VERCEL OOM
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
        */

        CACHED_DB = [...staticParts, ...harvestedParts];
        console.log(`✅ Loaded ${CACHED_DB.length} parts into memory.`);
        return CACHED_DB;
    } catch (error) {
        console.error("🚨 CRITICAL: getParts() failed completely:", error);
        // Return minimal fallback to prevent site crash
        return [];
    }
}

export async function getPartBySlug(brand: string, partNumber: string, locale: string = 'en'): Promise<Part | undefined> {
    const parts = await getParts(locale);
    // Fuzzy-ish match
    return parts.find(p =>
        slugify(p.brand) === slugify(brand) &&
        slugify(p.partNumber) === slugify(partNumber)
    );
}

export async function getPartsByBrand(brandSlug: string, locale: string = 'en'): Promise<Part[]> {
    const parts = await getParts(locale);
    return parts.filter(p => slugify(p.brand) === slugify(brandSlug));
}

export async function getPartsByCategory(categorySlug: string, locale: string = 'en'): Promise<Part[]> {
    const parts = await getParts(locale);
    // Fuzzy matching for category or compatibility
    const target = slugify(categorySlug);
    return parts.filter(p =>
        slugify(p.category).includes(target) ||
        p.compatibility.some(c => slugify(c).includes(target))
    );
}

export async function getFeaturedParts(): Promise<Part[]> {
    const parts = await getParts();

    // If we have fewer than 3 parts (minimal mode), just return what we have
    if (parts.length < 3) {
        return parts;
    }

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

        // If not found, just use any part from that brand
        if (!match) {
            match = parts.find(p => slugify(p.brand).includes(slugify(t.brand)));
        }

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

    // If we still don't have 3 parts, fill with first available parts
    while (featured.length < 3 && parts.length > 0) {
        const nextPart = parts[featured.length];
        if (nextPart && !featured.find(f => f.id === nextPart.id)) {
            featured.push(nextPart);
        } else {
            break;
        }
    }

    return featured.slice(0, 3);
}

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
