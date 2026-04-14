import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getSession();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Bạn chưa đăng nhập</p>
          <a href="/login" className="text-blue-600 hover:underline">
            Đăng nhập
          </a>
        </div>
      </div>
    );
  }

  const { logoutAction } = await import("@/lib/actions");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {user.name} ({user.role})
            </span>
            <form action={logoutAction}>
              <button className="text-blue-600 hover:underline">
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Chào mừng, {user.name}!</h2>
          <p className="text-gray-600">
            Vai trò của bạn: <span className="font-medium capitalize">{user.role}</span>
          </p>
          {(user.role === "manager" || user.role === "admin") && (
            <div className="mt-4 p-4 bg-blue-50 rounded">
              <a href="/admin/users" className="text-blue-600 hover:underline">
                Quản lý người dùng →
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
