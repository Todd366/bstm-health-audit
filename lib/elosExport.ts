export async function exportToELOS(report: any) {
  const payload = {
    source: "business-health-audit",
    business: {
      industry: report.business?.industry ?? "",
      location: report.business?.location ?? "",
    },
    healthScore: report.healthScore,
    categoryScores: report.categoryScores ?? {},
    weaknesses: report.diagnosis?.weaknesses ?? [],
    timestamp: new Date().toISOString(),
  };

  const endpoint = process.env.ELOS_API_URL;
  if (!endpoint) {
    console.warn("ELOS_API_URL not set — skipping export");
    return { sent: false, reason: "no endpoint configured", payload };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    return { sent: res.ok, status: res.status, data, payload };
  } catch (err) {
    console.error("ELOS export failed:", err);
    return { sent: false, error: String(err), payload };
  }
}
