import { runMigrations } from "@kilocode/app-builder-db";
import { getDb } from "./index";

const db = getDb();
if (db) {
  await runMigrations(db, {}, { migrationsFolder: "./src/db/migrations" });
} else {
  console.error("Database not available for migration");
}
