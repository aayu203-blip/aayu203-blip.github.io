import { Metadata } from 'next';

interface SEOConfig {
    title: string;
    description: string;
    keywords?: string[];
    canonical?: string;
    ogImage?: string;
    jsonLd?: any;
}

export function generateSEOMetadata(config: SEOConfig): Metadata {
    const baseUrl = 'https://nexgenspares.com'; // Update with actual domain
    const canonical = config.canonical ? `${baseUrl}${config.canonical}` : undefined;

    return {
        title: config.title,
        description: config.description,
        keywords: config.keywords?.join(', '),

        // Open Graph
        openGraph: {
            title: config.title,
            description: config.description,
            url: canonical,
            siteName: 'NexGen Spares',
            images: config.ogImage ? [
                {
                    url: config.ogImage,
                    width: 1200,
                    height: 630,
                    alt: config.title,
                }
            ] : [],
            locale: 'en_US',
            type: 'website',
        },

        // Twitter Card
        twitter: {
            card: 'summary_large_image',
            title: config.title,
            description: config.description,
            images: config.ogImage ? [config.ogImage] : [],
        },

        // Canonical
        alternates: {
            canonical: canonical,
        },

        // Robots
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export function generateProductJsonLd(part: any) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${part.brand} ${part.part_number}`,
        description: part.final_html_description || `Buy ${part.brand} ${part.part_number} ${part.product_name}. Genuine OEM & aftermarket parts. Global shipping.`,
        sku: part.part_number,
        mpn: part.part_number,
        brand: {
            '@type': 'Brand',
            name: part.brand,
        },
        offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            priceCurrency: 'INR',
            price: '0', // Update with actual pricing
            seller: {
                '@type': 'Organization',
                name: 'NexGen Spares',
            },
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '127',
        },
    };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `https://nexgenspares.com${item.url}`,
        })),
    };
}

export function generateOrganizationJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'NexGen Spares',
        url: 'https://nexgenspares.com',
        logo: 'https://nexgenspares.com/logo.png',
        description: 'Leading supplier of heavy machinery parts. Volvo, Scania, Caterpillar, Komatsu, and more. Global shipping.',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-8779956425',
            contactType: 'Sales',
            availableLanguage: ['en', 'hi'],
        },
        sameAs: [
            'https://www.facebook.com/nexgenspares',
            'https://www.linkedin.com/company/nexgenspares',
        ],
    };
}
