import { getParts, getPartsCount, slugify } from "@/lib/data-loader";
import { MACHINE_CATALOG } from "@/lib/taxonomy";
import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export async function generateSitemaps() {
    const totalProducts = await getPartsCount();
    // 10 locales * 4000 products = 40,000 URLs (Safe under 50k)
    const productsPerSitemap = 4000;
    const numSitemaps = Math.ceil(totalProducts / productsPerSitemap);

    // ID 0 = Static Pages + Brands + Machines
    // ID 1+ = Products Chunks

    return Array.from({ length: numSitemaps + 1 }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.nexgenspares.com';
    const locales = routing.locales;

    // SITEMAP ID 0: Static Pages, Brands, Machines
    if (id === 0) {
        const routes: MetadataRoute.Sitemap = [];

        // 1. Homepage
        locales.forEach((locale: string) => {
            routes.push({
                url: `${baseUrl}/${locale}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            });
        });

        // 2. Brand Pages
        const brands = ['volvo', 'caterpillar', 'komatsu', 'scania', 'hitachi', 'beml', 'hyundai', 'sany', 'liugong', 'mait', 'soilmec'];
        brands.forEach(brand => {
            locales.forEach((locale: string) => {
                routes.push({
                    url: `${baseUrl}/${locale}/brands/${brand}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.9,
                });
            });
        });

        // 3. Machine Model Pages
        Object.entries(MACHINE_CATALOG).forEach(([brand, categories]) => {
            Object.values(categories).flat().forEach((model: string) => {
                locales.forEach((locale: string) => {
                    const modelSlug = slugify(`${brand}-${model}`);
                    routes.push({
                        url: `${baseUrl}/${locale}/machines/${modelSlug}`,
                        lastModified: new Date(),
                        changeFrequency: 'monthly',
                        priority: 0.7,
                    });
                });
            });
        });

        return routes;
    }

    // SITEMAP ID > 0: Products
    // Adjust index to be 0-based for slicing
    const chunkIndex = id - 1;
    const productsPerSitemap = 4000;
    const start = chunkIndex * productsPerSitemap;
    const end = start + productsPerSitemap;

    const parts = await getParts();
    const chunk = parts.slice(start, end);

    const routes: MetadataRoute.Sitemap = [];

    chunk
        .filter(p => p.brand && p.partNumber)
        .forEach(part => {
            locales.forEach((locale: string) => {
                const slug = `${slugify(part.brand)}-${slugify(part.partNumber)}`;
                routes.push({
                    url: `${baseUrl}/${locale}/p/${slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                });
            });
        });

    console.log(`✅ Generated sitemap/${id} with ${routes.length} URLs`);
    return routes;
}
