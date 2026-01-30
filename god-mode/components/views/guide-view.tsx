import { GuideData } from "@/lib/data-loader";
import { Link } from '@/i18n/routing';
import { Calendar, User, ArrowRight, FileText, Download } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { slugify } from "@/lib/utils";

export function GuideView({ guide, locale }: { guide: GuideData, locale: string }) {

    // SEO: TechArticle Schema
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": guide.title,
        "description": guide.excerpt,
        "image": guide.coverImage || "https://nexgenspares.com/placeholder-guide.jpg",
        "author": {
            "@type": "Organization",
            "name": "NexGen Engineering Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "NexGen Spares",
            "logo": {
                "@type": "ImageObject",
                "url": "https://nexgenspares.com/logo.png"
            }
        },
        "datePublished": guide.datePublished
    };

    return (
        <main className="min-h-screen bg-white font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            {/* HEADER */}
            <div className="bg-slate-50 border-b border-slate-200 py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#005EB8] uppercase tracking-widest mb-4">
                        <FileText size={14} /> Troubleshooting Guide
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                        {guide.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-slate-500 text-sm">
                        <span className="flex items-center gap-2"><Calendar size={14} /> {guide.datePublished}</span>
                        <span className="flex items-center gap-2"><User size={14} /> NexGen Tech Team</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* CONTENT COLUMN */}
                <article className="lg:col-span-8 prose prose-slate prose-lg max-w-none">
                    {/* The Markdown Content */}
                    <ReactMarkdown
                        components={{
                            // Custom Link Styling
                            a: ({ node, ...props }) => <a {...props} className="text-[#005EB8] font-bold hover:underline" />,
                            // Auto-Inject Callouts
                            blockquote: ({ node, ...props }) => (
                                <div className="bg-blue-50 border-l-4 border-[#005EB8] p-4 my-6 not-italic">
                                    <span className="font-bold text-blue-900 block mb-1">Tech Note:</span>
                                    <span className="text-blue-800 text-sm">{props.children}</span>
                                </div>
                            )
                        }}
                    >
                        {guide.content}
                    </ReactMarkdown>

                    {/* LEAD MAGNET (The "Loop") */}
                    <div className="mt-12 bg-slate-900 text-white p-8 rounded-sm">
                        <h3 className="text-xl font-bold mb-2">Need the technical manual for this machine?</h3>
                        <p className="text-slate-400 mb-6">Download the complete PDF schematics for offline use.</p>
                        <button className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-6 rounded-sm flex items-center gap-2 w-full md:w-auto justify-center">
                            <Download size={18} /> Download Schematics (WhatsApp)
                        </button>
                    </div>
                </article>

                {/* THE "PRODUCT TRAP" SIDEBAR */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="sticky top-24">
                        <div className="bg-white border border-slate-200 shadow-xl p-6 rounded-sm">
                            <h3 className="font-bold text-slate-900 uppercase tracking-wide text-xs mb-4">
                                Related Parts
                            </h3>
                            <div className="space-y-4">
                                {guide.relatedParts && guide.relatedParts.length > 0 ? guide.relatedParts.map(part => (
                                    <div key={part.id} className="flex gap-4 items-start group">
                                        <div className="w-16 h-16 bg-slate-100 rounded-sm flex items-center justify-center text-xs text-slate-400 font-mono">
                                            IMG
                                        </div>
                                        <div>
                                            <Link href={`/p/${slugify(part.brand + "-" + part.partNumber)}`} className="font-bold text-slate-900 group-hover:text-[#005EB8] text-sm leading-tight block mb-1">
                                                {part.name}
                                            </Link>
                                            <div className="text-xs text-slate-500 font-mono mb-2">{part.partNumber}</div>
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                In Stock
                                            </span>
                                        </div>
                                    </div>
                                )) : <div className="text-slate-400 text-sm italic">Parts data loading...</div>}
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <Link href={`/${guide.machineSlug ? guide.machineSlug.split('-')[0] : 'brands'}/${getMachineModelFromSlug(guide.machineSlug)}`} className="text-xs font-bold text-[#005EB8] flex items-center gap-1 hover:underline">
                                    View all parts for this machine <ArrowRight size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}

// Helper to extract model from slug if needed, or just link to brand
function getMachineModelFromSlug(slug: string) {
    if (!slug) return "";
    const parts = slug.split('-');
    return parts.length > 1 ? parts.slice(1).join('-') : slug;
}
