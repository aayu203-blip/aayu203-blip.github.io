import { getParts, slugify } from '@/lib/data-loader';
import { getDisplayName } from '@/lib/data-loader'; // Helper
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft, Cog, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { SearchCommand } from '@/components/search-command';

// Helper to extract machine model from application field
function extractMachineModel(application: string | undefined): { brand: string; model: string } | null {
    if (!application || application === '-') return null;

    // Common patterns: "Volvo D13", "Scania R-Series", "Komatsu PC210"
    const match = application.match(/^([\w-]+)\s+([\w-]+)/);
    if (match) {
        return { brand: match[1], model: match[2] };
    }
    return null;
}

export async function generateStaticParams() {
    const parts = await getParts();
    const machines = new Set<string>();

    parts.forEach(p => {
        const parsed = extractMachineModel(p.application);
        if (parsed) {
            const slug = `${parsed.brand.toLowerCase()}-${parsed.model.toLowerCase()}`.replace(/\s+/g, '-');
            machines.add(slug);
        }
    });

    // In development, limit to prevent slow builds
    const machineArray = Array.from(machines);
    if (process.env.NODE_ENV === 'development') {
        return machineArray.slice(0, 10).map(m => ({ slug: m }));
    }

    return machineArray.map(m => ({ slug: m }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const machineName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return {
        title: `${machineName} Parts | OEM & Aftermarket | NexGen Spares`,
        description: `Complete parts catalog for ${machineName}. Filters, pumps, seals, and more. Global shipping. Instant quotes via WhatsApp.`,
    };
}

export default async function MachinePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const allParts = await getParts();

    // Filter parts by machine
    const machineParts = allParts.filter(p => {
        const parsed = extractMachineModel(p.application);
        if (!parsed) return false;
        const partSlug = `${parsed.brand.toLowerCase()}-${parsed.model.toLowerCase()}`.replace(/\s+/g, '-');
        return partSlug === slug;
    });

    if (machineParts.length === 0) {
        // Just return empty or not found.
        // For SSG, ensure we handle empty gently or 404
    }

    if (machineParts.length === 0) {
        notFound();
    }

    const machineName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const brand = machineParts[0]?.brand || machineName.split(' ')[0];

    // Group by category
    const categoryGroups = machineParts.reduce((acc, part) => {
        const cat = part.category || 'General Parts';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(part);
        return acc;
    }, {} as Record<string, typeof machineParts>);

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
                    <Link href={`/brands/${brand.toLowerCase()}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to {brand}
                    </Link>
                </div>

                {/* MACHINE HERO */}
                <div className="mb-12">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="text-6xl mb-4"><Cog /></div>
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">{machineName}</h1>
                            <p className="text-xl text-muted-foreground font-mono mb-6">
                                {machineParts.length.toLocaleString()} Compatible Parts • OEM & Aftermarket
                            </p>
                        </div>
                        <Button className="bg-primary text-black font-bold border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-14 px-8 text-lg hidden md:flex" asChild>
                            <a href={`https://wa.me/919820259953?text=Hi, I need parts for my ${machineName}.`} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="mr-2 h-5 w-5" />
                                GET QUOTE
                            </a>
                        </Button>
                    </div>

                    {/* CATEGORY BADGES */}
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(categoryGroups).map(cat => (
                            <Badge key={cat} variant="outline" className="font-mono">
                                {cat} ({categoryGroups[cat].length})
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* CATEGORY GROUPS */}
                <div className="space-y-8">
                    {Object.entries(categoryGroups).map(([category, parts]) => (
                        <Card key={category} className="rounded-none border-2">
                            <CardHeader className="bg-muted/30 border-b-2">
                                <CardTitle className="font-mono uppercase tracking-widest flex items-center justify-between">
                                    <span>{category}</span>
                                    <Badge variant="secondary" className="font-mono">{parts.length} parts</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                                    {parts.map((part) => (
                                        <Link key={part.id} href={`/product/${slugify(`${part.brand}-${part.partNumber}`)}`} className="p-4 hover:bg-muted/20 transition-colors group">
                                            <p className="font-mono font-bold text-primary group-hover:underline">{part.partNumber}</p>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{getDisplayName(part)}</p>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
