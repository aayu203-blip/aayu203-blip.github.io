
import { generateSitemaps } from '../app/sitemap';
import sitemap from '../app/sitemap';

async function run() {
    console.log('🚀 Starting Sitemap Debug...');
    try {
        const ids = await generateSitemaps();
        console.log('✅ generateSitemaps returned IDs:', ids);

        for (const item of ids) {
            console.log(`\n📄 Generating sitemap output for ID: ${item.id}...`);
            const start = Date.now();
            const sm = await sitemap({ id: item.id });
            console.log(`✅ Sitemap ${item.id} generated ${sm.length} URLs in ${Date.now() - start}ms`);

            if (sm.length > 50000) {
                console.error(`❌ CRITICAL: Sitemap ${item.id} exceeds 50k limit! Count: ${sm.length}`);
            }
        }
    } catch (e) {
        console.error("❌ Sitemap Generation Failed:", e);
    }
}

run();
