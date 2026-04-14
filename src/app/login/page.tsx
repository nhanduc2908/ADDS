"use client";

import { loginAction } from "@/lib/actions";
import { quickLoginAction } from "@/lib/quick-login";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  async function handleQuickLogin(formData: FormData) {
    const result = await quickLoginAction(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h1>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-3 font-medium">Đăng nhập nhanh (Demo):</p>
          <div className="space-y-2">
            <form action={handleQuickLogin}>
              <input type="hidden" name="type" value="admin" />
              <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 text-sm">
                Đăng nhập Admin
              </button>
            </form>
            <form action={handleQuickLogin}>
              <input type="hidden" name="type" value="manager" />
              <button className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 text-sm">
                Đăng nhập Manager
              </button>
            </form>
            <form action={handleQuickLogin}>
              <input type="hidden" name="type" value="user" />
              <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm">
                Đăng nhập User
              </button>
            </form>
          </div>
        </div>

        <div className="border-t pt-6">
          <p className="text-sm text-gray-600 mb-3">Đăng nhập bằng tài khoản:</p>
          <form action={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mật khẩu</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
