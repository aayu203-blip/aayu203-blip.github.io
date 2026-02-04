"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Search, FileSpreadsheet, ArrowRight, MessageCircle, Loader2 } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
// import Link from "next/link"; // REMOVED - Using localized Link
import { useRouter, Link } from "@/i18n/routing";

type Suggestion = {
    id: string;
    partNumber: string;
    brand: string;
    name: string;
    url: string;
};

export function HeroSearch() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"search" | "bulk">("search");
    const [bomText, setBomText] = useState("");
    const [searchText, setSearchText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Type-Ahead State
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Search Handler
    const handleSearch = () => {
        if (!searchText.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchText)}`);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    // Debounced Suggestion Fetcher
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const timer = setTimeout(async () => {
            if (searchText.length >= 2) {
                setIsLoadingSuggestions(true);
                try {
                    const res = await fetch(`/api/suggest?q=${encodeURIComponent(searchText)}`, { signal });
                    if (!res.ok) throw new Error("Fetch failed");
                    const data = await res.json();
                    setSuggestions(data.results || []);
                    setShowSuggestions(true);
                } catch (e: any) {
                    if (e.name !== "AbortError") {
                        console.error("Failed to fetch suggestions");
                    }
                } finally {
                    if (!signal.aborted) setIsLoadingSuggestions(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 150); // Optimized to 150ms for snappier feel

        return () => {
            clearTimeout(timer);
            controller.abort(); // Cancel previous request on new keystroke
        };
    }, [searchText]);

    // Click Outside Handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);


    // Bulk Handler
    const handleBulkQuote = () => {
        setIsAnalyzing(true);
        // Simulate processing delay for "Pro" feel
        setTimeout(() => {
            const lineCount = bomText.split('\n').filter(line => line.trim().length > 0).length;
            const bulkId = "Q-" + Math.floor(1000 + Math.random() * 9000); // Mock ID

            const link = generateWhatsAppLink({
                type: "BULK_LIST",
                bulkId: bulkId,
                itemCount: lineCount
            });

            window.open(link, '_blank');
            setIsAnalyzing(false);
        }, 800);
    };

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-8">
                {activeTab === "search" ? (
                    <>Input Part Number.<br />Get Global Specs.</>
                ) : (
                    <>Paste your B.O.M.<br />Get Instant Pricing.</>
                )}
            </h1>

            {/* TABS */}
            <div className="flex gap-1 mb-0 border-b-2 border-slate-300 w-fit">
                <button
                    onClick={() => setActiveTab("search")}
                    className={cn(
                        "px-6 py-3 font-mono text-sm font-bold tracking-wide transition-all",
                        activeTab === "search"
                            ? "bg-slate-900 text-white"
                            : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    )}
                >
                    PART SEARCH
                </button>
                <button
                    onClick={() => setActiveTab("bulk")}
                    className={cn(
                        "px-6 py-3 font-mono text-sm font-bold tracking-wide transition-all flex items-center gap-2",
                        activeTab === "bulk"
                            ? "bg-[#005EB8] text-white"
                            : "bg-transparent text-slate-500 hover:text-[#005EB8] hover:bg-blue-50"
                    )}
                >
                    <FileSpreadsheet size={14} />
                    BULK IMPORT (BOM)
                </button>
            </div>

            {/* PANEL: SEARCH */}
            {activeTab === "search" && (
                <div ref={wrapperRef} className="relative group max-w-2xl bg-white z-50">
                    <div className="absolute inset-y-0 left-3 md:left-4 flex items-center pointer-events-none">
                        {isLoadingSuggestions ? (
                            <Loader2 className="text-[#005EB8] animate-spin" size={18} />
                        ) : (
                            <Search className="text-slate-400 group-focus-within:text-[#005EB8]" size={18} />
                        )}
                    </div>
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                        onKeyDown={handleKeyDown}
                        placeholder="Search 500,000+ specs..."
                        className="w-full pl-10 md:pl-12 pr-28 md:pr-36 py-3 md:py-5 bg-white border-2 border-slate-300 rounded-none shadow-sm text-base md:text-lg font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#005EB8] focus:ring-4 focus:ring-blue-500/10 transition-all border-t-0 truncate"
                    />
                    <div className="absolute inset-y-1 md:inset-y-2 right-1 md:right-2 flex items-center">
                        <Button
                            onClick={handleSearch}
                            className="h-full rounded-none bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 md:px-6 text-xs md:text-sm"
                        >
                            SEARCH
                        </Button>
                    </div>

                    {/* TYPE-AHEAD DROPDOWN */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white border-2 border-[#005EB8] border-t-0 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                            {suggestions.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.url}
                                    className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 border-b border-slate-100 last:border-0 group transition-colors"
                                    onClick={() => setShowSuggestions(false)}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-mono font-bold text-[#005EB8] text-lg">
                                            {item.partNumber}
                                        </span>
                                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-slate-500 group-hover:text-slate-700">
                                            <span className="bg-slate-100 px-1 rounded-sm">{item.brand}</span>
                                            <span>{item.name}</span>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-300 group-hover:text-[#005EB8] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </Link>
                            ))}
                            <div
                                onClick={handleSearch}
                                className="px-4 py-2 bg-slate-50 text-xs font-mono text-center text-slate-500 hover:text-[#005EB8] cursor-pointer hover:underline border-t border-slate-200"
                            >
                                VIEW ALL MATCHES FOR &quot;{searchText}&quot;
                            </div>
                        </div>
                    )}

                    <div className="mt-4 flex gap-4 text-xs text-slate-500 font-medium">
                        <span>Try:</span>
                        <a href="/en/p/caterpillar-1r-0716" className="text-[#005EB8] hover:underline font-mono">1R-0716</a>
                        <a href="/en/p/volvo-21969323" className="text-[#005EB8] hover:underline font-mono">21969323</a>
                    </div>
                </div>
            )}

            {/* PANEL: BULK PASTE */}
            {activeTab === "bulk" && (
                <div className="max-w-2xl bg-white border-2 border-[#005EB8] p-4 shadow-lg border-t-0 relative">
                    <div className="absolute top-2 right-2 flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                    <textarea
                        value={bomText}
                        onChange={(e) => setBomText(e.target.value)}
                        placeholder={`Paste your list here...
Example:
Volvo 11110534 - 5 qty
CAT 1R-0716 - 20 qty
Parker 3209 - 1 qty`}
                        className="w-full h-48 bg-slate-50 border border-slate-200 p-4 font-mono text-sm text-slate-900 focus:outline-none focus:bg-white resize-none"
                    />
                    <div className="flex justify-between items-center mt-4">
                        <div className="text-xs text-slate-500 font-mono">
                            {bomText.split('\n').filter(l => l.trim()).length} ITEMS DETECTED
                        </div>
                        <Button
                            onClick={handleBulkQuote}
                            disabled={!bomText.trim() || isAnalyzing}
                            className="bg-[#005EB8] hover:bg-blue-700 text-white font-bold rounded-sm h-12 px-6 flex items-center gap-2"
                        >
                            {isAnalyzing ? "ANALYZING..." : (
                                <>
                                    <MessageCircle size={18} />
                                    QUOTE ON WHATSAPP
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
}
