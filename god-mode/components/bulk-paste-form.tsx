"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Clipboard } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export function BulkPasteForm() {
    const [text, setText] = useState("");

    const handleWhatsAppClick = () => {
        if (!text.trim()) return;
        const link = generateWhatsAppLink({
            source: 'bulk_paste',
            text: text
        });
        window.open(link, '_blank');
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
                <Clipboard className="text-[#005EB8]" size={20} />
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                    Rapid Quote Request
                </h3>
            </div>

            <p className="text-xs text-slate-500 mb-4">
                Paste your part numbers, BOM, or requirements list here. We'll check stock across all hubs instantly.
            </p>

            <Textarea
                placeholder="Example:&#10;CAT 1R-0716 - 50 pcs&#10;Volvo 11110176 - 2 pcs"
                className="font-mono text-sm bg-slate-50 min-h-[120px] mb-4 border-slate-300 focus-visible:ring-[#005EB8]"
                value={text}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
            />

            <Button
                onClick={handleWhatsAppClick}
                disabled={!text.trim()}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-12"
            >
                <MessageSquare className="mr-2 h-5 w-5" />
                Get Quote via WhatsApp
            </Button>

            <div className="mt-3 text-[10px] text-center text-slate-400">
                Average response time: &lt; 2 minutes
            </div>
        </div>
    );
}
