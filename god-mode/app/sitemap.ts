import { getParts } from "@/lib/data-loader";

export default async function sitemap() {
    const baseUrl = 'https://nexgen-index.com'; // Replace with actual domain
    const parts = await getParts();

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/brands/volvo',
        '/brands/caterpillar',
        '/brands/komatsu',
        '/brands/scania',
        '/brands/hitachi',
        '/machines/excavators',
        '/machines/wheel-loaders',
        '/machines/articulated-haulers',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
    }));

    // 2. Dynamic Part Routes (Limit to top 1000 for efficiency in demo)
    const partRoutes = parts
        .filter(p => p.brand && p.partNumber) // Ensure existence
        .slice(0, 1000)
        .map(part => {
            const slug = `${String(part.brand).toLowerCase()}-${String(part.partNumber).toLowerCase()}`;
            return {
                url: `${baseUrl}/p/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            };
        });

    return [...staticRoutes, ...partRoutes];
}
