"use client";
import { useEffect, useState } from "react";

export default function ScoreCard({ score }: { score: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame: number;
    const duration = 900;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * score));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const status =
    score >= 85 ? "Excellent" :
    score >= 70 ? "Healthy" :
    score >= 50 ? "Developing" :
    score >= 30 ? "Needs Attention" : "Critical";

  const glow = score >= 70 ? "glow-emerald" : score >= 50 ? "glow-amber" : "glow-red";
  const ringColor = score >= 70 ? "#10b981" : score >= 50 ? "#f5c542" : "#ef4444";
  const circumference = 314;
  const offset = circumference - (circumference * display) / 100;

  return (
    <div className={`card rounded-2xl p-8 mb-6 text-center animate-pop ${glow}`}>
      <p className="text-xs text-gray-500 font-mono mb-4 tracking-widest">HEALTH SCORE</p>
      <div className="relative w-40 h-40 mx-auto mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#1f2937" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="50" fill="none"
            stroke={ringColor} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-gradient">{display}</span>
          <span className="text-xs text-gray-500">/100</span>
        </div>
      </div>
      <p className="text-gray-300 font-medium">{status}</p>
    </div>
  );
}
