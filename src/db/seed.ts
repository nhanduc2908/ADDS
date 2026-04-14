import { db } from "./index";
import { users, hashPassword } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  const adminPassword = await hashPassword("admin123");
  
  const existing = await db.select().from(users).where(eq(users.email, "admin@example.com"));
  
  if (existing.length === 0) {
    await db.insert(users).values({
      name: "Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
    });
    console.log("Admin user created: admin@example.com / admin123");
  } else {
    console.log("Admin user already exists");
  }
}

seed();
