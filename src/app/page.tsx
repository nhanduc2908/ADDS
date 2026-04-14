import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const user = await getSession();
  
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Hệ thống Quản lý Bảo mật</h1>
          <p className="text-slate-400">Security Management System</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link href="/login" className="block p-6 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-center">
            <h2 className="text-xl font-bold mb-2">Đăng nhập</h2>
            <p className="text-blue-200">Quản lý tài khoản người dùng</p>
          </Link>
          <Link href="/security" className="block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition text-center">
            <h2 className="text-xl font-bold mb-2">Security Dashboard</h2>
            <p className="text-slate-400">Đánh giá bảo mật, quét lỗ hổng</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
