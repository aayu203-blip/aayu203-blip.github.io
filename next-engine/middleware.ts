import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'es', 'fr', 'ar', 'ru', 'zh'],

    // Used when no locale matches
    defaultLocale: 'en'
});

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(es|en|fr|ar|ru|zh)/:path*']
};
