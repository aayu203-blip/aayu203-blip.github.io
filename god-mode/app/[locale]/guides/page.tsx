import Link from "next/link";
import { getAllGuides } from "@/lib/guides";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    return {
        title: "Knowledge Hub | Maintenance Guides & Technical Tips",
        description: "Expert advice on maintaining Volvo, Scania, and heavy machinery. Prevent downtime with our technical guides.",
    };
}

export default async function GuidesIndexPage({ params }: Props) {
    const guides = await getAllGuides();

    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* HERDER */}
            <header className="bg-[#0f172a] text-white py-20 border-b-4 border-[#F97316]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-xs font-mono text-[#F97316] mb-6">
                        <BookOpen size={14} />
                        <span>TECHNICAL LIBRARY</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                        KNOWLEDGE HUB
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Expert maintenance strategies, diagnostic workflows, and repair guides for the modern fleet manager.
                    </p>
                </div>
            </header>

            {/* CONTENT GRID */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {guides.map((guide) => (
                            <Link
                                key={guide.id}
                                href={`/guides/${guide.slug}`}
                                className="group bg-white border border-slate-200 rounded-sm shadow-sm hover:shadow-md transition-all flex flex-col h-full"
                            >
                                <div className="h-48 bg-slate-100 border-b border-slate-100 relative overflow-hidden">
                                    {/* Placeholder Pattern */}
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 uppercase tracking-wide text-slate-700 border border-slate-200">
                                        {guide.tags[0] || "Guide"}
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#005EB8] transition-colors line-clamp-2">
                                        {guide.title}
                                    </h2>
                                    <p className="text-slate-500 text-sm mb-6 line-clamp-3">
                                        {guide.excerpt}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <User size={12} /> {guide.author.split(' ').pop()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} /> {guide.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
