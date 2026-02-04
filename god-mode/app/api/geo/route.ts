// Geo-IP detection API route
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // In production, use Vercel's geo headers (e.g., x-vercel-ip-city)

    // Attempt to read real headers if available (Vercel)
    const city = request.headers.get('x-vercel-ip-city');
    const country = request.headers.get('x-vercel-ip-country');
    const region = request.headers.get('x-vercel-ip-country-region');

    // Default to US/CA if not found (simulating North American user for testing if no headers)
    const geoData = {
        city: city || 'San Francisco',
        country: country || 'US',
        countryCode: country || 'US',
        region: region || 'CA',
        isSimulated: !city
    };

    return NextResponse.json(geoData);
}
