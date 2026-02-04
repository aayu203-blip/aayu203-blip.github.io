"use client";

import { useEffect, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

export function ShippingEstimator() {
    const [location, setLocation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                // Try to get location from our API (which uses IP geo)
                const res = await fetch('/api/geo');
                if (res.ok) {
                    const data = await res.json();
                    if (data.city && data.country) {
                        setLocation(`${data.city}, ${data.country}`);
                    } else if (data.country) {
                        setLocation(data.country);
                    } else {
                        setLocation("US"); // Fallback
                    }
                } else {
                    setLocation("US");
                }
            } catch (error) {
                console.error("Failed to fetch location", error);
                setLocation("US");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocation();
    }, []);

    return (
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <MapPin size={16} className="text-[#005EB8]" />
            <span className="font-medium">
                Shipping to{" "}
                {isLoading ? (
                    <span className="inline-flex items-center ml-1">
                        <Loader2 className="animate-spin h-3 w-3" />
                    </span>
                ) : (
                    <span className="text-slate-900 border-b border-slate-300 border-dashed cursor-help" title="Based on your IP address">
                        {location}
                    </span>
                )}
            </span>
        </div>
    );
}
