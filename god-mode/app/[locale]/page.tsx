import { Button } from "@/components/ui/button";
// REMOVED: Search, FileText (Unused)
import { Package, Activity, ArrowRight, Settings, Truck, ShieldCheck, Globe, Users, Clock, MessageCircle, ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import { Link } from '@/i18n/routing';
import { HeroSearch } from "@/components/hero-search";
import { BulkPasteForm } from "@/components/bulk-paste-form";
import { useTranslations } from 'next-intl';
import { slugify, type Part, cn } from "@/lib/utils"; // RECOMMENDATION: Import 'cn' from utils
import { getFeaturedParts as getHardcodedFeaturedParts } from "@/lib/featured-parts";
import { MobileContactBar } from "@/components/mobile-contact-bar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volvo, CAT, Komatsu & Scania Spare Parts Supplier | Nexgen Spares India",
  description: "Direct B2B supplier for heavy machinery parts. We stock 30,000+ verified aftermarket parts. Fast shipping to USA, Middle East & Africa. Get a quote in 30 mins.",
  openGraph: {
    title: "Nexgen Spares - Global Heavy Machinery Procurement",
    description: "Upload your BOM. Get a Quote. We source OEM-grade parts from Turkey, Korea, and India.",
    type: "website",
  }
};

export default async function Home() {
  const t = await useTranslations('HomePage');

  // Defensive coding: Ensure this doesn't crash if data is missing
  let featuredParts: Part[] = [];
  try {
    featuredParts = await getHardcodedFeaturedParts();
  } catch (e) {
    console.error("Featured parts failed to load", e);
    featuredParts = [];
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans">

      {/* 1. HEADER */}
      <header className="bg-white border-b-2 border-[#005EB8] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-black text-2xl tracking-tighter text-slate-900">
              [ NEXGEN SPARES ]
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:block border-l border-slate-300 pl-4 py-1">
              Global Heavy Machinery Spares
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="https://wa.me/919820259953?text=Hi%20Nexgen,%20I%20need%20a%20quote%20for..."
              target="_blank"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-sm font-bold transition-all shadow-sm"
            >
              <MessageCircle size={18} className="fill-white text-white" />
              <span className="hidden md:inline">WhatsApp for Instant Quote</span>
              <span className="md:hidden">Quote</span>
            </a>

            <div className="hidden md:flex gap-6 items-center">
              <Link href="/upload" className="hover:text-[#005EB8]">{t('nav.uploadBom')}</Link>
              <Link href="/login" className="hover:text-[#005EB8]">{t('nav.signIn')}</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* 2. TICKER */}
      <div className="bg-blue-50 border-b border-blue-100 py-2">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-xs font-mono text-blue-900 overflow-hidden">
          <Activity size={12} className="text-[#005EB8] flex-shrink-0" />
          <span className="font-bold flex-shrink-0">LIVE ACTIVITY:</span>
          <span className="hidden sm:inline">1,284 RFQs processed today</span>
          <span className="mx-2 text-blue-300 hidden sm:inline">|</span>
          <span className="truncate font-medium">Latest Quote: Volvo EC210 Swing Motor – To Dubai (5 mins ago)</span>
        </div>
      </div>

      {/* 3. HERO */}
      <section className="bg-graph-paper py-10 md:py-20 border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <HeroSearch />

          <div className="mt-8 md:mt-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold bg-slate-900 text-white px-1.5 py-0.5 uppercase">Pro</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Have a list?</span>
            </div>
            {/* FIX: Removed 'label' prop to prevent TS Error. Add the text directly inside BulkPasteForm component instead. */}
            <BulkPasteForm />
          </div>

          {/* TRUST STRIP */}
          <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-[#005EB8]" size={16} />
              <span>OEM-Grade Aftermarket</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="text-[#005EB8]" size={16} />
              <span>Ships to 12+ Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-[#005EB8]" size={16} />
              <span>48hr Quote Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-[#005EB8]" size={16} />
              <span>Trusted by 200+ Fleets</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PARAMETRIC DIRECTORY */}
      <section className="py-16 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-slate-200">
            <DirectoryColumn
              icon={<Settings size={24} strokeWidth={1.5} />}
              title="Engine Parts"
              items={['Piston Rings', 'Crankshafts', 'Fuel Injectors', 'Turbochargers', 'Gasket Kits', 'Oil Pumps']}
            />
            <DirectoryColumn
              icon={<Activity size={24} strokeWidth={1.5} />}
              title="Hydraulics"
              items={['Main Pumps', 'Swing Motors', 'Control Valves', 'Seal Kits', 'Cylinders', 'Hoses']}
            />
            <DirectoryColumn
              icon={<Package size={24} strokeWidth={1.5} />}
              title="Filtration"
              items={['Fuel Filters', 'Oil Filters', 'Air Filters', 'Hydraulic Filters', 'Separators', 'Cabin Air']}
            />
            <DirectoryColumn
              icon={<Truck size={24} strokeWidth={1.5} />}
              title="Undercarriage"
              items={['Track Chains', 'Rollers', 'Idlers', 'Sprockets', 'Track Shoes', 'Tensioners']}
            />
          </div>
        </div>
      </section>

      {/* 5. DATA SHOWCASE */}
      <section className="bg-slate-50 py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-12">
            We don&apos;t sell photos. We sell specs.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {featuredParts.map((part, idx) => (
              <PartCard part={part} index={idx} key={part.id} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="font-black text-xl tracking-tighter text-white">
                [ NEXGEN SPARES ]
              </div>
              <p className="leading-relaxed text-slate-500">
                Digital infrastructure for the global heavy machinery aftermarket. Connecting OEM specs with real-time inventory.
              </p>
              <div className="pt-4 mt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 font-mono">
                  <span className="text-emerald-500">✔</span> Sourced from OEM-grade manufacturers in Turkey, Korea, India & Europe.
                  <br />
                  <span className="text-emerald-500">✔</span> 100% Pre-dispatch Inspection.
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-[#005EB8]">About Us</Link></li>
                <li><Link href="/catalogs" className="hover:text-[#005EB8]">Digital Catalogs</Link></li>
                <li><Link href="/shipping" className="hover:text-[#005EB8]">Shipping Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#005EB8]">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">Contact Operations</h4>
              <ul className="space-y-3 font-mono text-xs">
                <li className="flex items-center gap-3">
                  <Phone size={14} />
                  <span>+91 98202 59953</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={14} />
                  <span>orders@nexgenspares.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={14} className="mt-0.5" />
                  <span>Mumbai, Maharashtra<br />Shipping Globally</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800 p-6 rounded-sm border border-slate-700">
              <h4 className="font-bold text-white mb-2">Stock Alerts</h4>
              <p className="text-xs mb-4 text-slate-500">Get notified when hard-to-find parts enter our index.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="bg-slate-900 border border-slate-700 text-white px-3 py-2 text-xs w-full focus:outline-none focus:border-[#005EB8]"
                />
                <Button className="bg-[#005EB8] hover:bg-blue-700 h-auto py-2 px-3">
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
            <p>© 2024 Nexgen Spares. All specifications property of respective OEMs.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <span>Privacy</span>
              <span>Sitemap</span>
            </div>
          </div>
        </div>
      </footer>

      <MobileContactBar />
    </main>
  );
}

// --- Helper Components ---

function DirectoryColumn({ icon, title, items }: { icon: React.ReactNode, title: string, items: string[] }) {
  return (
    <div className="border-r border-slate-200 px-6 py-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-slate-900">{icon}</div>
        <h3 className="text-sm font-bold text-[#005EB8] tracking-wider uppercase">{title}</h3>
      </div>
      <ul className="space-y-1">
        {items.map(item => (
          <li key={item}>
            <Link href={`/category/${slugify(item)}`} className="block py-1.5 px-2 -mx-2 text-sm text-slate-700 hover:bg-yellow-50 hover:text-slate-900 transition-colors rounded-sm">
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PartCard({ part, index }: { part: Part, index: number }) {
  const isFeatured = index === 1;
  return (
    <div className={cn(
      "bg-white border-slate-200 p-8 relative transform hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full",
      isFeatured ? "shadow-2xl border-2 border-[#005EB8] scale-105 z-10" : "shadow-xl border"
    )}>
      <div className={cn(
        "absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-b-md",
        index === 0 ? "bg-yellow-400" : isFeatured ? "active-brand-stripe w-24 h-2 bg-[#005EB8]" : "bg-slate-400"
      )}></div>

      {isFeatured && (
        <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 border border-emerald-200 rounded-full">
          IN STOCK
        </div>
      )}

      <div className="mb-6">
        <div className={cn("text-[10px] font-mono uppercase", isFeatured ? "text-[#005EB8]" : "text-slate-500")}>
          {part.name}
        </div>
        <h3 className={cn("font-black text-slate-900 tracking-tight mt-1", isFeatured ? "text-3xl" : "text-2xl")}>
          {part.brand} {part.partNumber}
        </h3>
      </div>

      <div className="bg-slate-50 p-3 mb-4 rounded-sm border border-slate-100 grid grid-cols-2 gap-2">
        <div className="text-[10px] text-slate-500 font-mono">
          <span className="block font-bold text-slate-700">Origin</span>
          Turkey / Korea
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          <span className="block font-bold text-slate-700">Lead Time</span>
          5-7 Days
        </div>
        <div className="col-span-2 text-[10px] text-slate-500 font-mono border-t border-slate-200 pt-2 mt-1">
          <span className="font-bold text-slate-700 mr-1">Compatible:</span>
          EC210 / EC240 / PC200-8
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-grow">
        {part.technical_specs && Object.entries(part.technical_specs).slice(0, 3).map(([key, val]) => (
          <div key={key} className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase truncate pr-4">{key}</span>
            <span className="font-mono text-sm font-bold text-slate-700 text-right">{val}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Link href={`/p/${slugify(part.brand)}-${slugify(part.partNumber)}`} className="block w-full">
          <Button className={cn(
            "w-full font-bold rounded-sm h-12 uppercase tracking-wide",
            isFeatured ?
              "bg-[#005EB8] hover:bg-blue-700 text-white shadow-lg shadow-blue-900/10" :
              "bg-slate-900 hover:bg-slate-800 text-white text-xs h-10"
          )}>
            {isFeatured ? "Get Price (WhatsApp)" : "View Specs"}
          </Button>
        </Link>
        <div className="text-center pt-2 border-t border-slate-100">
          <Link href={`/brands/${slugify(part.brand)}`} className="text-[10px] font-bold text-slate-400 hover:text-[#005EB8] uppercase tracking-wider flex items-center justify-center gap-1 group">
            View more {part.brand} parts
            <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
