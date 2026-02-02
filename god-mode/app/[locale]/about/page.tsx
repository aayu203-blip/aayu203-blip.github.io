import { ShieldCheck, Award, Users, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    return {
        title: "About NexGen | Global Heavy Machinery Spares",
        description: "NexGen is a digital-first supply chain partner for Volvo, Scania, and Komatsu parts. Verified stock, global logistics.",
    };
}

export default async function AboutPage({ params }: Props) {
    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* HERO */}
            <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
                        THE <span className="text-[#F97316]">NEXGEN</span> STANDARD.
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed">
                        We are re-engineering the heavy equipment supply chain. No friction. No opaque pricing. Just the parts you need, verified and delivered.
                    </p>
                </div>
            </section>

            {/* MISSION GRID */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="p-8 bg-white border border-slate-200 shadow-sm rounded-sm">
                        <div className="w-12 h-12 bg-blue-50 text-[#005EB8] flex items-center justify-center rounded-sm mb-6">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Verified Quality</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Every part in our "God Mode" database is cross-referenced with OEM schematics. Whether it's Premium Replacement or Tier-1 Aftermarket, you know exactly what you're buying.
                        </p>
                    </div>
                    <div className="p-8 bg-white border border-slate-200 shadow-sm rounded-sm">
                        <div className="w-12 h-12 bg-orange-50 text-[#F97316] flex items-center justify-center rounded-sm mb-6">
                            <Globe size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Global Logistics</h3>
                        <p className="text-slate-600 leading-relaxed">
                            From our hubs in Dubai and Singapore, we coordinate air freight to 140+ countries. Our dynamic shipping estimator gives you real-time timelines.
                        </p>
                    </div>
                    <div className="p-8 bg-white border border-slate-200 shadow-sm rounded-sm">
                        <div className="w-12 h-12 bg-slate-100 text-slate-900 flex items-center justify-center rounded-sm mb-6">
                            <Users size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Engineering First</h3>
                        <p className="text-slate-600 leading-relaxed">
                            We aren't just salespeople. Our team includes certified heavy equipment mechanics who understand the difference between a C2 and C3 bearing clearance.
                        </p>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="bg-[#005EB8] text-white py-20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-black mb-2">47,000+</div>
                        <div className="text-blue-200 text-sm font-mono uppercase tracking-widest">Parts Indexed</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black mb-2">140+</div>
                        <div className="text-blue-200 text-sm font-mono uppercase tracking-widest">Countries Served</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black mb-2">24h</div>
                        <div className="text-blue-200 text-sm font-mono uppercase tracking-widest">Dispatch Time</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black mb-2">100%</div>
                        <div className="text-blue-200 text-sm font-mono uppercase tracking-widest">Fitment Guarantee</div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Ready to minimize downtime?</h2>
                <Link href="/search">
                    <Button size="lg" className="bg-[#F97316] hover:bg-orange-700 text-white font-bold h-14 px-8 text-lg">
                        BROWSE THE INDEX
                    </Button>
                </Link>
            </section>
        </main>
    );
}
