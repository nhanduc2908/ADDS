"use client";

import { NOTIFICATIONS } from "@/lib/sample-data";

export function NotificationsTab() {
  const typeColors = {
    critical: "border-l-red-500 bg-red-500/5",
    warning: "border-l-yellow-500 bg-yellow-500/5",
    info: "border-l-blue-500 bg-blue-500/5",
    success: "border-l-green-500 bg-green-500/5",
  };

  const typeIcons = {
    critical: "🔴",
    warning: "⚠️",
    info: "ℹ️",
    success: "✅",
  };

  const unread = NOTIFICATIONS.filter((n) => !n.read);
  const read = NOTIFICATIONS.filter((n) => n.read);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">Thông báo hệ thống</h2>
        <span className="text-sm text-cyan-400">{unread.length} chưa đọc</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <NotifStatCard label="Chưa đọc" value={unread.length} color="cyan" />
        <NotifStatCard label="Critical" value={NOTIFICATIONS.filter((n) => n.type === "critical").length} color="red" />
        <NotifStatCard label="Warning" value={NOTIFICATIONS.filter((n) => n.type === "warning").length} color="yellow" />
        <NotifStatCard label="Tổng cộng" value={NOTIFICATIONS.length} color="blue" />
      </div>

      {unread.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Chưa đọc</h3>
          <div className="space-y-2">
            {unread.map((n) => (
              <div key={n.id} className={`rounded-lg p-3 border-l-4 ${typeColors[n.type]} border border-slate-700`}>
                <div className="flex items-start gap-2">
                  <span>{typeIcons[n.type]}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{n.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(n.createdAt).toLocaleString("vi-VN")}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Đã đọc</h3>
          <div className="space-y-2">
            {read.map((n) => (
              <div key={n.id} className={`rounded-lg p-3 border-l-4 ${typeColors[n.type]} border border-slate-700 opacity-60`}>
                <div className="flex items-start gap-2">
                  <span>{typeIcons[n.type]}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{n.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(n.createdAt).toLocaleString("vi-VN")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NotifStatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    cyan: "text-cyan-400",
    red: "text-red-400",
    yellow: "text-yellow-400",
    blue: "text-blue-400",
  };
  return (
    <div className="rounded-lg p-3 border bg-slate-800/50 border-slate-700">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`text-xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}
