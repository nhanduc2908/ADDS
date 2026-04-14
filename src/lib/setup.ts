"use server";

import { db } from "@/db";
import { users, hashPassword } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function setupAdminAction(formData: FormData) {
  const key = formData.get("key") as string;
  
  if (key !== "setup-admin-2024") {
    return { error: "Invalid setup key" };
  }

  const adminPassword = await hashPassword("admin123");
  
  const existing = await db.select().from(users).where(eq(users.email, "admin@example.com"));
  
  if (existing.length > 0) {
    return { error: "Admin already exists" };
  }

  await db.insert(users).values({
    name: "Admin",
    email: "admin@example.com",
    password: adminPassword,
    role: "admin",
  });

  redirect("/login");
}
