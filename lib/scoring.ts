import { CategoryBlock } from "./questions";

export function calculateScores(
  answers: Record<string, number>,
  categories: CategoryBlock[]
) {
  const categoryScores: Record<string, number> = {};

  categories.forEach((cat) => {
    const pts = cat.questions
      .map((q) => answers[q.id])
      .filter((v) => typeof v === "number") as number[];
    categoryScores[cat.category] = pts.length
      ? Math.round(pts.reduce((a, b) => a + b, 0) / pts.length)
      : 0;
  });

  const vals = Object.values(categoryScores);
  const overall = vals.length
    ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
    : 0;

  return { overall, categories: categoryScores };
}

export function ratingLabel(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Healthy";
  if (score >= 50) return "Developing";
  if (score >= 30) return "Needs Attention";
  return "Critical";
}
