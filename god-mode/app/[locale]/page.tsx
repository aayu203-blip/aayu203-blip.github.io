import { Button } from "@/components/ui/button";
import { Search, Package, Activity, ArrowRight, Settings, Truck, FileText, ChevronRight } from "lucide-react";
import { Link } from '@/i18n/routing';
import { HeroSearch } from "@/components/hero-search";
import { BulkPasteForm } from "@/components/bulk-paste-form";
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');
  const common = useTranslations('Common');

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans">

      {/* 1. HEADER: THE LAB BENCH */}
      <header className="bg-white border-b-2 border-[#005EB8] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="font-black text-2xl tracking-tighter text-slate-900">
              {t('title')}
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide hidden sm:block border-l border-slate-300 pl-4 py-1">
              {t('subTitle')}
            </span>
          </div>

          {/* Utility Nav */}
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
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

      {/* 5. DATA DENSITY SHOWCASE */}
      <section className="bg-slate-50 py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-12">
            We don&apos;t sell photos. We sell specs.
          </h2>

          {/* The Spec Card */}
          <div className="max-w-2xl mx-auto bg-white shadow-xl border border-slate-200 p-8 text-left relative transform hover:-translate-y-1 transition-transform duration-300">
            {/* Decorative Clip */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-2 bg-slate-200 rounded-b-md"></div>

            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-xs font-mono text-slate-500 mb-1">PART NUMBER</div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">CATERPILLAR 1R-0716</h3>
              </div>
              <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 border border-emerald-200 rounded-full">
                VERIFIED
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200 mb-8">
              <div className="bg-white p-4">
                <div className="text-[10px] uppercase font-bold text-slate-400">Thread Size</div>
                <div className="font-mono text-sm">1-14 UNS-2B</div>
              </div>
              <div className="bg-white p-4">
                <div className="text-[10px] uppercase font-bold text-slate-400">Efficiency Rating</div>
                <div className="font-mono text-sm">98% @ 4 Microns</div>
              </div>
              <div className="bg-white p-4">
                <div className="text-[10px] uppercase font-bold text-slate-400">Height</div>
                <div className="font-mono text-sm">175mm</div>
              </div>
              <div className="bg-white p-4">
                <div className="text-[10px] uppercase font-bold text-slate-400">Stock Availability</div>
                <div className="font-mono text-sm text-[#005EB8] font-bold">32 Global Locations</div>
              </div>
            </div>

            <Button className="w-full bg-[#005EB8] hover:bg-blue-700 text-white font-bold h-12 rounded-sm">
              {common('downloadSpec')} (MOCK)
            </Button>

          </div>
        </div>
      </section>

      {/* 6. FOOTER: THE FILING CABINET */}
      <footer className="bg-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="font-black text-xl mb-6 tracking-tighter">{t('title')}</div>
            <p className="text-slate-400 text-sm leading-relaxed">
              The definitive industrial index. Built for procurement officers, engineers, and fleet managers who need raw data, not marketing fluff.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-6 uppercase text-xs tracking-wider">{t('footer.brands')}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/brands/volvo" className="hover:text-white">Volvo Construction</Link></li>
              <li><Link href="/brands/caterpillar" className="hover:text-white">Caterpillar Inc.</Link></li>
              <li><Link href="/brands/komatsu" className="hover:text-white">Komatsu</Link></li>
              <li><Link href="/brands/scania" className="hover:text-white">Scania Industrial</Link></li>
              <li><Link href="/brands/hitachi" className="hover:text-white">Hitachi</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-6 uppercase text-xs tracking-wider">{t('footer.machines')}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/machines/excavators" className="hover:text-white">Excavators</Link></li>
              <li><Link href="/machines/articulated-haulers" className="hover:text-white">Articulated Haulers</Link></li>
              <li><Link href="/machines/wheel-loaders" className="hover:text-white">Wheel Loaders</Link></li>
              <li><Link href="/machines/industrial-engines" className="hover:text-white">Industrial Engines</Link></li>
              <li><Link href="/machines/pavers" className="hover:text-white">Pavers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-6 uppercase text-xs tracking-wider">{t('footer.regions')}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white">North America (USA/CAN)</Link></li>
              <li><Link href="#" className="hover:text-white">EMEA (Europe/Middle East)</Link></li>
              <li><Link href="#" className="hover:text-white">APAC (Asia Pacific)</Link></li>
              <li><Link href="#" className="hover:text-white">LATAM (South America)</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 text-center text-xs text-slate-600">
          Switch Region: <Link href="/" locale="en" className="underline hover:text-white mr-4">English (Global)</Link> <Link href="/" locale="es" className="underline hover:text-white">Español (LATAM)</Link>
        </div>
      </footer>

    </main>
  );
}
