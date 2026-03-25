"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ThemeLayout from "@/components/ThemeLayout";
import InsightsDashboard from "@/components/InsightsDashboard";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/report/${id}`);
        if (!res.ok) throw new Error("Report not found");
        const json = await res.json();
        // The endpoint returns { id, url, data, ... }
        setData(json.data || json); 
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchReport();
  }, [id]);

  return (
    <ThemeLayout>
      <div className="space-y-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors group mb-2"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Reports
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500 gap-4">
            <Loader2 className="animate-spin" size={40} />
            <p className="text-lg font-medium">Fetching deep analysis...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-6xl mb-6">🏜️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Report Not Found</h2>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              The report you're looking for might have been deleted or never existed.
            </p>
            <button 
              onClick={() => router.push("/saved")}
              className="px-6 py-3 rounded-2xl font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})` }}
            >
              Browse Saved Reports
            </button>
          </div>
        ) : (
          <InsightsDashboard data={data} isLoading={false} onReset={() => router.push("/")} />
        )}
      </div>
    </ThemeLayout>
  );
}
