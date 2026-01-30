import { NextResponse } from "next/server";
import { getParts } from "@/lib/data-loader";

export async function GET() {
    try {
        const parts = await getParts();

        return NextResponse.json({
            status: "success",
            totalParts: parts.length,
            sampleParts: parts.slice(0, 3).map(p => ({
                id: p.id,
                partNumber: p.partNumber,
                brand: p.brand
            })),
            dataSource: parts[0]?.source || "unknown"
        });
    } catch (error) {
        return NextResponse.json({
            status: "error",
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
