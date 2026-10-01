export async function exportToELOS(
  report: any
): Promise<{ sent: boolean; status?: number; error?: string }> {
  const payload = {
    source: "business-health-audit",
    business: report.business,
    scores: {
      overall: report.healthScore,
      categories: report.categoryScores,
    },
    diagnosis: report.diagnosis,
    timestamp: new Date().toISOString(),
  };

  const endpoint =
    process.env.ELOS_ENDPOINT ||
    process.env.NEXT_PUBLIC_ELOS_ENDPOINT ||
    "https://bstm-elos.vercel.app/api/receive-audit";

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.ELOS_INGEST_KEY) headers["x-elos-api-key"] = process.env.ELOS_INGEST_KEY;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) return { sent: false, status: res.status, error: `ELOS responded ${res.status}` };
    return { sent: true, status: res.status };
  } catch (err: any) {
    return { sent: false, error: err?.name === "AbortError" ? "ELOS timeout" : err?.message || "unknown" };
  } finally {
    clearTimeout(timer);
  }
}
