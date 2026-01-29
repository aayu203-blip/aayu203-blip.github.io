'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import posthog from 'posthog-js';

export function AnalyticsProvider({
    children,
    gaId,
    posthogKey,
    posthogHost
}: {
    children: React.ReactNode;
    gaId?: string;
    posthogKey?: string;
    posthogHost?: string;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 1. Initialize PostHog
    useEffect(() => {
        if (posthogKey && posthogHost) {
            posthog.init(posthogKey, {
                api_host: posthogHost,
                person_profiles: 'identified_only', // or 'always' depending on privacy needs
                capture_pageview: false
                // We handle pageviews manually for Next.js routing
            });
        }
    }, [posthogKey, posthogHost]);

    // 2. Track Page Views (GA4 + PostHog) on Route Change
    useEffect(() => {
        if (pathname && posthogKey) {
            let url = window.origin + pathname;
            if (searchParams && searchParams.toString()) {
                url = url + `?${searchParams.toString()}`;
            }

            // Track PostHog
            posthog.capture('$pageview', {
                '$current_url': url,
            });
        }
    }, [pathname, searchParams, posthogKey]);

    return (
        <>
            {/* GOOGLE ANALYTICS 4 */}
            {gaId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gaId}', {
                            page_path: window.location.pathname,
                        });
                        `}
                    </Script>
                </>
            )}

            {/* CHILDREN (The App) */}
            {children}
        </>
    );
}
