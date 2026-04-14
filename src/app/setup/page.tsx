"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setupAdminAction } from "@/lib/setup";

export default function SetupPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const result = await setupAdminAction(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Thiết lập Admin</h1>
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Mã bảo mật</label>
            <input
              type="password"
              name="key"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Tạo tài khoản Admin
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-500 text-center">
          Key: setup-admin-2024
        </p>
      </div>
    </div>
  );
}
