
import fs from 'fs';
import path from 'path';
import { getParts, slugify } from '../lib/data-loader';
import { MACHINE_CATALOG } from '../lib/taxonomy';

// Configuration
const BASE_URL = 'https://www.nexgenspares.com';
const LOCALES = ['en', 'es', 'zh', 'hi', 'ar', 'id', 'fr', 'pt', 'ru', 'ja'];
const PRODUCTS_PER_CHUNK = 4000;
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sitemap-data');

// Helper to ensure dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generate() {
    console.log("🚀 Starting Sitemap Pre-Build...");

    // Load Data ONCE
    const parts = await getParts(); // Loads full DB
    console.log(`✅ Loaded ${parts.length} parts.`);

    // --- CHUNK 0: Static, Brands, Machines ---
    const routes0: any[] = [];

    // Homepage
    LOCALES.forEach(locale => {
        routes0.push({
            url: `${BASE_URL}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        });
    });

    // Brands
    const brands = ['volvo', 'caterpillar', 'komatsu', 'scania', 'hitachi', 'beml', 'hyundai', 'sany', 'liugong', 'mait', 'soilmec'];
    brands.forEach(brand => {
        LOCALES.forEach(locale => {
            routes0.push({
                url: `${BASE_URL}/${locale}/brands/${brand}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
            });
        });
    });

    // Machines
    Object.entries(MACHINE_CATALOG).forEach(([brand, categories]) => {
        Object.values(categories).flat().forEach((model: string) => {
            LOCALES.forEach(locale => {
                const modelSlug = slugify(`${brand}-${model}`);
                routes0.push({
                    url: `${BASE_URL}/${locale}/machines/${modelSlug}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.7,
                });
            });
        });
    });

    fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-0.json'), JSON.stringify(routes0));
    console.log(`✅ Written sitemap-0.json (${routes0.length} URLs)`);

    // --- PRODUCT CHUNKS ---
    let chunkId = 1;
    for (let i = 0; i < parts.length; i += PRODUCTS_PER_CHUNK) {
        const chunk = parts.slice(i, i + PRODUCTS_PER_CHUNK);
        const routes: any[] = [];

        chunk.filter(p => p.brand && p.partNumber).forEach(part => {
            LOCALES.forEach(locale => {
                const slug = `${slugify(part.brand)}-${slugify(part.partNumber)}`;
                routes.push({
                    url: `${BASE_URL}/${locale}/p/${slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                });
            });
        });

        const fileName = `sitemap-${chunkId}.json`;
        fs.writeFileSync(path.join(OUTPUT_DIR, fileName), JSON.stringify(routes));
        console.log(`✅ Written ${fileName} (${routes.length} URLs)`);
        chunkId++;
    }

    console.log(`🎉 All sitemaps generated! Total chunks: ${chunkId}`);
}

generate().catch(console.error);
