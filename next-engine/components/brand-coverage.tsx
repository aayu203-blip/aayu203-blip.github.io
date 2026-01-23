"use client"

import * as React from "react"
import { ChevronDown, CheckCircle2, Truck, HardHat, Hammer } from "lucide-react"
import { cn } from "@/lib/utils"

// Data Structure
type BrandData = {
    name: string
    count: number
    color: string
    categories: {
        title: string
        models: string[]
    }[]
}

const BRANDS: BrandData[] = [
    {
        name: "VOLVO",
        count: 52,
        color: "bg-blue-600",
        categories: [
            {
                title: "Trucks & Heavy Vehicles",
                models: ["FH Series: FH12, FH13, FH16", "FM Series: FM9, FM10, FM12", "FMX Series: FMX330, FMX440"]
            },
            {
                title: "Construction & Mining",
                models: ["Excavators: EC140, EC210, EC360, EC480", "Wheel Loaders: L60, L120, L150, L350", "Articulated Haulers: A25, A30, A40, A60"]
            }
        ]
    },
    {
        name: "SCANIA",
        count: 55,
        color: "bg-red-600",
        categories: [
            {
                title: "Trucks",
                models: ["P-Series: P360, P410", "G-Series: G460", "R-Series: R500, R560, R620", "V8 Engines"]
            },
            {
                title: "Industrial & Marine",
                models: ["DC09, DC13, DC16 Gensets", "DI13, DI16 Marine Engines"]
            }
        ]
    },
    {
        name: "CATERPILLAR (CAT)",
        count: 89,
        color: "bg-yellow-500",
        categories: [
            {
                title: "Earthmoving",
                models: ["Excavators: 320D, 330D, 336D", "Dozers: D6, D8, D10", "Loaders: 950, 966, 980"]
            }
        ]
    },
    {
        name: "KOMATSU",
        count: 58,
        color: "bg-blue-800",
        categories: [
            { title: "Mining", models: ["PC200, PC300, PC450", "D155, D375 Dozers", "HD785 Dump Trucks"] }
        ]
    },
    {
        name: "HITACHI",
        count: 18,
        color: "bg-orange-600",
        categories: [
            { title: "Excavators", models: ["ZX200, ZX330, ZX470", "EX1200 Mining Shovels"] }
        ]
    }
]

// Simple Brands List (No Accordion needed for smaller ones)
const OTHER_BRANDS = [
    { name: "BEML", count: 42 },
    { name: "HYUNDAI", count: 20 },
    { name: "SANY", count: 19 },
    { name: "LIUGONG", count: 15 },
    { name: "MAIT", count: 12 },
    { name: "SOILMEC", count: 11 },
]

export function BrandCoverage() {
    const [openBrand, setOpenBrand] = React.useState<string | null>("VOLVO")

    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-950">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Global Fleet Coverage</h2>
                    <p className="text-muted-foreground text-lg">
                        We stock parts for over <span className="text-primary font-bold">500+</span> unique machine models across
                        major global manufacturers. From Scania V8s to Volvo Articulated Haulers.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">

                    {/* Left Column: Interactive Accordion */}
                    <div className="space-y-4">
                        {BRANDS.map((brand) => (
                            <div
                                key={brand.name}
                                className={cn(
                                    "border rounded-xl bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-200",
                                    openBrand === brand.name ? "ring-2 ring-primary/20 shadow-lg" : "hover:border-primary/50"
                                )}
                            >
                                <button
                                    onClick={() => setOpenBrand(openBrand === brand.name ? null : brand.name)}
                                    className="w-full flex items-center justify-between p-4 text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-2 h-12 rounded-full", brand.color)} />
                                        <div>
                                            <h3 className="font-bold text-lg">{brand.name}</h3>
                                            <p className="text-sm text-muted-foreground">{brand.count} Models Verified</p>
                                        </div>
                                    </div>
                                    <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", openBrand === brand.name && "rotate-180")} />
                                </button>

                                {openBrand === brand.name && (
                                    <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                                        <div className="grid gap-6">
                                            {brand.categories.map((cat, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex items-center gap-2 text-primary font-medium text-sm">
                                                        {cat.title.includes("Truck") ? <Truck className="w-4 h-4" /> : <HardHat className="w-4 h-4" />}
                                                        {cat.title}
                                                    </div>
                                                    <ul className="grid gap-1 pl-6">
                                                        {cat.models.map((m, j) => (
                                                            <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                                                                <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                                                                {m}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Quick Stats & Others */}
                    <div className="space-y-8">
                        <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-xl">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <CheckCircle2 className="text-green-500" />
                                Live Database Status
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="text-zinc-400">Total Unique Parts</span>
                                    <span className="text-xl font-mono font-bold text-green-400">29,082</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="text-zinc-400">Brands Supported</span>
                                    <span className="text-xl font-mono font-bold">14</span>
                                </div>
                                <div className="flex justify-between items-center pb-4">
                                    <span className="text-zinc-400">Update Frequency</span>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-sm font-medium">Continuous (Live)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {OTHER_BRANDS.map((b) => (
                                <div key={b.name} className="bg-white dark:bg-zinc-900 border p-4 rounded-xl flex flex-col justify-center text-center hover:scale-105 transition-transform cursor-default">
                                    <span className="font-bold text-lg">{b.name}</span>
                                    <span className="text-xs text-muted-foreground">{b.count} Models</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
                            <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                                <Hammer className="w-4 h-4" />
                                Don't see your machine?
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-400">
                                Our <strong>Neural Harvester™</strong> scans 100+ global sources daily.
                                If it exists, we are likely indexing it right now. Search by Part Number to check.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
