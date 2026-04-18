"use server";

import { getDb } from "@/db";
import { users, hashPassword } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function setupAdminAction(formData: FormData) {
  const db = getDb();
  if (!db) {
    return { error: "Database not available" };
  }

  const key = formData.get("key") as string;

  if (key !== "setup-admin-2024") {
    return { error: "Invalid setup key" };
  }

  const adminPassword = await hashPassword("admin2026");

  const existing = await db.select().from(users).where(eq(users.username, "admin"));

  if (existing.length > 0) {
    return { error: "Admin already exists" };
  }

  await db.insert(users).values({
    name: "Nguyễn Văn Admin",
    username: "admin",
    email: "admin@security.vn",
    password: adminPassword,
    role: "admin",
  });

  redirect("/login");
}
