import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% of transactions

    // Session Replay (optional)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    environment: process.env.NODE_ENV,

    // Filter out known non-issues
    beforeSend(event, hint) {
        // Ignore browser extension errors
        if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
            return null;
        }

        // Ignore network errors from ad blockers
        if (event.exception?.values?.[0]?.value?.includes('Failed to fetch')) {
            return null;
        }

        return event;
    },

    // Ignore certain errors
    ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'ChunkLoadError',
    ],
});
