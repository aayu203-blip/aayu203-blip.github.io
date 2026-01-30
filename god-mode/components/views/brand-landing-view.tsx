import { BrandData } from "@/lib/data-loader";
import { Link } from '@/i18n/routing';
import { ShieldCheck, Truck, ArrowRight, Settings, Wrench, FileText } from "lucide-react";

export function BrandLandingView({ brand, locale }: { brand: BrandData, locale: string }) {

    // 1. DYNAMIC FAQ SCHEMA GENERATOR (Your SEO Upgrade #1A)
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `Do you sell aftermarket parts for ${brand.name}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Yes, NexGen Spares stocks ${brand.totalParts}+ verified aftermarket parts for ${brand.name} excavators, loaders, and dozers. We ship globally.`
                }
            },
            {
                "@type": "Question",
                "name": `Are these parts compatible with ${brand.name} OEM specs?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Our parts are manufactured in Turkey and Korea to meet or exceed ${brand.name} OEM specifications. We offer a 100% fitment guarantee.`
                }
            }
        ]
    };

    return (
        <main className="min-h-screen bg-white font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* CLEAN TITLE SECTION */}
            <div className="bg-white pt-8 pb-8 px-6 border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2 text-slate-900">
                                {brand.name} <span className="text-slate-400">Parts</span>
                            </h1>
                            <p className="text-slate-500 max-w-2xl leading-relaxed">
                                {brand.totalParts.toLocaleString()} verified aftermarket SKUs for {brand.name} heavy machinery.
                                Direct from OEM-tier manufacturers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* TRUST STRIP */}
            <div className="bg-white border-b border-slate-200 py-4 px-6">
                <div className="max-w-7xl mx-auto flex flex-wrap gap-6 md:gap-12 text-xs font-mono text-slate-600">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-[#005EB8]" size={16} />
                        <span>Verified {brand.name} Fitment</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Truck className="text-[#005EB8]" size={16} />
                        <span>Exports to 12+ Countries</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wrench className="text-[#005EB8]" size={16} />
                        <span>Technical Schematics Available</span>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* LEFT: CATEGORIES & MACHINES */}
                <div className="lg:col-span-8 space-y-12">

                    {/* POPULAR MACHINE MODELS (Internal Linking Goldmine) */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Settings className="text-[#005EB8]" size={20} />
                            Popular {brand.name} Models Supported
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {brand.popularModels.map(model => (
                                <Link
                                    key={model}
                                    href={`/${brand.slug}/${model.toLowerCase()}`}
                                    className="group bg-white border border-slate-200 p-4 hover:border-[#005EB8] hover:shadow-md transition-all rounded-sm flex justify-between items-center"
                                >
                                    <span className="font-mono font-bold text-slate-700">{model}</span>
                                    <ArrowRight size={14} className="text-slate-300 group-hover:text-[#005EB8] group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* LATEST PARTS FEED (Freshness Signal) */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Recently Indexed {brand.name} Parts</h2>
                        <div className="bg-white border border-slate-200 rounded-sm">
                            {brand.recentParts.map((part, i) => (
                                <div key={part.id} className={`p-4 flex justify-between items-center ${i !== brand.recentParts.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                    <div>
                                        <Link href={`/p/${part.brand.toLowerCase()}-${part.partNumber.toLowerCase()}`} className="font-bold text-[#005EB8] hover:underline block">
                                            {part.partNumber}
                                        </Link>
                                        <span className="text-xs text-slate-500 uppercase">{part.name}</span>
                                    </div>
                                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-sm">
                                        In Stock
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* RIGHT: PROBLEM-BASED SEO & GUIDES */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-sm">
                        <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <FileText size={18} />
                            Maintenance Guides
                        </h3>
                        <ul className="space-y-3">
                            {brand.guides.length > 0 ? brand.guides.map(guide => (
                                <li key={guide.slug}>
                                    <Link href={`/guides/${guide.slug}`} className="text-sm text-slate-700 hover:text-[#005EB8] hover:underline block leading-snug">
                                        {guide.title}
                                    </Link>
                                </li>
                            )) : (
                                <li className="text-sm text-slate-400 italic">No guides available yet.</li>
                            )}
                        </ul>
                    </div>

                    {/* SEO CONTENT BLOCK (Text for Google) */}
                    <div className="text-sm text-slate-500 space-y-4 leading-relaxed border-t border-slate-200 pt-6">
                        <p>
                            <strong>Reliable {brand.name} Supply Chain:</strong> NexGen Spares provides a verified alternative to the official dealer network. We source directly from OEM-tier manufacturers used by {brand.name} assembly lines.
                        </p>
                        <p>
                            Whether you are repairing a <strong>{brand.popularModels[0]}</strong> hydraulic pump or rebuilding a <strong>{brand.popularModels[1]}</strong> engine, our index ensures you get the right spec, faster.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
