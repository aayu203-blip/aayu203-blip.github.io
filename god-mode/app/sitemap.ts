import { MetadataRoute } from 'next'
import { getParts, slugify } from '@/lib/data-loader'
import { getAllPosts } from '@/lib/blog'
import { routing } from '@/i18n/routing'

const PARTS_PER_SITEMAP = 500; // 500 parts * 10 languages = 5,000 URLs (Performance Optimized)

export async function generateSitemaps() {
    const parts = await getParts()
    const totalSitemaps = Math.ceil(parts.length / PARTS_PER_SITEMAP)

    // Generate IDs: [{ id: 0 }, { id: 1 }, ...]
    return Array.from({ length: totalSitemaps }, (_, i) => ({ id: i }))
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const parts = await getParts()
    const baseUrl = 'https://nexgenspares.com'

    // Slice data for this specific sitemap ID
    const safeId = Number(id);
    const start = safeId * PARTS_PER_SITEMAP
    const end = start + PARTS_PER_SITEMAP
    const currentBatch = parts.slice(start, end)

    // Generate URLs for *ALL* locales for these parts
    const productPages: MetadataRoute.Sitemap = []

    // DEBUG ENTRY (Temporary: Diagnose empty sitemap)
    productPages.push({
        url: `${baseUrl}/debug/sitemap-${safeId}-total-${parts.length}-batch-${currentBatch.length}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.1,
    })

    for (const part of currentBatch) {
        for (const locale of routing.locales) {
            productPages.push({
                url: `${baseUrl}/${locale}/p/${slugify(part.brand)}-${slugify(part.partNumber)}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.8,
            })
        }
    }

    // Include Static Pages & Blog ONLY in the first sitemap (id 0) to avoid duplication
    if (id === 0) {
        const posts = await getAllPosts()

        // Blog Posts (Localized)
        const blogPages: MetadataRoute.Sitemap = []
        for (const post of posts) {
            for (const locale of routing.locales) {
                blogPages.push({
                    url: `${baseUrl}/${locale}/blog/${post.slug}`,
                    lastModified: new Date(post.date),
                    changeFrequency: 'monthly',
                    priority: 0.7,
                })
            }
        }

        // Static Pages (Localized)
        const staticPaths = ['', '/about', '/blog', '/search']
        const staticPages: MetadataRoute.Sitemap = []

        for (const path of staticPaths) {
            // Root path special case: already handled by middleware redirection to default locale, 
            // but for sitemap we should list explicit localized roots
            for (const locale of routing.locales) {
                staticPages.push({
                    url: `${baseUrl}/${locale}${path}`,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: path === '' ? 1.0 : 0.7,
                })
            }
        }

        // Brand & Machine Pages (Localized)
        const brands = [...new Set(parts.map(p => p.brand))]
        const brandPages: MetadataRoute.Sitemap = []
        for (const brand of brands) {
            for (const locale of routing.locales) {
                brandPages.push({
                    url: `${baseUrl}/${locale}/brands/${slugify(brand)}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.9,
                })
            }
        }

        const machines = ['excavators', 'articulated-haulers', 'wheel-loaders', 'industrial-engines', 'pavers']
        const machinePages: MetadataRoute.Sitemap = []
        for (const machine of machines) {
            for (const locale of routing.locales) {
                machinePages.push({
                    url: `${baseUrl}/${locale}/machines/${machine}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.85,
                })
            }
        }

        return [...staticPages, ...brandPages, ...machinePages, ...blogPages, ...productPages]
    }

    return productPages
}
