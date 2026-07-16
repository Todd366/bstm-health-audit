export async function exportToELOS(report: any) {
  const payload = {
    source: "business-health-audit",
    business: {
      industry: report.business?.industry,
      location: report.business?.location,
    },
    healthScore: report.healthScore,
    weaknesses: report.diagnosis?.weaknesses ?? [],
    timestamp: new Date().toISOString(),
  };
  console.log("ELOS export payload:", payload);
  return payload;
}
