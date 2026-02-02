import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

export function middleware(request: NextRequest) {
    // Only rate limit API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const key = getRateLimitKey(request)

        if (!checkRateLimit(key)) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            )
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/api/:path*',
}
