const fs = require('fs');
const path = require('path');

const LIVE_FILE = path.join(__dirname, '../full_dataset.jsonl');

console.log("📂 Checking Live DB at:", LIVE_FILE);

if (fs.existsSync(LIVE_FILE)) {
    const content = fs.readFileSync(LIVE_FILE, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    console.log(`✅ Found ${lines.length} lines.`);

    // Sample first 3
    lines.slice(0, 3).forEach((l, i) => {
        try {
            const j = JSON.parse(l);
            console.log(`[${i}] ${j.part_number} - ${j.name} (${j.compatibility?.slice(0, 30)}...)`);
        } catch (e) {
            console.log(`[${i}] Failed parse`);
        }
    });
} else {
    console.log("❌ File not found.");
}
