export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs text-gray-500 mb-3 font-mono">
        <span>STEP {Math.min(current + 1, total)} OF {total}</span>
        <span className="text-emerald-400">{pct}%</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i < current ? "bg-emerald-500" : i === current ? "bg-emerald-500/50 animate-pulse" : "bg-gray-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
