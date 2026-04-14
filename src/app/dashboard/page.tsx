import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/lib/actions";

export default async function DashboardPage() {
  const user = await getSession();
  
  if (!user) {
    redirect("/login");
  }

  const roleConfig = {
    admin: { title: "Quản trị viên", description: "Quản lý người dùng và hệ thống", color: "red" },
    manager: { title: "Quản lý", description: "Quản lý người dùng", color: "yellow" },
    user: { title: "Người dùng", description: "Sử dụng hệ thống đánh giá bảo mật", color: "green" },
  };

  const config = roleConfig[user.role as keyof typeof roleConfig];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              {user.name} ({config.title})
            </span>
            <form action={logoutAction}>
              <button className="text-blue-400 hover:text-blue-300">
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Chào mừng, {user.name}!</h2>
          <p className="text-slate-400">{config.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {(user.role === "admin" || user.role === "manager") && (
            <Link href="/admin/users" className="block p-6 bg-slate-900 rounded-lg border border-slate-800 hover:border-slate-700 transition">
              <h3 className="text-lg font-bold mb-2">Quản lý người dùng</h3>
              <p className="text-slate-400">Thêm, sửa, xóa tài khoản người dùng</p>
            </Link>
          )}
          
          <Link href="/security" className="block p-6 bg-blue-900 rounded-lg border border-blue-800 hover:border-blue-700 transition">
            <h3 className="text-lg font-bold mb-2">Security Dashboard</h3>
            <p className="text-blue-200">Đánh giá bảo mật, quét lỗ hổng</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
