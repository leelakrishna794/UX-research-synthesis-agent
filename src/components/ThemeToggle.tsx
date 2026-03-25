"use client";

import { Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/ThemeContext";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const { theme } = useTheme();

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden"
      style={{ 
        background: "rgba(255,255,255,0.04)", 
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)"
      }}
    >
      <div className="flex items-center gap-3 relative z-10 transition-colors duration-300 text-slate-400 group-hover:text-white">
        {isDark ? (
          <Moon size={17} className="transition-transform duration-500 rotate-0" />
        ) : (
          <Sun size={17} className="transition-transform duration-500 rotate-0 text-amber-400" />
        )}
        <span>{isDark ? "Dark Mode" : "Light Mode"}</span>
      </div>
      
      <div 
        className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 relative z-10 ${isDark ? 'bg-slate-700' : 'bg-blue-500'}`}
      >
        <div 
          className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 transform ${isDark ? 'translate-x-0' : 'translate-x-5'}`}
        />
      </div>

      {/* Hover effect background */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(90deg, ${theme.accent}11, transparent)` }}
      />
    </button>
  );
}
