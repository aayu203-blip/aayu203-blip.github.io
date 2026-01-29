import { getPartsByCategory, slugify } from "@/lib/data-loader";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Search, Construction, Factory, Filter, ArrowRight, Settings } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ category: string; locale: string }>
};

export default async function MachineCategoryPage({ params }: Props) {
    const { category } = await params;
    // Decode slug back to a displayable title (simple approximation)
    const categoryTitle = category.replace(/-/g, ' ').toUpperCase();

    const parts = await getPartsByCategory(category);

    if (parts.length === 0) {
        // Fallback for demo: if no exact match, show all generic parts or handle gracefully
        // For now, return notFound if strictly checking. 
        // But since data is mock, let's just proceed with empty list or custom message if 0
    }

    const categories = Array.from(new Set(parts.map(p => p.category))).sort();
    const topParts = parts.slice(0, 50);

    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

            {/* 1. HEADER - OFFICIAL STYLE */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="font-black text-xl tracking-tighter text-slate-900 hover:text-[#005EB8] transition-colors">
                        [ NEXGEN ]
                    </Link>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                        <span>MACHINE INDEX</span>
                        <span>/</span>
                        <span className="font-bold text-slate-900 uppercase">{categoryTitle}</span>
                    </div>
                </div>
            </header>

            {/* 2. HERO: MACHINE AUTHORITY */}
            <section className="bg-white border-b border-slate-200 py-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm mb-6">
                                <Construction size={14} />
                                Heavy Equipment Series
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 uppercase">
                                {categoryTitle} PARTS
                            </h1>
                            <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                                Maintenance components, wear parts, and critical assemblies for {categoryTitle}.
                                Verified fitment for major OEMs.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <WhatsAppButton
                                    label={`Quote ${categoryTitle} Parts`}
                                    className="h-12 px-8 text-base bg-[#F97316] hover:bg-orange-700 font-bold"
                                />
                            </div>
                        </div>

                        {/* Decor */}
                        <div className="hidden md:block opacity-5">
                            <Settings size={300} strokeWidth={0.5} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. PARTS TABLE */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Available Components</h2>

                    <div className="overflow-x-auto border border-slate-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Part Number</th>
                                    <th className="px-6 py-4">Brand</th>
                                    <th className="px-6 py-4">Name / Application</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {topParts.length > 0 ? topParts.map(part => (
                                    <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-[#005EB8]">
                                            <Link href={`/p/${slugify(part.brand)}-${slugify(part.partNumber)}`} className="hover:underline">
                                                {part.partNumber}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-slate-900 font-bold uppercase">
                                            {part.brand}
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 font-medium">
                                            {part.name}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/p/${slugify(part.brand)}-${slugify(part.partNumber)}`} className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-[#005EB8] transition-colors">
                                                VIEW SPEC <ArrowRight size={12} className="ml-1" />
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                                            No explicit matches found for this category in the demo database.
                                            <br />Try searching for "Engine" or "Filter".
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    )
}
