import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { HeroSearch } from "@/components/hero-search";
import { PartDetailView } from "@/components/views/part-detail-view";
import { BrandLandingView } from "@/components/views/brand-landing-view";
import { MachineLandingView } from "@/components/views/machine-landing-view";
import { GuideView } from "@/components/views/guide-view";
import { SearchResultsView } from "@/components/views/search-results-view";
import { getPartBySlug, getBrandData, getMachineData, getGuideBySlug } from "@/lib/data-loader";

type Props = {
    params: Promise<{ slug: string[]; locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 1. DYNAMIC METADATA GENERATION (Crucial for SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const slugPath = slug.join('/');

    // Check Part (Highest Priority)
    const part = await getPartBySlug(slugPath);
    if (part) {
        return {
            title: `${part.partNumber} ${part.name} | ${part.brand} Replacement`,
            description: `Buy ${part.brand} ${part.partNumber} ${part.name}. In stock. Compatible with ${part.compatibility?.join(', ') || 'verified machines'}.`,
        };
    }

    // Check Brand
    const brand = await getBrandData(slug[0]);
    if (brand && slug.length === 1) {
        return {
            title: `${brand.name} Heavy Machinery Parts Catalog | NexGen Spares`,
            description: `Browse ${brand.totalParts}+ aftermarket parts for ${brand.name} excavators, loaders, and dozers. Direct supplier prices.`,
        };
    }

    // Check Guide (Problem-Based SEO)
    const guide = await getGuideBySlug(slugPath);
    if (guide) {
        return {
            title: `${guide.title} | Troubleshooting & Parts`,
            description: guide.excerpt,
        };
    }

    // Fallback: Smart Search / Part Number Lookup
    return {
        title: `Search Results for "${slug.join(' ')}" | NexGen Spares`,
        description: `Find heavy machinery parts matching "${slugPath}". Search our index of verified items.`,
    };
}

// 2. THE TRAFFIC CONTROLLER
export default async function UniversalPage({ params, searchParams }: Props) {
    const { slug, locale } = await params;
    const { q } = await searchParams; // Next.js 15 async searchParams

    // Normalize slug logic
    const slugPath = slug.join('/'); // e.g., "volvo/ec210/hydraulic-pump" or "1R-0716"

    // SPECIAL CASE: /search?q=Term
    if (slug[0] === 'search' || q) {
        const searchQuery = typeof q === 'string' ? q : slugPath;
        return (
            <main className="min-h-screen bg-slate-50">
                <div className="bg-slate-900 py-8 px-6">
                    <div className="max-w-4xl mx-auto">
                        <HeroSearch />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    <SearchResultsView query={searchQuery} />
                </div>
            </main>
        );
    }

    // --- LAYER 1: EXACT MATCH LOOKUPS ---

    // A. Is this a Product Page? (e.g., /cat-1r0716-filter)
    const part = await getPartBySlug(slugPath);
    if (part) {
        // Renders the Product Detail View (with WhatsApp "Get Quote" CTA)
        return <PartDetailView part={part} locale={locale} />;
    }

    // B. Is this a Brand Page? (e.g., /volvo)
    // We check if the FIRST segment matches a known brand
    const brandData = await getBrandData(slug[0]);
    if (brandData && slug.length === 1) {
        return <BrandLandingView brand={brandData} locale={locale} />;
    }

    // C. Is this a Machine Page? (e.g., /volvo/ec210)
    if (brandData && slug.length === 2) {
        const machineData = await getMachineData(brandData.name, slug[1]);
        if (machineData) {
            return <MachineLandingView machine={machineData} locale={locale} />;
        }
    }

    // D. Is this a Technical Guide? (e.g., /guides/how-to-fix-pressure-loss)
    // Or a "Problem Page" like /problems/overheating-pc200
    const guide = await getGuideBySlug(slugPath);
    if (guide) {
        return <GuideView guide={guide} locale={locale} />;
    }

    // --- LAYER 2: INTENT INFERENCE (The "God Mode" Magic) ---

    // If it's not a static page, assume the user is trying to find something.
    // E.g. User types: /en/1R-0716 -> We treat this as a SEARCH for that part number.
    // This covers your "Part Number Lookup" intent automatically.

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="bg-slate-900 py-8 px-6">
                <div className="max-w-4xl mx-auto">
                    <HeroSearch />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Results for <span className="text-[#005EB8]">"{slugPath}"</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        We couldn't find an exact page, so we searched our live index.
                    </p>
                </div>

                {/* Render fuzzy search results client-side or server-side */}
                <SearchResultsView query={slugPath} />
            </div>
        </main>
    );
}
