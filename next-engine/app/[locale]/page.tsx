import { SearchCommand } from "@/components/search-command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, Globe, ShieldCheck, TrendingUp, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MACHINERY_BRANDS, TRENDING_PARTS, LIVE_ACTIVITY } from "@/lib/brands";

import { BrandCoverage } from "@/components/brand-coverage";
import { OEMPartners } from "@/components/oem-partners";

export default function Home() {
  const tier1Brands = MACHINERY_BRANDS.filter(b => b.tier === 1);
  const tier2Brands = MACHINERY_BRANDS.filter(b => b.tier === 2);

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-black">

      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b-4 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between px-4">
          <div className="flex items-center space-x-2 font-black tracking-tighter text-xl">
            <Package className="h-6 w-6" />
            <span>NEXGEN SPARES</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium font-mono">
            <Link href="#brands" className="hover:underline hover:decoration-4 hover:decoration-primary underline-offset-4">BRANDS</Link>
            <Link href="#trending" className="hover:underline hover:decoration-4 hover:decoration-primary underline-offset-4">TRENDING</Link>
            <Link href="#" className="hover:underline hover:decoration-4 hover:decoration-primary underline-offset-4">TRACK ORDER</Link>
          </nav>
          <Button className="bg-primary text-black font-bold border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            GET QUOTE
          </Button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">

        {/* BACKGROUND GRID */}
        <div className="absolute inset-0 z-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <div className="z-10 w-full max-w-4xl text-center space-y-8">

          {/* STATUS BADGE */}
          <div className="inline-flex items-center justify-center space-x-2 border-2 border-border bg-muted/50 px-3 py-1 rounded-none mb-4">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">System Online • 21,342 Parts • 40+ Brands</span>
          </div>

          {/* HEADLINE */}
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
            The Google<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-yellow-600">For Parts</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-mono">
            Instant access to heavy machinery supply chain.
            Volvo. Scania. Komatsu. CAT. JCB. Hitachi.
          </p>

          {/* SEARCH CONSOLE */}
          <div className="pt-8 w-full max-w-2xl mx-auto">
            <SearchCommand />
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-mono text-muted-foreground">
              <span>TRENDING:</span>
              <Link href="/product/volvo-1521725" className="underline hover:text-primary">Volvo 1521725</Link>
              <Link href="/product/scania-2977059" className="underline hover:text-primary">Scania Brake Kit</Link>
              <Link href="#" className="underline hover:text-primary">Hydraulic Pumps</Link>
              <Link href="#" className="underline hover:text-primary">Oil Filters</Link>
            </div>
          </div>

        </div>
      </section>

      <BrandCoverage />

      {/* BRAND UNIVERSE */}
      <section id="brands" className="py-16 bg-muted/20 border-y-4 border-border">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tight">Brand Universe</h2>
            <Badge variant="outline" className="font-mono">40+ Manufacturers</Badge>
          </div>

          {/* TIER 1: BRANDS WITH INVENTORY */}
          <div className="mb-12">
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-4">In Stock Now</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {tier1Brands.map((brand) => (
                <Link key={brand.slug} href={`/brands/${brand.slug}`}>
                  <Card className="rounded-none border-2 hover:border-primary hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-2">{brand.logo}</div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{brand.name}</h3>
                      <p className="text-xs font-mono text-muted-foreground">{brand.partCount.toLocaleString()} parts</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* TIER 2: COMING SOON */}
          <div>
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-4">Expanding Soon</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-3">
              {tier2Brands.map((brand) => (
                <div key={brand.slug} className="border-2 border-dashed border-border p-3 text-center opacity-50 hover:opacity-100 transition-opacity">
                  <div className="text-2xl mb-1">{brand.logo}</div>
                  <p className="text-xs font-mono">{brand.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <OEMPartners />

      {/* TRENDING & ACTIVITY */}
      <section id="trending" className="py-16">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-8">

            {/* TRENDING PARTS */}
            <Card className="rounded-none border-2">
              <CardHeader className="border-b-2 bg-muted/30">
                <CardTitle className="flex items-center font-mono uppercase tracking-widest">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Most Searched This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {TRENDING_PARTS.map((part, idx) => (
                    <Link key={part.id} href={`/product/${part.brand.toLowerCase()}-${part.partNumber}`} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors group">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-black text-muted-foreground">#{idx + 1}</span>
                        <div>
                          <p className="font-mono font-bold group-hover:text-primary transition-colors">{part.partNumber}</p>
                          <p className="text-sm text-muted-foreground">{part.brand} {part.name}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-mono">{part.searches} searches</Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* LIVE ACTIVITY */}
            <Card className="rounded-none border-2">
              <CardHeader className="border-b-2 bg-muted/30">
                <CardTitle className="flex items-center font-mono uppercase tracking-widest">
                  <Activity className="mr-2 h-5 w-5 text-green-500 animate-pulse" />
                  Live Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {LIVE_ACTIVITY.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-mono text-sm">
                            <Badge variant={activity.action === 'shipped' ? 'default' : 'outline'} className="mr-2 rounded-none">
                              {activity.action.toUpperCase()}
                            </Badge>
                            <span className="font-bold">{activity.part}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Globe className="inline h-3 w-3 mr-1" />
                            {activity.destination}
                          </p>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* FOOTER STATS */}
      <div className="bg-black text-white py-12 border-t-8 border-primary">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 px-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Globe className="h-8 w-8 text-primary" />
            <h3 className="font-bold text-lg uppercase tracking-widest">Global Export</h3>
            <p className="text-sm text-gray-400 font-mono">Shipping to 50+ Countries</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h3 className="font-bold text-lg uppercase tracking-widest">OEM Quality</h3>
            <p className="text-sm text-gray-400 font-mono">Genuine & Aftermarket Certified</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Truck className="h-8 w-8 text-primary" />
            <h3 className="font-bold text-lg uppercase tracking-widest">Fast Logistics</h3>
            <p className="text-sm text-gray-400 font-mono">24h Dispatch from Mumbai</p>
          </div>
        </div>
      </div>
    </div>
  );
}
