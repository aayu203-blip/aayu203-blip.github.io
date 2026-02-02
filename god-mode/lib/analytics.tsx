'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

// Google Analytics tracking functions
declare global {
    interface Window {
        gtag?: (
            command: string,
            targetId: string,
            config?: Record<string, any>
        ) => void
    }
}

export function AnalyticsProvider() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'page_view', {
                page_path: pathname,
                page_search: searchParams.toString(),
                page_title: document.title,
            })
        }
    }, [pathname, searchParams])

    return null
}

// Track WhatsApp button clicks
export function trackWhatsAppClick(partNumber: string, source: string = 'product_page') {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'whatsapp_click', {
            event_category: 'engagement',
            event_label: partNumber,
            source: source,
        })
    }
}

// Track search queries
export function trackSearch(query: string, resultCount: number) {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'search', {
            search_term: query,
            result_count: resultCount,
            event_category: 'search',
        })
    }
}

// Track part views
export function trackPartView(partNumber: string, brand: string, category: string) {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'view_item', {
            event_category: 'product',
            event_label: partNumber,
            brand: brand,
            category: category,
        })
    }
}

// Track related parts clicks
export function trackRelatedPartClick(fromPart: string, toPart: string) {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'related_part_click', {
            event_category: 'internal_linking',
            event_label: `${fromPart} → ${toPart}`,
        })
    }
}

// Track download button clicks
export function trackDownload(partNumber: string, downloadType: string = 'pdf') {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'download', {
            event_category: 'engagement',
            event_label: partNumber,
            download_type: downloadType,
        })
    }
}

// Track blog post reads
export function trackBlogRead(slug: string, readTime: number) {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'blog_read', {
            event_category: 'content',
            event_label: slug,
            read_time: readTime,
        })
    }
}
