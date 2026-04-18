"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

const DEMO_USERS = [
  { email: "admin@security.vn", password: "admin2026", name: "Nguyễn Văn Admin", role: "admin", label: "Đăng nhập Admin", color: "red" },
  { email: "manager@security.vn", password: "manager2026", name: "Trần Thị Manager", role: "manager", label: "Đăng nhập Manager", color: "yellow" },
  { email: "user@security.vn", password: "user2026", name: "Lê Minh User", role: "user", label: "Đăng nhập User", color: "green" },
];

const roleColors = {
  admin: "bg-red-600 hover:bg-red-700",
  manager: "bg-yellow-600 hover:bg-yellow-700",
  user: "bg-green-600 hover:bg-green-700",
};

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem("theme");
  return saved ? saved === "dark" : true;
}

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const router = useRouter();
  const dark = useMemo(() => getInitialTheme(), []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  async function handleQuickLogin(email: string, password: string, role: string) {
    setLoading(role);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading("");
        return;
      }

      // Redirect based on role
      if (data.user?.role === "admin" || data.user?.role === "manager") {
        router.push("/admin/users");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      setError("Lỗi đăng nhập. Vui lòng thử lại.");
      setLoading("");
    }
  }

  async function handleManualLogin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setLoading("manual");
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading("");
        return;
      }

      // Redirect based on role
      if (data.user?.role === "admin" || data.user?.role === "manager") {
        router.push("/admin/users");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      setError("Lỗi đăng nhập. Vui lòng thử lại.");
      setLoading("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-colors">
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
        className="fixed top-4 right-4 p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
        title={dark ? "Chế độ sáng" : "Chế độ tối"}
      >
        {dark ? "☀️" : "🌙"}
      </button>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl w-96 border border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">Đăng nhập</h1>
        
        <div className="mb-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 font-medium">Đăng nhập nhanh:</p>
          <div className="space-y-2">
            {DEMO_USERS.map((user) => (
              <button
                key={user.role}
                onClick={() => handleQuickLogin(user.email, user.password, user.role)}
                disabled={loading === user.role}
                className={`w-full ${roleColors[user.role as keyof typeof roleColors]} text-white py-2 rounded-md text-sm font-medium disabled:opacity-50`}
              >
                {loading === user.role ? "Đang đăng nhập..." : user.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Đăng nhập bằng tài khoản:</p>
          <form action={async (formData) => {
            await handleManualLogin(formData);
          }} className="space-y-4">
            {error && (
              <div className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 p-2 rounded text-sm border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Mật khẩu</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading === "manual"}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading === "manual" ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
