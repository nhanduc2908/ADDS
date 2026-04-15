"use server";

import { db } from "@/db";
import { users, hashPassword } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const DEMO_USERS = {
  admin: { email: "admin@security.vn", password: "admin2026", role: "admin" as const, name: "Nguyễn Văn Admin" },
  manager: { email: "manager@security.vn", password: "manager2026", role: "manager" as const, name: "Trần Thị Manager" },
  user: { email: "user@security.vn", password: "user2026", role: "user" as const, name: "Lê Minh User" },
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
  const type = formData.get("type") as keyof typeof DEMO_USERS;
  const demo = DEMO_USERS[type];
  
  if (!demo) {
    return { error: "Invalid login type" };
  }

  try {
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

    const redirectPath = getRedirectPath(demo.role);
    redirect(redirectPath);
  } catch (err) {
    console.error("Quick login error:", err);
    return { error: "Login failed. Please try again." };
  }
}
