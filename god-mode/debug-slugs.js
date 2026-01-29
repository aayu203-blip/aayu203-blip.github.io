
const fs = require('fs');
const path = require('path');
const { slugify } = require('./lib/data-loader');

// Mock getParts logic simplified for debug
async function debugSlugs() {
    console.log("Loading parts manually...");

    const staticDbPath = path.join(process.cwd(), 'data', 'parts-database.json');
    const staticDb = JSON.parse(fs.readFileSync(staticDbPath, 'utf-8'));

    console.log(`Loaded ${staticDb.length} static parts.`);

    staticDb.forEach(p => {
        const brands = ["Caterpillar", "Volvo", "Komatsu"];
        // In the real loader, p.brand is normalized. Here we just guess or use p.brand if exists.
        const brand = p.brand || "Volvo"; // Default logic from data-loader.ts
        const slug = slugify(`${brand}-${p.partNumber || p.id}`);

        if (p.partNumber && (p.partNumber.includes("1R-0716") || p.partNumber.includes("1r-0716"))) {
            console.log(`FOUND STATIC: ${brand} ${p.partNumber}`);
            console.log(`SLUG: ${slug}`);
        }
    });

    console.log("Checking Harvest Data...");
    const livePath = path.join(process.cwd(), 'data', 'full_dataset.jsonl');
    if (fs.existsSync(livePath)) {
        const fileContent = fs.readFileSync(livePath, 'utf-8');
        const lines = fileContent.split('\n');
        lines.forEach(line => {
            if (line.includes("1R-0716") || line.includes("1r-0716")) {
                console.log("FOUND IN JSONL:", line.substring(0, 100) + "...");
                try {
                    const raw = JSON.parse(line);
                    const brand = "CAT"; // based on logic in data-loader
                    const slug = slugify(`${brand}-${raw.part_number}`);
                    console.log(`Harvest Slug would be: ${slug}`);
                } catch (e) { }
            }
        });
    }
}

debugSlugs();
