"use client";

import { useState } from "react";
import { createAssessmentFile, updateAssessmentFileStatus, downloadExport } from "@/lib/utils";
import type { AssessmentFile } from "@/lib/types";

interface FileManagerTabProps {
  files: AssessmentFile[];
  activeFileId: string | null;
  onCreateFile: (file: AssessmentFile) => void;
  onLoadFile: (fileId: string) => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFile: (fileId: string, name: string, systemName: string) => void;
}

export function FileManagerTab({
  files,
  activeFileId,
  onCreateFile,
  onLoadFile,
  onDeleteFile,
  onRenameFile,
}: FileManagerTabProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [newSystemName, setNewSystemName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTags, setNewTags] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSystem, setEditSystem] = useState("");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleCreate = () => {
    if (!newSystemName.trim()) return;
    const tags = newTags.split(",").map((t) => t.trim()).filter(Boolean);
    const file = createAssessmentFile(newSystemName.trim(), newDescription.trim(), tags);
    onCreateFile(file);
    setNewSystemName("");
    setNewDescription("");
    setNewTags("");
    setShowCreate(false);
  };

  const handleStartEdit = (file: AssessmentFile) => {
    setEditingId(file.id);
    setEditName(file.name);
    setEditSystem(file.systemName);
  };

  const handleSaveEdit = (fileId: string) => {
    onRenameFile(fileId, editName, editSystem);
    setEditingId(null);
  };

  const handleExport = async (file: AssessmentFile) => {
    await downloadExport("json", file.assessment);
  };

  const filteredFiles = files.filter((f) => {
    if (filter) {
      const q = filter.toLowerCase();
      if (!f.name.toLowerCase().includes(q) && !f.systemName.toLowerCase().includes(q) && !f.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (statusFilter !== "all" && f.status !== statusFilter) return false;
    return true;
  });

  const statusColors: Record<string, string> = {
    draft: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    "in-progress": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    completed: "bg-green-500/20 text-green-400 border-green-500/30",
    archived: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  const statusLabels: Record<string, string> = {
    draft: "Nháp",
    "in-progress": "Đang đánh giá",
    completed: "Hoàn thành",
    archived: "Lưu trữ",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">Quản lý file đánh giá</h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg transition-colors"
        >
          {showCreate ? "Hủy" : "+ Tạo file mới"}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-lg p-3 border bg-slate-800/50 border-slate-700">
          <p className="text-xs text-slate-400">Tổng file</p>
          <p className="text-xl font-bold text-slate-200">{files.length}</p>
        </div>
        <div className="rounded-lg p-3 border bg-slate-500/10 border-slate-500/30">
          <p className="text-xs text-slate-400">Nháp</p>
          <p className="text-xl font-bold text-slate-400">{files.filter((f) => f.status === "draft").length}</p>
        </div>
        <div className="rounded-lg p-3 border bg-yellow-500/10 border-yellow-500/30">
          <p className="text-xs text-yellow-400">Đang đánh giá</p>
          <p className="text-xl font-bold text-yellow-400">{files.filter((f) => f.status === "in-progress").length}</p>
        </div>
        <div className="rounded-lg p-3 border bg-green-500/10 border-green-500/30">
          <p className="text-xs text-green-400">Hoàn thành</p>
          <p className="text-xl font-bold text-green-400">{files.filter((f) => f.status === "completed").length}</p>
        </div>
      </div>

      {showCreate && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/30">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Tạo file đánh giá mới</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Tên hệ thống *</label>
              <input
                type="text"
                value={newSystemName}
                onChange={(e) => setNewSystemName(e.target.value)}
                placeholder="VD: Hệ thống ERP, Website chính..."
                className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Mô tả</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Mô tả ngắn về hệ thống..."
                className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Tags (phân cách bằng dấu phẩy)</label>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="production, critical, q2-2026"
                className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleCreate}
              disabled={!newSystemName.trim()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
            >
              Tạo file
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm file..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 pl-8 border border-slate-600 focus:border-cyan-500 focus:outline-none"
          />
          <span className="absolute left-2.5 top-2.5 text-slate-400 text-sm">🔍</span>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-600 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="draft">Nháp</option>
          <option value="in-progress">Đang đánh giá</option>
          <option value="completed">Hoàn thành</option>
          <option value="archived">Lưu trữ</option>
        </select>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
          <p className="text-4xl mb-3">📁</p>
          <p className="text-slate-400 text-sm">
            {files.length === 0 ? "Chưa có file đánh giá nào" : "Không tìm thấy file phù hợp"}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            {files.length === 0 ? 'Nhấn "Tạo file mới" để bắt đầu' : "Thử thay đổi bộ lọc"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFiles.map((file) => {
            const assessed = file.assessment.results.filter((r) => r.status !== "not-assessed").length;
            const total = file.assessment.results.length;
            const progress = total > 0 ? Math.round((assessed / total) * 100) : 0;
            const isActive = file.id === activeFileId;

            return (
              <div
                key={file.id}
                className={`bg-slate-800/50 rounded-xl p-4 border transition-colors ${
                  isActive ? "border-cyan-500/50 bg-cyan-500/5" : "border-slate-700 hover:border-slate-600"
                }`}
              >
                {editingId === file.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Tên hiển thị</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-600 focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Tên hệ thống</label>
                        <input
                          type="text"
                          value={editSystem}
                          onChange={(e) => setEditSystem(e.target.value)}
                          className="w-full bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-600 focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleSaveEdit(file.id)}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded-lg transition-colors"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-slate-200">{file.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded border ${statusColors[file.status]}`}>
                          {statusLabels[file.status]}
                        </span>
                        {isActive && (
                          <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            Đang mở
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Hệ thống: <span className="text-slate-300">{file.systemName}</span>
                        {file.description && <> — {file.description}</>}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden max-w-48">
                            <div
                              className={`h-full rounded-full ${
                                progress >= 80 ? "bg-green-500" : progress >= 40 ? "bg-yellow-500" : "bg-slate-500"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">{assessed}/{total} ({progress}%)</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          Điểm: <span className="text-cyan-400 font-medium">{file.assessment.overallScore}%</span>
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(file.updatedAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      {file.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {file.tags.map((tag, i) => (
                            <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onLoadFile(file.id)}
                        disabled={isActive}
                        className={`p-2 rounded-lg text-xs transition-colors ${
                          isActive
                            ? "bg-cyan-600/20 text-cyan-400 cursor-default"
                            : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                        }`}
                        title="Mở file"
                      >
                        📂
                      </button>
                      <button
                        onClick={() => handleExport(file)}
                        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-colors"
                        title="Xuất JSON"
                      >
                        📤
                      </button>
                      <button
                        onClick={() => handleStartEdit(file)}
                        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-colors"
                        title="Đổi tên"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDeleteFile(file.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-200 mb-2">Hướng dẫn</h3>
        <div className="space-y-1 text-xs text-slate-400">
          <p>• Mỗi file đánh giá đại diện cho <strong className="text-slate-300">một hệ thống</strong> cần đánh giá</p>
          <p>• Nhấn <strong className="text-slate-300">📂 Mở</strong> để chuyển sang đánh giá hệ thống đó</p>
          <p>• Nhấn <strong className="text-slate-300">📤 Xuất</strong> để tải file JSON của đánh giá</p>
          <p>• Có thể tạo file mới hoặc nhập từ file JSON/CSV qua tab <strong className="text-slate-300">Nhập dữ liệu</strong></p>
          <p>• Trạng thái tự động cập nhật: Nháp → Đang đánh giá → Hoàn thành</p>
        </div>
      </div>
    </div>
  );
}
