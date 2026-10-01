import type { SupabaseClient } from "@supabase/supabase-js";

export async function saveReport(
  supabase: SupabaseClient,
  userId: string,
  report: any,
  answers: Record<string, number>
): Promise<string> {
  const { data, error } = await supabase
    .from("audit_reports")
    .insert({
      user_id: userId,
      business: report.business,
      health_score: report.healthScore,
      category_scores: report.categoryScores,
      diagnosis: report.diagnosis,
      answers,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function markElosStatus(
  supabase: SupabaseClient,
  reportId: string,
  sent: boolean,
  error?: string
) {
  const { error: e } = await supabase
    .from("audit_reports")
    .update({
      elos_status: sent ? "sent" : "failed",
      elos_error: sent ? null : (error ?? "unknown").slice(0, 300),
    })
    .eq("id", reportId);
  if (e) console.error("[storage] markElosStatus failed:", e.message);
}
