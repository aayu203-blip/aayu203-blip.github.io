import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function SiteFooter() {
    const t = useTranslations('HomePage'); // Using HomePage namespace for now as it contains footer keys

    return (
        <footer className="bg-slate-900 text-white py-24 print:hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div>
                    <div className="font-black text-xl mb-6 tracking-tighter">[ NEXGEN SPARES ]</div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        The premier global supplier of heavy machinery parts. Verified components, technical accuracy, and rapid logistics for procurement teams worldwide.
                    </p>

                    {/* LEGAL DISCLAIMER */}
                    <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-sm">


                        <p className="text-[10px] text-slate-500 leading-normal">
                            <strong>DISCLAIMER:</strong> NexGen Spares is an independent supplier of aftermarket parts. All OEM names, trademarks, and part numbers (including Volvo, CAT, Komatsu, Scania) are for reference purposes only and do not imply affiliation or endorsement by the original equipment manufacturers.
                        </p>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-slate-200 mb-6 uppercase text-xs tracking-wider">{t('footer.brands')}</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><Link href="/brands/volvo" className="hover:text-white">Volvo</Link></li>
                        <li><Link href="/brands/caterpillar" className="hover:text-white">Caterpillar (CAT)</Link></li>
                        <li><Link href="/brands/komatsu" className="hover:text-white">Komatsu</Link></li>
                        <li><Link href="/brands/scania" className="hover:text-white">Scania</Link></li>
                        <li><Link href="/brands/hitachi" className="hover:text-white">Hitachi</Link></li>
                        <li><Link href="/brands/beml" className="hover:text-white">BEML</Link></li>
                        <li><Link href="/brands/hyundai" className="hover:text-white">Hyundai</Link></li>
                        <li><Link href="/brands/sany" className="hover:text-white">Sany</Link></li>
                        <li><Link href="/brands/liugong" className="hover:text-white">Liugong</Link></li>
                        <li><Link href="/brands/mait" className="hover:text-white">Mait</Link></li>
                        <li><Link href="/brands/soilmec" className="hover:text-white">Soilmec</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-slate-200 mb-6 uppercase text-xs tracking-wider">{t('footer.machines')}</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><Link href="/machines/excavators" className="hover:text-white">Excavators</Link></li>
                        <li><Link href="/machines/articulated-haulers" className="hover:text-white">Articulated Haulers</Link></li>
                        <li><Link href="/machines/wheel-loaders" className="hover:text-white">Wheel Loaders</Link></li>
                        <li><Link href="/machines/industrial-engines" className="hover:text-white">Industrial Engines</Link></li>
                        <li><Link href="/machines/pavers" className="hover:text-white">Pavers</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-slate-200 mb-6 uppercase text-xs tracking-wider">{t('footer.regions')}</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><Link href="/about" className="hover:text-white">North America (USA/CAN)</Link></li>
                        <li><Link href="/about" className="hover:text-white">EMEA (Europe/Middle East)</Link></li>
                        <li><Link href="/about" className="hover:text-white">APAC (Asia Pacific)</Link></li>
                        <li><Link href="/about" className="hover:text-white">LATAM (South America)</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 text-center text-xs text-slate-600 border-t border-slate-800">
                <p className="mb-4">&copy; {new Date().getFullYear()} NexGen Spares. All rights reserved.</p>
                <div className="flex justify-center gap-4">
                    <span>Switch Region:</span>
                    <Link href="/" locale="en" className="underline hover:text-white">English (Global)</Link>
                    <Link href="/" locale="es" className="underline hover:text-white">Español (LATAM)</Link>
                    <Link href="/" locale="zh" className="underline hover:text-white">中文 (China)</Link>
                    <Link href="/" locale="ar" className="underline hover:text-white">العربية (ME)</Link>
                </div>
            </div>
        </footer>
    );
}
