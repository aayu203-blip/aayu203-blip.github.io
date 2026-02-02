'use client';

import { useState } from 'react';
import { Part, slugify } from "@/lib/utils";
import {
    MessageCircle,
    ShieldCheck,
    Truck,
    Clock,
    Globe,
    ChevronRight,
    Share2,
    Copy,
    AlertTriangle,
    BarChart3,
    HelpCircle,
    CheckCircle2
} from "lucide-react";
import { Link } from '@/i18n/routing';

// --- HELPER: WhatsApp Message Generator ---
function getWhatsAppLink(part: Part, context: string = "general") {
    const phone = "919137151496";
    let text = `Hi NexGen, `;

    if (context === 'fitment') {
        text += `I need to verify if this part fits my machine:\n\n*Part:* ${part.brand} ${part.partNumber}\n*My Machine:* (type model here)`;
    } else if (context === 'price') {
        text += `I need a price quote for:\n\n*Part:* ${part.brand} ${part.partNumber}\n*Qty:* (type quantity)`;
    } else {
        const slug = part.brand && part.partNumber ? slugify(`${part.brand}-${part.partNumber}`) : 'part';
        text += `I found this part on your site:\n\n*Part:* ${part.brand} ${part.partNumber}\n*Name:* ${part.name}\n*Link:* https://nexgenspares.com/p/${slug}\n\nIs this available?`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function PartDetailView({ part, locale }: { part: Part, locale: string }) {
    const waLink = getWhatsAppLink(part, 'price');
    const [copied, setCopied] = useState(false);

    // Dynamic "Urgency" Logic
    const demandLevel = part.name.toLowerCase().includes('pump') || part.name.toLowerCase().includes('injector') ? 'HIGH' : 'NORMAL';

    // FAQ Data
    const faqs = [
        {
            question: `Is the ${part.partNumber} compatible with my ${part.brand} machine?`,
            answer: `This part is verified for fitment with ${part.compatibility?.slice(0, 3).join(', ') || "standard " + part.brand + " equipment"}. We recommend verifying your machine serial number with our engineering team via WhatsApp before ordering.`
        },
        {
            question: "How fast can you ship to my location?",
            answer: "We have stock ready for immediate dispatch. Express air freight (DHL/FedEx) typically reaches the USA, Middle East, and Europe within 3-5 business days."
        }
    ];

    // JSON-LD Structured Data
    const jsonLd = {
        "@context": "https://schema.org/",
        "@graph": [
            {
                "@type": "Product",
                "name": `${part.brand} ${part.partNumber} ${part.name} - Aftermarket Spare Part`,
                "image": "https://nexgenspares.com/placeholder-part.jpg",
                "description": `Buy verified aftermarket ${part.partNumber} ${part.name} for ${part.brand}. Compatible with ${part.compatibility?.join(', ')}. In stock with global shipping.`,
                "sku": part.partNumber,
                "brand": { "@type": "Brand", "name": part.brand },
                "offers": {
                    "@type": "Offer",
                    "url": `https://nexgenspares.com/p/${slugify(part.brand + "-" + part.partNumber)}`, // specific url
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "price": "0.00" // Call for price signal
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": faqs.map(f => ({
                    "@type": "Question",
                    "name": f.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": f.answer
                    }
                }))
            }
        ]
    };

    return (
        <main className="min-h-screen bg-white pb-24 md:pb-0">
            {/* 1. JSON-LD Injection & Dynamic Title */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <title>{`${part.brand} ${part.partNumber} - ${part.name} | NexGen Spares`}</title>

            {/* 2. BREADCRUMBS */}
            <nav className="border-b border-slate-200 bg-slate-50 py-3 px-6 text-xs font-mono text-slate-500">
                <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
                    <Link href="/" className="hover:text-[#005EB8] shrink-0">INDEX</Link>
                    <ChevronRight size={10} />
                    <Link href={`/brands/${part.brand.toLowerCase()}`} className="hover:text-[#005EB8] uppercase shrink-0">
                        {part.brand}
                    </Link>
                    <ChevronRight size={10} />
                    <span className="text-slate-900 font-bold uppercase truncate">{part.partNumber}</span>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* --- LEFT COL: SPECS & DETAILS --- */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* HEADER (SEO OPTIMIZED H1) */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
                                    Aftermarket Verified
                                </span>
                                {demandLevel === 'HIGH' && (
                                    <span className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
                                        <AlertTriangle size={10} /> High Demand
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-2 leading-none">
                                {part.brand} {part.partNumber} - {part.name}
                            </h1>
                            <h2 className="text-lg text-slate-500 font-medium mt-2">
                                Premium Aftermarket Replacement Part • Verified Fitment
                            </h2>
                        </div>

                        {/* KEY DATA GRID (Trust Signals) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-200">
                            <div className="space-y-1">
                                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1">
                                    <Globe size={12} /> Origin
                                </div>
                                <div className="font-mono text-sm font-bold text-slate-700">Turkey / Korea</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1">
                                    <Clock size={12} /> Lead Time
                                </div>
                                <div className="font-mono text-sm font-bold text-slate-700">Ready: 48 Hrs</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1">
                                    <ShieldCheck size={12} /> Quality
                                </div>
                                <div className="font-mono text-sm font-bold text-slate-700">ISO Certified</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1">
                                    <Truck size={12} /> Shipping
                                </div>
                                <div className="font-mono text-sm font-bold text-slate-700">DHL / FedEx</div>
                            </div>
                        </div>

                        {/* TECHNICAL SPECS TABLE */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <BarChart3 className="text-[#005EB8]" size={20} />
                                Technical Specifications
                            </h3>
                            <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <tbody>
                                        {Object.entries(part.technical_specs || {}).map(([key, value], idx) => (
                                            <tr key={key} className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                                                <th className="py-3 px-4 font-bold text-slate-500 uppercase text-xs border-r border-slate-200 w-1/3">
                                                    {key}
                                                </th>
                                                <td className="py-3 px-4 font-mono font-medium text-slate-900">
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Embed Cross References in Table */}
                                        {part.oem_cross_references && part.oem_cross_references.length > 0 && (
                                            <tr className="bg-blue-50/50">
                                                <th className="py-3 px-4 font-bold text-slate-500 uppercase text-xs border-r border-slate-200 align-top">
                                                    Cross Ref
                                                </th>
                                                <td className="py-3 px-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {part.oem_cross_references.map((xref, i) => (
                                                            <span key={i} className="font-mono font-bold text-[#005EB8] text-xs">
                                                                {xref.partNumber}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* MICRO-COMMITMENT CTA */}
                            <div className="mt-4 text-right">
                                <a
                                    href={waLink}
                                    target="_blank"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#005EB8] hover:underline"
                                >
                                    Need full PDF datasheet? Request on WhatsApp <ChevronRight size={12} />
                                </a>
                            </div>
                        </div>

                        {/* COMPATIBILITY & APPLICATIONS */}
                        {part.compatibility && part.compatibility.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Compatible Equipment (Applications)</h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {part.compatibility.map(model => (
                                        <Link
                                            key={model}
                                            href={`/search?q=${part.brand}+${model}`}
                                            className="bg-slate-100 hover:bg-[#005EB8] hover:text-white text-slate-700 text-xs font-mono py-1.5 px-3 rounded-sm transition-colors"
                                        >
                                            {model}
                                        </Link>
                                    ))}
                                </div>
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-sm flex items-center justify-between">
                                    <div className="text-xs text-blue-900">
                                        <span className="font-bold">Not sure if it fits?</span> Send us your machine serial plate.
                                    </div>
                                    <a
                                        href={getWhatsAppLink(part, 'fitment')}
                                        target="_blank"
                                        className="text-xs font-bold text-[#005EB8] hover:underline flex items-center gap-1"
                                    >
                                        Verify Fitment <MessageCircle size={12} />
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* FAQ SECTION (Rich Results Goldmine) */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <HelpCircle className="text-[#005EB8]" size={20} />
                                Frequently Asked Questions
                            </h3>
                            <div className="space-y-3">
                                {faqs.map((faq, idx) => (
                                    <details key={idx} className="group border border-slate-200 bg-white rounded-sm open:bg-slate-50">
                                        <summary className="flex items-center justify-between p-4 cursor-pointer list-none font-bold text-sm text-slate-800">
                                            {faq.question}
                                            <ChevronRight className="text-slate-400 group-open:rotate-90 transition-transform" size={16} />
                                        </summary>
                                        <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* --- RIGHT COL: THE "BUY BOX" (Sticky on Desktop) --- */}
                    <div className="lg:col-span-4">
                        <div className="bg-white border-2 border-[#005EB8] p-6 rounded-sm shadow-xl shadow-blue-900/5 sticky top-24">

                            <div className="text-center mb-6">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Estimated Price</div>
                                <div className="text-3xl font-black text-slate-900">
                                    Ask for Quote
                                </div>
                                <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center justify-center gap-1">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    In Stock (Verify Qty)
                                </p>
                            </div>

                            {/* PRIMARY CTA - THE MONEY BUTTON */}
                            <a
                                href={waLink}
                                target="_blank"
                                className="block w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-center py-4 rounded-sm text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 mb-4 flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="fill-white" />
                                Get Quote via WhatsApp
                            </a>

                            <div className="text-center mb-6">
                                <span className="text-[10px] text-slate-400">
                                    Response time: &lt; 30 mins (Business Hours)
                                </span>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-3 text-xs text-slate-600">
                                    <CheckCircle2 className="text-[#005EB8] shrink-0" size={16} />
                                    <span>100% Fitment Guarantee or Refund</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-600">
                                    <Truck className="text-[#005EB8] shrink-0" size={16} />
                                    <span>Express Air Freight to USA/UAE</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-600">
                                    <Copy className="text-[#005EB8] shrink-0" size={16} />
                                    <button
                                        onClick={() => {
                                            const slug = slugify(part.brand + "-" + part.partNumber);
                                            navigator.clipboard.writeText(`https://nexgenspares.com/p/${slug}`);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="hover:underline text-left"
                                    >
                                        {copied ? "Link Copied!" : "Copy Page Link for Procurement"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. STICKY MOBILE ACTION BAR */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 lg:hidden z-50 flex items-center gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex-1">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Part #</div>
                    <div className="text-sm font-black text-slate-900 truncate">{part.partNumber}</div>
                </div>
                <a
                    href={waLink}
                    target="_blank"
                    className="bg-[#25D366] text-white font-bold py-3 px-6 rounded-sm text-sm flex items-center gap-2 shadow-sm"
                >
                    <MessageCircle size={18} className="fill-white" />
                    Get Price
                </a>
            </div>
        </main>
    );
}
