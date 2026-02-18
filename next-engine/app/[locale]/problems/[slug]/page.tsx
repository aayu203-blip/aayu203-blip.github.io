import { getAllParts, getDisplayName } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { SearchCommand } from '@/components/search-command';

// Helper to extract symptoms from parts
function extractSymptoms(symptomsRaw: string): string[] {
    if (!symptomsRaw) return [];
    try {
        const parsed = JSON.parse(symptomsRaw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export async function generateStaticParams() {
    const parts = await getAllParts();
    const symptoms = new Set<string>();

    parts.forEach(p => {
        const partSymptoms = extractSymptoms(p.symptoms_list_raw);
        partSymptoms.forEach(s => {
            const slug = s.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 60);
            if (slug.length > 5) symptoms.add(slug);
        });
    });

    // In development, limit to prevent slow builds
    const symptomArray = Array.from(symptoms);
    if (process.env.NODE_ENV === 'development') {
        return symptomArray.slice(0, 10).map(s => ({ slug: s }));
    }

    return symptomArray.map(s => ({ slug: s }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const problemName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return {
        title: `${problemName} - Diagnosis & Parts | NexGen Spares`,
        description: `Troubleshoot ${problemName.toLowerCase()}. Find the right replacement parts for Volvo, Scania, Komatsu, CAT. Expert diagnosis guides.`,
    };
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const allParts = await getAllParts();

    // Filter parts by symptom
    const relevantParts = allParts.filter(p => {
        const symptoms = extractSymptoms(p.symptoms_list_raw);
        return symptoms.some(s => {
            const sSlug = s.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-');
            return sSlug.includes(slug) || slug.includes(sSlug.substring(0, 20));
        });
    });

    if (relevantParts.length === 0) {
        notFound();
    }

    const problemName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Group by brand
    const brandGroups = relevantParts.reduce((acc, part) => {
        const brand = part.brand || 'Other';
        if (!acc[brand]) acc[brand] = [];
        acc[brand].push(part);
        return acc;
    }, {} as Record<string, typeof relevantParts>);

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

                {/* PROBLEM HERO */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-16 w-16 rounded-none bg-destructive/20 border-2 border-destructive flex items-center justify-center">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{problemName}</h1>
                            <p className="text-lg text-muted-foreground font-mono mt-2">
                                {relevantParts.length} Replacement Parts Available
                            </p>
                        </div>
                    </div>

                    {/* DIAGNOSTIC INFO */}
                    <Card className="rounded-none border-2 border-primary bg-primary/5 mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Common Causes</h3>
                                    <p className="text-muted-foreground">
                                        This symptom is typically caused by worn or damaged components.
                                        Check the parts below to identify the exact replacement needed for your equipment.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* BRAND GROUPS */}
                <div className="space-y-8">
                    {Object.entries(brandGroups).map(([brand, parts]) => (
                        <Card key={brand} className="rounded-none border-2">
                            <CardHeader className="bg-muted/30 border-b-2">
                                <CardTitle className="font-mono uppercase tracking-widest flex items-center justify-between">
                                    <span>{brand} Solutions</span>
                                    <Badge variant="secondary" className="font-mono">{parts.length} parts</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border">
                                    {parts.map((part) => (
                                        <Link key={part.id} href={`/product/${part.slug}`} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors group">
                                            <div>
                                                <p className="font-mono font-bold text-primary group-hover:underline">{part.part_number}</p>
                                                <p className="text-sm text-muted-foreground mt-1">{getDisplayName(part)}</p>
                                                {part.category && (
                                                    <Badge variant="outline" className="mt-2 font-mono text-xs">{part.category}</Badge>
                                                )}
                                            </div>
                                            <Button variant="outline" className="rounded-none border-2 font-mono">
                                                VIEW PART
                                            </Button>
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
