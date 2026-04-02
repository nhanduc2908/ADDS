import type { Assessment, AssessmentResult, SecurityCriterion, SecurityDomain, AssessmentFile } from "./types";
import { CRITERIA } from "./data";

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

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
  const header = "ID,Code,Name,Name_Vi,Risk_Level,Score,Status,ISO_27001,SOC2,Notes\n";
  const rows = assessment.results.map((r) => {
    const c = criteria.find((cr) => cr.id === r.criterionId);
    if (!c) return "";
    return `"${c.id}","${c.code}","${c.name}","${c.nameVi}","${c.riskLevel}",${r.score},"${r.status}","${c.iso27001Control || ""}","${c.soc2Criteria || ""}","${r.notes}"`;
  }).join("\n");
  return header + rows;
}

export function exportToTXT(assessment: Assessment, criteria: SecurityCriterion[]): string {
  let txt = `BAO CAO DANH GIA BAO MAT\n`;
  txt += `========================\n\n`;
  txt += `Ten: ${assessment.name}\n`;
  txt += `Ngay: ${assessment.createdAt}\n`;
  txt += `Diem tong: ${assessment.overallScore}%\n`;
  txt += `Tieu chi: ${criteria.length}\n\n`;
  txt += `KET QA DANH GIA:\n`;
  txt += `${"=".repeat(60)}\n\n`;

  for (const r of assessment.results) {
    const c = criteria.find((cr) => cr.id === r.criterionId);
    if (!c) continue;
    const scoreBar = "█".repeat(r.score) + "░".repeat(5 - r.score);
    txt += `[${r.score}/5 ${scoreBar}] ${c.code}\n`;
    txt += `  ${c.nameVi}\n`;
    txt += `  Muc do: ${c.riskLevel.toUpperCase()} | Trang thai: ${r.status}\n`;
    if (c.iso27001Control) txt += `  ISO 27001: ${c.iso27001Control}\n`;
    if (c.soc2Criteria) txt += `  SOC 2: ${c.soc2Criteria}\n`;
    if (r.notes) txt += `  Ghi chu: ${r.notes}\n`;
    txt += `\n`;
  }

  txt += `\n${"=".repeat(60)}\n`;
  txt += `Tong ket: ${assessment.overallScore}%\n`;
  return txt;
}

