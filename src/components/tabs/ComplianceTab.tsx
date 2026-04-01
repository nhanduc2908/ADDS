"use client";

import { useMemo } from "react";
import { DOMAINS, CRITERIA } from "@/lib/data";

function seededValue(seed: number, min: number, range: number): number {
  return Math.round(((Math.sin(seed * 9301 + 49297) * 49297) % 1 + 1) % 1 * range + min);
}

export function ComplianceTab() {
  const isoDomains = useMemo(() => DOMAINS.map((d, i) => ({
    name: d.nameVi,
    icon: d.icon,
    coverage: seededValue(i + 1, 55, 40),
    controls: CRITERIA.filter((c) => c.domainId === d.id && c.iso27001Control).length,
  })), []);

  const socDomains = useMemo(() => DOMAINS.map((d, i) => ({
    name: d.nameVi,
    icon: d.icon,
    coverage: seededValue(i + 20, 50, 40),
    controls: CRITERIA.filter((c) => c.domainId === d.id && c.soc2Criteria).length,
  })), []);

  const tableRows = useMemo(() => DOMAINS.map((d, i) => {
    const count = CRITERIA.filter((c) => c.domainId === d.id).length;
    const isoCov = seededValue(i + 1, 55, 40);
    const socCov = seededValue(i + 20, 50, 40);
    const avg = Math.round((isoCov + socCov) / 2);
    return { id: d.id, icon: d.icon, nameVi: d.nameVi, count, isoCov, socCov, avg };
  }), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">Tuân thủ tiêu chuẩn</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ComplianceStandard
          name="ISO 27001"
          description="Hệ thống quản lý an toàn thông tin"
          overallCoverage={78}
          domains={isoDomains}
        />
        <ComplianceStandard
          name="SOC 2"
          description="Báo cáo kiểm soát tổ chức dịch vụ"
          overallCoverage={72}
          domains={socDomains}
        />
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Chi tiết tuân thủ theo lĩnh vực</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400 font-medium">Lĩnh vực</th>
                <th className="text-center py-2 px-3 text-slate-400 font-medium">Tiêu chí</th>
                <th className="text-center py-2 px-3 text-slate-400 font-medium">ISO 27001</th>
                <th className="text-center py-2 px-3 text-slate-400 font-medium">SOC 2</th>
                <th className="text-center py-2 px-3 text-slate-400 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {tableRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-200 flex items-center gap-2">
                    <span>{row.icon}</span>
                    {row.nameVi}
                  </td>
                  <td className="text-center py-2 px-3 text-slate-400">{row.count}</td>
                  <td className="text-center py-2 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${row.isoCov >= 70 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {row.isoCov}%
                    </span>
                  </td>
                  <td className="text-center py-2 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${row.socCov >= 70 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {row.socCov}%
                    </span>
                  </td>
                  <td className="text-center py-2 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${row.avg >= 75 ? "bg-green-500/20 text-green-400" : row.avg >= 60 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                      {row.avg >= 75 ? "Tuân thủ" : row.avg >= 60 ? "Một phần" : "Chưa đạt"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ComplianceStandard({
  name,
  description,
  overallCoverage,
  domains,
}: {
  name: string;
  description: string;
  overallCoverage: number;
  domains: Array<{ name: string; icon: string; coverage: number; controls: number }>;
}) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-200">{name}</h3>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold ${overallCoverage >= 70 ? "text-green-400" : "text-yellow-400"}`}>
            {overallCoverage}%
          </span>
          <p className="text-xs text-slate-500">Coverage</p>
        </div>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full ${overallCoverage >= 70 ? "bg-green-500" : "bg-yellow-500"}`}
          style={{ width: `${overallCoverage}%` }}
        />
      </div>
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {domains.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-5">{d.icon}</span>
            <span className="flex-1 text-slate-400 truncate">{d.name}</span>
            <span className="text-slate-500">{d.controls} ctrls</span>
            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${d.coverage >= 70 ? "bg-green-500" : d.coverage >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: `${d.coverage}%` }}
              />
            </div>
            <span className="w-8 text-right text-slate-400">{d.coverage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
