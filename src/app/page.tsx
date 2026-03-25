"use client";

import { useState } from "react";
import InputPanel from "@/components/InputPanel";
import InsightsDashboard from "@/components/InsightsDashboard";
import Footer from "@/components/Footer";
import ThemeLayout from "@/components/ThemeLayout";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setData(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = () => {
    alert("File upload logic coming soon / simulated for hackathon!");
  };

  const handleReset = () => {
    setData(null);
    setIsLoading(false);
  };

  return (
    <ThemeLayout>
      <div className="space-y-8 flex flex-col min-h-full">
        <InputPanel onAnalyze={handleAnalyze} onFileUpload={handleFileUpload} isLoading={isLoading} />

        {data || isLoading ? (
          <InsightsDashboard data={data} isLoading={isLoading} onReset={handleReset} />
        ) : (
          <div
            className="text-slate-400 py-20 text-center rounded-2xl transition-all duration-300 flex-1 flex flex-col justify-center"
            style={{
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(16px)",
              border: "1px dashed rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex justify-center mb-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                🤖
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Ready for synthesis</h3>
            <p className="text-sm max-w-sm mx-auto leading-relaxed">
              Paste a URL or upload a file above to generate UX insights, journey mapping, and prioritized roadmaps.
            </p>
            <div className="flex items-center justify-center gap-6 mt-8">
              {["YouTube Videos", "E-commerce Pages", "Web Apps", "PDF Reports"].map((item) => (
                <div
                  key={item}
                  className="text-xs px-3 py-1.5 rounded-full text-slate-400"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </ThemeLayout>
  );
}
