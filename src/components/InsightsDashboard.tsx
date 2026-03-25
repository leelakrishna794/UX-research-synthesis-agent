"use client";

import { useState } from "react";
import { 
  CheckCircle2, AlertCircle, TrendingUp, Lightbulb, 
  ChevronRight, ArrowRight, Download, Share2, FileText, 
  MapPin, Target, Zap, Clock, ExternalLink, RefreshCw, Bookmark, Loader2
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

interface InsightsDashboardProps {
  data: any;
  isLoading?: boolean;
  onReset?: () => void;
}

export default function InsightsDashboard({ data, isLoading, onReset }: InsightsDashboardProps) {
  const { theme } = useTheme();
  const [copying, setCopying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveReport = async () => {
    setIsSaving(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: data.url || "Unknown URL",
          data: data
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error("Failed to save report:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    setCopying(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportNotion = () => {
    // Generate a simple markdown blob for Notion
    const content = `# UX Audit Result for ${data?.url || "Project"}\n\n${JSON.stringify(data, null, 2)}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ux-analysis-${new Date().getTime()}.md`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse px-1">
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 w-48 bg-white/10 rounded-xl" />
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-white/10 rounded-xl" />
            <div className="h-9 w-20 bg-white/10 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/10" />
          ))}
        </div>
        <div className="h-64 bg-white/5 rounded-2xl border border-white/10" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 animate-fade-up px-1 pb-10">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-blue-400 p-2 bg-blue-500/10 rounded-lg" size={38} />
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Analysis Results</h2>
            <p className="text-xs text-slate-500 font-medium tracking-wide">AI-SYNTHESIZED INSIGHTS & ROADMAP</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
           <button 
             onClick={onReset}
             className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
           >
            <RefreshCw size={14} />
            New
          </button>
          <button 
            onClick={handleExportNotion}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
          >
            <FileText size={14} />
            Notion
          </button>
          
          <button 
            onClick={handleSaveReport}
            disabled={isSaving || saved}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={14} /> : saved ? <CheckCircle2 className="text-emerald-400" size={14} /> : <Bookmark size={14} />}
            {saved ? "Saved" : "Save Report"}
          </button>

          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
          >
            <Download size={14} />
            PDF
          </button>
          <button 
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-lg hover:scale-105 active:scale-95`}
            style={{ 
              background: copying ? '#10B981' : `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
              boxShadow: copying ? '0 4px 15px rgba(16,185,129,0.3)' : `0 4px 15px ${theme.glow}`
            }}
          >
            <Share2 size={14} />
            {copying ? "Copied!" : "Share"}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card group p-6 rounded-2xl border border-white/10 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] bg-white/[0.03] backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle size={48} className="text-red-400" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-red-400" size={20} />
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pain Points</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white">{data.pain_points?.length || 0}</span>
            <span className="text-xs text-slate-500 mb-1 font-medium">Identified friction areas</span>
          </div>
        </div>

        <div className="glass-card group p-6 rounded-2xl border border-white/10 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] bg-white/[0.03] backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={48} className="text-amber-400" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-amber-400" size={20} />
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Key Themes</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white">{data.themes?.length || 0}</span>
            <span className="text-xs text-slate-500 mb-1 font-medium">Foundational UX categories</span>
          </div>
        </div>

        <div className="glass-card group p-6 rounded-2xl border border-white/10 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] bg-white/[0.03] backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target size={48} className="text-emerald-400" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-emerald-400" size={20} />
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Actionable Steps</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white">{data.recommendations?.length || 0}</span>
            <span className="text-xs text-slate-500 mb-1 font-medium">Suggested improvements</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* AI Synthesis Section */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="text-amber-400 p-2 bg-amber-400/10 rounded-lg" size={36} />
              <h3 className="text-xl font-bold text-white tracking-tight">AI Synthesis & Insights</h3>
            </div>
            <div className="space-y-4">
              {data.insights?.map((insight: string, idx: number) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform duration-300" 
                       style={{ boxShadow: `0 0 10px ${theme.accent}` }} />
                  <p className="text-slate-300 text-sm leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Journey Mapping Section */}
          <div className="glass-card p-0 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center gap-3">
              <MapPin className="text-indigo-400 p-2 bg-indigo-400/10 rounded-lg" size={36} />
              <h3 className="text-xl font-bold text-white tracking-tight">Journey Mapping</h3>
            </div>
            <div className="p-6 space-y-6">
              {Object.entries(data.journey_mapping || {}).map(([stage, issues]: [string, any]) => (
                <div key={stage} className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">{stage} PHASE</h4>
                  <div className="grid gap-3">
                    {issues.map((issue: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">{issue.issue}</h5>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-400/10 text-red-400 border border-red-400/20 font-bold">
                            {issue.pain_point}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed opacity-80">{issue.description}</p>
                      </div>
                    ))}
                    {issues.length === 0 && (
                      <p className="text-xs text-slate-600 italic px-2">No critical issues identified in this phase.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-8">
          {/* Priority Roadmap */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl relative">
             <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="text-lg font-bold text-white tracking-tight">Priority Roadmap</h3>
            </div>
            
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {data.recommendations?.map((item: any, idx: number) => (
                <div key={idx} className="relative flex items-start gap-6 group">
                  <div 
                    className="absolute left-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white z-10 transition-all group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`, boxShadow: `0 4px 15px ${theme.glow}` }}
                  >
                    {idx + 1}
                  </div>
                  <div className="ml-14 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all w-full group-hover:translate-x-1">
                    <h5 className="font-bold text-white text-sm mb-2">{item.suggestion}</h5>
                    <div className="space-y-1.5">
                       <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Execution:</span>
                        <span className="text-[11px] text-slate-300">{item.implementation_notes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Success Metrics */}
          <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Target className="text-emerald-400 p-2 bg-emerald-400/10 rounded-lg" size={32} />
              <h3 className="text-lg font-bold text-white tracking-tight">Success Metrics</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(data.success_metrics || {}).map(([key, metric]: [string, any]) => (
                <div key={key} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{key}</span>
                  </div>
                  <p className="text-sm font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{metric.KPI}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Goal: {metric.goal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
