import { MetadataRoute } from 'next'
import { getParts } from '@/lib/data-loader'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const parts = await getParts()
    const baseUrl = 'https://nexgenspares.com'

    // Product pages (17,928 parts)
    const productPages: MetadataRoute.Sitemap = parts.map(part => ({
        url: `${baseUrl}/en/p/${part.brand.toLowerCase()}-${part.partNumber.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
    }))

    // Extract unique brands
    const brands = [...new Set(parts.map(p => p.brand))]
    const brandPages: MetadataRoute.Sitemap = brands.map(brand => ({
        url: `${baseUrl}/en/brands/${brand.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    }))

    // Extract unique machine categories
    const machines = ['excavators', 'articulated-haulers', 'wheel-loaders', 'industrial-engines', 'pavers']
    const machinePages: MetadataRoute.Sitemap = machines.map(machine => ({
        url: `${baseUrl}/en/machines/${machine}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
    }))

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/en/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/en/search`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.6,
        },
    ]

    return [...staticPages, ...brandPages, ...machinePages, ...productPages]
}
