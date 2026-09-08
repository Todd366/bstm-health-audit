export async function exportToELOS(report: any) {
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

  const endpoint = process.env.NEXT_PUBLIC_ELOS_ENDPOINT || "https://bstm-elos.vercel.app/api/receive-audit";

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const elosKey = process.env.ELOS_INGEST_KEY;
  if (elosKey) headers["x-elos-api-key"] = elosKey;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return { sent: true, status: res.status, data };
  } catch (err: any) {
    return { sent: false, error: err.message };
  }
}
