"use server";

import { login as authLogin, logout as authLogout, requireRole, type UserRole } from "@/lib/auth";
import { db } from "@/db";
import { users, hashPassword } from "@/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const result = await authLogin(email, password);

  if (result.error) {
    return { error: result.error };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await authLogout();
  redirect("/login");
}

export async function createUserAction(formData: FormData) {
  await requireRole("manager", "admin");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as UserRole;

  if (!name || !email || !password || !role) {
    return { error: "All fields are required" };
  }

  if (!["admin", "manager", "user"].includes(role)) {
    return { error: "Invalid role" };
  }

  const currentUser = await requireRole("manager", "admin");
  
  if (role === "admin" && currentUser.role !== "admin") {
    return { error: "Only admins can create admin accounts" };
  }

  if (role === "manager" && currentUser.role !== "admin") {
    return { error: "Only admins can create manager accounts" };
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
    role,
  });

  redirect("/admin/users");
}

export async function deleteUserAction(userId: number) {
  await requireRole("manager", "admin");
  
  const currentUser = await requireRole("manager", "admin");
  
  if (currentUser.id === userId) {
    return { error: "Cannot delete your own account" };
  }

  const [targetUser] = await db.select().from(users).where(eq(users.id, userId));
  
  if (targetUser.role === "admin" && currentUser.role !== "admin") {
    return { error: "Only admins can delete admin accounts" };
  }

  await db.delete(users).where(eq(users.id, userId));
}
