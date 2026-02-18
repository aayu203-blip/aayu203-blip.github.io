import { getParts, getPartsByBrand, getDisplayName, slugify } from '@/lib/data-loader';
import { MACHINERY_BRANDS } from '@/lib/brands';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { SearchCommand } from '@/components/search-command';

export async function generateStaticParams() {
    return MACHINERY_BRANDS.filter(b => b.tier === 1).map((brand) => ({
        slug: brand.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const brand = MACHINERY_BRANDS.find(b => b.slug === slug);
    if (!brand) return {};

    return {
        title: `${brand.name} Parts | ${brand.partCount.toLocaleString()}+ OEM & Aftermarket | NexGen Spares`,
        description: `Buy genuine ${brand.name} parts. ${brand.partCount.toLocaleString()}+ parts in stock. Global shipping. Instant quotes via WhatsApp.`,
    };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const brand = MACHINERY_BRANDS.find(b => b.slug === slug);

    if (!brand || brand.tier !== 1) {
        // Option: fallback to "Generic Brand Page" instead of 404 for SEO
        notFound();
    }

    // Get all parts for this brand
    const allParts = await getParts();
    const parts = allParts.filter(p => p.brand.toLowerCase() === brand.name.toLowerCase());

    // Group by category
    const categories = parts.reduce((acc, part) => {
        const cat = part.category || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(part);
        return acc;
    }, {} as Record<string, typeof parts>);

    return (
        <div className="min-h-screen bg-background">
            {/* HEADER */}
            <header className="sticky top-0 z-50 w-full border-b-4 border-border bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center justify-between px-4">
                    <Link href="/" className="mr-8 flex items-center space-x-2 font-bold tracking-tighter">
                        <Package className="h-6 w-6" />
                        <span className="hidden sm:inline-block">NEXGEN SPARES</span>
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
                        Back to Brands
                    </Link>
                </div>

                {/* BRAND HERO */}
                <div className="mb-12 text-center">
                    <div className="text-6xl mb-4">{brand.logo}</div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">{brand.name}</h1>
                    <p className="text-xl text-muted-foreground font-mono mb-6">
                        {brand.partCount.toLocaleString()} Parts Available • OEM & Aftermarket
                    </p>
                    <Button className="bg-primary text-black font-bold border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-14 px-8 text-lg" asChild>
                        <a href="https://wa.me/919820259953?text=Hi, I need parts for my {brand.name} equipment." target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="mr-2 h-5 w-5" />
                            GET INSTANT QUOTE
                        </a>
                    </Button>
                </div>

                {/* CATEGORIES */}
                <div className="space-y-8">
                    {Object.entries(categories).map(([category, categoryParts]) => (
                        <Card key={category} className="rounded-none border-2">
                            <CardHeader className="bg-muted/30 border-b-2">
                                <CardTitle className="font-mono uppercase tracking-widest flex items-center justify-between">
                                    <span>{category}</span>
                                    <Badge variant="secondary" className="font-mono">{categoryParts.length} parts</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                                    {categoryParts.slice(0, 12).map((part) => (
                                        <Link key={part.id} href={`/product/${slugify(`${part.brand}-${part.partNumber}`)}`} className="p-4 hover:bg-muted/20 transition-colors group">
                                            <p className="font-mono font-bold text-primary group-hover:underline">{part.partNumber}</p>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{getDisplayName(part)}</p>
                                        </Link>
                                    ))}
                                </div>
                                {categoryParts.length > 12 && (
                                    <div className="p-4 border-t-2 text-center">
                                        <Button variant="outline" className="rounded-none border-2 font-mono">
                                            VIEW ALL {categoryParts.length} {category.toUpperCase()} PARTS
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
