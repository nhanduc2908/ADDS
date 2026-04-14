"use server";

import { db } from "@/db";
import { users, hashPassword } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const DEMO_USERS = {
  admin: { email: "admin@example.com", password: "admin123", role: "admin" as const, name: "Admin" },
  manager: { email: "manager@example.com", password: "manager123", role: "manager" as const, name: "Manager" },
  user: { email: "user@example.com", password: "user123", role: "user" as const, name: "User" },
};

export async function quickLoginAction(formData: FormData) {
  const type = formData.get("type") as keyof typeof DEMO_USERS;
  const demo = DEMO_USERS[type];
  
  if (!demo) {
    return { error: "Invalid login type" };
  }

  let [user] = await db.select().from(users).where(eq(users.email, demo.email));
  
  if (!user) {
    const hashedPassword = await hashPassword(demo.password);
    [user] = await db.insert(users).values({
      email: demo.email,
      password: hashedPassword,
      name: demo.name,
      role: demo.role,
    }).returning();
  }

  const { login } = await import("@/lib/auth");
  const result = await login(demo.email, demo.password);
  
  if (result.error) {
    return { error: result.error };
  }

  redirect("/dashboard");
}
