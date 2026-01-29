import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match only internationalized pathnames
    // Exclude API, static assets (files with dots), and sitemap files explicitly
    matcher: ['/((?!api|_next|_vercel|sitemaps|sitemap.xml|sitemap-backup.xml|.*\\..*).*)']
};
