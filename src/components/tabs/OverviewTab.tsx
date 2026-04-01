"use client";

import { DOMAINS, CRITERIA } from "@/lib/data";
import { THREATS, DEVICES, TRAINING_MODULES } from "@/lib/sample-data";
import type { Assessment } from "@/lib/types";

interface OverviewTabProps {
  assessment: Assessment | null;
}

export function OverviewTab({ assessment }: OverviewTabProps) {
  const totalCriteria = CRITERIA.length;
  const assessedCount = assessment?.results.filter((r) => r.status !== "not-assessed").length ?? 0;
  const compliantCount = assessment?.results.filter((r) => r.status === "compliant").length ?? 0;
  const criticalCriteria = CRITERIA.filter((c) => c.riskLevel === "critical").length;
  const completedTraining = TRAINING_MODULES.filter((t) => t.completed).length;
  const criticalThreats = THREATS.filter((t) => t.severity === "critical").length;

  const riskDist = {
    critical: CRITERIA.filter((c) => c.riskLevel === "critical").length,
    high: CRITERIA.filter((c) => c.riskLevel === "high").length,
    medium: CRITERIA.filter((c) => c.riskLevel === "medium").length,
    low: CRITERIA.filter((c) => c.riskLevel === "low").length,
    info: CRITERIA.filter((c) => c.riskLevel === "info").length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Điểm bảo mật" value={`${assessment?.overallScore ?? 0}%`} icon="🛡️" color="cyan" />
        <DashboardCard title="Tiêu chí đã đánh giá" value={`${assessedCount}/${totalCriteria}`} icon="📋" color="blue" />
        <DashboardCard title="Tuân thủ" value={`${compliantCount}`} icon="✅" color="green" />
        <DashboardCard title="Mối đe dọa critical" value={`${criticalThreats}`} icon="⚠️" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Phân bố mức độ rủi ro</h3>
          <div className="space-y-2">
            <RiskBar label="Critical" value={riskDist.critical} total={totalCriteria} color="bg-red-500" />
            <RiskBar label="High" value={riskDist.high} total={totalCriteria} color="bg-orange-500" />
            <RiskBar label="Medium" value={riskDist.medium} total={totalCriteria} color="bg-yellow-500" />
            <RiskBar label="Low" value={riskDist.low} total={totalCriteria} color="bg-blue-500" />
            <RiskBar label="Info" value={riskDist.info} total={totalCriteria} color="bg-slate-500" />
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Điểm theo lĩnh vực</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {DOMAINS.map((d) => {
              const score = assessment?.domainScores[d.id] ?? 0;
              return (
                <div key={d.id} className="flex items-center gap-2">
                  <span className="text-sm w-6">{d.icon}</span>
                  <span className="text-xs text-slate-400 flex-1 truncate">{d.nameVi}</span>
                  <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : score >= 40 ? "bg-orange-500" : "bg-red-500"}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-300 w-8 text-right">{score}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Lĩnh vực ({DOMAINS.length})</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {DOMAINS.map((d) => (
              <div key={d.id} className="flex items-center gap-1.5 text-xs text-slate-400 p-1.5 rounded bg-slate-800">
                <span>{d.icon}</span>
                <span className="truncate">{d.nameVi}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Thiết bị ({DEVICES.length})</h3>
          <div className="space-y-1.5">
            {DEVICES.slice(0, 6).map((d) => (
              <div key={d.id} className="flex items-center gap-2 text-xs p-1.5 rounded bg-slate-800">
                <span className={`w-2 h-2 rounded-full ${d.status === "secure" ? "bg-green-500" : d.status === "warning" ? "bg-yellow-500" : "bg-red-500"}`} />
                <span className="text-slate-300 flex-1 truncate">{d.name}</span>
                <span className="text-slate-500">{d.type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Đào tạo ({completedTraining}/{TRAINING_MODULES.length})</h3>
          <div className="space-y-1.5">
            {TRAINING_MODULES.slice(0, 6).map((t) => (
              <div key={t.id} className="flex items-center gap-2 text-xs p-1.5 rounded bg-slate-800">
                <span>{t.completed ? "✅" : "⬜"}</span>
                <span className="text-slate-300 flex-1 truncate">{t.title}</span>
                <span className="text-slate-500">{t.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
  const colorMap: Record<string, string> = {
    cyan: "border-cyan-500/30 bg-cyan-500/10",
    blue: "border-blue-500/30 bg-blue-500/10",
    green: "border-green-500/30 bg-green-500/10",
    red: "border-red-500/30 bg-red-500/10",
  };
  const textMap: Record<string, string> = {
    cyan: "text-cyan-400",
    blue: "text-blue-400",
    green: "text-green-400",
    red: "text-red-400",
  };

  return (
    <div className={`rounded-xl p-4 border ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{title}</p>
        <span className="text-lg">{icon}</span>
      </div>
      <p className={`text-2xl font-bold mt-2 ${textMap[color]}`}>{value}</p>
    </div>
  );
}

function RiskBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 w-16">{label}</span>
      <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-300 w-8 text-right">{value}</span>
    </div>
  );
}
