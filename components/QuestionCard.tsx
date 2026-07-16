export default function QuestionCard({
  question,
  selected,
  onSelect,
}: {
  question: { id: string; question: string; answers: { value: string; label: string; points: number }[] };
  selected?: string;
  onSelect: (id: string, points: number) => void;
}) {
  return (
    <div className="card rounded-2xl p-5 mb-4 animate-slide-up">
      <p className="font-medium mb-4">{question.question}</p>
      <div className="grid gap-2">
        {question.answers.map((a) => {
          const isSelected = selected === a.value;
          return (
            <button
              key={a.value}
              type="button"
              onClick={() => onSelect(question.id, a.points)}
              className={`text-left px-4 py-3 rounded-xl border transition-all ${
                isSelected
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-white/10 bg-white/[0.02] text-gray-300 hover:border-white/20"
              }`}
            >
              <span className="flex items-center justify-between">
                {a.label}
                {isSelected && <span className="text-emerald-400">✓</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
