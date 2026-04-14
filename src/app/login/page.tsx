"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const DEMO_USERS = [
  { email: "admin@example.com", password: "admin123", name: "Admin", role: "admin", label: "Đăng nhập Admin", color: "red" },
  { email: "manager@example.com", password: "manager123", name: "Manager", role: "manager", label: "Đăng nhập Manager", color: "yellow" },
  { email: "user@example.com", password: "user123", name: "User", role: "user", label: "Đăng nhập User", color: "green" },
];

const roleColors = {
  admin: "bg-red-600 hover:bg-red-700",
  manager: "bg-yellow-600 hover:bg-yellow-700",
  user: "bg-green-600 hover:bg-green-700",
};

const roleRedirects = {
  admin: "/admin/users",
  manager: "/admin/users",
  user: "/security",
};

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const router = useRouter();

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

      router.push(roleRedirects[role as keyof typeof roleRedirects]);
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

      router.push(roleRedirects[data.role as keyof typeof roleRedirects] || "/security");
      router.refresh();
    } catch (err) {
      setError("Lỗi đăng nhập. Vui lòng thử lại.");
      setLoading("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-96 border border-slate-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Đăng nhập</h1>
        
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-3 font-medium">Đăng nhập nhanh:</p>
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

        <div className="border-t border-slate-700 pt-6">
          <p className="text-sm text-slate-400 mb-3">Đăng nhập bằng tài khoản:</p>
          <form action={async (formData) => {
            await handleManualLogin(formData);
          }} className="space-y-4">
            {error && (
              <div className="bg-red-900/50 text-red-300 p-2 rounded text-sm border border-red-800">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Mật khẩu</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
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
