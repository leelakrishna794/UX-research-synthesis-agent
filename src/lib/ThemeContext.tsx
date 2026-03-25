"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface Theme {
  id: string;
  name: string;
  accent: string;
  accentSecondary: string;
  bg1: string;
  bg2: string;
  bg3: string;
  glow: string;
}

export const THEMES: Theme[] = [
  {
    id: "blue",
    name: "Ocean Blue",
    accent: "#3B82F6",
    accentSecondary: "#6366F1",
    bg1: "#0F172A",
    bg2: "#1E293B",
    bg3: "#0D1B2A",
    glow: "rgba(59,130,246,0.15)",
  },
  {
    id: "purple",
    name: "Cosmic Purple",
    accent: "#A855F7",
    accentSecondary: "#EC4899",
    bg1: "#0E0A1A",
    bg2: "#1A1030",
    bg3: "#120D24",
    glow: "rgba(168,85,247,0.15)",
  },
  {
    id: "emerald",
    name: "Matrix Green",
    accent: "#10B981",
    accentSecondary: "#06B6D4",
    bg1: "#071211",
    bg2: "#0D2420",
    bg3: "#081A18",
    glow: "rgba(16,185,129,0.15)",
  },
  {
    id: "rose",
    name: "Sunset Rose",
    accent: "#F43F5E",
    accentSecondary: "#F97316",
    bg1: "#130A10",
    bg2: "#201020",
    bg3: "#180D18",
    glow: "rgba(244,63,94,0.15)",
  },
  {
    id: "amber",
    name: "Golden Hour",
    accent: "#F59E0B",
    accentSecondary: "#EF4444",
    bg1: "#13100A",
    bg2: "#201810",
    bg3: "#180F08",
    glow: "rgba(245,158,11,0.15)",
  },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  customAccent: string;
  setCustomAccent: (c: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES[0],
  setTheme: () => {},
  customAccent: "",
  setCustomAccent: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(THEMES[0]);
  const [customAccent, setCustomAccentState] = useState<string>("");

  // Load from localStorage
  useEffect(() => {
    try {
      const savedId = localStorage.getItem("ux-theme-id");
      const savedCustom = localStorage.getItem("ux-custom-accent");
      if (savedId) {
        const found = THEMES.find((t) => t.id === savedId);
        if (found) setThemeState(found);
      }
      if (savedCustom) setCustomAccentState(savedCustom);
    } catch {}
  }, []);

  // Apply CSS variables whenever theme or customAccent changes
  useEffect(() => {
    const accent = customAccent || theme.accent;
    const root = document.documentElement;
    root.style.setProperty("--accent-color", accent);
    root.style.setProperty("--accent-secondary", theme.accentSecondary);
    root.style.setProperty("--bg-1", theme.bg1);
    root.style.setProperty("--bg-2", theme.bg2);
    root.style.setProperty("--bg-3", theme.bg3);
    root.style.setProperty("--glow-color", theme.glow);
  }, [theme, customAccent]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    setCustomAccentState("");
    try {
      localStorage.setItem("ux-theme-id", t.id);
      localStorage.removeItem("ux-custom-accent");
    } catch {}
  };

  const setCustomAccent = (c: string) => {
    setCustomAccentState(c);
    try {
      localStorage.setItem("ux-custom-accent", c);
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, customAccent, setCustomAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
