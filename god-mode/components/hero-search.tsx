"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, FileSpreadsheet, ArrowRight, MessageCircle } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

import { useRouter } from "@/i18n/routing";

export function HeroSearch() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"search" | "bulk">("search");
    const [bomText, setBomText] = useState("");
    const [searchText, setSearchText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Search Handler
    const handleSearch = () => {
        if (!searchText.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchText)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

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
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-8">
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
                <div className="relative group max-w-2xl bg-white">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="text-slate-400 group-focus-within:text-[#005EB8]" size={20} />
                    </div>
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search 500,000+ specs (e.g. 1R-0716, Volvo EC210)..."
                        className="w-full pl-12 pr-4 py-5 bg-white border-2 border-slate-300 rounded-none shadow-sm text-lg font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#005EB8] focus:ring-4 focus:ring-blue-500/10 transition-all border-t-0"
                    />
                    <div className="absolute inset-y-2 right-2 flex items-center">
                        <Button
                            onClick={handleSearch}
                            className="h-full rounded-none bg-slate-900 hover:bg-slate-800 text-white font-bold px-6"
                        >
                            SEARCH
                        </Button>
                    </div>

                    <div className="mt-4 flex gap-4 text-xs text-slate-500 font-medium">
                        <span>Try:</span>
                        <a href="/p/cat-1r-0716" className="text-[#005EB8] hover:underline font-mono">1R-0716</a>
                        <a href="/p/volvo-11110534" className="text-[#005EB8] hover:underline font-mono">11110534</a>
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
