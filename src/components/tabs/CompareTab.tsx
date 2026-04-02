"use client";

import { useMemo, useState } from "react";
import { DOMAINS } from "@/lib/data";
import type { AssessmentFile } from "@/lib/types";

export function CompareTab({ files }: { files: AssessmentFile[] }) {
  const [idx1, setIdx1] = useState(0);
  const [idx2, setIdx2] = useState(files.length > 1 ? 1 : 0);

  const file1 = files[idx1] || null;
  const file2 = files[idx2] || null;

  const score1 = file1?.assessment.overallScore ?? 0;
  const score2 = file2?.assessment.overallScore ?? 0;
  const diff = score1 - score2;

  const domainComparisons = useMemo(() => {
    if (!file1 || !file2) return [];
    return DOMAINS.map((d) => {
      const s1 = file1.assessment.domainScores[d.id] ?? 0;
      const s2 = file2.assessment.domainScores[d.id] ?? 0;
      return { ...d, s1, s2, dDiff: s1 - s2 };
    });
  }, [file1, file2]);

  if (files.length < 2) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-200">So sánh đánh giá</h2>
        <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
          <p className="text-4xl mb-3">⚖️</p>
          <p className="text-slate-400 text-sm">Cần ít nhất 2 file đánh giá để so sánh</p>
          <p className="text-slate-500 text-xs mt-1">Tạo thêm file trong tab Quản lý file</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">So sánh đánh giá</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Hệ thống 1</label>
          <select
            value={idx1}
            onChange={(e) => setIdx1(Number(e.target.value))}
            className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-600 focus:border-cyan-500 focus:outline-none"
          >
            {files.map((f, i) => (
              <option key={f.id} value={i}>{f.systemName} ({f.assessment.overallScore}%)</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Hệ thống 2</label>
          <select
            value={idx2}
            onChange={(e) => setIdx2(Number(e.target.value))}
            className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-600 focus:border-cyan-500 focus:outline-none"
          >
            {files.map((f, i) => (
              <option key={f.id} value={i}>{f.systemName} ({f.assessment.overallScore}%)</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {file1 && (
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-200">{file1.systemName}</h3>
            <p className="text-xs text-slate-500">{new Date(file1.updatedAt).toLocaleDateString("vi-VN")}</p>
            <p className={`text-3xl font-bold mt-2 ${score1 >= 70 ? "text-green-400" : score1 >= 50 ? "text-yellow-400" : "text-red-400"}`}>
              {score1}%
            </p>
          </div>
        )}
        {file2 && (
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-200">{file2.systemName}</h3>
            <p className="text-xs text-slate-500">{new Date(file2.updatedAt).toLocaleDateString("vi-VN")}</p>
            <p className={`text-3xl font-bold mt-2 ${score2 >= 70 ? "text-green-400" : score2 >= 50 ? "text-yellow-400" : "text-red-400"}`}>
              {score2}%
            </p>
          </div>
        )}
      </div>

      {file1 && file2 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">
            So sánh {file1.systemName} vs {file2.systemName}
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
                <div className="absolute h-full bg-green-500/30 rounded-full" style={{ width: `${score1}%` }} />
                <div className="absolute h-full bg-yellow-500/50 rounded-full border-r-2 border-yellow-400" style={{ width: `${score2}%` }} />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-green-400">{file1.systemName}: {score1}%</span>
                <span className="text-yellow-400">{file2.systemName}: {score2}%</span>
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
                    <div className={`h-full rounded-full ${dc.s1 >= 70 ? "bg-green-500" : dc.s1 >= 40 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${dc.s1}%` }} />
                  </div>
                  <span className="text-xs text-slate-300 w-8">{dc.s1}%</span>
                </div>
                <div className="w-20 flex items-center gap-1">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${dc.s2 >= 70 ? "bg-green-500" : dc.s2 >= 40 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${dc.s2}%` }} />
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
      )}
    </div>
  );
}
