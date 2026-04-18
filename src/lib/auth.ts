import { getDb } from "@/db";
import { users, sessions, hashPassword, verifyPassword } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

const SESSION_COOKIE = "session_id";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export type UserRole = "admin" | "manager" | "user";

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export async function login(
  email: string,
  password: string
): Promise<{ error?: string }> {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!user) {
    return { error: "Invalid email or password" };
  }

  const valid = await verifyPassword(user.password, password);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  const sessionId = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await db.insert(sessions).values({
    id: sessionId,
    userId: user.id,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return {};
}

export async function logout(): Promise<void> {
  const db = getDb();
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (cookie && db) {
    await db
      .delete(sessions)
      .where(eq(sessions.id, cookie.value));
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const db = getDb();
  if (!db) return null;

  const cookieStore = await cookies();
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
    role: user.role as UserRole,
  };
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(...roles: UserRole[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}
