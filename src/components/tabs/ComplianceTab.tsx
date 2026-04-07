"use client";

import { useMemo } from "react";
import { DOMAINS, CRITERIA, SECURITY_STANDARDS } from "@/lib/data";

function seededValue(seed: number, min: number, range: number): number {
  return Math.round(((Math.sin(seed * 9301 + 49297) * 49297) % 1 + 1) % 1 * range + min);
}

export function ComplianceTab() {
  const standards = useMemo(() => SECURITY_STANDARDS.slice(0, 6).map((s, i) => ({
    id: s.id,
    name: s.shortName,
    nameVi: s.nameVi,
    icon: s.icon,
    coverage: seededValue(i + 1, 45, 45),
    criteria: s.criteriaCount,
  })), []);

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
    const nistCov = seededValue(i + 40, 45, 45);
    const avg = Math.round((isoCov + socCov + nistCov) / 3);
    return { id: d.id, icon: d.icon, nameVi: d.nameVi, count, isoCov, socCov, nistCov, avg };
  }), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">Tuân thủ tiêu chuẩn</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {standards.map((s) => (
          <ComplianceStandardCard
            key={s.id}
            name={s.name}
            nameVi={s.nameVi}
            icon={s.icon}
            overallCoverage={s.coverage}
            criteriaCount={s.criteria}
          />
        ))}
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
                <th className="text-center py-2 px-3 text-slate-400 font-medium">NIST 800-53</th>
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
                    <span className={`text-xs px-2 py-0.5 rounded ${row.nistCov >= 70 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {row.nistCov}%
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

function ComplianceStandardCard({
  name,
  nameVi,
  icon,
  overallCoverage,
  criteriaCount,
}: {
  name: string;
  nameVi: string;
  icon: string;
  overallCoverage: number;
  criteriaCount: number;
}) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-slate-200 text-sm">{name}</h3>
            <p className="text-xs text-slate-400">{nameVi}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-xl font-bold ${overallCoverage >= 70 ? "text-green-400" : overallCoverage >= 50 ? "text-yellow-400" : "text-red-400"}`}>
            {overallCoverage}%
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full ${overallCoverage >= 70 ? "bg-green-500" : overallCoverage >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
          style={{ width: `${overallCoverage}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">{criteriaCount} controls</p>
    </div>
  );
}
