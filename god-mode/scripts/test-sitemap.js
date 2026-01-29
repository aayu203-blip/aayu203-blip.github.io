
const { generateSitemaps, default: sitemap } = require('../app/sitemap');

async function testSitemap() {
    console.log("Testing generateSitemaps...");
    const start = Date.now();
    try {
        const sitemaps = await generateSitemaps();
        console.log(`Generated ${sitemaps.length} sitemaps in ${Date.now() - start}ms`);
        console.log(sitemaps);

        console.log("Testing sitemap(id: 0)...");
        const sm0 = await sitemap({ id: 0 });
        console.log(`Sitemap 0 has ${sm0.length} URLs`);

        if (sitemaps.length > 1) {
            console.log("Testing sitemap(id: 1)...");
            const sm1 = await sitemap({ id: 1 });
            console.log(`Sitemap 1 has ${sm1.length} URLs`);
        }
    } catch (e) {
        console.error("Sitemap generation failed:", e);
    }
}

testSitemap();
