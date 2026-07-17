import { NextRequest, NextResponse } from "next/server";
import { calculateScores } from "@/lib/scoring";
import { generateDiagnosis } from "@/lib/diagnosis";
import { buildReport } from "@/lib/report";
import { exportToELOS } from "@/lib/elosExport";
import { validateAuditPayload } from "@/lib/validation";
import { loadQuestions } from "@/lib/questions";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!validateAuditPayload(body)) {
    return NextResponse.json({ error: "Invalid audit payload" }, { status: 400 });
  }

  const categories = loadQuestions();
  const scores = calculateScores(body.answers, categories);
  const diagnosis = generateDiagnosis(scores);
  const report = buildReport(body.business, scores, diagnosis);

  await exportToELOS(report);

  return NextResponse.json({ report });
}
