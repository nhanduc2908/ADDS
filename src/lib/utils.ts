import type { Assessment, AssessmentResult, SecurityCriterion, SecurityDomain } from "./types";

export function calculateOverallScore(results: AssessmentResult[]): number {
  if (results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + r.score, 0);
  return Math.round((total / (results.length * 5)) * 100);
}

export function calculateDomainScores(
  results: AssessmentResult[],
  criteria: SecurityCriterion[],
  domains: SecurityDomain[]
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const domain of domains) {
    const domainCriteria = criteria.filter((c) => c.domainId === domain.id);
    const domainResults = results.filter((r) =>
      domainCriteria.some((c) => c.id === r.criterionId)
    );
    if (domainResults.length === 0) {
      scores[domain.id] = 0;
    } else {
      const total = domainResults.reduce((sum, r) => sum + r.score, 0);
      scores[domain.id] = Math.round((total / (domainResults.length * 5)) * 100);
    }
  }
  return scores;
}

export function getRiskDistribution(criteria: SecurityCriterion[]): Record<string, number> {
  const dist: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  for (const c of criteria) {
    dist[c.riskLevel]++;
  }
  return dist;
}

export function getComplianceDistribution(results: AssessmentResult[]): Record<string, number> {
  const dist: Record<string, number> = { compliant: 0, partial: 0, "non-compliant": 0, "not-assessed": 0 };
  for (const r of results) {
    dist[r.status]++;
  }
  return dist;
}

export function exportToJSON(assessment: Assessment): string {
  return JSON.stringify(assessment, null, 2);
}

export function exportToCSV(assessment: Assessment, criteria: SecurityCriterion[]): string {
  const header = "ID,Code,Name,Name_Vi,Score,Status,Notes\n";
  const rows = assessment.results.map((r) => {
    const c = criteria.find((cr) => cr.id === r.criterionId);
    if (!c) return "";
    return `"${c.id}","${c.code}","${c.name}","${c.nameVi}",${r.score},"${r.status}","${r.notes}"`;
  }).join("\n");
  return header + rows;
}

export function exportToTXT(assessment: Assessment, criteria: SecurityCriterion[]): string {
  let txt = `Security Assessment Report\n`;
  txt += `========================\n`;
  txt += `Name: ${assessment.name}\n`;
  txt += `Date: ${assessment.createdAt}\n`;
  txt += `Overall Score: ${assessment.overallScore}%\n\n`;
  txt += `Criteria Results:\n`;
  txt += `-----------------\n`;
  for (const r of assessment.results) {
    const c = criteria.find((cr) => cr.id === r.criterionId);
    if (!c) continue;
    txt += `[${r.score}/5] ${c.code} - ${c.nameVi} (${r.status})\n`;
    if (r.notes) txt += `    Notes: ${r.notes}\n`;
  }
  return txt;
}

export function exportToHTML(assessment: Assessment, criteria: SecurityCriterion[]): string {
  const rows = assessment.results.map((r) => {
    const c = criteria.find((cr) => cr.id === r.criterionId);
    if (!c) return "";
    const color = r.score >= 4 ? "#22c55e" : r.score >= 2 ? "#eab308" : "#ef4444";
    return `<tr>
      <td>${c.code}</td>
      <td>${c.nameVi}</td>
      <td style="color:${color};font-weight:bold">${r.score}/5</td>
      <td>${r.status}</td>
      <td>${r.notes}</td>
    </tr>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><title>Báo cáo đánh giá bảo mật</title>
<style>
body{font-family:system-ui;max-width:1200px;margin:0 auto;padding:20px;background:#0f172a;color:#e2e8f0}
h1{color:#38bdf8}table{width:100%;border-collapse:collapse;margin-top:20px}
th,td{padding:10px;border:1px solid #334155;text-align:left}
th{background:#1e293b}tr:nth-child(even){background:#1e293b}
.score{font-size:24px;font-weight:bold}
</style></head>
<body>
<h1>Báo Cáo Đánh Giá Bảo Mật</h1>
<p>Tên: ${assessment.name} | Ngày: ${assessment.createdAt}</p>
<p class="score">Điểm tổng: ${assessment.overallScore}%</p>
<table><thead><tr><th>Mã</th><th>Tiêu chí</th><th>Điểm</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead>
<tbody>${rows}</tbody></table>
</body></html>`;
}

export function generateSampleAssessment(criteria: SecurityCriterion[]): Assessment {
  const results: AssessmentResult[] = criteria.map((c) => {
    const score = Math.floor(Math.random() * 6) as 0 | 1 | 2 | 3 | 4 | 5;
    return {
      criterionId: c.id,
      score,
      status: score >= 4 ? "compliant" : score >= 2 ? "partial" : score >= 1 ? "non-compliant" : "not-assessed",
      notes: score < 3 ? "Cần cải thiện" : "",
      assessedAt: new Date().toISOString(),
      assessedBy: "System",
    };
  });

  return {
    id: "ASSESS-001",
    name: "Đánh giá bảo mật Q1 2026",
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
    results,
    overallScore: calculateOverallScore(results),
    domainScores: {},
  };
}
