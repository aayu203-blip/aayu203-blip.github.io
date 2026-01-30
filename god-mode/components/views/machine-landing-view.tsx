import { MachineData } from "@/lib/data-loader";
import { Link } from '@/i18n/routing';
import { Package, Activity, Zap, CheckCircle2, ArrowRight } from "lucide-react";

export function MachineLandingView({ machine, locale }: { machine: MachineData, locale: string }) {

    // SEO Upgrade: Specific Meta Description
    const metaDescription = `Complete parts catalog for ${machine.brand} ${machine.model}. Hydraulic pumps, injectors, filters, and undercarriage. Fast shipping to USA & Middle East.`;

    return (
        <main className="min-h-screen bg-white font-sans">

            {/* COMPACT TECHNICAL HEADER */}
            <div className="bg-slate-50 border-b border-slate-200 py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Link href={`/${machine.brand.toLowerCase()}`} className="text-xs font-bold text-slate-500 uppercase hover:text-[#005EB8]">
                                    {machine.brand} Index
                                </Link>
                                <span className="text-slate-300">/</span>
                                <span className="text-xs font-bold text-[#005EB8] uppercase">Model Catalog</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">
                                {machine.brand} {machine.model}
                            </h1>
                            <p className="text-slate-500 mt-2 max-w-xl">
                                Verified aftermarket components for {machine.model} series.
                                <span className="hidden sm:inline"> Cross-referenced with OEM diagrams.</span>
                            </p>
                        </div>

                        {/* MACHINE VITALS (Trust) */}
                        <div className="flex gap-6 text-xs font-mono text-slate-600 bg-white p-3 border border-slate-200 rounded-sm shadow-sm">
                            <div>
                                <div className="text-slate-400 font-bold uppercase text-[10px]">Engine</div>
                                <div>{machine.engineType || "Standard Diesel"}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 font-bold uppercase text-[10px]">Parts Indexed</div>
                                <div>{machine.totalParts} Items</div>
                            </div>
                            <div>
                                <div className="text-slate-400 font-bold uppercase text-[10px]">Hydraulics</div>
                                <div>Available</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CATEGORIZED PARTS GRID */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Category: HYDRAULICS */}
                    <CategoryCard
                        title="Hydraulics"
                        icon={<Activity size={20} />}
                        items={machine.parts.filter(p => p.category.toLowerCase().includes('hydraulic')).slice(0, 5)}
                    />

                    {/* Category: ENGINE */}
                    <CategoryCard
                        title="Engine Components"
                        icon={<Zap size={20} />}
                        items={machine.parts.filter(p => p.category.toLowerCase().includes('engine')).slice(0, 5)}
                    />

                    {/* Category: FILTERS & SERVICE */}
                    <CategoryCard
                        title="Filters & Service"
                        icon={<Package size={20} />}
                        items={machine.parts.filter(p => p.category.toLowerCase().includes('filter')).slice(0, 5)}
                    />
                </div>

                {/* CALL TO ACTION */}
                <div className="mt-16 bg-slate-900 text-white p-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Can't find a specific {machine.model} part?</h3>
                        <p className="text-slate-400 text-sm">We have access to 15,000+ items not listed publicly.</p>
                    </div>
                    <a
                        href={`https://wa.me/919820259953?text=I%20need%20parts%20for%20${machine.brand}%20${machine.model}`}
                        className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-6 rounded-sm whitespace-nowrap"
                    >
                        WhatsApp Inquiry
                    </a>
                </div>
            </div>
        </main>
    );
}

function CategoryCard({ title, icon, items }: { title: string, icon: any, items: any[] }) {
    if (items.length === 0) return null;
    return (
        <div className="border border-slate-200 bg-white rounded-sm p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
                <div className="text-[#005EB8] bg-blue-50 p-2 rounded-full">{icon}</div>
                <h3 className="font-bold text-slate-900 uppercase tracking-wide text-sm">{title}</h3>
            </div>
            <ul className="space-y-3">
                {items.map(part => (
                    <li key={part.id}>
                        <Link href={`/p/${part.brand.toLowerCase()}-${part.partNumber.toLowerCase()}`} className="flex justify-between items-start group">
                            <div>
                                <span className="block text-sm font-bold text-slate-700 group-hover:text-[#005EB8] transition-colors">
                                    {part.partNumber}
                                </span>
                                <span className="block text-[10px] text-slate-500 uppercase">{part.name}</span>
                            </div>
                            <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <span className="text-xs font-bold text-[#005EB8] uppercase tracking-wider cursor-pointer">View All</span>
            </div>
        </div>
    );
}
