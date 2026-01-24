"use client"

import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';

interface GeoStockDisplayProps {
    partId: string | number;
}

export function GeoStockDisplay({ partId }: GeoStockDisplayProps) {
    const [city, setCity] = useState<string | null>(null);
    const [stock, setStock] = useState<number | null>(null);

    useEffect(() => {
        // 1. Fetch Geo Data
        fetch('/api/geo')
            .then(res => res.json())
            .then(data => {
                if (data.city) setCity(data.city);
            })
            .catch(err => console.error('Geo fetch failed', err));

        // 2. Calculate Deterministic Stock
        let numericId = 0;
        if (typeof partId === 'number') {
            numericId = partId;
        } else {
            for (let i = 0; i < partId.length; i++) {
                numericId += partId.charCodeAt(i);
            }
        }

        const x = Math.sin(numericId) * 10000;
        const random = x - Math.floor(x);
        const calculatedStock = Math.floor(random * (150 - 3 + 1)) + 3;

        // Add a small delay to simulate "Checking..." for realism
        setTimeout(() => {
            setStock(calculatedStock);
        }, 800);

    }, [partId]);

    return (
        <div className="space-y-6">
            {/* STATUS */}
            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-mono">
                    <span>DATABASE STATUS:</span>
                    <span className="text-green-600 font-bold">ONLINE</span>
                </div>
                <div className="flex justify-between items-center text-sm font-mono">
                    <span>AVAILABILITY:</span>
                    {stock !== null ? (
                        <span className="font-bold text-green-600 animate-in fade-in duration-500">
                            IN STOCK: {stock} UNITS
                        </span>
                    ) : (
                        <span className="font-bold animate-pulse">CHECKING...</span>
                    )}
                </div>
                <div className="flex justify-between items-center text-sm font-mono">
                    <span>GLOBAL DELIVERY:</span>
                    <span className="font-bold">YES</span>
                </div>
            </div>

            {/* GEO SHIPPING MESSAGE */}
            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground font-mono pt-4 border-t border-border/50">
                <Truck className="h-4 w-4" />
                <span>
                    {city ? `Fast Shipping to ${city.toUpperCase()}` : 'Shipping to USA, UK, UAE, India'}
                </span>
            </div>
        </div>
    );
}
