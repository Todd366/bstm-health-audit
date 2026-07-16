export function generateDiagnosis(scores: { overall: number; categories: Record<string, number> }) {
  const weaknesses = Object.entries(scores.categories)
    .filter(([, v]) => v < 50)
    .map(([k]) => k);
  const strengths = Object.entries(scores.categories)
    .filter(([, v]) => v >= 70)
    .map(([k]) => k);
  return { strengths, weaknesses };
}
