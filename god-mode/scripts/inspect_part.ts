
import { searchParts } from '../lib/data-loader';

async function main() {
    const { results } = await searchParts("21969323");
    if (results.length > 0) {
        console.log(JSON.stringify(results[0], null, 2));
    } else {
        console.log("No part found");
    }
}

main().catch(console.error);