export function exportToHTML(assessment: Assessment, criteria: SecurityCriterion[]): string {
  const rows = assessment.results.map((r) => {
    const c = criteria.find((cr) => cr.id === r.criterionId);
    if (!c) return "";
    const color = r.score >= 4 ? "#22c55e" : r.score >= 2 ? "#eab308" : "#ef4444";
    const riskBadge = c.riskLevel === "critical" ? "background:#ef4444;color:#fff" :
      c.riskLevel === "high" ? "background:#f97316;color:#fff" :
      c.riskLevel === "medium" ? "background:#eab308;color:#000" :
      "background:#3b82f6;color:#fff";
    return `<tr>
      <td style="font-family:monospace;font-size:12px">${c.code}</td>
      <td>${c.nameVi}</td>
      <td><span style="${riskBadge};padding:2px 8px;border-radius:4px;font-size:11px">${c.riskLevel}</span></td>
      <td style="color:${color};font-weight:bold;text-align:center">${r.score}/5</td>
      <td style="text-align:center">${r.status}</td>
      <td>${c.iso27001Control || "-"}</td>
      <td>${r.notes}</td>
    </tr>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bao cao danh gia bao mat - ${assessment.name}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#0f172a;color:#e2e8f0;padding:24px}
.container{max-width:1400px;margin:0 auto}
h1{color:#38bdf8;font-size:28px;margin-bottom:4px}
h2{color:#94a3b8;font-size:16px;font-weight:normal;margin-bottom:24px}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px}
.score-box{text-align:right}
.score-value{font-size:48px;font-weight:bold;color:${assessment.overallScore >= 70 ? "#22c55e" : assessment.overallScore >= 50 ? "#eab308" : "#ef4444"}}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
.stat{background:#1e293b;padding:16px;border-radius:8px;border:1px solid #334155}
.stat-label{font-size:12px;color:#94a3b8;text-transform:uppercase}
.stat-value{font-size:24px;font-weight:bold;margin-top:4px}
table{width:100%;border-collapse:collapse;background:#1e293b;border-radius:8px;overflow:hidden}
th{background:#0f172a;padding:12px;text-align:left;font-size:12px;text-transform:uppercase;color:#94a3b8;border-bottom:2px solid #334155}
td{padding:10px 12px;border-bottom:1px solid #1e293b;font-size:13px}
tr:hover{background:#1e294b}
.footer{margin-top:32px;text-align:center;color:#475569;font-size:12px}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div>
      <h1>Bao Cao Danh Gia Bao Mat</h1>
      <h2>${assessment.name} | ${new Date(assessment.createdAt).toLocaleDateString("vi-VN")}</h2>
    </div>
    <div class="score-box">
      <div class="score-value">${assessment.overallScore}%</div>
      <div style="color:#94a3b8;font-size:12px">Diem tong</div>
    </div>
  </div>

  <div class="stats">
    <div class="stat"><div class="stat-label">Tieu chi</div><div class="stat-value">${criteria.length}</div></div>
    <div class="stat"><div class="stat-label">Da danh gia</div><div class="stat-value">${assessment.results.filter(r => r.status !== "not-assessed").length}</div></div>
    <div class="stat"><div class="stat-label">Dat yeu cau</div><div class="stat-value" style="color:#22c55e">${assessment.results.filter(r => r.status === "compliant").length}</div></div>
    <div class="stat"><div class="stat-label">Chua dat</div><div class="stat-value" style="color:#ef4444">${assessment.results.filter(r => r.status === "non-compliant").length}</div></div>
  </div>

  <table>
    <thead>
      <tr><th>Ma</th><th>Tieu chi</th><th>Risk</th><th>Diem</th><th>Trang thai</th><th>ISO 27001</th><th>Ghi chu</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="footer">
    <p>He thong danh gia bao mat - ${new Date().toLocaleString("vi-VN")}</p>
  </div>
</div>
</body></html>`;
}

export function generateSampleAssessment(criteria: SecurityCriterion[]): Assessment {
  const results: AssessmentResult[] = criteria.map((c, i) => {
    const rand = seededRandom(i + 1);
    const score = Math.floor(rand * 6) as 0 | 1 | 2 | 3 | 4 | 5;
    return {
      criterionId: c.id,
      score,
      status: score >= 4 ? "compliant" : score >= 2 ? "partial" : score >= 1 ? "non-compliant" : "not-assessed",
      notes: score < 3 ? "Can cai thien" : "",
      assessedAt: "2026-04-01T08:00:00Z",
      assessedBy: "System",
    };
  });

  return {
    id: "ASSESS-001",
    name: "Danh gia bao mat Q1 2026",
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T08:00:00Z",
    results,
    overallScore: calculateOverallScore(results),
    domainScores: {},
  };
}

export async function downloadExport(format: string, assessment?: Assessment): Promise<void> {
  const mimeTypes: Record<string, string> = {
    json: "application/json",
    csv: "text/csv",
    excel: "text/csv",
    txt: "text/plain",
    html: "text/html",
  };

  if (assessment) {
    let content: string;
    let ext = format;
    switch (format) {
      case "json":
        content = exportToJSON(assessment);
        break;
      case "csv":
      case "excel":
        content = exportToCSV(assessment, CRITERIA);
        ext = "csv";
        break;
      case "txt":
        content = exportToTXT(assessment, CRITERIA);
        break;
      case "html":
        content = exportToHTML(assessment, CRITERIA);
        break;
      default:
        content = exportToJSON(assessment);
    }
    const blob = new Blob([content], { type: mimeTypes[format] || "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bao-cao-bao-mat-${assessment.id}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return;
  }

  const res = await fetch(`/api/export?format=${format}`);
  if (!res.ok) throw new Error(`Export failed: ${res.statusText}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const ext = format === "excel" ? "csv" : format;
  a.download = `bao-cao-bao-mat.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface ImportResult {
  success: boolean;
  assessment?: Assessment;
  errors: string[];
  imported: number;
  skipped: number;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export function importFromJSON(text: string): ImportResult {
  const errors: string[] = [];
  try {
    const data = JSON.parse(text);

    if (data.results && Array.isArray(data.results)) {
      const assessment: Assessment = {
        id: data.id || `IMPORT-${Date.now()}`,
        name: data.name || "Nhập từ file JSON",
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        results: [],
        overallScore: 0,
        domainScores: {},
      };

      let imported = 0;
      let skipped = 0;

      for (const r of data.results) {
        if (!r.criterionId) {
          skipped++;
          errors.push(`Bỏ qua dòng thiếu criterionId`);
          continue;
        }
        const score = Math.min(5, Math.max(0, Number(r.score) || 0)) as 0 | 1 | 2 | 3 | 4 | 5;
        const validStatuses = ["compliant", "partial", "non-compliant", "not-assessed"];
        const status = validStatuses.includes(r.status) ? r.status :
          score >= 4 ? "compliant" : score >= 2 ? "partial" : score >= 1 ? "non-compliant" : "not-assessed";

        assessment.results.push({
          criterionId: r.criterionId,
          score,
          status,
          notes: r.notes || "",
          assessedAt: r.assessedAt || new Date().toISOString(),
          assessedBy: r.assessedBy || "Import",
        });
        imported++;
      }

      assessment.overallScore = calculateOverallScore(assessment.results);
      assessment.domainScores = data.domainScores || {};

      return { success: imported > 0, assessment, errors, imported, skipped };
    }

    if (Array.isArray(data)) {
      const assessment: Assessment = {
        id: `IMPORT-${Date.now()}`,
        name: "Nhập từ JSON array",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        results: [],
        overallScore: 0,
        domainScores: {},
      };

      let imported = 0;
      let skipped = 0;

      for (const r of data) {
        if (!r.criterionId && !r.id) {
          skipped++;
          continue;
        }
        const score = Math.min(5, Math.max(0, Number(r.score) || 0)) as 0 | 1 | 2 | 3 | 4 | 5;
        assessment.results.push({
          criterionId: r.criterionId || r.id,
          score,
          status: score >= 4 ? "compliant" : score >= 2 ? "partial" : "non-compliant",
          notes: r.notes || "",
          assessedAt: new Date().toISOString(),
          assessedBy: "Import",
        });
        imported++;
      }

      assessment.overallScore = calculateOverallScore(assessment.results);
      return { success: imported > 0, assessment, errors, imported, skipped };
    }

    errors.push("Định dạng JSON không hợp lệ. Cần { results: [...] } hoặc [...]");
    return { success: false, errors, imported: 0, skipped: 0 };
  } catch (e) {
    errors.push(`Lỗi parse JSON: ${e instanceof Error ? e.message : "Unknown"}`);
    return { success: false, errors, imported: 0, skipped: 0 };
  }
}

export function importFromCSV(text: string): ImportResult {
  const errors: string[] = [];
  const lines = text.trim().split("\n");

  if (lines.length < 2) {
    errors.push("File CSV phải có ít nhất 1 dòng header và 1 dòng dữ liệu");
    return { success: false, errors, imported: 0, skipped: 0 };
  }

  const header = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, ""));
  const idIdx = header.findIndex((h) => h === "id" || h === "criterionid" || h === "criterion_id" || h === "ma");
  const scoreIdx = header.findIndex((h) => h === "score" || h === "diem");
  const statusIdx = header.findIndex((h) => h === "status" || h === "trangthai" || h === "trang_thai");
  const notesIdx = header.findIndex((h) => h === "notes" || h === "ghichu" || h === "ghi_chu");

  if (idIdx === -1) {
    errors.push("Không tìm thấy cột ID/criterionId/Ma trong header CSV");
    return { success: false, errors, imported: 0, skipped: 0 };
  }

  const assessment: Assessment = {
    id: `IMPORT-${Date.now()}`,
    name: "Nhập từ CSV",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    results: [],
    overallScore: 0,
    domainScores: {},
  };

  let imported = 0;
  let skipped = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = parseCSVLine(line);
    const criterionId = cols[idIdx];

    if (!criterionId) {
      skipped++;
      continue;
    }

    const rawScore = scoreIdx >= 0 ? Number(cols[scoreIdx]) : 0;
    const score = Math.min(5, Math.max(0, rawScore || 0)) as 0 | 1 | 2 | 3 | 4 | 5;
    const notes = notesIdx >= 0 ? cols[notesIdx] : "";

    assessment.results.push({
      criterionId,
      score,
      status: score >= 4 ? "compliant" : score >= 2 ? "partial" : score >= 1 ? "non-compliant" : "not-assessed",
      notes,
      assessedAt: new Date().toISOString(),
      assessedBy: "Import",
    });
    imported++;
  }

  assessment.overallScore = calculateOverallScore(assessment.results);

  return { success: imported > 0, assessment, errors, imported, skipped };
}

export function importAssessment(file: File): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        resolve({ success: false, errors: ["File rỗng"], imported: 0, skipped: 0 });
        return;
      }

      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "json") {
        resolve(importFromJSON(text));
      } else if (ext === "csv") {
        resolve(importFromCSV(text));
      } else {
        resolve({ success: false, errors: [`Định dạng .${ext} không được hỗ trợ. Dùng JSON hoặc CSV`], imported: 0, skipped: 0 });
      }
    };
    reader.onerror = () => reject(new Error("Không thể đọc file"));
    reader.readAsText(file);
  });
}

