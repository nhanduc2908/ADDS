"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { clientLogout } from "@/lib/client-utils";

const ROLE_FEATURES = {
  admin: [
    { name: "Người dùng", desc: "Quản lý tài khoản người dùng", href: "/admin/users", icon: "👥", color: "red" },
    { name: "Security Dashboard", desc: "Đánh giá bảo mật, quét lỗ hổng", href: "/security", icon: "🛡️", color: "blue" },
    { name: "Báo cáo", desc: "Xem và xuất báo cáo bảo mật", href: "/reports", icon: "📊", color: "green" },
    { name: "Cài đặt", desc: "Cấu hình hệ thống", href: "/settings", icon: "⚙️", color: "gray" },
    { name: "Nhật ký", desc: "Lịch sử hoạt động người dùng", href: "/audit", icon: "📝", color: "yellow" },
  ],
  manager: [
    { name: "Người dùng", desc: "Quản lý tài khoản người dùng", href: "/admin/users", icon: "👥", color: "red" },
    { name: "Security Dashboard", desc: "Đánh giá bảo mật, quét lỗ hổng", href: "/security", icon: "🛡️", color: "blue" },
    { name: "Báo cáo", desc: "Xem và xuất báo cáo bảo mật", href: "/reports", icon: "📊", color: "green" },
  ],
  user: [
    { name: "Security Dashboard", desc: "Đánh giá bảo mật, quét lỗ hổng", href: "/security", icon: "🛡️", color: "blue" },
  ],
};

const colorStyles = {
  red: { bg: "bg-red-900/30 dark:bg-red-900/30", border: "border-red-800 dark:border-red-800", hover: "hover:border-red-700", text: "text-red-500 dark:text-red-400" },
  blue: { bg: "bg-blue-900/30 dark:bg-blue-900/30", border: "border-blue-800 dark:border-blue-800", hover: "hover:border-blue-700", text: "text-blue-500 dark:text-blue-400" },
  green: { bg: "bg-green-900/30 dark:bg-green-900/30", border: "border-green-800 dark:border-green-800", hover: "hover:border-green-700", text: "text-green-500 dark:text-green-400" },
  gray: { bg: "bg-slate-200 dark:bg-slate-800", border: "border-slate-300 dark:border-slate-700", hover: "hover:border-slate-400 dark:hover:border-slate-600", text: "text-slate-600 dark:text-slate-400" },
  yellow: { bg: "bg-yellow-900/30 dark:bg-yellow-900/30", border: "border-yellow-800 dark:border-yellow-800", hover: "hover:border-yellow-700", text: "text-yellow-500 dark:text-yellow-400" },
};

const roleTitles = {
  admin: { title: "Quản trị viên", desc: "Quản lý toàn bộ hệ thống" },
  manager: { title: "Quản lý", desc: "Quản lý người dùng và đánh giá bảo mật" },
  user: { title: "Người dùng", desc: "Sử dụng hệ thống đánh giá bảo mật" },
};

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem("theme");
  return saved ? saved === "dark" : true;
}

export default function DashboardClient({ user }: { user: { id: number; email: string; name: string; role: string } }) {
  const dark = useMemo(() => getInitialTheme(), []);

  const features = ROLE_FEATURES[user.role as keyof typeof ROLE_FEATURES] || ROLE_FEATURES.user;
  const roleInfo = roleTitles[user.role as keyof typeof roleTitles] || roleTitles.user;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const newDark = !dark;
                localStorage.setItem("theme", newDark ? "dark" : "light");
                if (newDark) {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
                window.location.reload();
              }}
              className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
              title={dark ? "Chế độ sáng" : "Chế độ tối"}
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
            <form action={clientLogout}>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2">Chào mừng, {user.name}!</h2>
          <p className="text-slate-600 dark:text-slate-400">{roleInfo.title} - {roleInfo.desc}</p>
        </div>

        <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">Chức năng</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const style = colorStyles[feature.color as keyof typeof colorStyles];
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className={`block p-6 rounded-lg border ${style.bg} ${style.border} ${style.hover} transition`}
              >
                <span className="text-2xl mb-2 block">{feature.icon}</span>
                <h4 className={`text-lg font-bold mb-1 ${style.text}`}>{feature.name}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{feature.desc}</p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}