export default function CategoryScore({ name, score }: { name: string; score: number }) {
  const color = score >= 70 ? "bg-emerald-500" : score >= 30 ? "bg-amber-400" : "bg-red-500";
  const textColor = score >= 70 ? "text-emerald-400" : score >= 30 ? "text-amber-300" : "text-red-400";
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-300">{name}</span>
        <span className={`font-mono font-semibold ${textColor}`}>{score}</span>
      </div>
      <div className="w-full bg-gray-800/60 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
