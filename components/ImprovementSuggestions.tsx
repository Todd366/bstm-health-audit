const ACTION_MAP: Record<string, string> = {
  "Digital Presence": "Build a simple website or booking page.",
  "Technology Readiness": "Adopt digital payments and a basic management tool.",
  "Customer Experience": "Start collecting feedback and set up a loyalty system.",
  "Marketing & Customer Growth": "Run a consistent marketing campaign and track sources.",
  "Financial Management": "Set up formal bookkeeping and a separate business account.",
  "Operations": "Document your core daily processes.",
  "Growth & Strategy": "Write a simple growth plan for the next 90 days.",
};

export default function ImprovementSuggestions({ weaknesses }: { weaknesses: string[] }) {
  if (!weaknesses.length) return null;
  return (
    <div className="card rounded-2xl p-6 mb-6 animate-slide-up">
      <h3 className="font-bold mb-4">Recommended Actions</h3>
      <div className="space-y-3">
        {weaknesses.map((w, i) => (
          <div key={w} className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <p className="text-gray-300 text-sm">{ACTION_MAP[w] ?? `Improve ${w.toLowerCase()}.`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
