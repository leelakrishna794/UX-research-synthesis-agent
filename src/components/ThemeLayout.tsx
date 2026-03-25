"use client";

import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/lib/ThemeContext";

export default function ThemeLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div
      className="flex min-h-screen font-sans text-slate-200 selection:bg-blue-500/30 relative overflow-hidden"
      style={{ background: theme.bg1 }}
    >
      {/* ── Animated Background Orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="orb-1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-25"
          style={{ background: `radial-gradient(circle, ${theme.accent}, transparent 70%)` }}
        />
        <div
          className="orb-2 absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20"
          style={{ background: `radial-gradient(circle, ${theme.accentSecondary}, transparent 70%)` }}
        />
        <div
          className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10"
          style={{ background: `radial-gradient(circle, ${theme.accent}, ${theme.accentSecondary}, transparent 70%)` }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <Sidebar />

      <main className="relative z-10 flex-1 flex flex-col overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full px-6 py-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
