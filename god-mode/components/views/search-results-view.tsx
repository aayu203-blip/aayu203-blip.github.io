import { searchParts, slugify } from "@/lib/data-loader";
import Link from 'next/link';
import { ArrowRight, Box } from "lucide-react";

export async function SearchResultsView({ query }: { query: string }) {
    // Server-Side Search
    const searchResult = await searchParts(query);
    const results = searchResult.results;
    const duration = searchResult.duration.toFixed(2);

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">
                    Results for <span className="text-[#005EB8]">"{query}"</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Found {results.length} results in {duration}ms
                </p>
            </div>

            {results.length === 0 ? (
                <div className="bg-white p-12 text-center border border-slate-200 rounded-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                        <Box className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No matches found</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        We couldn't find an exact match for "{query}". Try searching for a broader term like "Filter" or "Pump", or check for typos.
                    </p>
                    <Link href="/" className="inline-flex items-center text-[#005EB8] font-bold hover:underline">
                        Return to Index
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((part) => (
                        <Link
                            key={part.id}
                            href={`/p/${slugify(part.brand)}-${slugify(part.partNumber)}`}
                            className="group block bg-white border border-slate-200 hover:border-[#005EB8] hover:shadow-md transition-all p-5 rounded-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="text-[#005EB8]" size={20} />
                            </div>

                            <div className="mb-3">
                                <span className="inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-[#005EB8] font-mono uppercase tracking-wide">
                                    {part.brand}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-1 font-mono tracking-tight group-hover:text-[#005EB8] transition-colors">
                                {part.partNumber}
                            </h3>
                            <p className="text-sm font-medium text-slate-700 mb-4 line-clamp-2 min-h-[2.5rem]">
                                {part.name}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100 pt-3">
                                <span>Stock: 10+</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>Ships Today</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
