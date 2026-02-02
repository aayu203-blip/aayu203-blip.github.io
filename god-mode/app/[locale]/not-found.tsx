
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Construction, AlertTriangle, ArrowLeft } from 'lucide-react';
import { HeroSearch } from '@/components/hero-search'; // Reusing search component? Maybe too big.
// Let's use a simple search bar or just button to home.

export default function NotFound() {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center text-slate-900 font-sans">
            <div className="max-w-md w-full bg-white p-12 border border-slate-200 shadow-xl rounded-sm">
                <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center">
                        <AlertTriangle size={40} className="text-slate-400" />
                    </div>
                </div>

                <h1 className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">404</h1>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Page Not Found</h2>

                <p className="text-slate-500 mb-8 leading-relaxed">
                    The machine part you are looking for might have moved or is no longer available in this specific location.
                </p>

                <div className="space-y-3">
                    <Link href="/">
                        <Button className="w-full h-12 bg-[#005EB8] hover:bg-blue-800 text-white font-bold">
                            RETURN TO CATALOG
                        </Button>
                    </Link>
                    <Link href="/en/search">
                        <Button variant="outline" className="w-full h-12 border-slate-300 text-slate-700">
                            <Search className="mr-2" size={16} /> SEARCH PARTS
                        </Button>
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 text-xs text-slate-400">
                    Error Code: 404_COMPONENT_MISSING
                </div>
            </div>
        </main>
    );
}
