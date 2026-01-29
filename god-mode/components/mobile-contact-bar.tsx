"use client";

import { useState, useEffect } from "react";
import { X, Phone, MessageCircle, Mail } from "lucide-react";

export function MobileContactBar() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after 3 seconds on mobile
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t-2 border-[#005EB8] shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex gap-3 flex-1">
                    <a
                        href="tel:+919820259953"
                        className="flex-1 flex items-center justify-center gap-2 bg-[#005EB8] text-white py-3 rounded-sm font-bold text-sm hover:bg-blue-700 transition-colors"
                    >
                        <Phone size={18} />
                        Call Now
                    </a>
                    <a
                        href="https://wa.me/919820259953"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-sm font-bold text-sm hover:bg-green-600 transition-colors"
                    >
                        <MessageCircle size={18} />
                        WhatsApp
                    </a>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="ml-3 text-slate-400 hover:text-slate-600"
                    aria-label="Close contact bar"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
