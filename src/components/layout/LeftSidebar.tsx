"use client";

import { useState } from "react";
import { TABS, DOMAINS, CRITERIA, EXPORT_FORMATS, SECURITY_STANDARDS } from "@/lib/data";
import { THREATS, NOTIFICATIONS, VULNERABILITIES, AUDIT_LOGS, COMPLIANCE_FRAMEWORKS } from "@/lib/sample-data";
import { downloadExport } from "@/lib/utils";
import type { Assessment, TabId } from "@/lib/types";

interface LeftSidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDomain: string;
  onDomainChange: (domainId: string) => void;
  assessment: Assessment;
  activeFileName: string | null;
}

export function LeftSidebar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  selectedDomain,
  onDomainChange,
  assessment,
  activeFileName,
}: LeftSidebarProps) {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;
  const criticalThreats = THREATS.filter((t) => t.severity === "critical").length;
  const openVulnerabilities = VULNERABILITIES.filter((v) => v.status === "open").length;
  const criticalVulnerabilities = VULNERABILITIES.filter((v) => v.severity === "critical").length;
  const failedAudits = AUDIT_LOGS.filter((l) => l.status === "failure").length;
  const complianceIssues = COMPLIANCE_FRAMEWORKS.filter((c) => c.status !== "compliant").length;
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

  const handleQuickAction = (action: TabId) => {
    onTabChange(action);
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col h-screen overflow-y-auto">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          Security Audit
        </h1>
        {activeFileName ? (
          <p className="text-xs text-cyan-300 mt-1 truncate">📂 {activeFileName}</p>
        ) : (
          <p className="text-xs text-slate-400 mt-1">Hệ thống đánh giá bảo mật</p>
        )}
      </div>

      <div className="p-3 border-b border-slate-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tiêu chí..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 pl-8 border border-slate-600 focus:border-cyan-500 focus:outline-none"
          />
          <span className="absolute left-2.5 top-2.5 text-slate-400 text-sm">🔍</span>
        </div>
      </div>

      <div className="p-3 border-b border-slate-700">
        <select
          value={selectedDomain}
          onChange={(e) => onDomainChange(e.target.value)}
          className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-600 focus:border-cyan-500 focus:outline-none"
        >
          <option value="">Tất cả lĩnh vực ({CRITERIA.length})</option>
          {DOMAINS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.icon} {d.nameVi} ({d.criteriaCount})
            </option>
          ))}
        </select>
      </div>

      <div className="p-3 border-b border-slate-700">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Tình trạng hệ thống</p>
        <div className="grid grid-cols-2 gap-2">
          <QuickStat 
            label="Lỗ hổng" 
            value={openVulnerabilities} 
            icon="🔴" 
            color={openVulnerabilities > 0 ? "text-red-400" : "text-green-400"}
            onClick={() => handleQuickAction("threats")}
          />
          <QuickStat 
            label="Audit" 
            value={failedAudits} 
            icon="📋" 
            color={failedAudits > 0 ? "text-orange-400" : "text-green-400"}
            onClick={() => handleQuickAction("compliance")}
          />
          <QuickStat 
            label="Tuân thủ" 
            value={complianceIssues} 
            icon="⚠️" 
            color={complianceIssues > 0 ? "text-yellow-400" : "text-green-400"}
            onClick={() => handleQuickAction("compliance")}
          />
          <QuickStat 
            label="Thông báo" 
            value={unreadCount} 
            icon="🔔" 
            color={unreadCount > 0 ? "text-cyan-400" : "text-slate-400"}
            onClick={() => handleQuickAction("notifications")}
          />
        </div>
      </div>

      <div className="p-3 border-b border-slate-700">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Thao tác nhanh</p>
        <div className="space-y-1">
          <QuickActionButton 
            label="Quét website" 
            icon="🌐" 
            onClick={() => handleQuickAction("scanner")}
          />
          <QuickActionButton 
            label="Tạo đánh giá mới" 
            icon="➕" 
            onClick={() => handleQuickAction("files")}
          />
          <QuickActionButton 
            label="Nhập dữ liệu" 
            icon="📥" 
            onClick={() => handleQuickAction("import")}
          />
          <QuickActionButton 
            label="Xem báo cáo" 
            icon="📊" 
            onClick={() => handleQuickAction("reports")}
          />
        </div>
      </div>

      <nav className="flex-1 p-2 overflow-y-auto">
        <p className="text-xs text-slate-500 uppercase tracking-wider px-2 py-2">Chức năng</p>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 mb-0.5 transition-colors ${
              activeTab === tab.id
                ? "bg-cyan-600/20 text-cyan-400 border border-cyan-600/30"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="flex-1">{tab.labelVi}</span>
            {tab.id === "notifications" && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">
                {unreadCount}
              </span>
            )}
            {tab.id === "threats" && criticalThreats > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">
                {criticalThreats}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-700">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Xuất báo cáo</p>
        <div className="grid grid-cols-3 gap-1">
          {EXPORT_FORMATS.slice(0, 6).map((fmt) => (
            <button
              key={fmt.format}
              onClick={() => handleExport(fmt.format)}
              disabled={exporting === fmt.format}
              className="flex flex-col items-center gap-0.5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors disabled:opacity-50"
              title={`Xuất ${fmt.label}`}
            >
              <span>{exporting === fmt.format ? "⏳" : fmt.icon}</span>
              <span>{fmt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-slate-700">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Tiêu chuẩn</p>
        <div className="flex flex-wrap gap-1">
          {SECURITY_STANDARDS.slice(0, 4).map((s) => (
            <button
              key={s.id}
              onClick={() => onTabChange("compliance")}
              className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
              title={s.nameVi}
            >
              {s.shortName}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function QuickStat({ 
  label, 
  value, 
  icon, 
  color, 
  onClick 
}: { 
  label: string; 
  value: number; 
  icon: string; 
  color: string;
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-1.5 p-2 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
    >
      <span>{icon}</span>
      <span className="text-xs text-slate-400">{label}</span>
      <span className={`ml-auto text-sm font-bold ${color}`}>{value}</span>
    </button>
  );
}

function QuickActionButton({ 
  label, 
  icon, 
  onClick 
}: { 
  label: string; 
  icon: string; 
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-300 transition-colors"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
