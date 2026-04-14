import { NextResponse } from "next/server";
import { requireRole, type UserRole } from "@/lib/auth";
import { db } from "@/db";
import { users, hashPassword } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    await requireRole("manager", "admin");

    const currentUser = await requireRole("manager", "admin");
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!["admin", "manager", "user"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (role === "admin" && currentUser.role !== "admin") {
      return NextResponse.json({ error: "Only admins can create admin accounts" }, { status: 403 });
    }

    if (role === "manager" && currentUser.role !== "admin") {
      return NextResponse.json({ error: "Only admins can create manager accounts" }, { status: 403 });
    }

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
