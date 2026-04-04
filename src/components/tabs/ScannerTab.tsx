"use client";

import { useState } from "react";
import type { ScanResult, ScanCheck } from "@/lib/types";

const statusIcons: Record<string, string> = {
  pass: "✅",
  fail: "❌",
  warning: "⚠️",
  info: "ℹ️",
  error: "💥",
};

export function ScannerTab() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<Array<{ url: string; score: number; grade: string; time: string }>>([]);

  const handleScan = async () => {
    if (!url.trim()) return;
    setScanning(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Scan failed");
      }

      const data: ScanResult = await res.json();
      setResult(data);
      setHistory((prev) => [
        { url: data.url, score: data.score, grade: data.grade, time: new Date().toLocaleTimeString("vi-VN") },
        ...prev.slice(0, 9),
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định");
    } finally {
      setScanning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !scanning) handleScan();
  };

  const gradeColors: Record<string, string> = {
    "A+": "text-green-400 bg-green-500/20 border-green-500/30",
    A: "text-green-400 bg-green-500/20 border-green-500/30",
    B: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30",
    C: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
    D: "text-orange-400 bg-orange-500/20 border-orange-500/30",
    F: "text-red-400 bg-red-500/20 border-red-500/30",
  };

  const statusColors: Record<string, string> = {
    pass: "border-l-green-500",
    fail: "border-l-red-500",
    warning: "border-l-yellow-500",
    info: "border-l-blue-500",
    error: "border-l-red-500",
  };

  const categories = result
    ? [...new Set(result.checks.map((c) => c.categoryVi))]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">Quét bảo mật Website</h2>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập URL website (VD: example.com hoặc https://example.com)"
              className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-4 py-3 pl-10 border border-slate-600 focus:border-cyan-500 focus:outline-none"
              disabled={scanning}
            />
            <span className="absolute left-3 top-3.5 text-slate-400">🌐</span>
          </div>
          <button
            onClick={handleScan}
            disabled={scanning || !url.trim()}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {scanning ? "⏳ Đang quét..." : "🔍 Quét ngay"}
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-400 mt-2">❌ {error}</p>
        )}
        <p className="text-xs text-slate-500 mt-2">
          Kiểm tra: HTTPS, Security Headers, Cookie, CORS, XSS, CSRF, Mixed Content, Information Disclosure
        </p>
      </div>

      {scanning && (
        <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
          <div className="text-4xl mb-3 animate-pulse">🔍</div>
          <p className="text-slate-300 text-sm">Đang quét bảo mật...</p>
          <p className="text-slate-500 text-xs mt-1">{url}</p>
          <div className="mt-4 flex justify-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {result && !scanning && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <div className={`col-span-2 lg:col-span-1 rounded-xl p-4 border text-center ${gradeColors[result.grade]}`}>
              <p className="text-xs uppercase">Grade</p>
              <p className="text-4xl font-bold">{result.grade}</p>
              <p className="text-sm">{result.score}%</p>
            </div>
            <div className="rounded-lg p-3 border bg-slate-800/50 border-slate-700">
              <p className="text-xs text-slate-400">HTTP</p>
              <p className={`text-lg font-bold ${result.statusCode >= 200 && result.statusCode < 400 ? "text-green-400" : "text-red-400"}`}>
                {result.statusCode}
              </p>
            </div>
            <div className="rounded-lg p-3 border bg-slate-800/50 border-slate-700">
              <p className="text-xs text-slate-400">Thời gian</p>
              <p className={`text-lg font-bold ${result.responseTime < 1000 ? "text-green-400" : result.responseTime < 3000 ? "text-yellow-400" : "text-red-400"}`}>
                {result.responseTime}ms
              </p>
            </div>
            <div className="rounded-lg p-3 border bg-green-500/10 border-green-500/30">
              <p className="text-xs text-green-400">Đạt</p>
              <p className="text-lg font-bold text-green-400">{result.summary.passed}</p>
            </div>
            <div className="rounded-lg p-3 border bg-red-500/10 border-red-500/30">
              <p className="text-xs text-red-400">Lỗi</p>
              <p className="text-lg font-bold text-red-400">{result.summary.failed}</p>
            </div>
            <div className="rounded-lg p-3 border bg-yellow-500/10 border-yellow-500/30">
              <p className="text-xs text-yellow-400">Cảnh báo</p>
              <p className="text-lg font-bold text-yellow-400">{result.summary.warnings}</p>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Tổng quan điểm</p>
            <div className="h-4 bg-slate-700 rounded-full overflow-hidden flex">
              <div className="h-full bg-green-500" style={{ width: `${(result.summary.passed / result.summary.total) * 100}%` }} />
              <div className="h-full bg-yellow-500" style={{ width: `${(result.summary.warnings / result.summary.total) * 100}%` }} />
              <div className="h-full bg-red-500" style={{ width: `${(result.summary.failed / result.summary.total) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>{result.url}</span>
              <span>{new Date(result.scannedAt).toLocaleString("vi-VN")}</span>
            </div>
          </div>

          {categories.map((cat) => {
            const catChecks = result.checks.filter((c) => c.categoryVi === cat);
            return (
              <div key={cat} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-200">{cat}</span>
                  <span className="text-xs text-slate-500">
                    {catChecks.filter((c) => c.status === "pass").length}/{catChecks.length} đạt
                  </span>
                </div>
                <div className="divide-y divide-slate-700/50">
                  {catChecks.map((check) => (
                    <CheckRow key={check.id} check={check} statusClass={statusColors[check.status]} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {history.length > 0 && !result && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Lịch sử quét</h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded bg-slate-800">
                <span className={`text-xs px-2 py-0.5 rounded border ${gradeColors[h.grade]}`}>{h.grade}</span>
                <span className="text-sm text-slate-300 flex-1 truncate">{h.url}</span>
                <span className="text-xs text-slate-500">{h.score}%</span>
                <span className="text-xs text-slate-500">{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && !scanning && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Kiểm tra thực hiện</h3>
            <div className="space-y-2 text-xs text-slate-400">
              <p>🔒 <strong className="text-slate-300">HTTPS / SSL</strong> - Mã hóa kết nối</p>
              <p>🛡️ <strong className="text-slate-300">Security Headers</strong> - HSTS, CSP, X-Frame-Options...</p>
              <p>🍪 <strong className="text-slate-300">Cookie Security</strong> - Secure, HttpOnly, SameSite</p>
              <p>🌐 <strong className="text-slate-300">CORS</strong> - Cross-Origin Resource Sharing</p>
              <p>🔗 <strong className="text-slate-300">Mixed Content</strong> - Nội dung hỗn hợp HTTP/HTTPS</p>
              <p>📜 <strong className="text-slate-300">Script Integrity</strong> - SRI cho script CDN</p>
              <p>📝 <strong className="text-slate-300">Form Security</strong> - CSRF protection</p>
              <p>ℹ️ <strong className="text-slate-300">Information Disclosure</strong> - Lộ thông tin server</p>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Thang điểm</h3>
            <div className="space-y-2">
              <GradeInfo grade="A+" range="95-100%" desc="Bảo mật xuất sắc" color="text-green-400" />
              <GradeInfo grade="A" range="85-94%" desc="Bảo mật tốt" color="text-green-400" />
              <GradeInfo grade="B" range="70-84%" desc="Bảo mật khá" color="text-cyan-400" />
              <GradeInfo grade="C" range="55-69%" desc="Bảo mật trung bình" color="text-yellow-400" />
              <GradeInfo grade="D" range="40-54%" desc="Bảo mật yếu" color="text-orange-400" />
              <GradeInfo grade="F" range="0-39%" desc="Bảo mật rất kém" color="text-red-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckRow({ check, statusClass }: { check: ScanCheck; statusClass: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`px-4 py-3 border-l-4 ${statusClass} hover:bg-slate-800/30`}>
      <div
        className="flex items-start gap-3 cursor-pointer"
        onClick={() => (check.details || check.recommendation) && setExpanded(!expanded)}
      >
        <span className="text-base shrink-0">{statusIcons[check.status]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-200">{check.nameVi}</span>
            {check.status !== "pass" && check.status !== "info" && (
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                check.severity === "critical" ? "bg-red-500/20 text-red-400" :
                check.severity === "high" ? "bg-orange-500/20 text-orange-400" :
                check.severity === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-blue-500/20 text-blue-400"
              }`}>
                {check.severity}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{check.messageVi}</p>
          {expanded && (
            <div className="mt-2 space-y-1.5">
              {check.details && (
                <p className="text-xs text-slate-500 bg-slate-800 rounded px-2 py-1">{check.details}</p>
              )}
              {check.recommendation && (
                <div className="text-xs bg-green-500/10 rounded px-2 py-1">
                  <span className="text-green-400 font-medium">Khuyến nghị: </span>
                  <span className="text-green-300">{check.recommendation}</span>
                </div>
              )}
            </div>
          )}
        </div>
        {(check.details || check.recommendation) && (
          <span className="text-slate-500 text-xs shrink-0">{expanded ? "▲" : "▼"}</span>
        )}
      </div>
    </div>
  );
}

function GradeInfo({ grade, range, desc, color }: { grade: string; range: string; desc: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-lg font-bold w-8 ${color}`}>{grade}</span>
      <span className="text-xs text-slate-500 w-16">{range}</span>
      <span className="text-xs text-slate-400">{desc}</span>
    </div>
  );
}
