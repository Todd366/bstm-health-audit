export async function exportToELOS(report: any) {
  const payload = {
    source: "business-health-audit",
    business: report.business,
    scores: report.scores,
    diagnosis: report.diagnosis,
    timestamp: new Date().toISOString(),
  };

  const endpoint = process.env.NEXT_PUBLIC_ELOS_ENDPOINT || "https://bstm-elos.vercel.app/api/receive-audit";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return { sent: true, status: res.status, data };
  } catch (err: any) {
    return { sent: false, error: err.message };
  }
}
