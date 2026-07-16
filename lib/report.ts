export function buildReport(business: any, scores: any, diagnosis: any) {
  return {
    business,
    healthScore: scores.overall,
    categoryScores: scores.categories,
    diagnosis,
    generatedAt: new Date().toISOString(),
  };
}
