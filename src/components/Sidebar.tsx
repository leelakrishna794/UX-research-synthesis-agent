"use client";

import { LayoutDashboard, PlusCircle, Settings, History, Bookmark, Palette, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme, THEMES } from "@/lib/ThemeContext";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: <LayoutDashboard size={17} />, label: "Dashboard" },
    { href: "/", icon: <PlusCircle size={17} />, label: "New Analysis", isNew: true },
    { href: "/history", icon: <History size={17} />, label: "History" },
    { href: "/saved", icon: <Bookmark size={17} />, label: "Saved Reports" },
  ];

  return (
    <aside
      className="w-64 hidden md:flex flex-col p-4 relative overflow-hidden shrink-0 h-screen sticky top-0"
      style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(24px)", borderRight: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Accent glow orb in sidebar */}
      <div
        className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: `radial-gradient(circle, ${theme.accent}, transparent)` }}
      />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-2 mb-8 mt-2 relative z-10 hover:opacity-80 transition-opacity">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg font-bold text-lg"
          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`, boxShadow: `0 0 20px ${theme.glow}` }}
        >
          U
        </div>
        <span className="font-bold text-lg text-white tracking-tight">UX Agent</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1 relative z-10">
        {navItems.map(({ href, icon, label, isNew }) => {
          const isActive = isNew ? false : pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              style={isActive ? { background: `linear-gradient(135deg, ${theme.accent}22, ${theme.accentSecondary}22)`, border: `1px solid ${theme.accent}33` } : {}}
            >
              <span style={isActive ? { color: theme.accent } : {}}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 px-1">
        <ThemeToggle />
      </div>

      {/* Theme Picker */}
      <div className="relative z-10 mt-4 mb-2 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Palette size={14} style={{ color: theme.accent }} />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Theme</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              title={t.name}
              onClick={() => setTheme(t)}
              className="w-6 h-6 rounded-full transition-all duration-200 hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${t.accent}, ${t.accentSecondary})`,
                outline: theme.id === t.id ? `2px solid white` : "2px solid transparent",
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">{theme.name}</p>
      </div>

      {/* User */}
      <div className="relative z-10 pt-3 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})` }}
          >
            K
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-white truncate">Krishna 👋</span>
            <span className="text-[10px] text-slate-500 truncate uppercase font-bold tracking-wider">Pro Plan</span>
          </div>
          <Link 
            href="/login" 
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogIn size={14} className="rotate-180" />
          </Link>
        </div>
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl transition-all duration-200 text-sm font-medium ${
            pathname === "/settings" 
              ? "text-white shadow-md" 
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
          style={pathname === "/settings" ? { background: `linear-gradient(135deg, ${theme.accent}22, ${theme.accentSecondary}22)`, border: `1px solid ${theme.accent}33` } : {}}
        >
          <Settings size={17} style={pathname === "/settings" ? { color: theme.accent } : {}} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
