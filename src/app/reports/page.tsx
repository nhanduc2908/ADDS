import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
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

  return <ReportsClient user={user as { id: number; email: string; name: string; role: string }} />;
}
