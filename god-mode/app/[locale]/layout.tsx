import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { GodModeProvider } from "@/components/god-mode-provider";
import { SiteFooter } from "@/components/site-footer";
import "../globals.css";

import { AnalyticsProvider } from "@/components/analytics-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexgen Spares | Global Heavy Machinery Parts Supplier",
  description: "Premier supplier of verified spare parts for Volvo, CAT, Komatsu, and Scania. Factory-direct pricing and technical specs for excavators and loaders.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <AnalyticsProvider
            gaId={process.env.NEXT_PUBLIC_GA_ID}
            posthogKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
            posthogHost={process.env.NEXT_PUBLIC_POSTHOG_HOST}
          >
            <GodModeProvider>
              {children}
              <SiteFooter />
            </GodModeProvider>
          </AnalyticsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
