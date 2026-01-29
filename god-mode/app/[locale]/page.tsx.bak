import { Button } from "@/components/ui/button";
import { Search, Package, Activity, ArrowRight, Settings, Truck, FileText, ChevronRight } from "lucide-react";
import { Link } from '@/i18n/routing';
import { HeroSearch } from "@/components/hero-search";
import { BulkPasteForm } from "@/components/bulk-paste-form";
import { useTranslations } from 'next-intl';
import { slugify, type Part } from "@/lib/utils";
import { getFeaturedParts as getHardcodedFeaturedParts } from "@/lib/featured-parts";
import { MobileContactBar } from "@/components/mobile-contact-bar";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nexgen Spares | Global Heavy Machinery Parts Supplier",
  description: "B2B parts supplier for Volvo, CAT, Komatsu, and Scania heavy equipment. Verified inventory, fast shipping to USA, India, & Middle East. Request a quote.",
  openGraph: {
    title: "Nexgen Spares - Global Heavy Machinery Index",
    description: "Search 30,000+ verified aftermarket parts. Direct supplier for excavators, loaders, and dozers.",
    type: "website",
  }
};



export default async function Home() {
  const t = await useTranslations('HomePage'); // Async in newer Next.js
  const common = await useTranslations('Common');

  // Use hardcoded featured parts to prevent Vercel OOM
  let featuredParts: Part[] = [];
  try {
    featuredParts = await getHardcodedFeaturedParts();
  } catch (e) {
    console.error("Failed to load featured parts", e);
    featuredParts = [];
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans">

      {/* 1. HEADER: THE LAB BENCH */}
      <header className="bg-white border-b-2 border-[#005EB8] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="font-black text-2xl tracking-tighter text-slate-900">
              [ NEXGEN SPARES ]
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide hidden sm:block border-l border-slate-300 pl-4 py-1">
              Global Heavy Machinery Spares
            </span>
          </div>

          {/* Utility Nav */}
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="tel:+919820259953" className="hidden md:flex items-center gap-1.5 hover:text-[#005EB8] transition-colors">
              <span className="text-lg">📞</span>
              <span className="font-mono text-xs">+91 98202 59953</span>
            </a>
            <Link href="#" className="hover:text-[#005EB8] transition-colors">{t('nav.uploadBom')}</Link>
            <Link href="#" className="hover:text-[#005EB8] transition-colors">{t('nav.trackOrder')}</Link>
            <Link href="#" className="hover:text-[#005EB8] transition-colors">{t('nav.signIn')}</Link>
          </nav>
        </div>
      </header>

      {/* 2. LIVE TICKER (Keeping Static for now, hard to translate dynamic content simply yet) */}
      <div className="bg-blue-50 border-b border-blue-100 py-2">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-xs font-mono text-blue-900">
          <Activity size={12} className="text-[#005EB8]" />
          <span className="font-bold">LIVE INDEX:</span>
          <span>14,203 Stock checks in the last hour.</span>
          <span className="mx-2 text-blue-300">|</span>
          <span className="truncate">Newest indexing: Komatsu PC200-8 Hydraulic Pump (7 mins ago)</span>
        </div>
      </div>

      {/* 3. HERO: THE WHITEBOARD */}
      <section className="bg-graph-paper py-10 md:py-24 border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <HeroSearch />

          {/* BULK PASTE / QUICK ACTION */}
          <div className="mt-8 md:mt-12">
            <BulkPasteForm />
          </div>
        </div>

        {/* Rotating Gear Graphic (SVG) - Decorative */}
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
          <svg width="600" height="600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-[#005EB8] animate-[spin_60s_linear_infinite]">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
            <path d="M2.05 13H21.95M13 2.05V21.95M10.66 2.5C10.66 2.5 13.34 2.5 13.34 2.5M2.5 10.66L2.5 13.34M21.5 10.66L21.5 13.34M10.66 21.5L13.34 21.5" />
            <circle cx="12" cy="12" r="4" strokeWidth="1" />
          </svg>
        </div>
      </section>

      {/* 4. PARAMETRIC DIRECTORY (Keeping static for speed, can translate keys later) */}
      <section className="py-16 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-slate-200">

            {/* Column 1: ENGINE */}
            <div className="border-r border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="text-slate-900" size={24} strokeWidth={1.5} />
                <h3 className="text-sm font-bold text-[#005EB8] tracking-wider uppercase">Engine Parts</h3>
              </div>
              <ul className="space-y-1">
                {['Piston Rings', 'Crankshafts', 'Fuel Injectors', 'Turbochargers', 'Gasket Kits', 'Oil Pumps'].map(item => (
                  <li key={item}>
                    <Link href="#" className="block py-1.5 px-2 -mx-2 text-sm text-slate-700 hover:bg-yellow-50 hover:text-slate-900 transition-colors rounded-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: HYDRAULICS */}
            <div className="border-r border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-slate-900" size={24} strokeWidth={1.5} />
                <h3 className="text-sm font-bold text-[#005EB8] tracking-wider uppercase">Hydraulics</h3>
              </div>
              <ul className="space-y-1">
                {['Main Pumps', 'Swing Motors', 'Control Valves', 'Seal Kits', 'Cylinders', 'Hoses'].map(item => (
                  <li key={item}>
                    <Link href="#" className="block py-1.5 px-2 -mx-2 text-sm text-slate-700 hover:bg-yellow-50 hover:text-slate-900 transition-colors rounded-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: FILTERS */}
            <div className="border-r border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3 mb-6">
                <Package className="text-slate-900" size={24} strokeWidth={1.5} />
                <h3 className="text-sm font-bold text-[#005EB8] tracking-wider uppercase">Filtration</h3>
              </div>
              <ul className="space-y-1">
                {['Fuel Filters', 'Oil Filters', 'Air Filters', 'Hydraulic Filters', 'Separators', 'Cabin Air'].map(item => (
                  <li key={item}>
                    <Link href="#" className="block py-1.5 px-2 -mx-2 text-sm text-slate-700 hover:bg-yellow-50 hover:text-slate-900 transition-colors rounded-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: UNDERCARRIAGE */}
            <div className="border-r border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="text-slate-900" size={24} strokeWidth={1.5} />
                <h3 className="text-sm font-bold text-[#005EB8] tracking-wider uppercase">Undercarriage</h3>
              </div>
              <ul className="space-y-1">
                {['Track Chains', 'Rollers', 'Idlers', 'Sprockets', 'Track Shoes', 'Tensioners'].map(item => (
                  <li key={item}>
                    <Link href="#" className="block py-1.5 px-2 -mx-2 text-sm text-slate-700 hover:bg-yellow-50 hover:text-slate-900 transition-colors rounded-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 5. DATA DENSITY SHOWCASE (DYNAMIC) */}
      <section className="bg-slate-50 py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-12">
            We don&apos;t sell photos. We sell specs.
          </h2>

          {/* DYNAMIC GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">

            {featuredParts.map((part, idx) => (
              <div key={part.id} className={cn(
                "bg-white border-slate-200 p-8 relative transform hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full",
                idx === 1 ? "shadow-2xl border-2 border-[#005EB8] scale-105 z-10" : "shadow-xl border"
              )}>
                <div className={cn(
                  "absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-b-md",
                  idx === 0 ? "bg-yellow-400" : idx === 1 ? "active-brand-stripe w-24 h-2 bg-[#005EB8]" : "bg-slate-400"
                )}></div>

                {idx === 1 && (
                  <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 border border-emerald-200 rounded-full">
                    IN STOCK
                  </div>
                )}

                <div className="mb-6">
                  <div className={cn("text-[10px] font-mono uppercase", idx === 1 ? "text-[#005EB8]" : "text-slate-500")}>
                    {part.name}
                  </div>
                  <h3 className={cn("font-black text-slate-900 tracking-tight mt-1", idx === 1 ? "text-3xl" : "text-2xl")}>
                    {part.brand} {part.partNumber}
                  </h3>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  {/* Render Top 3 Specs if available */}
                  {part.technical_specs && Object.entries(part.technical_specs).slice(0, 3).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase truncate pr-4">{key}</span>
                      <span className="font-mono text-sm font-bold text-slate-700 text-right">{val}</span>
                    </div>
                  ))}
                  {(!part.technical_specs || Object.keys(part.technical_specs).length === 0) && (
                    <div className="text-xs text-slate-400 italic py-4">Specs loading...</div>
                  )}
                </div>

                <div className="space-y-4">
                  <Link href={`/p/${slugify(part.brand)}-${slugify(part.partNumber)}`} className="block w-full">
                    <Button className={cn(
                      "w-full font-bold rounded-sm h-12 uppercase tracking-wide",
                      idx === 1 ?
                        "bg-[#005EB8] hover:bg-blue-700 text-white shadow-lg shadow-blue-900/10" :
                        "bg-slate-900 hover:bg-slate-800 text-white text-xs h-10"
                    )}>
                      {idx === 1 ? "Check Availability" : "View Specs"}
                    </Button>
                  </Link>

                  {/* Deep Link to Brand */}
                  <div className="text-center pt-2 border-t border-slate-100">
                    <Link href={`/brands/${slugify(part.brand)}`} className="text-[10px] font-bold text-slate-400 hover:text-[#005EB8] uppercase tracking-wider flex items-center justify-center gap-1 group">
                      View more {part.brand} parts
                      <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* 6. FOOTER: THE FILING CABINET */}


      {/* Mobile Contact Bar */}
      <MobileContactBar />

    </main>
  );
}

// Utility for styles
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
