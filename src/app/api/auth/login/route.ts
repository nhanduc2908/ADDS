import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users, sessions, hashPassword, verifyPassword } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

const SESSION_COOKIE = "session_id";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

const DEMO_ACCOUNTS: Record<string, { name: string; role: "admin" | "manager" | "user" }> = {
  "admin@security.vn": { name: "Nguyễn Văn Admin", role: "admin" },
  "manager@security.vn": { name: "Trần Thị Manager", role: "manager" },
  "user@security.vn": { name: "Lê Minh User", role: "user" },
};

type UserRole = "admin" | "manager" | "user";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email và mật khẩu là bắt buộc" }, { status: 400 });
    }

    let user: { id: number; name: string; role: UserRole; password: string } | null = null;
    const demoInfo = DEMO_ACCOUNTS[email];

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    if (demoInfo) {
      let [existingUser] = await db.select().from(users).where(eq(users.email, email));

      if (!existingUser) {
        const hashedPassword = await hashPassword(password);
        [existingUser] = await db.insert(users).values({
          email,
          password: hashedPassword,
          name: demoInfo.name,
          role: demoInfo.role,
        }).returning();
      }
      user = existingUser;
    } else {
      const [existingUser] = await db.select().from(users).where(eq(users.email, email));
      user = existingUser || null;
    }

    if (!user) {
      return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
    }

    const valid = await verifyPassword(user.password, password);
    if (!valid) {
      return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
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

    return NextResponse.json({
      success: true,
      user: { id: user.id, email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Lỗi đăng nhập. Vui lòng thử lại." }, { status: 500 });
  }
}
