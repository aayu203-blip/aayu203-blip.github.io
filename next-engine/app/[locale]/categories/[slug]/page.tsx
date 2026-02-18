import { getAllParts, getDisplayName } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft, Wrench } from 'lucide-react';
import Link from 'next/link';
import { SearchCommand } from '@/components/search-command';

export async function generateStaticParams() {
    const parts = await getAllParts();
    const categories = new Set<string>();

    parts.forEach(p => {
        if (p.category && p.category.trim()) {
            categories.add(p.category.toLowerCase().replace(/\s+/g, '-'));
        }
    });

    // In development, limit to prevent slow builds
    const categoryArray = Array.from(categories);
    if (process.env.NODE_ENV === 'development') {
        return categoryArray.slice(0, 10).map(cat => ({ slug: cat }));
    }

    return categoryArray.map(cat => ({ slug: cat }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return {
        title: `${categoryName} Parts | Heavy Equipment | NexGen Spares`,
        description: `Buy ${categoryName.toLowerCase()} for Volvo, Scania, Komatsu, CAT. OEM & aftermarket parts. Global shipping. Instant quotes.`,
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const allParts = await getAllParts();

    // Filter parts by category
    const categoryParts = allParts.filter(p =>
        p.category && p.category.toLowerCase().replace(/\s+/g, '-') === slug
    );

    if (categoryParts.length === 0) {
        notFound();
    }

    const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Group by brand
    const brandGroups = categoryParts.reduce((acc, part) => {
        const brand = part.brand || 'Other';
        if (!acc[brand]) acc[brand] = [];
        acc[brand].push(part);
        return acc;
    }, {} as Record<string, typeof categoryParts>);

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
                        Back to Home
                    </Link>
                </div>

                {/* CATEGORY HERO */}
                <div className="mb-12 text-center">
                    <div className="text-6xl mb-4"><Wrench /></div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">{categoryName}</h1>
                    <p className="text-xl text-muted-foreground font-mono mb-6">
                        {categoryParts.length.toLocaleString()} Parts Available • All Major Brands
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {Object.keys(brandGroups).map(brand => (
                            <Badge key={brand} variant="outline" className="font-mono">
                                {brand} ({brandGroups[brand].length})
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* BRAND GROUPS */}
                <div className="space-y-8">
                    {Object.entries(brandGroups).map(([brand, parts]) => (
                        <Card key={brand} className="rounded-none border-2">
                            <CardHeader className="bg-muted/30 border-b-2">
                                <CardTitle className="font-mono uppercase tracking-widest flex items-center justify-between">
                                    <span>{brand} {categoryName}</span>
                                    <Badge variant="secondary" className="font-mono">{parts.length} parts</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                                    {parts.slice(0, 12).map((part) => (
                                        <Link key={part.id} href={`/product/${part.slug}`} className="p-4 hover:bg-muted/20 transition-colors group">
                                            <p className="font-mono font-bold text-primary group-hover:underline">{part.part_number}</p>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{getDisplayName(part)}</p>
                                        </Link>
                                    ))}
                                </div>
                                {parts.length > 12 && (
                                    <div className="p-4 border-t-2 text-center">
                                        <Button variant="outline" className="rounded-none border-2 font-mono">
                                            VIEW ALL {parts.length} {brand.toUpperCase()} PARTS
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
