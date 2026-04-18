"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { clientLogout } from "@/lib/client-utils";

const ROLE_FEATURES = {
  admin: [
    { name: "Người dùng", desc: "Quản lý tài khoản người dùng", href: "/admin/users", icon: "👥", color: "red", stats: "127 users" },
    { name: "Security Dashboard", desc: "Đánh giá bảo mật, quét lỗ hổng", href: "/security", icon: "🛡️", color: "blue", stats: "94% compliant" },
    { name: "Báo cáo", desc: "Xem và xuất báo cáo bảo mật", href: "/reports", icon: "📊", color: "green", stats: "12 reports" },
    { name: "Cài đặt", desc: "Cấu hình hệ thống", href: "/settings", icon: "⚙️", color: "gray", stats: "System config" },
    { name: "Nhật ký", desc: "Lịch sử hoạt động người dùng", href: "/audit", icon: "📝", color: "yellow", stats: "245 entries" },
  ],
  manager: [
    { name: "Người dùng", desc: "Quản lý tài khoản người dùng", href: "/admin/users", icon: "👥", color: "red", stats: "89 users" },
    { name: "Security Dashboard", desc: "Đánh giá bảo mật, quét lỗ hổng", href: "/security", icon: "🛡️", color: "blue", stats: "87% compliant" },
    { name: "Báo cáo", desc: "Xem và xuất báo cáo bảo mật", href: "/reports", icon: "📊", color: "green", stats: "8 reports" },
    { name: "Đội ngũ", desc: "Quản lý đội ngũ bảo mật", href: "/team", icon: "👨‍💼", color: "purple", stats: "12 members" },
  ],
  user: [
    { name: "Security Dashboard", desc: "Đánh giá bảo mật, quét lỗ hổng", href: "/security", icon: "🛡️", color: "blue", stats: "85% compliant" },
  ],
};

const colorStyles = {
  red: { bg: "bg-red-900/30 dark:bg-red-900/30", border: "border-red-800 dark:border-red-800", hover: "hover:border-red-700", text: "text-red-500 dark:text-red-400" },
  blue: { bg: "bg-blue-900/30 dark:bg-blue-900/30", border: "border-blue-800 dark:border-blue-800", hover: "hover:border-blue-700", text: "text-blue-500 dark:text-blue-400" },
  green: { bg: "bg-green-900/30 dark:bg-green-900/30", border: "border-green-800 dark:border-green-800", hover: "hover:border-green-700", text: "text-green-500 dark:text-green-400" },
  gray: { bg: "bg-slate-200 dark:bg-slate-800", border: "border-slate-300 dark:border-slate-700", hover: "hover:border-slate-400 dark:hover:border-slate-600", text: "text-slate-600 dark:text-slate-400" },
  yellow: { bg: "bg-yellow-900/30 dark:bg-yellow-900/30", border: "border-yellow-800 dark:border-yellow-800", hover: "hover:border-yellow-700", text: "text-yellow-500 dark:text-yellow-400" },
  purple: { bg: "bg-purple-900/30 dark:bg-purple-900/30", border: "border-purple-800 dark:border-purple-800", hover: "hover:border-purple-700", text: "text-purple-500 dark:text-purple-400" },
};

const roleTitles = {
  admin: { title: "Quản trị viên", desc: "Quản lý toàn bộ hệ thống bảo mật" },
  manager: { title: "Quản lý Bảo mật", desc: "Giám sát và quản lý đội ngũ bảo mật" },
  user: { title: "Chuyên viên Bảo mật", desc: "Thực hiện đánh giá và quét bảo mật" },
};

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem("theme");
  return saved ? saved === "dark" : true;
}

