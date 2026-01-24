import fs from 'fs';
import path from 'path';

export interface TechnicalSpecs {
    [key: string]: string | number | undefined;
}

export interface Part {
    id: number;
    brand: string;
    part_number: string;
    product_name: string;
    category: string;
    application: string;
    symptoms_list_raw: string;
    final_html_description: string;
    slug: string;
    technical_specs: TechnicalSpecs;
    description?: string;
    name?: string;
    json_ld?: any;
    alternate_part_numbers?: string[];
    cross_reference_oem?: string[];
    data_quality?: 'good' | 'low';
    url?: string;
    _search?: {
        sanitized_pn: string;
        normalized_pn: string;
        searchable_text: string;
    };
}

const DATA_PATH = path.join(process.cwd(), 'data', 'parts-database.json');

// Cache the data in memory for serverless/edge efficiency (if container stays warm)
let cachedParts: Part[] | null = null;

export async function getAllParts(): Promise<Part[]> {
    if (cachedParts) return cachedParts;

    try {
        const fileContents = await fs.promises.readFile(DATA_PATH, 'utf8');
        const rawData = JSON.parse(fileContents);

        // Normalize data structure
        cachedParts = rawData.map((p: any) => ({
            ...p,
            product_name: p.product_name || p.name || 'Unknown Part',
            description: p.description || p.final_html_description || '',
            technical_specs: p.technical_specs || {},
            category: p.category || '',
            part_number: String(p.part_number), // Ensure string
        }));

        return cachedParts || [];
    } catch (error) {
        console.error('Failed to load parts database:', error);
        return [];
    }
}

export async function getPartBySlug(slug: string): Promise<Part | undefined> {
    const parts = await getAllParts();
    return parts.find((p) => p.slug === slug);
}

// Helper to generate the SEO-optimized display name
// User wants: "BEARING 123454" instead of "VOLVO 123454"
export function getDisplayName(part: Part): string {
    // 1. Try Technical Specs Part Type
    const techSpecType = part.technical_specs?.['Part Type'] || part.technical_specs?.['Part Name'];

    // 2. Try Category (if it represents a type)
    const category = part.category;

    let partType = '';

    if (techSpecType && typeof techSpecType === 'string' && techSpecType.length > 2) {
        partType = techSpecType;
    } else if (category && category.length > 2 && !['Spare Parts', 'Components'].includes(category)) {
        partType = category;
    } else {
        // 3. Fallback: Parse from Name
        // Remove Brand from Name
        const brandRegex = new RegExp(`^${part.brand}\\s+`, 'i');
        let cleanName = part.product_name.replace(brandRegex, '').trim();

        // Remove Part Number from Name to isolate the "Type"
        cleanName = cleanName.replace(part.part_number, '').trim();

        // Remove "OEM", "Replacement", "Component" noise if it's the only thing left
        if (cleanName && !['OEM', 'Replacement', 'Component'].includes(cleanName)) {
            partType = cleanName;
        }
    }

    // Default fallback
    if (!partType || partType.trim() === '') {
        partType = 'Replacement Part';
    }

    // Capitalize Title Case (simple)
    partType = partType.charAt(0).toUpperCase() + partType.slice(1);

    return `${partType} ${part.part_number}`;
}


const SYNONYMS: Record<string, string[]> = {
    'bearing': ['ball bearing', 'roller bearing', 'needle bearing', 'bushing'],
    'filter': ['strainer', 'cartridge', 'element'],
    'gasket': ['seal', 'o-ring', 'washer'],
    'pump': ['compressor', 'impeller'],
    'injector': ['nozzle', 'valve'],
    'sensor': ['transmitter', 'switch', 'probe'],
    'shoe': ['lining', 'pad', 'friction material'],
    'lining': ['shoe', 'pad'],
    'glass': ['windshield', 'window', 'pane'],
};

// Deterministic Stock Generator
// Uses Part ID to generate a consistent "random" number between 3 and 150
export function getDeterministicStock(partId: number): number {
    // Simple seeded random using sine
    const x = Math.sin(partId) * 10000;
    const random = x - Math.floor(x);
    // Range: 3 to 150
    return Math.floor(random * (150 - 3 + 1)) + 3;
}


// Updated Search with Synonyms
export async function searchParts(query: string, limit = 20): Promise<Part[]> {
    const parts = await getAllParts();
    if (!query) return parts.slice(0, limit);

    const q = query.toLowerCase().trim();

    // Synonym Expansion
    const searchTerms = [q];
    Object.entries(SYNONYMS).forEach(([key, synonyms]) => {
        if (q.includes(key)) {
            synonyms.forEach(syn => searchTerms.push(q.replace(key, syn)));
        } else {
            synonyms.forEach(syn => {
                if (q.includes(syn)) searchTerms.push(q.replace(syn, key));
            });
        }
    });

    const uniqueSearchTerms = Array.from(new Set(searchTerms)).slice(0, 3); // Limit breadth

    return parts
        .filter((p) => {
            const partStr = (p._search?.searchable_text ||
                `${p.part_number} ${p.brand} ${p.product_name} ${p.category}`).toLowerCase();

            // Check if ANY of the synonymous terms match
            return uniqueSearchTerms.some(term => partStr.includes(term));
        })
        .sort((a, b) => {
            // Prioritize exact matches to original query
            const aExact = a.part_number.toLowerCase() === q;
            const bExact = b.part_number.toLowerCase() === q;
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            return 0;
        })
        .slice(0, limit);
}

export async function getPartsByBrand(brand: string, limit = 50): Promise<Part[]> {
    const parts = await getAllParts();
    return parts
        .filter((p) => p.brand.toLowerCase() === brand.toLowerCase())
        .slice(0, limit);
}
