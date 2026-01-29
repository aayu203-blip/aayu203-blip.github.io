import { getParts, slugify } from "@/lib/data-loader";
import { MACHINE_CATALOG } from "@/lib/taxonomy";

export default async function sitemap() {
    const baseUrl = 'https://www.nexgenspares.com';
    const parts = await getParts();
    const locales = ['en', 'es']; // Will expand to ['en', 'es', 'zh', 'hi', 'ar', 'id', 'fr', 'pt', 'ru', 'ja']

    const routes: any[] = [];

    // 1. Homepage (Multi-language)
    locales.forEach(locale => {
        routes.push({
            url: `${baseUrl}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        });
    });

    // 2. Brand Pages (Multi-language)
    const brands = ['volvo', 'caterpillar', 'komatsu', 'scania', 'hitachi', 'beml', 'hyundai', 'sany', 'liugong', 'mait', 'soilmec'];
    brands.forEach(brand => {
        locales.forEach(locale => {
            routes.push({
                url: `${baseUrl}/${locale}/brands/${brand}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.9,
            });
        });
    });

    // 3. Machine Model Pages (Virtual - for SEO)
    Object.entries(MACHINE_CATALOG).forEach(([brand, categories]) => {
        Object.values(categories).flat().forEach((model: string) => {
            locales.forEach(locale => {
                const modelSlug = slugify(`${brand}-${model}`);
                routes.push({
                    url: `${baseUrl}/${locale}/machines/${modelSlug}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.7,
                });
            });
        });
    });

    // 4. Product Pages (ALL 29k products, Multi-language)
    parts
        .filter(p => p.brand && p.partNumber)
        .forEach(part => {
            locales.forEach(locale => {
                const slug = `${slugify(part.brand)}-${slugify(part.partNumber)}`;
                routes.push({
                    url: `${baseUrl}/${locale}/p/${slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                });
            });
        });

    console.log(`✅ Generated sitemap with ${routes.length} URLs`);
    return routes;
}

