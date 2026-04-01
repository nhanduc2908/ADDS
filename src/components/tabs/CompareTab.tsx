"use client";

import { useMemo } from "react";
import { DOMAINS } from "@/lib/data";

function seededValue(seed: number, min: number, range: number): number {
  return Math.round(((Math.sin(seed * 9301 + 49297) * 49297) % 1 + 1) % 1 * range + min);
}

export function CompareTab() {
  const assessments = [
    { id: "Q1-2026", name: "Q1 2026", date: "01/04/2026", overall: 72 },
    { id: "Q4-2025", name: "Q4 2025", date: "01/01/2026", overall: 65 },
    { id: "Q3-2025", name: "Q3 2025", date: "01/10/2025", overall: 58 },
  ];

  const [selected1, selected2] = [assessments[0], assessments[1]];
  const diff = selected1.overall - selected2.overall;

  const domainComparisons = useMemo(() => DOMAINS.slice(0, 10).map((d, i) => {
    const s1 = seededValue(i + 1, 55, 40);
    const s2 = seededValue(i + 20, 50, 40);
    return { ...d, s1, s2, dDiff: s1 - s2 };
  }), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">So sánh đánh giá</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {assessments.map((a) => (
          <div key={a.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-200">{a.name}</h3>
            <p className="text-xs text-slate-500">{a.date}</p>
            <p className={`text-3xl font-bold mt-2 ${a.overall >= 70 ? "text-green-400" : a.overall >= 50 ? "text-yellow-400" : "text-red-400"}`}>
              {a.overall}%
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">
          So sánh {selected1.name} vs {selected2.name}
        </h3>
        <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-slate-800">
          <div>
            <p className="text-xs text-slate-400">Thay đổi tổng thể</p>
            <p className={`text-2xl font-bold ${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
              {diff >= 0 ? "+" : ""}{diff}%
            </p>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-slate-700 rounded-full overflow-hidden relative">
              <div className="absolute h-full bg-green-500/30 rounded-full" style={{ width: `${selected1.overall}%` }} />
              <div className="absolute h-full bg-yellow-500/50 rounded-full border-r-2 border-yellow-400" style={{ width: `${selected2.overall}%` }} />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-green-400">{selected1.name}: {selected1.overall}%</span>
              <span className="text-yellow-400">{selected2.name}: {selected2.overall}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {domainComparisons.map((dc) => (
            <div key={dc.id} className="flex items-center gap-2">
              <span className="text-sm w-6">{dc.icon}</span>
              <span className="text-xs text-slate-400 flex-1 truncate">{dc.nameVi}</span>
              <div className="w-20 flex items-center gap-1">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${dc.s1 >= 70 ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${dc.s1}%` }} />
                </div>
                <span className="text-xs text-slate-300 w-8">{dc.s1}%</span>
              </div>
              <div className="w-20 flex items-center gap-1">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${dc.s2 >= 70 ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${dc.s2}%` }} />
                </div>
                <span className="text-xs text-slate-300 w-8">{dc.s2}%</span>
              </div>
              <span className={`text-xs w-12 text-right ${dc.dDiff >= 0 ? "text-green-400" : "text-red-400"}`}>
                {dc.dDiff >= 0 ? "+" : ""}{dc.dDiff}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
