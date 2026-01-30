import fs from 'fs';
import path from 'path';
import STATIC_DB from '../data/parts-database.json';
import Fuse from 'fuse.js';
import { MACHINE_CATALOG } from './taxonomy'; // Import Taxonomy

// --- TYPE DEFINITIONS ---
import { Part, slugify } from './utils';
import { translateTitle, translateTerm } from './dictionary';

export type { Part };
export { slugify };

// New Types for Universal Router
export type BrandData = {
    name: string;
    slug: string;
    totalParts: number;
    description: string;
    machines: Record<string, string[]>; // Category -> Models
};

export type MachineData = {
    brand: string;
    model: string;
    category: string | null;
    compatibleParts: Part[];
};

export type GuideData = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string; // Markdown or HTML
    relatedParts?: string[];
};

// --- CACHE (Server-Side Only) ---
let CACHED_DB: Part[] = [];
let CACHED_GUIDES: GuideData[] = [];

export async function getPartsCount(): Promise<number> {
    if (CACHED_DB.length > 0) return CACHED_DB.length;
    // ... same logical quick count ...
    return (STATIC_DB as any[]).length;
}

// --- MAIN LOADER ---
export async function getParts(locale: string = 'en'): Promise<Part[]> {
    try {
        if (CACHED_DB.length > 0) return CACHED_DB; // TODO: simple locale map if needed

        console.log("🔥 Loading God Mode Database...");

        // VERCEL PRODUCTION MODE logic (Optimized)
        const isVercelProduction = process.env.VERCEL_ENV === 'production';
        if (isVercelProduction) {
            CACHED_DB = (STATIC_DB as any[]).slice(0, 100).map((p, idx) => ({
                id: `static-${idx}`,
                partNumber: p.partNumber || p.id,
                brand: p.brand || "Volvo",
                name: p.name,
                description: p.description || "",
                stock: 10,
                price: "On Request",
                category: p.category || "Uncategorized",
                compatibility: p.compatibility || [],
                oem_cross_references: [],
                cross_reference_numbers: [],
                technical_specs: undefined,
                source: "static"
            }));
            return CACHED_DB;
        }

        // DEV MODE: Full Load
        let enrichedSpecs: Record<string, any> = {};
        try {
            const enrichedPath = path.join(process.cwd(), 'data', 'enriched_product_data.json');
            if (fs.existsSync(enrichedPath)) {
                enrichedSpecs = JSON.parse(fs.readFileSync(enrichedPath, 'utf-8'));
            }
        } catch { }

        CACHED_DB = (STATIC_DB as any[]).map(p => {
            const partNum = p.partNumber || p.id;
            const enrichment = enrichedSpecs[partNum];
            return {
                id: `static-${p.id}`,
                partNumber: partNum,
                brand: p.brand || "Volvo",
                name: enrichment?.part_label || p.name,
                description: enrichment?.description || p.description || "",
                stock: 10,
                price: "On Request",
                category: p.category || "Uncategorized",
                compatibility: p.compatibility || [],
                oem_cross_references: enrichment?.cross_references || [],
                cross_reference_numbers: (enrichment?.cross_references || []).map((x: any) => x.part_number),
                technical_specs: enrichment ? {
                    "Application": enrichment.application,
                    "Key Features": (enrichment.features || []).join(", ")
                } : undefined,
                source: "static"
            };
        });

        return CACHED_DB;
    } catch (error) {
        console.error("🚨 CRITICAL: getParts() failed", error);
        return [];
    }
}

// --- UNIVERSAL ACCESSORS ---

/**
 * Smart Lookup for Part Details
 * Handles: "cat-1r0716", "1r-0716", "volvo/11110534"
 */
