export interface AuditAnswer {
  category: string;
  value: string;
  points: number;
}

export interface AuditSubmission {
  business: Record<string, string>;
  answers: Record<string, number>;
}
