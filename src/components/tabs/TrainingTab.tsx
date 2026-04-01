"use client";

import { TRAINING_MODULES } from "@/lib/sample-data";

export function TrainingTab() {
  const completed = TRAINING_MODULES.filter((t) => t.completed).length;
  const total = TRAINING_MODULES.length;
  const progress = Math.round((completed / total) * 100);

  const difficultyColors = {
    beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    advanced: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">Đào tạo an ninh mạng</h2>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-200">Tiến độ đào tạo</span>
          <span className="text-sm text-cyan-400">{completed}/{total} hoàn thành</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-slate-500 mt-1">{progress}% hoàn thành</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {TRAINING_MODULES.map((mod) => (
          <div
            key={mod.id}
            className={`bg-slate-800/50 rounded-xl p-4 border ${mod.completed ? "border-green-500/30" : "border-slate-700"}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span>{mod.completed ? "✅" : "⬜"}</span>
                  <h3 className="text-sm font-semibold text-slate-200">{mod.title}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">{mod.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded border ${difficultyColors[mod.difficulty]}`}>
                {mod.difficulty === "beginner" ? "Cơ bản" : mod.difficulty === "intermediate" ? "Trung bình" : "Nâng cao"}
              </span>
              <span className="text-xs text-slate-500">⏱ {mod.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
