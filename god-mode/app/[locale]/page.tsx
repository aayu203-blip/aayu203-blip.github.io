import { Button } from "@/components/ui/button";
import { Link } from '@/i18n/routing';
import { MobileContactBar } from "@/components/mobile-contact-bar"; // Restore Component
import { useTranslations } from 'next-intl'; // Restore Translations
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DEBUG STAGE 2 | Nexgen Spares",
  description: "Testing Translations and Mobile Bar...",
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Restore translations
  const t = await useTranslations('HomePage');

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans p-10">
      <h1 className="text-4xl font-black text-[#005EB8] mb-4">
        DEBUG STAGE 2
      </h1>
      <p className="text-xl mb-8">
        Translations Check: {t('nav.signIn')} (Should say Sign In)
      </p>

      <div className="p-4 border border-slate-200 rounded">
        <Link href="/login" className="text-blue-600 underline">
          Test Link Component
        </Link>
      </div>

      <MobileContactBar />
    </main>
  );
}
