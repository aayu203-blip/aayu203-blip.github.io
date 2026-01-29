"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react"; // Assuming lucide-react is available
import { generateWhatsAppLink } from "@/lib/whatsapp";
import posthog from 'posthog-js';

interface WhatsAppButtonProps {
    partNumber?: string;
    brand?: string;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    label?: string;
}

export function WhatsAppButton({
    partNumber,
    brand,
    className,
    variant = "default", // Default to the orange style if passed or default shadcn
    size = "default",
    label = "Request Quote"
}: WhatsAppButtonProps) {

    const handleClick = () => {
        // Track the lead
        posthog.capture('lead_generated', {
            part_number: partNumber,
            brand: brand,
            location: 'product_page'
        });

        const link = generateWhatsAppLink({
            source: 'product_page',
            partNumber,
            brand,
        });
        window.open(link, '_blank');
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleClick}
        >
            <MessageSquare className="mr-2 h-4 w-4" />
            {label}
        </Button>
    );
}
