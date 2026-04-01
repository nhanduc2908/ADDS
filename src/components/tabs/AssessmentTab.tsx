"use client";

import { DOMAINS, CRITERIA } from "@/lib/data";
import type { Assessment, AssessmentResult, RiskLevel } from "@/lib/types";

interface AssessmentTabProps {
  assessment: Assessment | null;
  selectedDomain: string;
  searchQuery: string;
  onUpdateResult: (criterionId: string, score: number, status: string, notes: string) => void;
}

export function AssessmentTab({ assessment, selectedDomain, searchQuery, onUpdateResult }: AssessmentTabProps) {
  const filteredCriteria = CRITERIA.filter((c) => {
    if (selectedDomain && c.domainId !== selectedDomain) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.nameVi.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
    }
    return true;
  });

  const groupedByDomain = DOMAINS.map((d) => ({
    domain: d,
    criteria: filteredCriteria.filter((c) => c.domainId === d.id),
  })).filter((g) => g.criteria.length > 0);

  const riskColors: Record<RiskLevel, string> = {
    critical: "bg-red-500/20 text-red-400 border-red-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    info: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">Đánh giá bảo mật</h2>
        <span className="text-sm text-slate-400">{filteredCriteria.length} tiêu chí</span>
      </div>

      {groupedByDomain.map(({ domain, criteria }) => (
        <div key={domain.id} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
            <span>{domain.icon}</span>
            <span className="font-semibold text-sm text-slate-200">{domain.nameVi}</span>
            <span className="text-xs text-slate-500">({criteria.length} tiêu chí)</span>
            <span className="ml-auto text-xs text-slate-500">
              {assessment?.domainScores[domain.id] ?? 0}%
            </span>
          </div>
          <div className="divide-y divide-slate-700/50">
            {criteria.map((c) => {
              const result = assessment?.results.find((r) => r.criterionId === c.id);
              return (
                <CriterionRow
                  key={c.id}
                  criterion={c}
                  result={result ?? null}
                  riskClass={riskColors[c.riskLevel]}
                  onUpdate={onUpdateResult}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function CriterionRow({
  criterion,
  result,
  riskClass,
  onUpdate,
}: {
  criterion: (typeof CRITERIA)[0];
  result: AssessmentResult | null;
  riskClass: string;
  onUpdate: (id: string, score: number, status: string, notes: string) => void;
}) {
  const score = result?.score ?? 0;
  const status = result?.status ?? "not-assessed";

  return (
    <div className="px-4 py-3 hover:bg-slate-800/30">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-slate-500">{criterion.code}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded border ${riskClass}`}>{criterion.riskLevel}</span>
            {criterion.iso27001Control && (
              <span className="text-xs text-blue-400">ISO {criterion.iso27001Control}</span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-200 mt-1">{criterion.nameVi}</p>
          <p className="text-xs text-slate-400 mt-0.5">{criterion.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => onUpdate(criterion.id, s, s >= 4 ? "compliant" : s >= 2 ? "partial" : s >= 1 ? "non-compliant" : "not-assessed", "")}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  score === s
                    ? s >= 4 ? "bg-green-600 text-white" : s >= 2 ? "bg-yellow-600 text-white" : "bg-red-600 text-white"
                    : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <span
            className={`text-xs px-2 py-1 rounded ${
              status === "compliant" ? "bg-green-500/20 text-green-400" :
              status === "partial" ? "bg-yellow-500/20 text-yellow-400" :
              status === "non-compliant" ? "bg-red-500/20 text-red-400" :
              "bg-slate-700 text-slate-400"
            }`}
          >
            {status === "compliant" ? "Đạt" : status === "partial" ? "Một phần" : status === "non-compliant" ? "Chưa đạt" : "Chưa đánh giá"}
          </span>
        </div>
      </div>
    </div>
  );
}
