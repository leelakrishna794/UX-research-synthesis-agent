"use client";

import { useEffect, useState } from "react";
import ThemeLayout from "@/components/ThemeLayout";
import { History as HistoryIcon, Search, Calendar, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function HistoryPage() {
  const { theme } = useTheme();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/history`);
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error("Failed to fetch history:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/history/${id}`, { method: "DELETE" });
      setHistory(history.filter(item => item.id !== id));
    } catch (e) {
      console.error("Failed to delete item:", e);
    }
  };

  const handleViewReport = (id: string) => {
    window.location.href = `/report/${id}`;
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => 
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeLayout>
      <div className="space-y-8 animate-fade-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <HistoryIcon style={{ color: theme.accent }} size={28} />
              Analysis History
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Review and compare your past UX research syntheses.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-64"
              suppressHydrationWarning={true}
            />
          </div>
        </div>

        {/* History Table/List */}
        <div 
          className="rounded-2xl overflow-hidden border border-white/10 min-h-[400px] flex flex-col"
          style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)" }}
        >
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-3">
              <Loader2 className="animate-spin" size={32} />
              <p>Loading history...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-3 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <HistoryIcon size={24} />
              </div>
              <h3 className="text-white font-medium">No history found</h3>
              <p className="max-w-xs text-sm">Start a new UX analysis on the dashboard to see it listed here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/20 border-b border-white/5">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">URL / Product</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Insights</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate max-w-[200px] md:max-w-xs">
                            {item.url}
                          </span>
                          <span className="text-xs text-slate-500 mt-0.5">Full UX Heuristic Audit</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-400 text-sm whitespace-nowrap">
                          <Calendar size={14} />
                          {item.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-white">{item.data.themes?.length || 0}</span>
                            <span className="text-[10px] text-slate-500 uppercase">Themes</span>
                          </div>
                          <div className="w-px h-6 bg-white/10" />
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-white">{item.data.pain_points?.length || 0}</span>
                            <span className="text-[10px] text-slate-500 uppercase">Issues</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleViewReport(item.id)}
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all pointer-events-auto"
                          >
                            <ExternalLink size={16} />
                          </button>
                          <button 
                            onClick={() => deleteItem(item.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!isLoading && filteredHistory.length > 0 && (
            <div className="bg-black/20 px-6 py-4 flex items-center justify-between border-t border-white/5 text-xs text-slate-500 mt-auto">
              <span>Showing {filteredHistory.length} results</span>
            </div>
          )}
        </div>
      </div>
    </ThemeLayout>
  );
}
