"use client";

import { DOMAINS, CRITERIA } from "@/lib/data";
import { THREATS, DEVICES, NOTIFICATIONS } from "@/lib/sample-data";
import type { Assessment } from "@/lib/types";

interface RightSidebarProps {
  assessment: Assessment | null;
}

export function RightSidebar({ assessment }: RightSidebarProps) {
  const overallScore = assessment?.overallScore ?? 0;
  const scoreColor =
    overallScore >= 80 ? "text-green-400" : overallScore >= 60 ? "text-yellow-400" : overallScore >= 40 ? "text-orange-400" : "text-red-400";
  const scoreBg =
    overallScore >= 80 ? "from-green-500/20" : overallScore >= 60 ? "from-yellow-500/20" : overallScore >= 40 ? "from-orange-500/20" : "from-red-500/20";

  const criticalCount = CRITERIA.filter((c) => c.riskLevel === "critical").length;
  const secureDevices = DEVICES.filter((d) => d.status === "secure").length;
  const warningDevices = DEVICES.filter((d) => d.status === "warning").length;
  const criticalDevices = DEVICES.filter((d) => d.status === "critical").length;
  const unreadNotifications = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <aside className="w-72 bg-slate-900 border-l border-slate-700 flex flex-col h-screen overflow-y-auto">
      <div className={`p-4 border-b border-slate-700 bg-gradient-to-b ${scoreBg} to-transparent`}>
        <p className="text-xs text-slate-400 uppercase tracking-wider">Điểm bảo mật tổng thể</p>
        <div className="flex items-end gap-2 mt-2">
          <span className={`text-5xl font-bold ${scoreColor}`}>{overallScore}</span>
          <span className="text-slate-400 text-lg mb-1">/ 100</span>
        </div>
        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overallScore >= 80 ? "bg-green-500" : overallScore >= 60 ? "bg-yellow-500" : overallScore >= 40 ? "bg-orange-500" : "bg-red-500"
            }`}
            style={{ width: `${overallScore}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {overallScore >= 80 ? "Bảo mật tốt" : overallScore >= 60 ? "Cần cải thiện" : overallScore >= 40 ? "Nhiều rủi ro" : "Nguy hiểm"}
        </p>
      </div>

      <div className="p-4 border-b border-slate-700">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Biểu đồ Radar</p>
        <RadarChart assessment={assessment} />
      </div>

      <div className="p-4 border-b border-slate-700">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Thống kê nhanh</p>
        <div className="space-y-2">
          <StatRow label="Tổng tiêu chí" value={CRITERIA.length.toString()} icon="📋" />
          <StatRow label="Lĩnh vực" value={DOMAINS.length.toString()} icon="📁" />
          <StatRow label="Mức critical" value={criticalCount.toString()} icon="🔴" color="text-red-400" />
          <StatRow label="Mối đe dọa" value={THREATS.length.toString()} icon="⚠️" color="text-orange-400" />
        </div>
      </div>

      <div className="p-4 border-b border-slate-700">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Trạng thái thiết bị</p>
        <div className="space-y-2">
          <StatRow label="An toàn" value={secureDevices.toString()} icon="✅" color="text-green-400" />
          <StatRow label="Cảnh báo" value={warningDevices.toString()} icon="⚠️" color="text-yellow-400" />
          <StatRow label="Nghiêm trọng" value={criticalDevices.toString()} icon="🔴" color="text-red-400" />
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Thông báo</p>
        <div className="space-y-2">
          <StatRow label="Chưa đọc" value={unreadNotifications.toString()} icon="🔔" color="text-cyan-400" />
          <StatRow label="Tổng cộng" value={NOTIFICATIONS.length.toString()} icon="📬" />
        </div>
      </div>
    </aside>
  );
}

function StatRow({ label, value, icon, color = "text-slate-200" }: { label: string; value: string; icon: string; color?: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400 flex items-center gap-1.5">
        <span>{icon}</span>
        {label}
      </span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}

function RadarChart({ assessment }: { assessment: Assessment | null }) {
  if (!assessment) return <div className="text-slate-500 text-sm">Đang tải...</div>;

  const topDomains = DOMAINS.slice(0, 8);
  const centerX = 100;
  const centerY = 100;
  const radius = 80;
  const angleStep = (2 * Math.PI) / topDomains.length;

  const points = topDomains.map((d, i) => {
    const score = assessment.domainScores[d.id] || 0;
    const r = (score / 100) * radius;
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
      labelX: centerX + (radius + 15) * Math.cos(angle),
      labelY: centerY + (radius + 15) * Math.sin(angle),
      score,
      name: d.nameVi.slice(0, 8),
    };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 200 200" className="w-full">
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon
          key={scale}
          points={topDomains
            .map((_, i) => {
              const r = radius * scale;
              const angle = i * angleStep - Math.PI / 2;
              return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
            })
            .join(" ")}
          fill="none"
          stroke="#334155"
          strokeWidth="0.5"
        />
      ))}
      {topDomains.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        return (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={centerX + radius * Math.cos(angle)}
            y2={centerY + radius * Math.sin(angle)}
            stroke="#334155"
            strokeWidth="0.5"
          />
        );
      })}
      <path d={pathD} fill="rgba(34, 211, 238, 0.15)" stroke="#22d3ee" strokeWidth="1.5" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="#22d3ee" />
          <text x={p.labelX} y={p.labelY} textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="6">
            {p.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
