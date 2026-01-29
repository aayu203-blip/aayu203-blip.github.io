"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
    className?: string;
}

import posthog from 'posthog-js';

export function DownloadButton({ className }: DownloadButtonProps) {
    const handleDownload = () => {
        posthog.capture('pdf_downloaded', {
            type: 'spec_sheet'
        });
        window.print();
    };

    return (
        <Button
            variant="outline"
            className={cn("w-full border-slate-700 text-slate-400 hover:text-white hover:border-slate-500", className)}
            onClick={handleDownload}
        >
            <Download size={14} className="mr-2" />
            Download Spec Sheet (PDF)
        </Button>
    );
}
