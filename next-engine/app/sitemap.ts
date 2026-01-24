import { MetadataRoute } from 'next';
import { getAllParts } from '@/lib/data';
import blogPosts from '@/data/blog-posts.json';
import { MACHINERY_BRANDS } from '@/lib/brands';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.nexgenspares.com'; // Replace with actual domain

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/blog',
        '/search',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
    }));

    // 2. Brand Pages
    const brandRoutes = MACHINERY_BRANDS.map((brand) => ({
        url: `${baseUrl}/brands/${brand.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    // 3. Blog Posts
    const blogRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.9, // High priority for "How To" content
    }));

    // 4. Product Pages (The Big List)
    // In production, you might want to paginate or split sitemaps if > 50k URLs
    const parts = await getAllParts();
    const productRoutes = parts.map((part) => ({
        url: `${baseUrl}/product/${part.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [
        ...staticRoutes,
        ...brandRoutes,
        ...blogRoutes,
        ...productRoutes,
    ];
}
