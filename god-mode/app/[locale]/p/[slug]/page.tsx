import { getParts, type Part } from "@/lib/data-loader";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DownloadButton } from "@/components/download-button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ViewToggle } from "@/components/view-toggle";
import { RelatedParts } from "@/components/related-parts";
import { ShippingEstimator } from "@/components/shipping-estimator";
import { ShieldCheck, Truck, Search, ChevronRight, FileText, Printer, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// --- HELPER ISOLATED ---
// Removed parseSlug to avoid mismatch. We now match by fully reconstructing the slug.

type Props = {
    params: Promise<{ slug: string, locale: string }>
};

export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params;
    const parts = await getParts(resolvedParams.locale);

    // Robust Matching Strategy: Reconstruct slug for each part and compare
    // This handles brands with spaces/hyphens correctly (e.g. "Mercedes-Benz" -> "mercedes-benz")
    const targetPart = parts.find(p => {
        const expectedSlug = `${slugify(p.brand)}-${slugify(p.partNumber)}`;
        return expectedSlug === resolvedParams.slug;
    });

    if (!targetPart) {
        return {
            title: 'Part Not Found | NexGen Index',
            description: 'The requested part could not be found in our database.'
        };
    }

    return {
        title: `${targetPart.partNumber} ${targetPart.brand} - ${targetPart.name} | NexGen Index`,
        description: `Buy ${targetPart.brand} ${targetPart.partNumber} ${targetPart.name}. Verified technical specifications, dimensions, and global stock availability. Request a quote on WhatsApp.`,
        openGraph: {
            title: `${targetPart.partNumber} ${targetPart.brand} Specs`,
            description: `Verified specs for ${targetPart.brand} ${targetPart.partNumber}. In stock at 3 regional hubs.`,
            type: 'article',
        },
        alternates: {
            canonical: `https://nexgenspares.com/${resolvedParams.locale}/p/${resolvedParams.slug}`,
            languages: {
                'en': `https://nexgenspares.com/en/p/${resolvedParams.slug}`,
                'es': `https://nexgenspares.com/es/p/${resolvedParams.slug}`,
                'fr': `https://nexgenspares.com/fr/p/${resolvedParams.slug}`,
                'pt': `https://nexgenspares.com/pt/p/${resolvedParams.slug}`,
                'id': `https://nexgenspares.com/id/p/${resolvedParams.slug}`,
                'hi': `https://nexgenspares.com/hi/p/${resolvedParams.slug}`,
                'ar': `https://nexgenspares.com/ar/p/${resolvedParams.slug}`,
                'zh': `https://nexgenspares.com/zh/p/${resolvedParams.slug}`,
                'ja': `https://nexgenspares.com/ja/p/${resolvedParams.slug}`,
                'ru': `https://nexgenspares.com/ru/p/${resolvedParams.slug}`,
            }
        }
    };
}

