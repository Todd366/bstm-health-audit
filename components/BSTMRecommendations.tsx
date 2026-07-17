"use client";
import { useEffect, useState } from "react";

interface Recommendation {
  priority: number;
  department: number;
  name: string;
  reason: string;
  impact: number;
  estimatedDifficulty: string;
  estimatedTimelineWeeks: number;
}

interface IntelligenceReport {
  businessName: string;
  healthScore: number;
  recommendedDepartments: Recommendation[];
  confidence: number;
  estimatedTimelineWeeks: number;
}

function slugify(name: string) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BSTMRecommendations({ businessName }: { businessName: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "fail">("idle");
  const [report, setReport] = useState<IntelligenceReport | null>(null);

  async function fetchRecommendations() {
    setStatus("loading");
    try {
      const businessId = slugify(businessName);
      const endpoint =
        process.env.NEXT_PUBLIC_ELOS_ENDPOINT?.replace("/receive-audit", "") ||
        "https://bstm-elos.vercel.app/api";
      const res = await fetch(`${endpoint}/intelligence-report?businessId=${businessId}`);
      if (!res.ok) throw new Error("Not ready yet");
      const data = await res.json();
      setReport(data);
      setStatus("ok");
    } catch {
      setStatus("fail");
    }
  }

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading" || status === "idle") {
    return (
      <div className="card rounded-2xl p-6 mb-6 text-center text-gray-400 text-sm">
        Fetching your BSTM department recommendations...
      </div>
    );
  }

  if (status === "fail" || !report) {
    return (
      <div className="card rounded-2xl p-6 mb-6 text-center">
        <p className="text-gray-400 text-sm mb-3">
          Your recommendations are still processing.
        </p>
        <button
          onClick={fetchRecommendations}
          className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="card rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">BSTM Recommended Departments</h3>
        <span className="text-xs text-gray-400">{report.confidence}% confidence</span>
      </div>
      <div className="space-y-3">
        {report.recommendedDepartments.map((r) => (
          <div key={r.department} className="flex items-center justify-between bg-black/20 rounded-xl p-3">
            <div>
              <p className="font-semibold text-sm">
                #{r.priority} — {r.name}
              </p>
              <p className="text-xs text-gray-400">
                {r.estimatedDifficulty} difficulty · ~{r.estimatedTimelineWeeks}wk
              </p>
            </div>
            <span className="text-emerald-400 text-sm">{"★".repeat(r.impact)}</span>
          </div>
        ))}
      </div>
      {report.estimatedTimelineWeeks > 0 && (
        <p className="text-xs text-gray-400 mt-4 text-center">
          Estimated full implementation: ~{report.estimatedTimelineWeeks} weeks
        </p>
      )}
    </div>
  );
}
