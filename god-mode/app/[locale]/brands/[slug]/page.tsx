import { getPartsByBrand, slugify } from "@/lib/data-loader";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Search, ShieldCheck, Factory, Filter, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ slug: string; locale: string }>
};

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    // Simple title case for brand
    const brandName = slug.charAt(0).toUpperCase() + slug.slice(1);

    return {
        title: `${brandName} Parts Catalog & Price List | NexGen Index`,
        description: `Browse the official ${brandName} spare parts index. Verified components for excavators, loaders, and haulers. Direct factory quotes via WhatsApp.`,
    };
}

export default async function BrandPage({ params }: Props) {
    const { slug } = await params;
    const parts = await getPartsByBrand(slug);

    if (parts.length === 0) {
        return notFound();
    }

    const brandName = parts[0].brand; // Assuming consistent brand naming in result

    // Extract Categories
    const categories = Array.from(new Set(parts.map(p => p.category))).sort();

    // Top 50 Parts
    const topParts = parts.slice(0, 50);

    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

            {/* 1. BRAND HEADER - OFFICIAL STYLE */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="font-black text-xl tracking-tighter text-slate-900 hover:text-[#005EB8] transition-colors">
                        [ NEXGEN ]
                    </Link>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                        <span>OFFICIAL INDEX</span>
                        <span>/</span>
                        <span className="font-bold text-slate-900 uppercase">{brandName}</span>
                    </div>
                </div>
            </header>

            {/* 2. HERO: BRAND AUTHORITY */}
            <section className="bg-white border-b border-slate-200 py-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#005EB8] text-white text-xs font-bold uppercase tracking-wider rounded-sm mb-6">
                                <ShieldCheck size={14} />
                                Verified Manufacturer
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 uppercase">
                                {brandName}
                            </h1>
                            <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                                Browse {parts.length.toLocaleString()} verified components. Direct from global warehouses.
                                Full technical specifications avaiable.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <WhatsAppButton
                                    label={`Get Quote for ${brandName}`}
                                    className="h-12 px-8 text-base bg-[#F97316] hover:bg-orange-700 font-bold"
                                />
                                <Button variant="outline" className="h-12 px-8 text-base border-slate-300 text-slate-700 hover:text-[#005EB8]">
                                    Download Catalog (PDF)
                                </Button>
                            </div>
                        </div>

                        {/* Decor */}
                        <div className="hidden md:block opacity-5">
                            <Factory size={300} strokeWidth={0.5} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. CATEGORY GRID */}
            <section className="py-20 bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                        <Filter className="text-[#005EB8]" />
                        Popular Categories
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categories.map(cat => (
                            <Link
                                key={cat}
                                href="#"
                                className="group bg-white p-6 border border-slate-200 shadow-sm hover:border-[#005EB8] hover:shadow-md transition-all"
                            >
                                <div className="h-2 w-8 bg-slate-200 mb-4 group-hover:bg-[#005EB8] transition-colors"></div>
                                <h3 className="font-bold text-slate-900 text-sm">{cat}</h3>
                                <p className="text-xs text-slate-400 mt-2">{parts.filter(p => p.category === cat).length} parts</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. PARTS TABLE */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Popular {brandName} Components</h2>

                    <div className="overflow-x-auto border border-slate-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Part Number</th>
                                    <th className="px-6 py-4">Name / Application</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {topParts.map(part => (
                                    <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-[#005EB8]">
                                            <Link href={`/p/${slugify(part.brand)}-${slugify(part.partNumber)}`} className="hover:underline">
                                                {part.partNumber}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 font-medium">
                                            {part.name}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {part.category}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/p/${slugify(part.brand)}-${slugify(part.partNumber)}`} className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-[#005EB8] transition-colors">
                                                VIEW SPEC <ArrowRight size={12} className="ml-1" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 text-center">
                        <Button variant="ghost" className="text-slate-500 hover:text-[#005EB8]">
                            View All {brandName} Parts <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}
