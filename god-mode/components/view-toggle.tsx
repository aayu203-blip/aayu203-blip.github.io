"use client";

import { useGodMode } from "@/components/god-mode-provider";
import { cn } from "@/lib/utils";
import { Settings, ShieldCheck, Truck, Scale, Ruler } from "lucide-react";

export function ViewToggle({ className }: { className?: string }) {
    const { mode, setMode } = useGodMode();

    return (
        <div className={cn("flex items-center bg-slate-100 p-1 rounded-sm border border-slate-200", className)}>
            <button
                onClick={() => setMode("procurement")}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all",
                    mode === "procurement"
                        ? "bg-white text-[#F97316] shadow-sm ring-1 ring-slate-200"
                        : "text-slate-500 hover:text-slate-900"
                )}
            >
                <Truck size={12} />
                Procurement
            </button>
            <button
                onClick={() => setMode("engineering")}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all",
                    mode === "engineering"
                        ? "bg-[#005EB8] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                )}
            >
                <Ruler size={12} />
                Engineering
            </button>
        </div>
    );
}
