"use client";

import { useState } from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/lib/actions";

const auditLogs = [
  { id: 1, action: "Đăng nhập hệ thống", user: "admin@example.com", role: "admin", ip: "192.168.1.100", time: "2026-04-14 09:30:00" },
  { id: 2, action: "Tạo người dùng mới", user: "admin@example.com", role: "admin", ip: "192.168.1.100", time: "2026-04-14 09:25:00" },
  { id: 3, action: "Cập nhật cài đặt", user: "admin@example.com", role: "admin", ip: "192.168.1.100", time: "2026-04-14 09:20:00" },
  { id: 4, action: "Xuất báo cáo", user: "manager@example.com", role: "manager", ip: "192.168.1.101", time: "2026-04-14 08:45:00" },
  { id: 5, action: "Đăng nhập hệ thống", user: "manager@example.com", role: "manager", ip: "192.168.1.101", time: "2026-04-14 08:30:00" },
  { id: 6, action: "Đánh giá bảo mật", user: "user@example.com", role: "user", ip: "192.168.1.102", time: "2026-04-14 08:15:00" },
  { id: 7, action: "Đăng nhập hệ thống", user: "user@example.com", role: "user", ip: "192.168.1.102", time: "2026-04-14 08:00:00" },
  { id: 8, action: "Xóa phiên đăng nhập", user: "admin@example.com", role: "admin", ip: "192.168.1.100", time: "2026-04-13 17:00:00" },
  { id: 9, action: "Cập nhật profile", user: "manager@example.com", role: "manager", ip: "192.168.1.101", time: "2026-04-13 16:30:00" },
  { id: 10, action: "Đổi mật khẩu", user: "user@example.com", role: "user", ip: "192.168.1.102", time: "2026-04-13 15:00:00" },
];

const actionTypes = [
  { id: "all", name: "Tất cả" },
  { id: "login", name: "Đăng nhập" },
  { id: "create", name: "Tạo mới" },
  { id: "update", name: "Cập nhật" },
  { id: "delete", name: "Xóa" },
  { id: "export", name: "Xuất" },
];

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem("theme");
  return saved ? saved === "dark" : true;
}

export default function AuditPage() {
  const [user, setUser] = useState<{ id: number; email: string; name: string; role: string } | null>(null);
  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterRole, setFilterRole] = useState("all");

  if (typeof window !== "undefined" && !user) {
    getSession().then(setUser).catch(() => redirect("/login"));
  }

  const handleToggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    if (newDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = search === "" || 
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase());
    const matchesAction = filterAction === "all" || log.action.toLowerCase().includes(filterAction);
    const matchesRole = filterRole === "all" || log.role === filterRole;
    return matchesSearch && matchesAction && matchesRole;
  });

  const getActionColor = (action: string) => {
    if (action.includes("Đăng nhập")) return "text-blue-500";
    if (action.includes("Tạo")) return "text-green-500";
    if (action.includes("Cập nhật")) return "text-yellow-500";
    if (action.includes("Xóa")) return "text-red-500";
    if (action.includes("Xuất")) return "text-purple-500";
    return "text-slate-500";
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              ← Quay lại
            </Link>
            <h1 className="text-xl font-bold">Nhật ký hoạt động</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              user.role === "admin" ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200" :
              user.role === "manager" ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200" :
              "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"
            }`}>
              {user.role.toUpperCase()}
            </span>
            <span className="text-slate-600 dark:text-slate-400">{user.name}</span>
            <form action={logoutAction}>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg"
              />
            </div>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg"
            >
              {actionTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Hành động</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Người dùng</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Vai trò</th>
                <th className="px-4 py-3 text-left text-sm font-medium">IP</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-4 py-3 font-medium">
                    <span className={getActionColor(log.action)}>{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{log.user}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      log.role === "admin" ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200" :
                      log.role === "manager" ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200" :
                      "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"
                    }`}>
                      {log.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono text-sm">{log.ip}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Không tìm thấy nhật ký nào
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
