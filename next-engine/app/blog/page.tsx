import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Wrench } from 'lucide-react';
import { SearchCommand } from '@/components/search-command';
import blogPosts from '@/data/blog-posts.json';

export const metadata = {
    title: 'Knowledge Hub | Maintenance Guides & Fixes | NexGen Spares',
    description: 'Expert guides on heavy machinery maintenance, part replacement, and troubleshooting. Learn how to fix your Volvo, Scania, and Caterpillar equipment.',
};

export default function BlogIndex() {
    return (
        <div className="min-h-screen bg-background">
            {/* HEADER */}
            <header className="sticky top-0 z-50 w-full border-b-4 border-border bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center justify-between px-4">
                    <Link href="/" className="mr-8 flex items-center space-x-2 font-bold tracking-tighter">
                        <Wrench className="h-6 w-6" />
                        <span className="hidden sm:inline-block">NEXGEN KNOWLEDGE</span>
                    </Link>
                    <div className="flex-1 max-w-xl">
                        <SearchCommand />
                    </div>
                </div>
            </header>

            <main className="container px-4 py-8 md:py-12">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Parts Store
                    </Link>
                </div>

                {/* HERO */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Knowledge Hub</h1>
                    <p className="text-xl text-muted-foreground font-mono mb-6 max-w-2xl mx-auto">
                        Expert troubleshooting guides and replacement tutorials for your heavy machinery.
                    </p>
                </div>

                {/* POSTS GRID */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {blogPosts.map((post) => (
                        <Card key={post.id} className="rounded-none border-2 hover:border-primary transition-colors group">
                            <CardHeader className="bg-muted/30 border-b-2">
                                <Badge variant="outline" className="w-fit mb-2 font-mono text-xs">{post.date}</Badge>
                                <CardTitle className="font-bold leading-tight group-hover:text-primary transition-colors">
                                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                                        {post.title}
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                    {post.excerpt}
                                </p>
                                <Button asChild variant="link" className="p-0 font-bold font-mono">
                                    <Link href={`/blog/${post.slug}`}>
                                        READ GUIDE <BookOpen className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
