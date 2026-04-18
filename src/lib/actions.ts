"use server";

import { getDb } from "@/db";
import { users, hashPassword } from "@/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";



export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required" };
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
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !username || !email || !password || !role) {
    return { error: "All fields are required" };
  }

  if (!["admin", "manager", "user"].includes(role)) {
    return { error: "Invalid role" };
  }

  const existingEmail = await db.select().from(users).where(eq(users.email, email));
  if (existingEmail.length > 0) {
    return { error: "Email already exists" };
  }

  const existingUsername = await db.select().from(users).where(eq(users.username, username));
  if (existingUsername.length > 0) {
    return { error: "Username already exists" };
  }

  const hashedPassword = await hashPassword(password);
  await db.insert(users).values({
    name,
    username,
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
