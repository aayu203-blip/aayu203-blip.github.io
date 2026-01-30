import { BrandData } from "@/lib/data-loader";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ShieldCheck, Factory, Filter, ArrowRight, Tractor, ChevronDown } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";

type Props = {
    brand: BrandData;
    locale: string;
};

export function BrandLandingView({ brand, locale }: Props) {
    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="font-black text-xl tracking-tighter text-slate-900 hover:text-[#005EB8] transition-colors">
                        [ NEXGEN SPARES ]
                    </Link>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                        <span>OFFICIAL INDEX</span>
                        <span>/</span>
                        <span className="font-bold text-slate-900 uppercase">{brand.name}</span>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="bg-white border-b border-slate-200 py-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#005EB8] text-white text-xs font-bold uppercase tracking-wider rounded-sm mb-6">
                                <ShieldCheck size={14} />
                                Verified Manufacturer
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 uppercase">
                                {brand.name}
                            </h1>
                            <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                                {brand.description}
                                <br />
                                <span className="text-sm font-mono mt-2 block text-slate-400">{brand.totalParts.toLocaleString()} Verified Parts Indexed.</span>
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <WhatsAppButton
                                    label={`Get Quote for ${brand.name}`}
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

            {/* MACHINE MODELS */}
            {brand.machines && (
                <section className="py-20 bg-white border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <Tractor className="text-[#005EB8]" />
                            Supported Equipment Models
                        </h2>
                        <p className="text-slate-500 mb-12">Select your machine model to find compatible parts.</p>

                        <div className="space-y-4">
                            {Object.entries(brand.machines).map(([category, models]) => (
                                <details key={category} className="group border border-slate-200 bg-slate-50 rounded-sm open:bg-white open:ring-1 open:ring-[#005EB8] transition-all">
                                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-blue-100 text-[#005EB8] flex items-center justify-center rounded-sm font-bold text-xs ring-1 ring-blue-200">
                                                {models.length}
                                            </div>
                                            <span className="font-bold text-lg text-slate-800 uppercase tracking-tight">{category}</span>
                                        </div>
                                        <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="px-6 pb-8 pt-2">
                                        <div className="flex flex-wrap gap-2">
                                            {models.map(model => (
                                                <Link
                                                    key={model}
                                                    href={`/search?q=${brand.name}+${model}`}
                                                    className="px-3 py-1.5 bg-white border border-slate-200 text-sm font-mono text-slate-600 hover:border-[#005EB8] hover:text-[#005EB8] hover:bg-blue-50 transition-colors rounded-sm"
                                                >
                                                    {model}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CALL TO ACTION */}
            <section className="py-20 bg-slate-50 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Can't find your part?</h2>
                <p className="mb-8">We have 60,000+ items that are not yet listed online.</p>
                <WhatsAppButton label="Ask an Expert" />
            </section>
        </main>
    );
}
