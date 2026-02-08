import { getParts } from '@/lib/data-loader';

export const dynamic = 'force-dynamic'; // Ensure no caching issues

const PARTS_PER_SITEMAP = 500;

export async function GET() {
    try {
        const parts = await getParts();
        const totalSitemaps = Math.ceil(parts.length / PARTS_PER_SITEMAP);

        // Generate sitemap index XML
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        const baseUrl = 'https://nexgenspares.com';
        const now = new Date().toISOString();

        for (let i = 0; i < totalSitemaps; i++) {
            xml += `
  <sitemap>
    <loc>${baseUrl}/sitemap/${i}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;
        }

        xml += `
</sitemapindex>`;

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml',
                // Cache for 1 hour
                'Cache-Control': 'public, max-age=3600, s-maxage=3600'
            },
        });
    } catch (error) {
        console.error('Sitemap Index Generation Error:', error);
        return new Response('Error generating sitemap index', { status: 500 });
    }
}
