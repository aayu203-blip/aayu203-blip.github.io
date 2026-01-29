import { getParts, getPartsCount, slugify } from "@/lib/data-loader";
import { MACHINE_CATALOG } from "@/lib/taxonomy";
import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";


export async function generateSitemaps() {
    // Read the OUTPUT_DIR to find how many files exist
    // But since this runs in build, we can't rely on FS persistence in Vercel dynamic functions easily
    // UNLESS we use "Include Files".
    // Better: Hardcode a safe upper bound or read the dir if possible.
    // In Vercel, generated files in `data` might not persist to lambda unless included.
    // Actually, simply reading the file count from the prebuild is hard if we don't know it.
    // Let's rely on the IDs. We knew it was ~13. Let's return 0-20 to be safe, or just 13.
    // Or we can use getPartsCount again just for the ID list (cheap).

    // Re-use optimized counter for IDs
    const { getPartsCount } = await import("@/lib/data-loader");
    const totalProducts = await getPartsCount();
    const productsPerSitemap = 4000;
    const numSitemaps = Math.ceil(totalProducts / productsPerSitemap);
    return Array.from({ length: numSitemaps + 1 }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const path = await import("path");
    const fs = await import("fs");

    // LOCALLY: god-mode/data/sitemaps
    // VERCEL: We need to ensure these files are included.
    // Usually nextjs bundles files in 'public' automatically. 
    // Maybe we should write to 'public/sitemaps' instead?
    // Writing to public/sitemaps/sitemap-X.json means we can just fetch them via HTTP or read fs.
    // Reading fs from public is easier.

    // Let's assume they are in `public/sitemap-data` for now and try to read.
    const filePath = path.join(process.cwd(), 'public', 'sitemap-data', `sitemap-${id}.json`);

    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(content);
        }
    } catch (e) {
        console.error(`Sitemap file ${id} missing`, e);
    }

    return [];
}
