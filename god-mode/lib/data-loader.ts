import fs from 'fs';
import path from 'path';
import STATIC_DB from '../data/parts-database.json';
import GUIDES_DB from '../data/generated_guides.json';
import Fuse from 'fuse.js';
import { MACHINE_CATALOG } from './taxonomy'; // Import Taxonomy

// --- TYPE DEFINITIONS ---
import { Part, slugify } from './utils';
export type { Part };
export { slugify };

// New Types for Universal Router
export type GuideData = {
    id: string;
    title: string;
    slug: string;
    machineSlug: string; // Added machineSlug
    excerpt: string;
    content: string; // Markdown or HTML
    datePublished: string; // Added datePublished
    coverImage?: string; // Added coverImage
    relatedParts?: Part[]; // Changed to Part[] for direct access
};

export type BrandData = {
    name: string;
    slug: string;
    totalParts: number;
    description: string;
    popularModels: string[];
    recentParts: Part[];
    examplePart: string;
    guides: GuideData[];
};

export type MachineData = {
    brand: string;
    model: string;
    totalParts: number;
    parts: Part[];
    engineType?: string; // Added stub
};


// --- CACHE (Server-Side Only) ---
let CACHED_DB: Part[] = [];
let CACHED_GUIDES: GuideData[] = [];

// --- MAIN LOADER ---
export async function getParts(locale: string = 'en'): Promise<Part[]> {
    try {
        if (CACHED_DB.length > 0) return CACHED_DB;

        // Use static import for Vercel compatibility (bundled at build time)
        const rawData = STATIC_DB as any[];

        CACHED_DB = (rawData as any[]).map((p, idx) => ({
            id: p.id || `static-${idx}`,
            partNumber: p.part_number || p.partNumber || "Unknown",
            brand: p.brand || "Volvo",
            name: p.technical_specs?.["Part Name"] || p.technical_specs?.["Product Name"] || p.technical_specs?.["Product Type"] || p.product_name || p.name || "Unknown Part",
            description: p.description || "",
            stock: 10,
            price: "On Request" as "On Request",
            category: p.category || "Uncategorized",
            compatibility: p.compatibility || [],
            oem_cross_references: p.oem_cross_references || [],
            cross_reference_numbers: [
                ...(p.cross_reference_numbers || []),
                // Extract "Alternate Part Numbers" from technical_specs if available (Safe Check)
                ...(p.technical_specs?.["Alternate Part Numbers"] && typeof p.technical_specs["Alternate Part Numbers"] === 'string'
                    ? p.technical_specs["Alternate Part Numbers"].split(',').map((s: string) => s.trim())
                    : []),
                ...(p.technical_specs?.["Cross-Reference Numbers"] && typeof p.technical_specs["Cross-Reference Numbers"] === 'string'
                    ? p.technical_specs["Cross-Reference Numbers"].split(',').map((s: string) => s.trim())
                    : [])
            ],
            technical_specs: p.technical_specs || undefined,
            source: "static" as const
        })).filter(p => p.partNumber.length > 2 && p.partNumber !== "Unknown"); // SANITIZE: Remove ghosts

        console.log(`[DATA-LOADER] Loaded ${CACHED_DB.length} parts from static import`);
        return CACHED_DB;
    } catch (error) {
        console.error("🚨 CRITICAL: getParts() failed", error);
        return [];
    }
}

// --- UNIVERSAL ACCESSORS ---

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
 * Get Brand Data + Hub Logic
 */
export async function getBrandData(slug: string): Promise<BrandData | undefined> {
    const parts = await getParts();
    // Normalize slug (e.g. "caterpillar" vs "cat")
    const brandName = parts.find(p => slugify(p.brand) === slugify(slug))?.brand;

    if (!brandName && !MACHINE_CATALOG[slugify(slug)]) return undefined;

    const realName = brandName || slug.toUpperCase();
    const brandParts = parts.filter(p => slugify(p.brand) === slugify(realName));

    // HUB LOGIC: Find popular models from parts compatibility
    const allModels = brandParts.flatMap(p => p.compatibility || []);
    const modelCounts = allModels.reduce((acc, model) => {
        acc[model] = (acc[model] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const popularModels = Object.entries(modelCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 9)
        .map(([m]) => m);

    // Find related guides
    const relevantGuides = (GUIDES_DB as any[]).filter(g => g.slug.includes(slugify(realName))).map(g => ({
        ...g,
        relatedParts: [] // shallow load
    }));

    return {
        name: realName,
        slug: slugify(realName),
        totalParts: brandParts.length,
        description: `Browse verified aftermarket parts for ${realName}.`,
        popularModels: popularModels.length > 0 ? popularModels : (MACHINE_CATALOG[slugify(realName)] ? Object.values(MACHINE_CATALOG[slugify(realName)]).flat().slice(0, 6) : []),
        recentParts: brandParts.slice(0, 5),
        examplePart: brandParts[0]?.partNumber || "123-456",
        guides: relevantGuides
    };
}

/**
 * Get Machine Data + Categorization
 */
export async function getMachineData(brandName: string, machineModel: string): Promise<MachineData | undefined> {
    const parts = await getParts();
    const targetModelS = slugify(machineModel);

    // Find parts that mention this model in compatibility
    const compatibleParts = parts.filter(p =>
        p.compatibility.some(c => slugify(c).includes(targetModelS))
    );

    if (compatibleParts.length === 0) return undefined;

    // Categorization logic could go here if category field is reliable
    // For now we pass all parts and let the view filter

    return {
        brand: brandName,
        model: machineModel.toUpperCase(),
        totalParts: compatibleParts.length,
        parts: compatibleParts,
        engineType: "Diesel (Standard)" // Mock data or extract from taxonomy if available
    };
}

/**
 * Get Guide with Product Trap
 */
export async function getGuideBySlug(slug: string): Promise<GuideData | undefined> {
    const rawGuide = (GUIDES_DB as any[]).find(g => g.slug === slug);
    if (!rawGuide) return undefined;

    const parts = await getParts();
    // REAL-TIME LINKING: Find parts that match the guide's machine
    const linkedParts = parts.filter(p =>
        p.compatibility.some(m => slugify(m) === slugify(rawGuide.machineSlug))
    ).slice(0, 3);

    return {
        ...rawGuide,
        relatedParts: linkedParts
    };
}

// --- KEEPING OLD EXPORTS FOR COMPATIBILITY ---
export async function getPartsByBrand(brand: string, locale: string = 'en') {
    return (await getParts(locale)).filter(p => slugify(p.brand) === slugify(brand));
}

export async function getPartsByCategory(category: string, locale: string = 'en') {
    return (await getParts(locale)).filter(p => slugify(p.category) === slugify(category));
}

export async function getFeaturedParts(): Promise<Part[]> {
    const parts = await getParts();
    return parts.slice(0, 3);
}

// --- SEARCH ENGINE ---
let FUSE_INSTANCE: Fuse<Part> | null = null;
export async function searchParts(query: string): Promise<{ results: Part[], duration: number }> {
    const parts = await getParts();
    if (!FUSE_INSTANCE) {
        FUSE_INSTANCE = new Fuse(parts, {
            keys: [
                { name: 'partNumber', weight: 2 },
                { name: 'brand', weight: 2 },
                { name: 'name', weight: 1 },
                { name: 'cross_reference_numbers', weight: 1 }
            ],
            threshold: 0.4
        });
    }
    const start = performance.now();
    const res = FUSE_INSTANCE.search(query).slice(0, 50).map(r => r.item);
    return { results: res, duration: performance.now() - start };
}
