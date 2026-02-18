import { Badge } from "@/components/ui/badge";

const OEM_BRANDS = [
    "WABCO", "ZF", "BOSCH", "DANA", "DELPHI",
    "VALEO", "SACHS", "LUK", "MAHLE", "MANN FILTER",
    "KNORR BREMSE", "SCHAEFFLER", "TRW", "FAG", "INA",
    "LEMFORDER", "ELRING KLINGER", "DAYCO", "BILSTEIN",
    "HENGST", "MONROE", "SARDEN", "PAGID", "LUCAS",
    "HYDRECO", "KOLBENSCHMIDT", "FTE"
];

export function OEMPartners() {
    return (
        <section className="py-12 border-b-4 border-border bg-yellow-50 dark:bg-yellow-900/10">
            <div className="container px-4 text-center">
                <h3 className="text-xl font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                    <span className="w-12 h-1 bg-black dark:bg-white inline-block"></span>
                    Authorized OEM & Aftermarket Network
                    <span className="w-12 h-1 bg-black dark:bg-white inline-block"></span>
                </h3>
                <p className="text-sm font-mono text-muted-foreground mb-8">
                    We source directly from the same factories that build your machines.
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                    {OEM_BRANDS.map((brand) => (
                        <Badge
                            key={brand}
                            variant="secondary"
                            className="text-base py-1 px-4 border-2 border-black/10 dark:border-white/10 hover:border-primary hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-default"
                        >
                            {brand}
                        </Badge>
                    ))}
                </div>
            </div>
        </section>
    );
}
