"use client";

import ThemeLayout from "@/components/ThemeLayout";
import { Settings, Palette, Key, Shield, Bell, HelpCircle, Save, CheckCircle2 } from "lucide-react";
import { useTheme, THEMES } from "@/lib/ThemeContext";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { theme, setTheme, customAccent, setCustomAccent } = useTheme();
  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Load API key from local storage if available
  useEffect(() => {
    const savedKey = localStorage.getItem("ux-openai-api-key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("ux-openai-api-key", apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <ThemeLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings style={{ color: theme.accent }} size={28} />
            Settings
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Configure your workspace preferences and API connections.</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Appearance Section */}
          <div 
            className="rounded-2xl p-6 border border-white/10"
            style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Palette className="text-blue-400" size={20} />
              <h2 className="text-lg font-bold text-white tracking-wide">Appearance & Theme</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">Select Preset Theme</label>
                <div className="grid grid-cols-5 gap-3">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t)}
                      className={`w-full aspect-square rounded-xl transition-all duration-300 hover:scale-110 flex items-center justify-center`}
                      style={{ 
                        background: `linear-gradient(135deg, ${t.accent}, ${t.accentSecondary})`,
                        border: theme.id === t.id ? '2px solid white' : '2px solid transparent',
                        boxShadow: theme.id === t.id ? `0 0 15px ${t.glow}` : 'none'
                      }}
                    >
                      {theme.id === t.id && <CheckCircle2 size={16} className="text-white" />}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-3 italic">Selected: {theme.name}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">Custom Accent Color</label>
                <div className="flex gap-4">
                  <input 
                    type="color" 
                    value={customAccent || theme.accent}
                    onChange={(e) => setCustomAccent(e.target.value)}
                    className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
                    suppressHydrationWarning={true}
                  />
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={customAccent || theme.accent}
                      onChange={(e) => setCustomAccent(e.target.value)}
                      className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none w-full font-mono"
                      suppressHydrationWarning={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* API Keys Section */}
          <div 
            className="rounded-2xl p-6 border border-white/10"
            style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Key className="text-emerald-400" size={20} />
              <h2 className="text-lg font-bold text-white tracking-wide">API Connections</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">OpenAI / OpenRouter API Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="password" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full"
                    suppressHydrationWarning={true}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                  Your key is stored locally in your browser's persistent storage. It will be used for all UX synthesis requests.
                </p>
              </div>
            </div>
          </div>

          {/* Other settings placeholders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6 border border-white/10 opacity-60 pointer-events-none" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-slate-400" size={18} />
                <h3 className="text-sm font-bold text-white tracking-wide">Privacy & Data</h3>
              </div>
              <p className="text-xs text-slate-500">Manage data retention and anonymous logging settings.</p>
            </div>
            <div className="rounded-2xl p-6 border border-white/10 opacity-60 pointer-events-none" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center gap-3 mb-4">
                <Bell className="text-slate-400" size={18} />
                <h3 className="text-sm font-bold text-white tracking-wide">Notifications</h3>
              </div>
              <p className="text-xs text-slate-500">Configure desktop and email alerts for long analyses.</p>
            </div>
          </div>
        </div>

        {/* Save Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <HelpCircle size={16} />
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </div>
          
          <button 
            onClick={handleSaveSettings}
            disabled={isSaved}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-75"
            style={{ 
              background: isSaved ? '#10B981' : `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
              boxShadow: isSaved ? '0 4px 15px rgba(16,185,129,0.3)' : `0 4px 15px ${theme.glow}` 
            }}
          >
            {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {isSaved ? "Saved Successfully!" : "Save Changes"}
          </button>
        </div>
      </div>
    </ThemeLayout>
  );
}
