import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, CheckCircle, Package } from 'lucide-react';
import { SearchCommand } from '@/components/search-command';
import blogPosts from '@/data/blog-posts.json';

// Generate static params for all blog posts
export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogPosts.find(p => p.slug === slug);
    if (!post) return {};

    return {
        title: `${post.title} | Maintenance Guide`,
        description: post.excerpt,
    };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            {/* HEADER */}
            <header className="sticky top-0 z-50 w-full border-b-4 border-border bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center justify-between px-4">
                    <Link href="/blog" className="mr-8 flex items-center space-x-2 font-bold tracking-tighter">
                        <Package className="h-6 w-6" />
                        <span className="hidden sm:inline-block">NEXGEN KNOWLEDGE</span>
                    </Link>
                    <div className="flex-1 max-w-xl">
                        <SearchCommand />
                    </div>
                </div>
            </header>

            <main className="container px-4 py-8 md:py-12">
                <div className="mb-8">
                    <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to All Guides
                    </Link>
                </div>

                <div className="grid gap-12 lg:grid-cols-3">
                    {/* LEFT: CONTENT (2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <Badge className="font-mono mb-4">{post.date}</Badge>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">{post.title}</h1>
                        </div>

                        <div
                            className="prose prose-lg dark:prose-invert max-w-none font-sans"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>

                    {/* RIGHT: RELATED PART UI (1/3) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="rounded-none border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-primary/5">
                                <CardHeader className="bg-primary text-primary-foreground border-b-4 border-black">
                                    <CardTitle className="flex items-center space-x-2">
                                        <Wrench className="h-5 w-5" />
                                        <span>FIX THIS ISSUE</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <p className="font-bold text-lg">Need a {post.related_part_name}?</p>
                                        <p className="text-sm text-muted-foreground">
                                            We have the exact replacement part meant for this repair in stock.
                                        </p>
                                    </div>

                                    <div className="bg-background border-2 p-4 font-mono text-sm space-y-2">
                                        <div className="flex justify-between">
                                            <span>Status:</span>
                                            <span className="text-green-600 font-bold">IN STOCK</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping:</span>
                                            <span className="font-bold">IMMEDIATE</span>
                                        </div>
                                    </div>

                                    <Button className="w-full h-12 text-lg font-bold border-2 border-black rounded-none shadow-none" asChild>
                                        <Link href={`/product/${post.related_part_slug}`}>
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            BUY REPLACEMENT PART
                                        </Link>
                                    </Button>

                                    <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>Verified for your machine</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Icon for the related part card
function Wrench(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
    )
}
