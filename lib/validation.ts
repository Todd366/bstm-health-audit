import type { CategoryBlock } from "./questions";

export type ValidationResult = { ok: boolean; error?: string };

export function validateAuditPayload(body: any, categories: CategoryBlock[]): ValidationResult {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid payload" };

  const { business, answers } = body;

  if (!business || typeof business !== "object" || Array.isArray(business)) {
    return { ok: false, error: "Invalid business profile" };
  }
  const bEntries = Object.entries(business);
  if (bEntries.length > 20) return { ok: false, error: "Business profile too large" };
  for (const [k, v] of bEntries) {
    if (k.length > 60) return { ok: false, error: "Invalid business field" };
    if (typeof v === "string" && v.length > 200) return { ok: false, error: `Business field too long: ${k}` };
    if (typeof v !== "string" && typeof v !== "number") return { ok: false, error: `Invalid business field: ${k}` };
  }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return { ok: false, error: "Invalid answers" };
  }

  const allowed = new Map<string, Set<number>>();
  categories.forEach((c) =>
    c.questions.forEach((q) => allowed.set(q.id, new Set(q.answers.map((a) => a.points))))
  );

  const aEntries = Object.entries(answers);
  if (aEntries.length === 0) return { ok: false, error: "No answers provided" };
  for (const [id, pts] of aEntries) {
    const set = allowed.get(id);
    if (!set) return { ok: false, error: `Unknown question: ${id}` };
    if (typeof pts !== "number" || !set.has(pts)) return { ok: false, error: `Invalid answer for ${id}` };
  }
  return { ok: true };
}
