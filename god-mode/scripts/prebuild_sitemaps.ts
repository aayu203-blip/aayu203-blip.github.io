
import fs from 'fs';
import path from 'path';
import { getParts, slugify } from '../lib/data-loader';
import { MACHINE_CATALOG } from '../lib/taxonomy';

// Configuration
const BASE_URL = 'https://www.nexgenspares.com';
const LOCALES = ['en', 'es', 'zh', 'hi', 'ar', 'id', 'fr', 'pt', 'ru', 'ja'];
const PRODUCTS_PER_CHUNK = 4000;
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sitemaps');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Helper to ensure dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// XML Helpers
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const URLSET_START = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
const URLSET_END = '</urlset>';
const INDEX_START = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const INDEX_END = '</sitemapindex>';

function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

function generateUrlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
    return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generate() {
    console.log("🚀 Starting Static Sitemap Generation (XML Mode)...");

    // Load Data ONCE
    const parts = await getParts(); // Loads full DB
    console.log(`✅ Loaded ${parts.length} parts.`);

    const generatedFiles: string[] = [];
    const dateNow = new Date().toISOString();

    // --- CHUNK 0: Static, Brands, Machines ---
    let xml0 = `${XML_HEADER}\n${URLSET_START}`;

    // Homepage
    LOCALES.forEach(locale => {
        xml0 += generateUrlEntry(`${BASE_URL}/${locale}`, dateNow, 'daily', '1.0');
    });

    // Brands
    const brands = ['volvo', 'caterpillar', 'komatsu', 'scania', 'hitachi', 'beml', 'hyundai', 'sany', 'liugong', 'mait', 'soilmec'];
    brands.forEach(brand => {
        LOCALES.forEach(locale => {
            xml0 += generateUrlEntry(`${BASE_URL}/${locale}/brands/${brand}`, dateNow, 'weekly', '0.9');
        });
    });

    // Machines
    Object.entries(MACHINE_CATALOG).forEach(([brand, categories]) => {
        Object.values(categories).flat().forEach((model: string) => {
            LOCALES.forEach(locale => {
                const modelSlug = slugify(`${brand}-${model}`);
                xml0 += generateUrlEntry(`${BASE_URL}/${locale}/machines/${modelSlug}`, dateNow, 'monthly', '0.7');
            });
        });
    });

    xml0 += `\n${URLSET_END}`;
    fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-0.xml'), xml0);
    generatedFiles.push('sitemaps/sitemap-0.xml');
    console.log(`✅ Written sitemaps/sitemap-0.xml`);

    // --- PRODUCT CHUNKS ---
    let chunkId = 1;
    for (let i = 0; i < parts.length; i += PRODUCTS_PER_CHUNK) {
        const chunk = parts.slice(i, i + PRODUCTS_PER_CHUNK);
        let xmlChunk = `${XML_HEADER}\n${URLSET_START}`;

        chunk.filter(p => p.brand && p.partNumber).forEach(part => {
            LOCALES.forEach(locale => {
                const slug = `${slugify(part.brand)}-${slugify(part.partNumber)}`;
                xmlChunk += generateUrlEntry(`${BASE_URL}/${locale}/p/${slug}`, dateNow, 'weekly', '0.8');
            });
        });

        xmlChunk += `\n${URLSET_END}`;
        const fileName = `sitemap-${chunkId}.xml`;
        fs.writeFileSync(path.join(OUTPUT_DIR, fileName), xmlChunk);
        generatedFiles.push(`sitemaps/${fileName}`);
        console.log(`✅ Written sitemaps/${fileName}`);
        chunkId++;
    }

    // --- GENERATE INDEX ---
    let indexXml = `${XML_HEADER}\n${INDEX_START}`;
    generatedFiles.forEach(file => {
        indexXml += `
  <sitemap>
    <loc>${BASE_URL}/${file}</loc>
    <lastmod>${dateNow}</lastmod>
  </sitemap>`;
    });
    indexXml += `\n${INDEX_END}`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), indexXml);
    console.log(`🎉 Generated public/sitemap.xml Index linking to ${generatedFiles.length} files.`);
}

generate().catch(console.error);
