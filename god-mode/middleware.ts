import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 30 // 30 requests per minute

function getRateLimitKey(req: NextRequest): string {
    // Use IP address from headers
    const forwarded = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const ip = forwarded ? forwarded.split(',')[0] : (realIp || 'unknown')
    return `${ip}-${req.nextUrl.pathname}`
}

function checkRateLimit(key: string): boolean {
    const now = Date.now()
    const record = rateLimit.get(key)

    if (!record || now > record.resetTime) {
        // Reset or create new record
        rateLimit.set(key, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW,
        })
        return true
    }

    if (record.count >= MAX_REQUESTS) {
        return false
    }

    record.count++
    return true
}

export default async function middleware(request: NextRequest) {
    // 1. Rate Limit API Routes First
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const key = getRateLimitKey(request)

        if (!checkRateLimit(key)) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            )
        }
        // API routes don't use next-intl middleware, just return next()
        // OR we can let them pass if we want localization in API, but usually not needed for pure data endpoints unless we access cookies.
        return NextResponse.next();
    }

    // 2. Handle Internationalization for all other routes
    const handleI18n = createMiddleware(routing);
    const response = handleI18n(request);

    return response;
}

export const config = {
    // Match only internationalized pathnames
    // Skip all internal paths (_next, api, assets, favicon, etc.)
    matcher: ['/((?!api|_next|.*\\..*).*)', '/']
};
