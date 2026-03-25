"use client";

import { useState } from "react";
import { Link2, Upload, ChevronDown, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/ThemeContext";

interface InputPanelProps {
  onAnalyze: (url: string) => void;
  onFileUpload?: () => void;
  isLoading?: boolean;
}

export default function InputPanel({ onAnalyze, onFileUpload, isLoading }: InputPanelProps) {
  const [url, setUrl] = useState("");
  const { theme } = useTheme();

  const handleAnalyze = () => {
    if (!url) return;
    onAnalyze(url);
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 shadow-2xl transition-all duration-300 group"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: `0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      {/* Glow blob top-right */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${theme.accent}, transparent)` }}
      />

      <div className="flex flex-col md:flex-row gap-4 relative z-10">
        {/* URL Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Link2 className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner text-sm"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: `1px solid rgba(255,255,255,0.1)`,
              backdropFilter: "blur(8px)",
            }}
            placeholder="Paste URL (YouTube / Website / App link)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={(e) => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 2px ${theme.accent}33`; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            suppressHydrationWarning={true}
          />
        </div>

        <div className="flex gap-3">
          {/* Upload */}
          <Button
            variant="outline"
            className="h-full py-3.5 px-4 rounded-xl flex items-center gap-2 transition-all hover:scale-105 text-slate-300 hover:text-white"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
          >
            <Upload size={17} />
            <span className="hidden sm:inline text-sm">Upload</span>
          </Button>

          {/* Type dropdown */}
          <Button
            variant="outline"
            className="h-full py-3.5 px-4 rounded-xl flex items-center gap-2 transition-all hover:scale-105 text-slate-300 hover:text-white"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
          >
            <span className="text-sm">UX Audit</span>
            <ChevronDown size={17} className="text-slate-500" />
          </Button>

          {/* Analyze */}
          <Button
            onClick={handleAnalyze}
            disabled={isLoading || !url}
            className="h-full py-3.5 px-6 text-white font-semibold rounded-xl flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 text-sm"
            style={{
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
              boxShadow: `0 4px 20px ${theme.glow}, 0 0 0 1px ${theme.accent}44`,
            }}
          >
            {isLoading ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}
            {isLoading ? "Synthesizing..." : "Analyze"}
          </Button>
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500 relative z-10 px-1">
        <p className="font-medium">What do you want to analyze today?</p>
        <div className="flex items-center gap-2 text-xs font-medium bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#10B981" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#10B981" }} />
          </span>
          System Ready
        </div>
      </div>
    </div>
  );
}
