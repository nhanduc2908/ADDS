"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateUserForm({ currentRole }: { currentRole: string }) {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    const res = await fetch("/api/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
          {error}
        </div>
      )}
      <input
        type="text"
        name="name"
        placeholder="Họ tên"
        required
        className="px-3 py-2 border rounded-md w-full"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="px-3 py-2 border rounded-md w-full"
      />
      <input
        type="password"
        name="password"
        placeholder="Mật khẩu"
        required
        className="px-3 py-2 border rounded-md w-full"
      />
      <select
        name="role"
        required
        className="px-3 py-2 border rounded-md w-full"
      >
        <option value="user">User</option>
        {currentRole === "admin" && (
          <>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </>
        )}
      </select>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
      >
        Thêm người dùng
      </button>
    </form>
  );
}
