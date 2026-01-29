import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
// --- SHARED TYPES ---
export type Part = {
    id: string;
    partNumber: string;
    brand: string;
    name: string;
    description: string;
    stock: number;
    price: number | "On Request";
    category: string;
    compatibility: string[];
    technical_specs?: Record<string, string | number>;
    oem_cross_references?: { brand: string, partNumber: string }[];
    cross_reference_numbers?: string[];
    source: "static" | "harvest";
};

// --- HELPER: Slugify ---
export function slugify(text: string): string {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}
