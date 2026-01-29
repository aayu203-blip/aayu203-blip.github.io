import { notFound } from "next/navigation";
import { getGuideBySlug, enrichContent, type Guide } from "@/lib/guides";
import { User, Calendar, Tag, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getParts } from "@/lib/data-loader";

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const guide = await getGuideBySlug(slug);

    if (!guide) {
        return { title: 'Guide Not Found' };
    }

    return {
        title: `${guide.title} | NexGen Knowledge Hub`,
        description: guide.excerpt,
        openGraph: {
            title: guide.title,
            description: guide.excerpt,
            type: 'article',
            publishedTime: guide.date,
            authors: [guide.author],
        },
    };
}

export default async function GuideDetailPage({ params }: Props) {
    const { slug } = await params;
    const guide = await getGuideBySlug(slug);

    if (!guide) {
        notFound();
    }

    const htmlContent = enrichContent(guide.content);

    // Schema.org Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: guide.title,
        description: guide.excerpt,
        author: {
            '@type': 'Person',
            name: guide.author
        },
        datePublished: guide.date,
        image: guide.coverImage || 'https://example.com/default.jpg'
    };

    return (
        <main className="min-h-screen bg-white font-sans text-slate-900">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* PROGRESS BAR (Mock) */}
            <div className="fixed top-0 left-0 w-full h-1 z-50 bg-slate-100">
                <div className="h-full bg-[#F97316] w-1/3"></div>
            </div>

            {/* HEADER */}
            <header className="bg-slate-50 border-b border-slate-200 py-16">
                <div className="max-w-4xl mx-auto px-6">
                    <Link href="/guides" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-[#005EB8] mb-8">
                        <ArrowLeft size={16} className="mr-2" />
                        BACK TO HUB
                    </Link>

                    <div className="flex gap-2 mb-6">
                        {guide.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-white border border-slate-200 text-xs font-mono font-bold uppercase tracking-wide text-slate-600 rounded-sm">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
                        {guide.title}
                    </h1>

                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                        {guide.excerpt}
                    </p>

                    <div className="flex items-center gap-6 mt-8 pt-8 border-t border-slate-200">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                <User size={16} />
                            </div>
                            {guide.author}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-mono">
                            <Calendar size={14} />
                            {guide.date}
                        </div>
                    </div>
                </div>
            </header>

            {/* ARTICLE BODY */}
            <article className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Main Content */}
                <div className="lg:col-span-8">
                    <div
                        className="prose prose-lg prose-slate max-w-none 
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
                        prose-p:leading-relaxed prose-p:text-slate-600
                        prose-a:text-[#005EB8] prose-a:no-underline prose-a:font-semibold hover:prose-a:underline
                        prose-strong:text-slate-900 prose-strong:font-bold
                        "
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />

                    {/* CTA Box */}
                    <div className="mt-16 bg-slate-900 text-white p-8 rounded-sm shadow-xl">
                        <h3 className="text-2xl font-bold mb-4">Need Generic Spares?</h3>
                        <p className="text-slate-300 mb-6">
                            We stock verified aftermarket parts for the machines mentioned in this guide.
                        </p>
                        <Link href="/search">
                            <Button className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-bold h-12">
                                BROWSE CATALOG
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="sticky top-24">
                        <div className="bg-slate-50 border border-slate-200 p-6 rounded-sm">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Tag size={16} className="text-[#005EB8]" />
                                RELATED TOPICS
                            </h4>
                            <ul className="space-y-3">
                                {guide.tags.map(tag => (
                                    <li key={tag}>
                                        <Link href={`/search?q=${tag}`} className="text-sm text-slate-600 hover:text-[#005EB8] hover:underline block">
                                            Browse {tag} Parts &rarr;
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-6">
                            <Button variant="outline" className="w-full border-slate-300 text-slate-600 hover:text-[#005EB8]" >
                                <Share2 size={16} className="mr-2" /> Share Guide
                            </Button>
                        </div>
                    </div>
                </aside>

            </article>
        </main>
    );
}
