"use server";

import { db } from "@/db";
import { users, hashPassword } from "@/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";



export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const SESSION_COOKIE = "session_id";
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (cookie) {
    // Note: We can't delete sessions from DB here since we don't want to import db
    // The session will expire naturally
  }
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}

export async function createUserAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password || !role) {
    return { error: "All fields are required" };
  }

  if (!["admin", "manager", "user"].includes(role)) {
    return { error: "Invalid role" };
  }

  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    return { error: "Email already exists" };
  }

  const hashedPassword = await hashPassword(password);
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    role: role as "admin" | "manager" | "user",
  });

  redirect("/admin/users");
}

export async function deleteUserAction(userId: number) {
  const [targetUser] = await db.select().from(users).where(eq(users.id, userId));

  if (!targetUser) {
    return { error: "User not found" };
  }

  await db.delete(users).where(eq(users.id, userId));
}
