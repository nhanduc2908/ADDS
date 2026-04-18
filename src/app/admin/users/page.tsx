import { clientLogout } from "@/lib/client-utils";
import { CreateUserForm } from "@/components/auth/CreateUserForm";

export default async function UsersManagementPage() {
  const [{ redirect }, { getServerSession }, { getDb }, { users }] = await Promise.all([
    import("next/navigation"),
    import("@/lib/server-session"),
    import("@/db"),
    import("@/db/schema")
  ]);

  const db = getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const currentUser = await getServerSession();

  if (!currentUser || (currentUser.role !== "manager" && currentUser.role !== "admin")) {
    redirect("/login");
  }

  const allUsers = await db.select().from(users);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Quay lại
            </a>
            <h1 className="text-xl font-bold">Quản lý người dùng</h1>
          </div>
          <button
            onClick={clientLogout}
            className="text-blue-600 hover:underline"
          >
            Đăng xuất
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Danh sách người dùng</h2>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Thêm người dùng mới</h3>
            <CreateUserForm currentRole={currentUser!.role} />
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Tên</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Vai trò</th>
                <th className="text-left py-2">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-2">{user.id}</td>
                  <td className="py-2">{user.name}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      user.role === "admin" ? "bg-red-100 text-red-700" :
                      user.role === "manager" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-2">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
