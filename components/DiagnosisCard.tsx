export default function DiagnosisCard({
  strengths,
  weaknesses,
}: {
  strengths: string[];
  weaknesses: string[];
}) {
  return (
    <div className="card rounded-2xl p-6 mb-6 animate-slide-up">
      <h3 className="font-bold mb-4">Diagnosis</h3>

      <p className="text-xs text-gray-500 font-mono mb-2 tracking-widest">STRENGTHS</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {strengths.length ? strengths.map((s) => (
          <span key={s} className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 text-sm border border-emerald-500/20">
            ✓ {s}
          </span>
        )) : <span className="text-gray-500 text-sm">None yet — plenty of room to build.</span>}
      </div>

      <p className="text-xs text-gray-500 font-mono mb-2 tracking-widest">TO IMPROVE</p>
      <div className="space-y-2">
        {weaknesses.map((w) => (
          <div key={w} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/5 border border-red-500/15 text-sm text-red-300">
            <span>→</span> {w}
          </div>
        ))}
      </div>
    </div>
  );
}
