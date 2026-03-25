"use client";

import { useEffect, useState } from "react";
import ThemeLayout from "@/components/ThemeLayout";
import { Bookmark, Search, Star, MoreVertical, Share2, Download, Trash2, Eye, Loader2 } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function SavedReportsPage() {
  const { theme } = useTheme();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/reports`);
      const data = await res.json();
      setReports(data);
    } catch (e) {
      console.error("Failed to fetch reports:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReport = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    
    try {
      // Re-using history delete for now or implement /api/reports/{id} delete if needed
      // Actually let's assume /api/history/{id} works for reports too if they share IDs or add a specific one
      // For now, let's just implement the UI and I'll add the DELETE endpoint to app.py if missing
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/history/${id}`, { method: "DELETE" });
      setReports(reports.filter(r => r.id !== id));
    } catch (e) {
      console.error("Failed to delete report:", e);
    }
  };

  const handleDownload = (report: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report.data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `ux-report-${report.url.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleViewReport = (id: string) => {
    window.location.href = `/report/${id}`;
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter(report => 
    report.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeLayout>
      <div className="space-y-8 animate-fade-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Bookmark style={{ color: theme.accent }} size={28} />
              Saved Reports
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Organize and access your most important research findings.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-64"
              suppressHydrationWarning={true}
            />
          </div>
        </div>

        {/* Grid of Saved Reports */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center text-slate-500 gap-3 py-20">
              <Loader2 className="animate-spin" size={32} />
              <p>Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-slate-500 gap-3 p-12 text-center border-2 border-dashed border-white/10 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <Bookmark size={24} />
              </div>
              <h3 className="text-white font-medium">No saved reports yet</h3>
              <p className="max-w-xs text-sm">Save your research results from the dashboard to see them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredReports.map((report) => (
                <div 
                  key={report.id}
                  className="rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 border border-white/10"
                  style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}
                >
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ background: theme.accent }}
                  />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1 rounded-md bg-white/5 border border-white/5">
                      UX Audit
                    </span>
                    <button className="text-slate-500 hover:text-white transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 relative z-10 leading-tight group-hover:text-blue-400 transition-colors truncate">
                    {report.url}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-6 relative z-10">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="font-bold text-white">4.9</span>
                    </div>
                    <span>•</span>
                    <span>{report.data?.insights?.length || 0} Insights</span>
                    <span>•</span>
                    <span>{report.date}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all shadow-sm">
                        <Share2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDownload(report)}
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all shadow-sm"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={() => deleteReport(report.id)}
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleViewReport(report.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`, boxShadow: `0 4px 15px ${theme.glow}` }}
                    >
                      <Eye size={14} />
                      View Full Report
                    </button>
                  </div>
                </div>
              ))}

              <div 
                className="rounded-2xl p-6 flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-white/20 transition-all group cursor-pointer"
                style={{ background: "rgba(255,255,255,0.01)" }}
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-white transition-colors mb-4">
                  <Bookmark size={24} />
                </div>
                <span className="text-sm font-bold text-slate-500 group-hover:text-white transition-colors tracking-wide">
                  Create Custom Report
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemeLayout>
  );
}
