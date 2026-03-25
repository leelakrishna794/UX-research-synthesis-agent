"use client";

import { useState } from "react";
import { Mail, Lock, LogIn, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import Link from "next/link";

export default function LoginPage() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  const handleDemoLogin = () => {
    setEmail("demo@uxagent.ai");
    setPassword("password123");
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden" 
         style={{ background: theme.bg1 }}>
      
      {/* ── Animated Background Orbs (Matching ThemeLayout) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="orb-1 absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 animate-pulse"
          style={{ background: `radial-gradient(circle, ${theme.accent}, transparent 70%)` }}
        />
        <div
          className="orb-2 absolute -bottom-48 -right-48 w-[700px] h-[700px] rounded-full blur-[160px] opacity-20"
          style={{ background: `radial-gradient(circle, ${theme.accentSecondary}, transparent 70%)` }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* ── Login Card ── */}
      <div 
        className="w-full max-w-md relative z-10 animate-fade-up"
        style={{ animationDuration: '0.6s' }}
      >
        <div 
          className="rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden"
          style={{ 
            background: "rgba(255,255,255,0.03)", 
            backdropFilter: "blur(40px)",
            boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`
          }}
        >
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl font-bold text-3xl mb-4"
              style={{ 
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`, 
                boxShadow: `0 0 30px ${theme.glow}` 
              }}
            >
              U
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Access UX Agent</h1>
            <p className="text-slate-400 text-sm mt-2 text-center">Enter your credentials to manage your UX research.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-black/30 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:ring-2 transition-all transition-duration-300"
                  style={{ focusRingColor: `${theme.accent}66` } as any}
                  suppressHydrationWarning={true}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-black/30 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:ring-2 transition-all transition-duration-300"
                  style={{ focusRingColor: `${theme.accent}66` } as any}
                  suppressHydrationWarning={true}
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 mt-4"
              style={{ 
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                boxShadow: `0 8px 25px ${theme.glow}`
              }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="bg-[#0F172A] px-4 text-slate-500" style={{ background: 'transparent' }}>Or Continue With</span>
            </div>
          </div>

          {/* Demo Button */}
          <button 
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white transition-all bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
          >
            <Sparkles size={18} className="text-amber-400" />
            Try Demo Account
          </button>

          {/* Footer links */}
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[11px] font-medium text-slate-500">
            <div className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-500/70" />
              Secure Authentication
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>

        {/* Signup Prompt */}
        <p className="text-center mt-8 text-sm text-slate-500">
          Don't have an account?{" "}
          <a href="#" className="text-white font-bold hover:underline underline-offset-4 decoration-blue-500">
            Join the waitlist
            <ArrowRight size={14} className="inline ml-1" />
          </a>
        </p>
      </div>
    </div>
  );
}
