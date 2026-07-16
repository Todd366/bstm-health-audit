export interface HealthReport {
  business: Record<string, string>;
  healthScore: number;
  categoryScores: Record<string, number>;
  diagnosis: {
    strengths: string[];
    weaknesses: string[];
  };
  generatedAt: string;
}
