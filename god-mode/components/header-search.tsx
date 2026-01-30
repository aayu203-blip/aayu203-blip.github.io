"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";

type Suggestion = {
    id: string;
    partNumber: string;
    brand: string;
    name: string;
    url: string;
};

export function HeaderSearch() {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleSearch = () => {
        if (!searchText.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchText)}`);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchText.length >= 2) {
                setIsLoadingSuggestions(true);
                try {
                    const res = await fetch(`/api/suggest?q=${encodeURIComponent(searchText)}`);
                    const data = await res.json();
                    setSuggestions(data.results || []);
                    setShowSuggestions(true);
                } catch (e) {
                    console.error("Failed to fetch suggestions");
                } finally {
                    setIsLoadingSuggestions(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchText]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    return (
        <div ref={wrapperRef} className="relative group w-full max-w-xl">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search Part Number..."
                    className="w-full pl-3 pr-10 py-2 bg-slate-100/50 border border-slate-200 rounded-sm text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#005EB8] focus:bg-white transition-all"
                />
                <button
                    onClick={handleSearch}
                    className="absolute right-2 text-slate-400 hover:text-[#005EB8]"
                >
                    {isLoadingSuggestions ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        <Search size={16} />
                    )}
                </button>
            </div>

            {/* DROPDOWN */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-slate-200 border-t-0 shadow-lg z-50 rounded-b-sm">
                    {suggestions.map((item) => (
                        <Link
                            key={item.id}
                            href={item.url}
                            className="flex items-center justify-between px-4 py-2 hover:bg-blue-50 border-b border-slate-100 last:border-0 group transition-colors"
                            onClick={() => setShowSuggestions(false)}
                        >
                            <div className="flex flex-col">
                                <span className="font-mono font-bold text-[#005EB8] text-sm">
                                    {item.partNumber}
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase truncate max-w-[200px]">
                                    {item.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                    <div
                        onClick={handleSearch}
                        className="px-4 py-2 bg-slate-50 text-[10px] font-mono text-center text-slate-500 hover:text-[#005EB8] cursor-pointer hover:underline"
                    >
                        VIEW ALL MATCHES
                    </div>
                </div>
            )}
        </div>
    );
}
