export type ModeType = "DOMESTIC" | "LIMINAL" | "MYTHIC" | "ARCHIVAL" | "COSMIC";

export interface ModeStyles {
  background: string;
  text: string;
  font: string;
  extra?: string;
}

export const MODE_STYLES: Record<ModeType, ModeStyles> = {
  DOMESTIC: {
    background: "bg-[#E8E6E1]",
    text: "text-stone-800",
    font: "font-serif",
  },
  LIMINAL: {
    background: "bg-gray-300",
    text: "text-gray-800",
    font: "font-sans",
    extra: "backdrop-blur-sm",
  },
  MYTHIC: {
    background: "bg-[#2C3E50]",
    text: "text-[#E0C097]",
    font: "font-serif",
  },
  ARCHIVAL: {
    background: "bg-[#F5F5DC]",
    text: "text-stone-900",
    font: "font-mono",
  },
  COSMIC: {
    background: "bg-[#0F172A]",
    text: "text-slate-200",
    font: "font-serif",
    extra: "shadow-[0_0_20px_rgba(148,163,184,0.1)]",
  },
};

export function getModeStyles(mode: ModeType): ModeStyles {
  return MODE_STYLES[mode] || MODE_STYLES.LIMINAL;
}

