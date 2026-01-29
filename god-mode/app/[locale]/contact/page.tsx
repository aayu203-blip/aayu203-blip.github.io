import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    return {
        title: "Contact NexGen | 24/7 Support",
        description: "Get in touch with our engineering team via WhatsApp, Email, or Phone. We support global procurement.",
    };
}

export default async function ContactPage({ params }: Props) {
    return (
        <main className="min-h-screen bg-white font-sans text-slate-900">
            <header className="bg-slate-50 border-b border-slate-200 py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                        LET&apos;S TALK.
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Our support team operates across 3 time zones to ensure you get answers when you need them.
                    </p>
                </div>
            </header>

            <section className="py-20 max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* DIRECT CONTACT */}
                    <div className="space-y-12">
                        <div className="bg-[#F0FDF4] border border-green-200 p-8 rounded-sm">
                            <h3 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-3">
                                <MessageCircle className="text-green-600" /> WhatsApp Support
                            </h3>
                            <p className="text-green-800 mb-6">
                                The fastest way to get a quote. Send us photos of your part or a list of part numbers.
                            </p>
                            <a href="https://wa.me/919821037990" target="_blank" rel="noopener noreferrer">
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-14 text-lg">
                                    CHAT NOW
                                </Button>
                            </a>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Mail className="text-[#005EB8] mt-1" />
                                <div>
                                    <h4 className="font-bold text-lg">Email Us</h4>
                                    <p className="text-slate-500 mb-1">For bulk inquiries and tenders</p>
                                    <a href="mailto:sales@partstradingco.com" className="text-lg font-mono font-semibold hover:text-[#005EB8]">
                                        sales@partstradingco.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Phone className="text-[#005EB8] mt-1" />
                                <div>
                                    <h4 className="font-bold text-lg">Call Us</h4>
                                    <p className="text-slate-500 mb-1">Mon-Fri, 9am - 6pm (GST)</p>
                                    <a href="tel:+919821037990" className="text-lg font-mono font-semibold hover:text-[#005EB8]">
                                        +91 98210 37990
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAP / ADDRESS */}
                    <div className="bg-slate-50 p-8 rounded-sm border border-slate-200">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MapPin size={20} /> Global Headquarters
                        </h3>
                        <div className="aspect-video bg-slate-200 mb-6 rounded-sm relative">
                            {/* Map Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-mono text-sm">
                                [ GOOGLE MAP INTEGRATION ]
                            </div>
                        </div>
                        <address className="not-italic text-slate-600 space-y-2">
                            <p className="font-bold text-slate-900">Parts Trading Company</p>
                            <p>123 Industrial Area, Phase 1</p>
                            <p>New Delhi, India 110020</p>
                        </address>
                    </div>
                </div>
            </section>
        </main>
    );
}
