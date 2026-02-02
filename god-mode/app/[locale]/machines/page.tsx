import { MACHINE_CATALOG } from "@/lib/taxonomy";
import { Link } from '@/i18n/routing'; // Using universal router link
import { slugify } from "@/lib/utils";
import { Construction, ArrowRight, Activity, Truck, Anchor } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Heavy Equipment Catalog | NexGen Spares",
    description: "Browse aftermarket parts by machine type. Excavators, Loaders, Dozers, and Haulers from Volvo, CAT, Komatsu, and more.",
};

export default function MachinesIndexPage() {
    // 1. Extract Unique Categories
    const categorySet = new Set<string>();
    Object.values(MACHINE_CATALOG).forEach(brandCats => {
        Object.keys(brandCats).forEach(cat => categorySet.add(cat));
    });
    const categories = Array.from(categorySet).sort();

    // 2. Extract Brands
    const brands = Object.keys(MACHINE_CATALOG).sort();

    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* HERO */}
            <section className="bg-slate-900 text-white py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase">
                        Equipment Catalog
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                        Navigate our inventory by machine type or manufacturer.
                        We stock parts for over {Object.values(MACHINE_CATALOG).flatMap(c => Object.values(c)).flat().length} different models.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">

                {/* 1. BY CATEGORY */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                        <Construction className="text-[#005EB8]" />
                        Browse by Machine Type
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map(cat => (
                            <Link
                                key={cat}
                                href={`/machines/${slugify(cat)}`}
                                className="group bg-white border border-slate-200 p-6 rounded-sm hover:shadow-lg hover:border-[#005EB8] transition-all flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-[#005EB8] transition-colors">
                                        {cat}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        View Parts & Models
                                    </p>
                                </div>
                                <ArrowRight className="text-slate-300 group-hover:text-[#005EB8] group-hover:translate-x-1 transition-all" size={20} />
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 2. BY BRAND */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                        <Activity className="text-[#005EB8]" />
                        Browse by Manufacturer
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {brands.map(brand => (
                            <Link
                                key={brand}
                                href={`/brands/${slugify(brand)}`}
                                className="bg-white border border-slate-200 p-8 flex flex-col items-center justify-center gap-4 hover:border-[#005EB8] hover:shadow-md transition-all group rounded-sm text-center"
                            >
                                <span className="font-black text-xl text-slate-700 uppercase tracking-tighter group-hover:text-[#005EB8]">
                                    {brand}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}
