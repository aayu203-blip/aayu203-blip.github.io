"use client";

import { useState, useEffect } from "react";
import { X, Download, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExitIntentModalProps {
    productName?: string;
    brandName?: string;
}

export function ExitIntentModal({ productName, brandName }: ExitIntentModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Check if already shown in this session
        const shown = sessionStorage.getItem("exitIntentShown");
        if (shown) {
            setHasShown(true);
            return;
        }

        let timeoutId: NodeJS.Timeout;
        let scrollTriggered = false;

        // Trigger on scroll to 50%
        const handleScroll = () => {
            if (scrollTriggered || hasShown) return;

            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

            if (scrollPercent > 50) {
                scrollTriggered = true;
                triggerModal();
            }
        };

        // Trigger after 10 seconds
        timeoutId = setTimeout(() => {
            if (!scrollTriggered && !hasShown) {
                triggerModal();
            }
        }, 10000);

        const triggerModal = () => {
            setIsVisible(true);
            setHasShown(true);
            sessionStorage.setItem("exitIntentShown", "true");
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [hasShown]);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const whatsappMessage = productName
        ? `Hi, I'm interested in ${productName} (${brandName}). Can you send me the spec sheet?`
        : `Hi, I'm interested in getting a parts catalog. Can you help?`;

    const whatsappUrl = `https://wa.me/919137151496?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 animate-scale-in">
                <div className="bg-white rounded-lg shadow-2xl border-2 border-[#005EB8] overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#005EB8] to-blue-700 p-6 text-white relative">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                        <h3 className="text-2xl font-black tracking-tight mb-2">
                            Wait! Before You Go...
                        </h3>
                        <p className="text-blue-100 text-sm">
                            Get instant access to technical specs
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                            <p className="text-sm text-slate-700 leading-relaxed">
                                {productName ? (
                                    <>
                                        Interested in <span className="font-bold text-[#005EB8]">{productName}</span>?
                                        Get the complete spec sheet via WhatsApp in 30 seconds.
                                    </>
                                ) : (
                                    <>
                                        Get our complete parts catalog with verified specs for Volvo, CAT, Komatsu, and more.
                                    </>
                                )}
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="space-y-3">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <Button className="w-full bg-[#25D366] hover:bg-green-600 text-white h-12 text-base font-bold flex items-center justify-center gap-2">
                                    <MessageCircle size={20} />
                                    Get Specs via WhatsApp
                                </Button>
                            </a>

                            <Button
                                variant="outline"
                                className="w-full h-12 text-base border-slate-300 hover:border-[#005EB8] hover:text-[#005EB8] flex items-center justify-center gap-2"
                                onClick={handleClose}
                            >
                                <Download size={20} />
                                Download Catalog (PDF)
                            </Button>
                        </div>

                        <p className="text-xs text-center text-slate-400 pt-2">
                            No spam. Instant delivery. Trusted by 500+ procurement teams.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
