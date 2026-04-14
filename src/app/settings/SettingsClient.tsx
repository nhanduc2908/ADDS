"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/actions";

const systemSettings = {
  general: [
    { id: "siteName", name: "Tên trang web", value: "Security Audit System", type: "text" },
    { id: "siteUrl", name: "URL trang web", value: "https://security.example.com", type: "text" },
    { id: "timezone", name: "Múi giờ", value: "Asia/Ho_Chi_Minh", type: "select" },
    { id: "language", name: "Ngôn ngữ", value: "vi", type: "select" },
  ],
  security: [
    { id: "2fa", name: "Bảo mật 2FA", value: true, type: "boolean" },
    { id: "sessionTimeout", name: "Thời gian hết phiên (phút)", value: "60", type: "number" },
    { id: "passwordExpiry", name: "Hết hạn mật khẩu (ngày)", value: "90", type: "number" },
    { id: "loginAttempts", name: "Số lần đăng nhập sai tối đa", value: "5", type: "number" },
  ],
  notifications: [
    { id: "emailNotify", name: "Thông báo qua email", value: true, type: "boolean" },
    { id: "slackNotify", name: "Thông báo Slack", value: false, type: "boolean" },
    { id: "dailyReport", name: "Báo cáo hàng ngày", value: true, type: "boolean" },
    { id: "alertSeverity", name: "Cảnh báo mức", value: "medium", type: "select" },
  ],
};

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem("theme");
  return saved ? saved === "dark" : true;
}

export default function SettingsClient({ user }: { user: { id: number; email: string; name: string; role: string } }) {
  const [dark, setDark] = useState(getInitialTheme());
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(systemSettings);
  const [saved, setSaved] = useState(false);

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

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSetting = (category: string, id: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].map(s => 
        s.id === id ? { ...s, value } : s
      )
    }));
  };

  const tabs = [
    { id: "general", name: "Chung", icon: "⚙️" },
    { id: "security", name: "Bảo mật", icon: "🔒" },
    { id: "notifications", name: "Thông báo", icon: "🔔" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              ← Quay lại
            </Link>
            <h1 className="text-xl font-bold">Cài đặt</h1>
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
        {user.role !== "admin" && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg mb-6">
            Chỉ quản trị viên mới có quyền thay đổi cài đặt hệ thống.
          </div>
        )}

        <div className="flex gap-6">
          <div className="w-64 shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-2 transition ${
                    activeTab === tab.id
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-xl font-bold mb-6">
                {tabs.find(t => t.id === activeTab)?.name}
              </h2>

              <div className="space-y-6">
                {settings[activeTab as keyof typeof settings]?.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <label className="font-medium">{setting.name}</label>
                    </div>
                    <div>
                      {setting.type === "boolean" && user.role === "admin" && (
                        <button
                          onClick={() => updateSetting(activeTab, setting.id, !setting.value)}
                          className={`w-12 h-6 rounded-full transition ${
                            setting.value ? "bg-green-600" : "bg-slate-400"
                          }`}
                        >
                          <span className={`block w-6 h-6 bg-white rounded-full transition ${
                            setting.value ? "translate-x-6" : "translate-x-0"
                          }`} />
                        </button>
                      )}
                      {setting.type === "boolean" && user.role !== "admin" && (
                        <span className={`px-2 py-1 rounded text-sm ${
                          setting.value ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200" : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                        }`}>
                          {setting.value ? "Bật" : "Tắt"}
                        </span>
                      )}
                      {setting.type === "text" && user.role === "admin" && (
                        <input
                          type="text"
                          value={setting.value as string}
                          onChange={(e) => updateSetting(activeTab, setting.id, e.target.value)}
                          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg w-64"
                        />
                      )}
                      {setting.type === "text" && user.role !== "admin" && (
                        <span className="text-slate-600 dark:text-slate-400">{setting.value as string}</span>
                      )}
                      {setting.type === "number" && user.role === "admin" && (
                        <input
                          type="number"
                          value={setting.value as string}
                          onChange={(e) => updateSetting(activeTab, setting.id, e.target.value)}
                          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg w-24"
                        />
                      )}
                      {setting.type === "number" && user.role !== "admin" && (
                        <span className="text-slate-600 dark:text-slate-400">{setting.value as string}</span>
                      )}
                      {setting.type === "select" && user.role === "admin" && (
                        <select
                          value={setting.value as string}
                          onChange={(e) => updateSetting(activeTab, setting.id, e.target.value)}
                          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg"
                        >
                          {setting.id === "timezone" && (
                            <>
                              <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh</option>
                              <option value="Asia/Tokyo">Asia/Tokyo</option>
                              <option value="UTC">UTC</option>
                            </>
                          )}
                          {setting.id === "language" && (
                            <>
                              <option value="vi">Tiếng Việt</option>
                              <option value="en">English</option>
                            </>
                          )}
                          {setting.id === "alertSeverity" && (
                            <>
                              <option value="low">Thấp</option>
                              <option value="medium">Trung bình</option>
                              <option value="high">Cao</option>
                            </>
                          )}
                        </select>
                      )}
                      {setting.type === "select" && user.role !== "admin" && (
                        <span className="text-slate-600 dark:text-slate-400">{setting.value as string}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {user.role === "admin" && (
                <div className="mt-6 flex items-center gap-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Lưu cài đặt
                  </button>
                  {saved && (
                    <span className="text-green-600 dark:text-green-400">Đã lưu!</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
