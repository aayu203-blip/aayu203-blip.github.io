"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ViewMode = "procurement" | "engineering";

interface GodModeContextType {
    mode: ViewMode;
    toggleMode: () => void;
    setMode: (mode: ViewMode) => void;
}

const GodModeContext = createContext<GodModeContextType | undefined>(undefined);

export function GodModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<ViewMode>("procurement");

    return (
        <GodModeContext.Provider value={{ mode, toggleMode: () => setMode(prev => prev === "procurement" ? "engineering" : "procurement"), setMode }}>
            <div data-view-mode={mode} className="transition-colors duration-500">
                {children}
            </div>
        </GodModeContext.Provider>
    );
}

export function useGodMode() {
    const context = useContext(GodModeContext);
    if (context === undefined) {
        throw new Error("useGodMode must be used within a GodModeProvider");
    }
    return context;
}