export async function getPartBySlug(slugPath: string): Promise<Part | undefined> {
    const parts = await getParts();
    const normalizedSlug = slugPath.toLowerCase().replace(/[^a-z0-9]/g, '');

    return parts.find(p => {
        const pSlug = `${p.brand}-${p.partNumber}`.toLowerCase().replace(/[^a-z0-9]/g, '');
        const pnOnly = p.partNumber.toLowerCase().replace(/[^a-z0-9]/g, '');

        return pSlug === normalizedSlug || pnOnly === normalizedSlug;
    });
}

/**
 * Get Brand Data + Taxonomy
 */
export async function getBrandData(slug: string): Promise<BrandData | undefined> {
    const parts = await getParts();
    // Normalize slug (e.g. "caterpillar" vs "cat")
    // Simple verification: Does this brand exist in our DB?
    const brandName = parts.find(p => slugify(p.brand) === slugify(slug))?.brand;

    // Also check Taxonomy
    const taxonomyInfo = MACHINE_CATALOG[slug.toLowerCase()] || MACHINE_CATALOG[slugify(slug)];

    if (!brandName && !taxonomyInfo) return undefined;

    const realName = brandName || slug.toUpperCase();
    const brandParts = parts.filter(p => slugify(p.brand) === slugify(realName));

    return {
        name: realName,
        slug: slugify(realName),
        totalParts: brandParts.length,
        description: `Browse verified aftermarket parts for ${realName}.`,
        machines: taxonomyInfo || {}
    };
}

/**
 * Get Machine Data
 */
export async function getMachineData(brandName: string, machineModel: string): Promise<MachineData | undefined> {
    const parts = await getParts();
    const targetModel = machineModel.toLowerCase();

    // Find parts that mention this model in compatibility
    const compatibleParts = parts.filter(p =>
        p.compatibility.some(c => c.toLowerCase().includes(targetModel))
    );

    // Verify machine exists in taxonomy? (Optional, but good for validation)
    const taxonomy = MACHINE_CATALOG[brandName.toLowerCase()];
    let category = null;
    if (taxonomy) {
        for (const [cat, models] of Object.entries(taxonomy)) {
            if (models.some(m => m.toLowerCase() === targetModel)) {
                category = cat;
                break;
            }
        }
    }

    if (compatibleParts.length === 0 && !category) return undefined;

    return {
        brand: brandName,
        model: machineModel.toUpperCase(),
        category,
        compatibleParts
    };
}

/**
 * Get Guide
 */
export async function getGuideBySlug(slug: string): Promise<GuideData | undefined> {
    if (CACHED_GUIDES.length === 0) {
        try {
            const guidePath = path.join(process.cwd(), 'data', 'generated_guides.json');
            if (fs.existsSync(guidePath)) {
                const raw = JSON.parse(fs.readFileSync(guidePath, 'utf-8'));
                // Normalize structure
                CACHED_GUIDES = Array.isArray(raw) ? raw : Object.values(raw);
            }
        } catch (e) { console.error("Failed to load guides", e); }
    }

    return CACHED_GUIDES.find(g => g.slug === slug);
}

// --- KEEPING OLD EXPORTS FOR COMPATIBILITY (Optional) ---
export async function getPartsByBrand(brand: string, locale: string = 'en') {
    return (await getParts(locale)).filter(p => slugify(p.brand) === slugify(brand));
}

export async function getFeaturedParts(): Promise<Part[]> {
    const parts = await getParts();
    // ... simple implementation ...
    return parts.slice(0, 3);
}

// --- SEARCH ENGINE ---
let FUSE_INSTANCE: Fuse<Part> | null = null;
export async function searchParts(query: string): Promise<{ results: Part[], duration: number }> {
    const parts = await getParts();
    if (!FUSE_INSTANCE) {
        FUSE_INSTANCE = new Fuse(parts, {
            keys: ['partNumber', 'brand', 'name', 'cross_reference_numbers'],
            threshold: 0.3
        });
    }
    const start = performance.now();
    const res = FUSE_INSTANCE.search(query).slice(0, 50).map(r => r.item);
    return { results: res, duration: performance.now() - start };
}