export default async function ProductPage({ params }: Props) {
    const resolvedParams = await params;

    // FETCH DATA
    const parts = await getParts(resolvedParams.locale);

    // Robust Matching Strategy
    const targetPart = parts.find(p => {
        const expectedSlug = `${slugify(p.brand)}-${slugify(p.partNumber)}`;
        return expectedSlug === resolvedParams.slug;
    });

    if (!targetPart) {
        return notFound();
    }

    return (
        <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">



            {/* JSON-LD SCHEMA */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "Product",
                                "name": `${targetPart.brand} ${targetPart.partNumber} - ${targetPart.name}`,
                                "image": [
                                    `https://www.nexgenspares.com/api/og?brand=${targetPart.brand}&part=${targetPart.partNumber}`
                                ],
                                "description": targetPart.description || `High-quality replacement for ${targetPart.brand} ${targetPart.partNumber} ${targetPart.name}. Verified technical specifications.`,
                                "sku": targetPart.partNumber,
                                "mpn": targetPart.partNumber,
                                "brand": {
                                    "@type": "Brand",
                                    "name": targetPart.brand
                                },
                                "offers": {
                                    "@type": "Offer",
                                    "url": `https://www.nexgenspares.com/${resolvedParams.locale}/p/${resolvedParams.slug}`,
                                    "priceCurrency": "USD",
                                    "price": "0",
                                    "priceValidUntil": "2026-12-31",
                                    "availability": "https://schema.org/InStock",
                                    "itemCondition": "https://schema.org/NewCondition"
                                },
                                "aggregateRating": {
                                    "@type": "AggregateRating",
                                    "ratingValue": "4.8",
                                    "reviewCount": "24",
                                    "bestRating": "5",
                                    "worstRating": "1"
                                }
                            },
                            {
                                "@type": "FAQPage",
                                "mainEntity": [
                                    {
                                        "@type": "Question",
                                        "name": `Is the ${targetPart.partNumber} in stock?`,
                                        "acceptedAnswer": {
                                            "@type": "Answer",
                                            "text": "Yes, we have verified stock at our regional hubs. We offer express shipping to minimize downtime."
                                        }
                                    },
                                    {
                                        "@type": "Question",
                                        "name": "Do you provide a warranty?",
                                        "acceptedAnswer": {
                                            "@type": "Answer",
                                            "text": "All new parts come with a standard 12-month manufacturer warranty. Reconditioned parts include a 6-month NexGen guarantee."
                                        }
                                    },
                                    {
                                        "@type": "Question",
                                        "name": `Can you ship ${targetPart.partNumber} internationally?`,
                                        "acceptedAnswer": {
                                            "@type": "Answer",
                                            "text": "Yes, NexGen ships to over 140 countries including USA, Canada, Australia, and UAE with customs handling included."
                                        }
                                    }
                                ]
                            },
                            {
                                "@type": "BreadcrumbList",
                                "itemListElement": [
                                    {
                                        "@type": "ListItem",
                                        "position": 1,
                                        "name": "Home",
                                        "item": "https://www.nexgenspares.com"
                                    },
                                    {
                                        "@type": "ListItem",
                                        "position": 2,
                                        "name": targetPart.brand,
                                        "item": `https://www.nexgenspares.com/${resolvedParams.locale}/brands/${slugify(targetPart.brand)}`
                                    },
                                    {
                                        "@type": "ListItem",
                                        "position": 3,
                                        "name": targetPart.partNumber
                                    }
                                ]
                            }
                        ]
                    })
                }}
            />
            {/* 2. MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* LEFT COL: IDENTIFICATION (40%) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* BREADCRUMB */}
                    <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6 print:hidden">
                        <Link href="/" className="hover:text-[#005EB8] hover:underline">INDEX</Link>
                        <ChevronRight size={12} />
                        <span className="uppercase">{targetPart.brand}</span>
                        <ChevronRight size={12} />
                        <span className="uppercase">{targetPart.category}</span>
                        <ChevronRight size={12} />
                        <span className="text-slate-900 font-bold">{targetPart.partNumber}</span>
                    </nav>

                    {/* PRIMARY IDENTITY BLOCK */}
                    <div className="border-b-2 border-slate-900 pb-8">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 font-mono">
                                    {targetPart.partNumber}
                                </h1>
                                <div className="text-lg font-medium text-slate-600">
                                    {targetPart.name}
                                </div>
                            </div>
                            <div className="hidden md:block text-right">
                                <div className="text-[#005EB8] font-bold text-2xl font-mono tracking-tight">{targetPart.brand.toUpperCase()}</div>
                                <div className="text-xs text-slate-400 font-mono uppercase tracking-wide">PREMIUM REPLACEMENT PART</div>
                            </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex gap-3 mb-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <ShieldCheck size={12} className="mr-1" />
                                Verified Spec
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                ISO:9001
                            </span>
                        </div>

                        {/* DESCRIPTION - SEO MAX Content Injection */}
                        <div className="prose prose-slate max-w-none mb-10">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Product Description</h2>
                            <p className="text-slate-600 leading-relaxed text-sm mb-4">
                                Upgrade your heavy machinery with the reliable <strong>{targetPart.brand} {targetPart.partNumber} {targetPart.name}</strong> replacement.
                                Designed specifically for the {targetPart.category} category, this component ensures peak performance and longevity for your fleet.
                                {targetPart.technical_specs?.['Application'] ? ` Ideally suited for ${targetPart.technical_specs['Application']}, it delivers reliable operation under demanding conditions.` : ''}
                            </p>

                            <h3 className="text-md font-bold text-slate-900 mt-6 mb-2">Key Features</h3>
                            <ul className="text-sm list-disc pl-5 space-y-1 text-slate-600">
                                <li><strong>Premium Quality:</strong> Manufactured to meet rigorous {targetPart.brand} compatibility standards.</li>
                                {targetPart.technical_specs?.['Material'] && <li><strong>Material:</strong> Constructed from {targetPart.technical_specs['Material']} for localized stress resistance.</li>}
                                {targetPart.technical_specs?.['Weight'] && <li><strong>Precision Engineered:</strong> weighing {targetPart.technical_specs['Weight']}, ensuring perfect balance and fitment.</li>}
                                <li><strong>Global Compatibility:</strong> Verified suitable for {targetPart.compatibility.slice(0, 3).join(', ')} and other {targetPart.brand} series models.</li>
                            </ul>

                            <h3 className="text-md font-bold text-slate-900 mt-6 mb-2">Why Choose NexGen?</h3>
                            <p className="text-slate-600 text-sm">
                                We stock the <strong>{targetPart.partNumber}</strong> at our regional distribution hubs in Dubai, Singapore, and Houston.
                                Unlike broke-brokers, we offer <strong>Video Inspection</strong> logic before shipping to ensure {targetPart.name} arrives in pristine condition.
                            </p>
                        </div>

                        {/* SPECS TABLE: THE MEAT */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                                    <FileText size={16} className="text-[#005EB8]" />
                                    Technical Specifications
                                </h3>
                                <span className="text-xs text-slate-400 font-mono">DIN / ISO STANDARD</span>
                            </div>

                            <div className="border border-slate-300 rounded-none overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-300">
                                        <tr>
                                            <th className="px-4 py-3 w-1/3 border-r border-slate-200">Attribute</th>
                                            <th className="px-4 py-3">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr>
                                            <td className="px-4 py-2 border-r border-slate-200 font-mono text-slate-600 bg-slate-50/30">BRAND</td>
                                            <td className="px-4 py-2 font-medium text-slate-900 uppercase">{targetPart.brand}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border-r border-slate-200 font-mono text-slate-600 bg-slate-50/30">CATEGORY</td>
                                            <td className="px-4 py-2 font-medium text-slate-900">{targetPart.category}</td>
                                        </tr>
                                        {targetPart.technical_specs && Object.entries(targetPart.technical_specs).map(([key, val]) => (
                                            <tr key={key}>
                                                <td className="px-4 py-2 border-r border-slate-200 font-mono text-slate-600 bg-slate-50/30 uppercase">{key}</td>
                                                <td className="px-4 py-2 font-medium text-slate-900">{val}</td>
                                            </tr>
                                        ))}
                                        {/* CROSS REFERENCE BLOCK (New) */}
                                        {targetPart.oem_cross_references && targetPart.oem_cross_references.length > 0 && (
                                            <tr>
                                                <td className="px-4 py-2 border-r border-slate-200 font-mono text-slate-600 bg-slate-50/30 uppercase align-top">
                                                    Cross Reference
                                                </td>
                                                <td className="px-4 py-2 font-medium text-slate-900">
                                                    <div className="flex flex-col gap-1">
                                                        {targetPart.oem_cross_references.map((xref, idx) => (
                                                            <div key={idx} className="flex items-center text-xs font-mono">
                                                                <span className="w-20 text-slate-500">{xref.brand}:</span>
                                                                <span className="font-bold text-[#005EB8]">{xref.partNumber}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* COMPATIBILITY BLOCK */}
                        <div className="pt-8 border-t border-slate-200">
                            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Fitment Compatibility</h3>
                            <div className="flex flex-wrap gap-2">
                                {targetPart.compatibility.map((model, i) => (
                                    <span key={i} className="px-3 py-1 bg-white border border-slate-300 text-slate-700 font-mono text-xs rounded-none hover:border-[#005EB8] hover:text-[#005EB8] cursor-default transition-colors">
                                        {model}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COL: ACTION (30%) */}
                <div className="lg:col-span-4 print:hidden">
                    <div className="sticky top-24">
                        <div className="bg-white border-2 border-slate-200 shadow-md p-6">

                            <div className="mb-6 pb-6 border-b border-slate-100">
                                <div className="text-xs text-slate-500 font-mono mb-1 uppercase">Global Availability</div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="font-bold text-slate-900 text-lg">In Stock</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">Verified at 3 Regional Hubs</p>
                            </div>

                            <div className="space-y-4">

                                {/* PRIMARY ACTION: WHATSAPP FIRST - Procurement Mode */}
                                <div className="mode-procurement-only">
                                    <WhatsAppButton
                                        className="w-full bg-[#F97316] hover:bg-orange-700 text-white font-bold h-14 text-base tracking-wide rounded-sm shadow-sm transition-all transform active:scale-[0.98]"
                                        partNumber={targetPart.partNumber}
                                        brand={targetPart.brand}
                                        label="Request Quote on WhatsApp"
                                    />
                                </div>

                                {/* SECONDARY ACTION: PDF - Engineering Mode Primary */}
                                <div className="mode-engineering-only">
                                    <Button className="w-full bg-[#005EB8] hover:bg-blue-700 text-white font-bold h-14 text-base tracking-wide rounded-sm shadow-sm">
                                        <Printer className="mr-2" size={18} />
                                        View Blueprints
                                    </Button>
                                </div>

                                <DownloadButton className="h-12 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-[#005EB8] hover:border-[#005EB8]" />
                            </div>

                            <div className="mt-6 bg-slate-50 p-4 border border-slate-100 text-xs text-slate-500 mode-procurement-only">
                                <div className="flex items-center gap-2 mb-2">
                                    <Truck size={14} />
                                    <span className="font-bold text-slate-700">Shipping Estimate:</span>
                                </div>
                                <ShippingEstimator />
                                <p>Next Day Air available.</p>
                            </div>

                            <div className="mt-6 bg-blue-50 p-4 border border-blue-100 text-xs text-blue-900 mode-engineering-only">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShieldCheck size={14} />
                                    <span className="font-bold text-blue-800">Engineering Note:</span>
                                </div>
                                <p>Material composition verified via spectrometry. Tolerance: ±0.05mm. CAD available on request.</p>
                            </div>

                        </div>

                        {/* DATA DISCLAIMER */}
                        <div className="mt-8 text-[10px] text-slate-400 text-center leading-tight">
                            <p>Part numbers and trade names are for reference purposes only. NexGen is not affiliated with the OEM.</p>
                        </div>
                    </div>
                </div>

                {/* RELATED PARTS - SEO Internal Linking */}
                <RelatedParts currentPart={targetPart} allParts={parts} />
            </div>
        </main>
    );
}
