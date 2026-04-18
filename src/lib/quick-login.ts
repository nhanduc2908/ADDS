"use server";

import { getDb } from "@/db";
import { users, hashPassword } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const DEMO_USERS = {
  admin: { username: "admin", password: "admin2026", role: "admin" as const, name: "Nguyễn Văn Admin", email: "admin@security.vn" },
  manager: { username: "manager", password: "manager2026", role: "manager" as const, name: "Trần Thị Manager", email: "manager@security.vn" },
  user: { username: "user", password: "user2026", role: "user" as const, name: "Lê Minh User", email: "user@security.vn" },
};

function getRedirectPath(role: string): string {
  switch (role) {
    case "admin":
      return "/admin/users";
    case "manager":
      return "/admin/users";
    case "user":
      return "/security";
    default:
      return "/security";
  }
}

export async function quickLoginAction(formData: FormData) {
  const db = getDb();
  if (!db) {
    return { error: "Database not available" };
  }

  const type = formData.get("type") as keyof typeof DEMO_USERS;
  const demo = DEMO_USERS[type];

  if (!demo) {
    return { error: "Invalid login type" };
  }

  try {
    let [user] = await db.select().from(users).where(eq(users.username, demo.username));

    if (!user) {
      const hashedPassword = await hashPassword(demo.password);
      [user] = await db.insert(users).values({
        username: demo.username,
        email: demo.email,
        password: hashedPassword,
        name: demo.name,
        role: demo.role,
      }).returning();
    }

    redirect("/dashboard");
  } catch (err) {
    console.error("Quick login error:", err);
    return { error: "Login failed. Please try again." };
  }
}
