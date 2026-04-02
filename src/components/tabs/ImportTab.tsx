"use client";

import { useState, useRef } from "react";
import { importAssessment } from "@/lib/utils";
import type { Assessment } from "@/lib/types";
import type { ImportResult } from "@/lib/utils";

interface ImportTabProps {
  onImport: (assessment: Assessment) => void;
}

export function ImportTab({ onImport }: ImportTabProps) {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setLoading(true);
    setResult(null);
    try {
      const res = await importAssessment(file);
      setResult(res);
      if (res.success && res.assessment) {
        onImport(res.assessment);
      }
    } catch (err) {
      setResult({
        success: false,
        errors: [err instanceof Error ? err.message : "Lỗi không xác định"],
        imported: 0,
        skipped: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handlePasteJSON = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { importFromJSON } = await import("@/lib/utils");
      const res = importFromJSON(text);
      setResult(res);
      if (res.success && res.assessment) {
        onImport(res.assessment);
      }
    } catch (err) {
      setResult({
        success: false,
        errors: [err instanceof Error ? err.message : "Lỗi không xác định"],
        imported: 0,
        skipped: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">Nhập dữ liệu</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-xl p-8 border-2 border-dashed text-center transition-colors cursor-pointer ${
            dragOver
              ? "border-cyan-500 bg-cyan-500/10"
              : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="text-4xl mb-3">{loading ? "⏳" : "📥"}</div>
          <p className="text-sm font-medium text-slate-200 mb-1">
            {loading ? "Đang xử lý..." : "Kéo thả file vào đây hoặc click để chọn"}
          </p>
          <p className="text-xs text-slate-400">Hỗ trợ .json và .csv</p>
          {fileName && !loading && (
            <p className="text-xs text-cyan-400 mt-2">File: {fileName}</p>
          )}
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Dán JSON trực tiếp</h3>
          <textarea
            id="json-paste"
            placeholder='Dán JSON vào đây, ví dụ:
{
  "name": "Đánh giá Q2 2026",
  "results": [
    {"criterionId": "CR-001", "score": 4, "notes": "OK"},
    {"criterionId": "CR-002", "score": 3}
  ]
}'
            className="w-full h-32 bg-slate-800 text-slate-200 text-xs font-mono rounded-lg px-3 py-2 border border-slate-600 focus:border-cyan-500 focus:outline-none resize-none"
          />
          <button
            onClick={() => {
              const el = document.getElementById("json-paste") as HTMLTextAreaElement;
              handlePasteJSON(el.value);
            }}
            disabled={loading}
            className="mt-2 w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Nhập JSON"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Định dạng JSON hỗ trợ</h3>
          <pre className="text-xs text-slate-400 bg-slate-800 rounded-lg p-3 overflow-x-auto">{`{
  "name": "Đánh giá Q2 2026",
  "results": [
    {
      "criterionId": "CR-001",
      "score": 4,
      "status": "compliant",
      "notes": "Đạt yêu cầu"
    },
    {
      "criterionId": "CR-002",
      "score": 2,
      "status": "partial",
      "notes": "Cần cải thiện"
    }
  ]
}`}</pre>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Định dạng CSV hỗ trợ</h3>
          <pre className="text-xs text-slate-400 bg-slate-800 rounded-lg p-3 overflow-x-auto">{`criterionId,score,status,notes
CR-001,4,compliant,Đạt yêu cầu
CR-002,2,partial,Cần cải thiện
CR-003,5,compliant,Xuất sắc
CR-004,1,non-compliant,Chưa đạt`}</pre>
        </div>
      </div>

      {result && (
        <div className={`rounded-xl p-4 border ${result.success ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{result.success ? "✅" : "❌"}</span>
            <h3 className="text-sm font-semibold text-slate-200">
              {result.success ? "Nhập dữ liệu thành công" : "Nhập dữ liệu thất bại"}
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-slate-800 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-400">Đã nhập</p>
              <p className="text-lg font-bold text-green-400">{result.imported}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-400">Bỏ qua</p>
              <p className="text-lg font-bold text-yellow-400">{result.skipped}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-400">Lỗi</p>
              <p className="text-lg font-bold text-red-400">{result.errors.length}</p>
            </div>
          </div>
          {result.assessment && (
            <div className="bg-slate-800 rounded-lg p-2 mb-2">
              <p className="text-xs text-slate-400">Tên đánh giá</p>
              <p className="text-sm text-slate-200">{result.assessment.name}</p>
              <p className="text-xs text-slate-400 mt-1">Điểm tổng: <span className="text-cyan-400 font-bold">{result.assessment.overallScore}%</span></p>
            </div>
          )}
          {result.errors.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-red-400 font-medium mb-1">Chi tiết lỗi:</p>
              <div className="max-h-24 overflow-y-auto space-y-0.5">
                {result.errors.slice(0, 10).map((err, i) => (
                  <p key={i} className="text-xs text-red-300">• {err}</p>
                ))}
                {result.errors.length > 10 && (
                  <p className="text-xs text-red-300">... và {result.errors.length - 10} lỗi khác</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Hướng dẫn</h3>
        <div className="space-y-2 text-xs text-slate-400">
          <p>1. <strong>Xuất file JSON/CSV</strong> từ tab Báo cáo để có template chuẩn</p>
          <p>2. <strong>Chỉnh sửa file</strong> với điểm đánh giá thực tế</p>
          <p>3. <strong>Tải lên file</strong> bằng cách kéo thả hoặc chọn file</p>
          <p>4. <strong>Kiểm tra kết quả</strong> nhập và điểm tổng</p>
          <p className="text-cyan-400 mt-2">Lưu ý: criterionId phải khớp với mã tiêu chí trong hệ thống (CR-001 đến CR-203)</p>
        </div>
      </div>
    </div>
  );
}
