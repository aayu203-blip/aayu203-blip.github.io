import { getParts, getPartBySlug, getDisplayName, slugify } from '@/lib/data-loader';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Truck, Phone, MessageCircle, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { SearchCommand } from '@/components/search-command';
import { ComparisonTool } from '@/components/comparison-tool';
import { generateSEOMetadata, generateProductJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import { GeoStockDisplay } from '@/components/geo-stock-display';

export async function generateStaticParams() {
    // For large datasets, ONLY generate top 50 static. The rest dynamic.
    const parts = await getParts();
    return parts.slice(0, 50).map((part) => ({
        slug: slugify(`${part.brand}-${part.partNumber}`),
    }));
}

// Next.js 15: params is a Promise
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const part = await getPartBySlug(slug);
    if (!part) return {};

    const keywords = [
        part.brand,
        part.partNumber,
        'heavy machinery parts',
        'OEM parts',
        'aftermarket parts',
        part.category,
        'global shipping',
    ].filter((x): x is string => !!x);

    const displayName = getDisplayName(part);

    return generateSEOMetadata({
        title: `${displayName} | ${part.brand} | NexGen Spares`,
        description: `Buy ${displayName}. Genuine ${part.brand} OEM & certified aftermarket parts. Global shipping to USA, UK, UAE, India. Instant WhatsApp quotes. In stock now.`,
        keywords,
        canonical: `/product/${slug}`,
    });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const part = await getPartBySlug(slug);

    if (!part) {
        notFound();
    }

    const displayName = getDisplayName(part);

    // Helper to format specs nicely
    const specs = part.technical_specs || {};
    const specKeys = Object.keys(specs).filter(key => specs[key]);

    // Generate JSON-LD
    const productJsonLd = generateProductJsonLd(part);
    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: 'Home', url: '/' },
        { name: part.brand, url: `/brands/${part.brand.toLowerCase()}` },
        { name: displayName, url: `/product/${slug}` },
    ]);

    return (
        <div className="min-h-screen bg-background">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            {/* HEADER */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                        Back to Search
                    </Link>
                </div>

                <div className="grid gap-12 lg:grid-cols-3">
                    {/* LEFT: PRODUCT DETAILS (2/3) */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* HERO TITLE */}
                        <div>
                            <div className="flex items-center space-x-4 mb-4">
                                <Badge variant="outline" className="text-base py-1 px-4 border-2 font-mono uppercase rounded-none">
                                    {part.brand}
                                </Badge>
                                {part.category && (
                                    <Badge variant="secondary" className="text-base py-1 px-4 font-mono uppercase rounded-none">
                                        {part.category}
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter font-sans uppercase">
                                {part.partNumber}
                            </h1>
                            <h2 className="text-xl md:text-3xl text-primary font-bold mt-2 font-mono uppercase">
                                {displayName}
                            </h2>
                        </div>

                        {/* SPECS TABLE */}
                        <Card className="rounded-none border-2 shadow-none">
                            <CardHeader className="bg-muted/50 border-b-2">
                                <CardTitle className="font-mono uppercase tracking-widest flex items-center">
                                    <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                                    Technical Specifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border">
                                    {specKeys.length > 0 ? specKeys.map((key) => (
                                        <div key={key} className="grid grid-cols-2 p-4 hover:bg-muted/20 transition-colors">
                                            <span className="font-semibold text-sm uppercase text-muted-foreground">{key}</span>
                                            <span className="font-mono text-sm">{specs[key]}</span>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center text-muted-foreground font-mono">
                                            No additional specifications available for this part.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* APPLICATION / MODELS */}
                        {part.application && part.application !== '-' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold uppercase tracking-tight">Compatible Application</h3>
                                <p className="text-lg text-muted-foreground font-mono p-4 border-l-4 border-primary bg-muted/30">
                                    {part.application}
                                </p>
                            </div>
                        )}

                        {/* COMPARISON TOOL */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold uppercase tracking-tight">OEM vs Aftermarket</h3>
                            <ComparisonTool />
                        </div>

                    </div>

                    {/* RIGHT: STICKY TERMINAL (1/3) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="rounded-none border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                                <CardHeader className="bg-primary text-primary-foreground border-b-4 border-black">
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="font-black tracking-tighter text-2xl">PROCUREMENT</span>
                                        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse ring-4 ring-black/20" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">

                                    <GeoStockDisplay partId={part.id} />

                                    <Separator className="bg-border/50" />

                                    {/* CTAS */}
                                    <div className="grid gap-4">
                                        <Button className="h-14 w-full rounded-none text-lg font-bold bg-black text-white hover:bg-black/80 border-2 border-transparent shadow-none" asChild>
                                            <a
                                                href={`https://wa.me/919820259953?text=Hi, I need a quote for ${part.brand} ${part.partNumber}.`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <MessageCircle className="mr-2 h-5 w-5" />
                                                WHATSAPP QUOTE
                                            </a>
                                        </Button>
                                        <Button variant="outline" className="h-14 w-full rounded-none text-lg font-bold border-2 hover:bg-muted" asChild>
                                            <a href={`mailto:sales@nexgenspares.com?subject=Quote for ${part.partNumber}`}>
                                                Request Email Quote
                                            </a>
                                        </Button>
                                    </div>

                                </CardContent>
                            </Card>

                            {/* TRUST BADGES */}
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="p-4 border text-center bg-muted/20">
                                    <span className="block font-bold text-2xl font-mono">75+</span>
                                    <span className="text-xs uppercase text-muted-foreground">Years Exp.</span>
                                </div>
                                <div className="p-4 border text-center bg-muted/20">
                                    <span className="block font-bold text-2xl font-mono">24h</span>
                                    <span className="text-xs uppercase text-muted-foreground">Dispatch</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
