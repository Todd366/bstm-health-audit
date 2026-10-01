import { NextRequest, NextResponse } from "next/server";
import { calculateScores } from "@/lib/scoring";
import { generateDiagnosis } from "@/lib/diagnosis";
import { buildReport } from "@/lib/report";
import { exportToELOS } from "@/lib/elosExport";
import { validateAuditPayload } from "@/lib/validation";
import { loadQuestions } from "@/lib/questions";
import { saveReport, markElosStatus } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const categories = loadQuestions();
  const check = validateAuditPayload(body, categories);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const scores = calculateScores(body.answers, categories);
  const diagnosis = generateDiagnosis(scores);
  const report = buildReport(body.business, scores, diagnosis);

  // Accounts are off unless AUTH_ENABLED=true in .env.local
  const authEnabled = process.env.AUTH_ENABLED === "true";
  const supabase = authEnabled ? createClient() : null;
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  let reportId: string | null = null;
  if (supabase && user) {
    try {
      reportId = await saveReport(supabase, user.id, report, body.answers);
    } catch (err: any) {
      console.error("[submit-audit] persist failed:", err?.message);
    }
  }

  const elos =
    body.exportToElos === false
      ? { sent: false, error: "disabled by user setting" }
      : await exportToELOS(report);
  if (!elos.sent && body.exportToElos !== false) console.error("[submit-audit] ELOS export failed:", elos.error);
  if (supabase && reportId) await markElosStatus(supabase, reportId, elos.sent, elos.error);

  return NextResponse.json({ report, saved: !!reportId, elosSent: elos.sent });
}
