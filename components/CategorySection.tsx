"use client";
import { useState } from "react";
import QuestionCard from "./QuestionCard";
import { CategoryBlock } from "@/lib/questions";

export default function CategorySection({
  category,
  answers,
  onAnswer,
  onNext,
  isLast,
}: {
  category: CategoryBlock;
  answers: Record<string, number>;
  onAnswer: (questionId: string, points: number) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

  const allAnswered = category.questions.every((q) => answers[q.id] !== undefined);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{category.category}</h2>
      {category.questions.map((q) => (
        <QuestionCard
          key={q.id}
          question={q}
          selected={selectedValues[q.id]}
          onSelect={(id, points) => {
            const answer = q.answers.find((a) => a.points === points);
            setSelectedValues((prev) => ({ ...prev, [id]: answer?.value ?? "" }));
            onAnswer(id, points);
          }}
        />
      ))}
      <button
        onClick={onNext}
        disabled={!allAnswered}
        className="btn-primary w-full py-3 rounded-xl font-semibold text-white mt-2"
      >
        {isLast ? "Finish Audit" : "Next Category"}
      </button>
    </div>
  );
}
