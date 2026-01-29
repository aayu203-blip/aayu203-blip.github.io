import { slugify } from "./data-loader";

export interface Guide {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string; // HTML content
    author: string;
    date: string;
    tags: string[];
    relatedParts?: string[]; // Array of Part Numbers
    coverImage?: string;
}

const GUIDES: Guide[] = [
    // Fallback static guide
    {
        id: "1",
        slug: "volvo-excavator-maintenance-guide",
        title: "The Ultimate Maintenance Checklist for Volvo Excavators",
        excerpt: "Prevent costly downtime with this comprehensive 500-hour service interval checklist for EC-Series excavators.",
        author: "Chief Engineer S. K. Gupta",
        date: "2024-03-15",
        tags: ["Maintenance", "Volvo", "Excavators"],
        relatedParts: ["1R-0716", "11110534"],
        content: `
            <p>Maintaining your <strong>Volvo</strong> heavy machinery is critical...</p>
        `
    }
];

export async function getAllGuides(): Promise<Guide[]> {
    try {
        // Dynamic import to avoid build errors if file is missing initially
        // @ts-ignore
        const generated = await import("@/../data/generated_guides.json");
        // Combine static fallback with generated content
        if (generated.default && Array.isArray(generated.default)) {
            return [...generated.default, ...GUIDES];
        }
    } catch (e) {
        console.warn("⚠️ Generated guides not found. Using static content.");
    }
    return GUIDES;
}

export async function getGuideBySlug(slug: string): Promise<Guide | undefined> {
    const all = await getAllGuides();
    return all.find(g => g.slug === slug);
}

// SMART LINKING LOGIC
// This function takes raw HTML and wraps keywords in internal links
export function enrichContent(html: string): string {
    let enriched = html;

    // 1. Link Brands
    const brands = ["Volvo", "Scania", "Caterpillar", "Komatsu"];
    brands.forEach(brand => {
        const regex = new RegExp(`\\b${brand}\\b`, 'g');
        enriched = enriched.replace(regex, `<a href="/brands/${slugify(brand)}" class="text-[#005EB8] hover:underline font-semibold" title="View all ${brand} parts">${brand}</a>`);
    });

    // 2. Link Categories (Simple Keyword Match)
    const categories = [
        { term: "Excavator", slug: "excavators" },
        { term: "Loader", slug: "loaders" },
        { term: "Filter", slug: "filters" },
        { term: "Engine", slug: "engine" },
        { term: "Hydraulic", slug: "hydraulics" }
    ];

    categories.forEach(cat => {
        // Only replace the first occurrence to avoid over-linking
        const regex = new RegExp(`\\b${cat.term}\\b(?!<)`, 'i');
        // (?!<) negative lookahead to prevent replacing inside existing tags if any
        enriched = enriched.replace(regex, `<a href="/machines/${cat.slug}" class="text-[#005EB8] hover:underline decoration-dotted" title="Browse ${cat.term} parts">${cat.term}</a>`);
    });

    return enriched;
}