function AdminDashboard({ user }: { user: { id: number; email: string; name: string; role: string } }) {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "Tổng người dùng", value: "127", change: "+12%", icon: "👥", color: "blue" },
    { label: "Hệ thống compliant", value: "94%", change: "+5%", icon: "🛡️", color: "green" },
    { label: "Cảnh báo bảo mật", value: "3", change: "-2", icon: "⚠️", color: "yellow" },
    { label: "Báo cáo tháng", value: "12", change: "+3", icon: "📊", color: "purple" },
  ];

  const recentActivities = [
    { time: "10:30", action: "Thêm người dùng mới", user: "manager@security.vn", status: "success" },
    { time: "09:45", action: "Cập nhật cài đặt hệ thống", user: "admin@security.vn", status: "success" },
    { time: "09:15", action: "Xuất báo cáo bảo mật", user: "manager@security.vn", status: "success" },
    { time: "08:30", action: "Đăng nhập hệ thống", user: "admin@security.vn", status: "success" },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-900 rounded-lg p-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className={`text-sm ${
                  stat.change.startsWith('+') ? 'text-green-400' :
                  stat.change.startsWith('-') ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {stat.change}
                </p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Features Grid */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Chức năng quản lý</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {ROLE_FEATURES.admin.map((feature) => {
              const style = colorStyles[feature.color as keyof typeof colorStyles];
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className={`block p-4 rounded-lg border ${style.bg} ${style.border} ${style.hover} transition group`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-300">{feature.stats}</span>
                  </div>
                  <h4 className={`text-sm font-bold mb-1 ${style.text}`}>{feature.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{feature.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
            <h4 className="text-sm font-semibold mb-3 text-slate-300">Hành động nhanh</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm transition">
                Thêm người dùng mới
              </button>
              <button className="w-full text-left px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm transition">
                Xuất báo cáo
              </button>
              <button className="w-full text-left px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm transition">
                Cập nhật cài đặt
              </button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
            <h4 className="text-sm font-semibold mb-3 text-slate-300">Hoạt động gần đây</h4>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 w-12">{activity.time}</span>
                  <div className="flex-1">
                    <p className="text-slate-300">{activity.action}</p>
                    <p className="text-slate-500">{activity.user}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    activity.status === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManagerDashboard({ user }: { user: { id: number; email: string; name: string; role: string } }) {
  const stats = [
    { label: "Đội ngũ quản lý", value: "12", change: "+2", icon: "👨‍💼", color: "purple" },
    { label: "Người dùng active", value: "89", change: "+8", icon: "👥", color: "blue" },
    { label: "Đánh giá hoàn thành", value: "87%", change: "+3%", icon: "✅", color: "green" },
    { label: "Báo cáo xuất", value: "8", change: "+1", icon: "📊", color: "yellow" },
  ];

  const teamMembers = [
    { name: "Nguyễn Văn A", role: "Security Analyst", status: "online", avatar: "👨‍💻" },
    { name: "Trần Thị B", role: "Compliance Officer", status: "offline", avatar: "👩‍💼" },
    { name: "Lê Minh C", role: "Penetration Tester", status: "online", avatar: "🧑‍💻" },
    { name: "Phạm Thị D", role: "Risk Analyst", status: "away", avatar: "👩‍🔬" },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-900 rounded-lg p-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className={`text-sm ${
                  stat.change.startsWith('+') ? 'text-green-400' :
                  stat.change.startsWith('-') ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {stat.change}
                </p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Features Grid */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Công cụ quản lý</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {ROLE_FEATURES.manager.map((feature) => {
              const style = colorStyles[feature.color as keyof typeof colorStyles];
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className={`block p-4 rounded-lg border ${style.bg} ${style.border} ${style.hover} transition group`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-300">{feature.stats}</span>
                  </div>
                  <h4 className={`text-sm font-bold mb-1 ${style.text}`}>{feature.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{feature.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Team Overview */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
            <h4 className="text-sm font-semibold mb-3 text-slate-300">Đội ngũ bảo mật</h4>
            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-lg">{member.avatar}</span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-300">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    member.status === 'online' ? 'bg-green-900 text-green-200' :
                    member.status === 'away' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
            <h4 className="text-sm font-semibold mb-3 text-slate-300">Công việc chờ xử lý</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span className="text-slate-300">Xem xét báo cáo Q1</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span className="text-slate-300">Đánh giá hiệu suất đội ngũ</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span className="text-slate-300">Cập nhật chính sách bảo mật</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardClient({ user }: { user: { id: number; email: string; name: string; role: string } }) {
  const dark = useMemo(() => getInitialTheme(), []);

  const features = ROLE_FEATURES[user.role as keyof typeof ROLE_FEATURES] || ROLE_FEATURES.user;
  const roleInfo = roleTitles[user.role as keyof typeof roleTitles] || roleTitles.user;

  // Render specialized dashboard for admin and manager
  if (user.role === "admin") {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
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
              <span className={`px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200`}>
                ADMIN
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
          <AdminDashboard user={user} />
        </main>
      </div>
    );
  }

  if (user.role === "manager") {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Manager Dashboard</h1>
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
              <span className={`px-2 py-1 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200`}>
                MANAGER
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
          <ManagerDashboard user={user} />
        </main>
      </div>
    );
  }

  // Default dashboard for users
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