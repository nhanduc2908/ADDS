"use client";

import { THREATS } from "@/lib/sample-data";
import type { RiskLevel } from "@/lib/types";

export function ThreatsTab() {
  const severityColors: Record<RiskLevel, string> = {
    critical: "bg-red-500/20 text-red-400 border-red-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    info: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  const categories = [...new Set(THREATS.map((t) => t.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">Mối đe dọa bảo mật</h2>
        <span className="text-sm text-slate-400">{THREATS.length} mối đe dọa</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {(["critical", "high", "medium", "low"] as RiskLevel[]).map((level) => {
          const count = THREATS.filter((t) => t.severity === level).length;
          return (
            <div key={level} className={`rounded-lg p-3 border ${severityColors[level]}`}>
              <p className="text-xs uppercase">{level}</p>
              <p className="text-xl font-bold mt-1">{count}</p>
            </div>
          );
        })}
        <div className="rounded-lg p-3 border bg-slate-800/50 border-slate-700">
          <p className="text-xs uppercase text-slate-400">Categories</p>
          <p className="text-xl font-bold text-slate-200 mt-1">{categories.length}</p>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => {
          const catThreats = THREATS.filter((t) => t.category === cat);
          return (
            <div key={cat} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <div className="px-4 py-3 bg-slate-800 border-b border-slate-700">
                <span className="font-semibold text-sm text-slate-200">{cat}</span>
                <span className="text-xs text-slate-500 ml-2">({catThreats.length})</span>
              </div>
              <div className="divide-y divide-slate-700/50">
                {catThreats.map((t) => (
                  <div key={t.id} className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded border ${severityColors[t.severity]}`}>
                            {t.severity}
                          </span>
                          <span className="text-sm font-medium text-slate-200">{t.name}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{t.description}</p>
                        <div className="mt-2 p-2 bg-slate-800 rounded text-xs">
                          <span className="text-green-400 font-medium">Khắc phục: </span>
                          <span className="text-slate-300">{t.mitigation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
