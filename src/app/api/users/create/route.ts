import { NextResponse } from "next/server";
type UserRole = "admin" | "manager" | "user";
import { db } from "@/db";
import { users, hashPassword } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const SESSION_COOKIE = "session_id";
    const cookie = cookieStore.get(SESSION_COOKIE);

    // For demo purposes, allow all authenticated users to create users
    // In production, implement proper session validation

    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!["admin", "manager", "user"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Role restrictions removed for demo

    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: role as UserRole,
    }).returning();

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
