"use client";

import { useState } from "react";
import { EXPORT_FORMATS } from "@/lib/data";
import { downloadExport } from "@/lib/utils";
import type { Assessment } from "@/lib/types";

export function ReportsTab({ assessment }: { assessment: Assessment }) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (format: string) => {
    setExporting(format);
    try {
      await downloadExport(format, assessment);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">Báo cáo</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Xuất báo cáo đánh giá</h3>
          <p className="text-xs text-slate-400 mb-4">Xuất báo cáo đánh giá bảo mật với 203 tiêu chí theo nhiều định dạng.</p>
          <div className="grid grid-cols-3 gap-2">
            {EXPORT_FORMATS.map((fmt) => (
              <button
                key={fmt.format}
                onClick={() => handleExport(fmt.format)}
                disabled={exporting === fmt.format}
                className="flex flex-col items-center gap-1 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50"
              >
                <span className="text-2xl">{exporting === fmt.format ? "⏳" : fmt.icon}</span>
                <span className="text-xs text-slate-300">{fmt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Báo cáo gần đây</h3>
          <div className="space-y-2">
            <ReportItem name="Đánh giá Q1 2026" date="01/04/2026" format="PDF" status="Hoàn thành" />
            <ReportItem name="Tuân thủ ISO 27001" date="15/03/2026" format="HTML" status="Hoàn thành" />
            <ReportItem name="Threat Analysis" date="01/03/2026" format="CSV" status="Hoàn thành" />
            <ReportItem name="Device Audit" date="15/02/2026" format="JSON" status="Hoàn thành" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Lịch báo cáo tự động</h3>
        <div className="space-y-2">
          <ScheduleItem name="Báo cáo bảo mật hàng tuần" schedule="Thứ 2 hàng tuần lúc 08:00" format="HTML" active />
          <ScheduleItem name="Tuân thủ ISO 27001 hàng tháng" schedule="Ngày 1 hàng tháng" format="PDF" active />
          <ScheduleItem name="Thiết bị scan hàng ngày" schedule="Hàng ngày lúc 02:00" format="JSON" active />
        </div>
      </div>
    </div>
  );
}

function ReportItem({ name, date, format, status }: { name: string; date: string; format: string; status: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded bg-slate-800">
      <span className="text-sm">📄</span>
      <div className="flex-1">
        <p className="text-sm text-slate-200">{name}</p>
        <p className="text-xs text-slate-500">{date}</p>
      </div>
      <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded">{format}</span>
      <span className="text-xs text-green-400">{status}</span>
    </div>
  );
}

function ScheduleItem({ name, schedule, format, active }: { name: string; schedule: string; format: string; active: boolean }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded bg-slate-800">
      <span className={`w-2 h-2 rounded-full ${active ? "bg-green-500" : "bg-slate-500"}`} />
      <div className="flex-1">
        <p className="text-sm text-slate-200">{name}</p>
        <p className="text-xs text-slate-500">{schedule}</p>
      </div>
      <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded">{format}</span>
    </div>
  );
}
