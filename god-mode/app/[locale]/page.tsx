import { Button } from "@/components/ui/button";
import { Link } from '@/i18n/routing'; // Test if this is the crasher?
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DEBUG MODE | Nexgen Spares",
  description: "Debugging...",
};

export const dynamic = 'force-dynamic';

export default function Home() {
  // REMOVED: useTranslations, getFeaturedParts, all components

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans p-10">
      <h1 className="text-4xl font-black text-[#005EB8] mb-4">
        SYSTEM DEBUG MODE
      </h1>
      <p className="text-xl mb-8">
        If you can see this, the server is working.
        The issue is likely in a child component or translation loading.
      </p>

      <div className="p-4 border border-slate-200 rounded">
        <Link href="/login" className="text-blue-600 underline">
          Test Link Component
        </Link>
      </div>
    </main>
  );
}
