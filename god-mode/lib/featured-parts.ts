import type { Part } from "./utils";

export async function getFeaturedParts(): Promise<Part[]> {
    // HARDCODED FEATURED PARTS - No database lookups, guaranteed to work on Vercel
    const hardcodedParts: Part[] = [
        {
            id: "featured-cat-1r0716",
            partNumber: "1R-0716",
            brand: "CAT",
            name: "Oil Filter",
            description: "High-efficiency oil filter for CAT engines. Premium filtration media ensures maximum engine protection and extended service intervals.",
            stock: 150,
            price: "On Request",
            category: "Filters",
            compatibility: ["CAT 320D", "CAT 330D", "CAT 336D"],
            oem_cross_references: [
                { brand: "Fleetguard", partNumber: "LF3000" },
                { brand: "Donaldson", partNumber: "P550425" }
            ],
            cross_reference_numbers: ["LF3000", "P550425"],
            technical_specs: {
                "Application": "Heavy-duty diesel engines",
                "Key Features": "High-efficiency filtration, Extended service life, OEM quality"
            },
            source: "static"
        },
        {
            id: "featured-volvo-14524125",
            partNumber: "14524125",
            brand: "Volvo",
            name: "Fuel Filter",
            description: "Genuine Volvo fuel filter for EC-series excavators. Advanced water separation technology protects fuel injection systems from contamination.",
            stock: 200,
            price: "On Request",
            category: "Filters",
            compatibility: ["Volvo EC210", "Volvo EC240", "Volvo EC290"],
            oem_cross_references: [
                { brand: "Fleetguard", partNumber: "FF5624" },
                { brand: "Baldwin", partNumber: "BF7951" }
            ],
            cross_reference_numbers: ["FF5624", "BF7951"],
            technical_specs: {
                "Application": "Volvo EC-series excavators",
                "Key Features": "Water separation, Genuine OEM quality, Extended engine life"
            },
            source: "static"
        },
        {
            id: "featured-komatsu-20570",
            partNumber: "205-70-19570",
            brand: "Komatsu",
            name: "Track Shoe",
            description: "Heavy-duty track shoe for Komatsu PC-series excavators. Heat-treated steel construction provides superior wear resistance in demanding applications.",
            stock: 80,
            price: "On Request",
            category: "Undercarriage",
            compatibility: ["Komatsu PC200", "Komatsu PC220", "Komatsu PC240"],
            oem_cross_references: [],
            cross_reference_numbers: [],
            technical_specs: {
                "Application": "Komatsu PC-series excavators",
                "Key Features": "Heat-treated steel, Superior wear resistance, OEM specifications"
            },
            source: "static"
        }
    ];

    return hardcodedParts;
}
