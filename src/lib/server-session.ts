// Server-side session utility - only use in server components with dynamic imports
export async function getServerSession() {
  const { cookies } = await import("next/headers");
  const { getDb } = await import("@/db");
  const { users, sessions } = await import("@/db/schema");
  const { eq, and, gt } = await import("drizzle-orm");

  const db = getDb();
  if (!db) return null;

  const cookieStore = await cookies();
  const SESSION_COOKIE = "session_id";
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie) return null;

  const [session] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.id, cookie.value),
        gt(sessions.expiresAt, new Date())
      )
    );

  if (!session) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId));

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as string,
  };
}