"use client";

import { DEVICES } from "@/lib/sample-data";

export function DevicesTab() {
  const statusColors = {
    secure: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
    unknown: "bg-slate-500",
  };

  const statusLabels = {
    secure: "An toàn",
    warning: "Cảnh báo",
    critical: "Nghiêm trọng",
    unknown: "Không rõ",
  };

  const typeIcons: Record<string, string> = {
    Server: "🖥️",
    Endpoint: "💻",
    Network: "🌐",
    IoT: "🔗",
    Cloud: "☁️",
    Mobile: "📱",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">Quản lý thiết bị</h2>
        <span className="text-sm text-slate-400">{DEVICES.length} thiết bị</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-lg p-3 border bg-green-500/10 border-green-500/30">
          <p className="text-xs text-green-400">An toàn</p>
          <p className="text-xl font-bold text-green-400">{DEVICES.filter((d) => d.status === "secure").length}</p>
        </div>
        <div className="rounded-lg p-3 border bg-yellow-500/10 border-yellow-500/30">
          <p className="text-xs text-yellow-400">Cảnh báo</p>
          <p className="text-xl font-bold text-yellow-400">{DEVICES.filter((d) => d.status === "warning").length}</p>
        </div>
        <div className="rounded-lg p-3 border bg-red-500/10 border-red-500/30">
          <p className="text-xs text-red-400">Nghiêm trọng</p>
          <p className="text-xl font-bold text-red-400">{DEVICES.filter((d) => d.status === "critical").length}</p>
        </div>
        <div className="rounded-lg p-3 border bg-slate-800/50 border-slate-700">
          <p className="text-xs text-slate-400">Tổng cộng</p>
          <p className="text-xl font-bold text-slate-200">{DEVICES.length}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Thiết bị</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Loại</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">HĐH</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">IP</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">Lỗ hổng</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {DEVICES.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span>{typeIcons[d.type] || "📦"}</span>
                      <span className="text-slate-200 font-medium">{d.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{d.type}</td>
                  <td className="py-3 px-4 text-slate-400 text-xs font-mono">{d.os}</td>
                  <td className="py-3 px-4 text-slate-400 text-xs font-mono">{d.ip}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-xs font-medium ${d.vulnerabilities === 0 ? "text-green-400" : d.vulnerabilities <= 2 ? "text-yellow-400" : "text-red-400"}`}>
                      {d.vulnerabilities}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className={`w-2 h-2 rounded-full ${statusColors[d.status]}`} />
                      {statusLabels[d.status]}
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
