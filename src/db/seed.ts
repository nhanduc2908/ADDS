import { getDb } from "./index";
import { users, hashPassword } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  const db = getDb();
  if (!db) {
    console.error("Database not available for seeding");
    return;
  }

  const adminPassword = await hashPassword("admin2026");

  const existing = await db.select().from(users).where(eq(users.email, "admin@security.vn"));

  if (existing.length === 0) {
    await db.insert(users).values({
      name: "Nguyễn Văn Admin",
      username: "admin",
      email: "admin@security.vn",
      password: adminPassword,
      role: "admin",
    });
    console.log("Admin user created: admin / admin2026");
  } else {
    console.log("Admin user already exists");
  }
}

seed();
