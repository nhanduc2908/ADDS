"use server";

import { getDb } from "@/db";
import { users, hashPassword } from "@/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";



export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  redirect("/login");
}

export async function createUserAction(formData: FormData) {
  const db = getDb();
  if (!db) {
    return { error: "Database not available" };
  }

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
  const db = getDb();
  if (!db) {
    return { error: "Database not available" };
  }

  const [targetUser] = await db.select().from(users).where(eq(users.id, userId));

  if (!targetUser) {
    return { error: "User not found" };
  }

  await db.delete(users).where(eq(users.id, userId));
}