export function createAssessmentFile(
  systemName: string,
  description: string,
  tags: string[] = []
): AssessmentFile {
  const now = new Date().toISOString();
  const id = `FILE-${Date.now()}`;
  const assessment = generateSampleAssessment(CRITERIA);
  assessment.id = `ASSESS-${Date.now()}`;
  assessment.name = `Đánh giá ${systemName}`;
  assessment.createdAt = now;
  assessment.updatedAt = now;
  assessment.domainScores = calculateDomainScores(assessment.results, CRITERIA, []);
  assessment.overallScore = 0;
  assessment.results = assessment.results.map((r) => ({
    ...r,
    score: 0 as 0,
    status: "not-assessed" as const,
    notes: "",
    assessedAt: now,
    assessedBy: "",
  }));

  return {
    id,
    name: `Đánh giá ${systemName}`,
    systemName,
    description,
    createdAt: now,
    updatedAt: now,
    assessment,
    status: "draft",
    tags,
  };
}

export function createAssessmentFileFromImport(
  systemName: string,
  description: string,
  importedAssessment: Assessment,
  tags: string[] = []
): AssessmentFile {
  const now = new Date().toISOString();
  const id = `FILE-${Date.now()}`;

  return {
    id,
    name: importedAssessment.name || `Đánh giá ${systemName}`,
    systemName,
    description,
    createdAt: now,
    updatedAt: now,
    assessment: {
      ...importedAssessment,
      id: `ASSESS-${Date.now()}`,
      updatedAt: now,
    },
    status: "in-progress",
    tags,
  };
}

export function updateAssessmentFileStatus(
  file: AssessmentFile
): AssessmentFile {
  const assessed = file.assessment.results.filter((r) => r.status !== "not-assessed").length;
  const total = file.assessment.results.length;
  const pct = total > 0 ? (assessed / total) * 100 : 0;

  let status: AssessmentFile["status"] = "draft";
  if (pct === 0) status = "draft";
  else if (pct < 100) status = "in-progress";
  else status = "completed";

  return { ...file, status, updatedAt: new Date().toISOString() };
}
