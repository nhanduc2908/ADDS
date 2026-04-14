import { clientLogout } from "@/lib/client-utils";
import SecurityDashboardClient from "./SecurityDashboardClient";

export default async function SecurityPage() {
  const [{ redirect }, { cookies }, { db }, { users, sessions }, { eq, and, gt }] = await Promise.all([
    import("next/navigation"),
    import("next/headers"),
    import("@/db"),
    import("@/db/schema"),
    import("drizzle-orm")
  ]);

  const cookieStore = await cookies();
  const SESSION_COOKIE = "session_id";
  const cookie = cookieStore.get(SESSION_COOKIE);

  let user = null;
  if (cookie) {
    const [session] = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.id, cookie.value),
          gt(sessions.expiresAt, new Date())
        )
      );

    if (session) {
      const [userData] = await db
        .select()
        .from(users)
        .where(eq(users.id, session.userId));

      if (userData) {
        user = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role as string,
        };
      }
    }
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">Đăng nhập:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            (user as any).role === "admin" ? "bg-red-900 text-red-200" :
            (user as any).role === "manager" ? "bg-yellow-900 text-yellow-200" :
            "bg-green-900 text-green-200"
          }`}>
            {(user as any).role.toUpperCase()}
          </span>
          <span className="text-slate-300">{(user as any).name}</span>
        </div>
        <button
          onClick={clientLogout}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          Đăng xuất
        </button>
      </header>
      <div className="flex-1 flex">
        <SecurityDashboardClient />
      </div>
    </div>
  );
}
