// Geo-IP detection API route
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // In production, use Vercel's geo headers (e.g., x-vercel-ip-city)
    // For now, robustly simulate a key market to demonstrate the feature

    // Attempt to read real headers if available (Vercel)
    const city = request.headers.get('x-vercel-ip-city') || 'Mumbai';
    const country = request.headers.get('x-vercel-ip-country') || 'IN'; // India
    const region = request.headers.get('x-vercel-ip-country-region') || 'MH'; // Maharashtra

    const geoData = {
        city: city,
        country: country === 'IN' ? 'India' : country,
        countryCode: country,
        region: region,
        isSimulated: !request.headers.get('x-vercel-ip-city')
    };

    return NextResponse.json(geoData);
}
