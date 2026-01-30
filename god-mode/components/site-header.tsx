import { Link } from '@/i18n/routing';
import { MessageCircle } from "lucide-react";
import { useTranslations } from 'next-intl';

export function SiteHeader() {
    const t = useTranslations('HomePage');

    return (
        <header className="bg-white border-b-2 border-[#005EB8] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="font-black text-2xl tracking-tighter text-slate-900">
                        [ NEXGEN SPARES ]
                    </Link>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:block border-l border-slate-300 pl-4 py-1">
                        Global Heavy Machinery Spares
                    </span>
                </div>

                <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
                    <a
                        href="https://wa.me/919820259953?text=Hi%20Nexgen,%20I%20need%20a%20quote%20for..."
                        target="_blank"
                        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-sm font-bold transition-all shadow-sm"
                    >
                        <MessageCircle size={18} className="fill-white text-white" />
                        <span className="hidden md:inline">WhatsApp for Instant Quote</span>
                        <span className="md:hidden">Quote</span>
                    </a>

                    <div className="hidden md:flex gap-6 items-center">
                        {/* Redirecting broken links to Contact for now */}
                        <Link href="/contact" className="hover:text-[#005EB8]">{t('nav.uploadBom')}</Link>
                        <Link href="/contact" className="hover:text-[#005EB8]">{t('nav.signIn')}</Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
