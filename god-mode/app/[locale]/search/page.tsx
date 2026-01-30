import { searchParts, slugify } from "@/lib/data-loader";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Filter, AlertCircle } from "lucide-react";
import Link from "next/link";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;
    const q = (resolvedSearchParams.q as string) || "";

    return {
        title: `Search Results for "${q}" | NexGen Index`,
        description: `Browse global inventory for ${q}. Verified specifications and stock checks.`,
    };
}

export default async function SearchPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;
    const q = (resolvedSearchParams.q as string) || "";

    // Execute Search
    const { results, duration } = await searchParts(q);

    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">



            {/* 2. RESULTS CONTAINER */}
            <section className="py-12 bg-white min-h-[80vh]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">
                            {results.length > 0 ? (
                                <>Found {results.length} matches for <span className="text-[#005EB8]">&quot;{q}&quot;</span></>
                            ) : (
                                <>No matches found for <span className="text-red-600">&quot;{q}&quot;</span></>
                            )}
                        </h1>
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-sm">
                            Query Time: {duration.toFixed(2)}ms
                        </div>
                    </div>

                    {results.length > 0 ? (
                        <div className="overflow-x-auto border border-slate-200 shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Part Number</th>
                                        <th className="px-6 py-4">Brand</th>
                                        <th className="px-6 py-4">Name / Application</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {results.map(part => (
                                        <tr key={part.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 font-mono font-bold text-[#005EB8]">
                                                <Link href={`/p/${slugify(part.brand)}-${slugify(part.partNumber)}`} className="hover:underline">
                                                    {part.partNumber}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-slate-900 font-bold uppercase">
                                                {part.brand}
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 font-medium group-hover:text-slate-900">
                                                {part.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs uppercase tracking-wide">
                                                {part.category}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/p/${slugify(part.brand)}-${slugify(part.partNumber)}`} className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-[#005EB8] transition-colors">
                                                    VIEW SPEC <ArrowRight size={12} className="ml-1" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-slate-50 border border-slate-200 p-12 text-center rounded-sm">
                            <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Search Yielded No Results</h3>
                            <p className="text-slate-500 max-w-md mx-auto mb-8">
                                We couldn&apos;t find an exact match for &quot;{q}&quot;. Try searching for a broader term like &quot;Filter&quot; or &quot;Pump&quot;, or check for typos.
                            </p>
                            <Link href="/">
                                <Button variant="outline" className="border-slate-300 text-slate-700 hover:border-[#005EB8] hover:text-[#005EB8]">
                                    Return to Index
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
