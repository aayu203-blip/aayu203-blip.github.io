import { getParts, slugify } from '@/lib/data-loader';
import { getAllPosts } from '@/lib/blog';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

const PARTS_PER_SITEMAP = 500;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Await params for Next.js 15+ compatibility (just in case, safe for 14 too)
    const { id } = await params;

    const numericId = parseInt(id, 10);
    const safeId = isNaN(numericId) ? 0 : numericId;

    const parts = await getParts();
    const baseUrl = 'https://nexgenspares.com';

    // Slice data
    const start = safeId * PARTS_PER_SITEMAP;
    const end = start + PARTS_PER_SITEMAP;
    const currentBatch = parts.slice(start, end);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Static Pages (Only in ID 0)
    if (safeId === 0) {
        // ... (Static pages logic) ...
        // Blog
        const posts = await getAllPosts();

        // Helper to add URL
        const addUrl = (loc: string, lastmod: string, changefreq: string, priority: string) => {
            xml += `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
        };

        // Static Routes
        const staticPaths = ['', '/about', '/blog', '/search'];
        for (const path of staticPaths) {
            for (const locale of routing.locales) {
                addUrl(`${baseUrl}/${locale}${path}`, new Date().toISOString(), path === '' ? 'daily' : 'weekly', path === '' ? '1.0' : '0.7');
            }
        }

        // Blog Posts
        for (const post of posts) {
            for (const locale of routing.locales) {
                addUrl(`${baseUrl}/${locale}/blog/${post.slug}`, new Date(post.date).toISOString(), 'monthly', '0.7');
            }
        }

        // Brands & Machines would be huge, let's include them in 0 for now as previously done
        // Or if parts list is empty, just skip
    }

    // Products
    for (const part of currentBatch) {
        for (const locale of routing.locales) {
            xml += `
  <url>
    <loc>${baseUrl}/${locale}/p/${slugify(part.brand)}-${slugify(part.partNumber)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }
    }

    xml += `
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        },
    });
}
