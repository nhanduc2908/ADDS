import { createDatabase } from "@kilocode/app-builder-db";
import * as schema from "./schema";

// Lazy initialization to avoid build-time database connection
let dbInstance: ReturnType<typeof createDatabase> | null = null;

export function getDb() {
  if (!dbInstance) {
    try {
      dbInstance = createDatabase(schema);
    } catch (error) {
      // During build time, database might not be available
      // Return a mock database that throws helpful errors
      dbInstance = new Proxy({} as any, {
        get: (target, prop) => {
          return (...args: any[]) => {
            throw new Error("Database not available during build time. This is normal and will work in runtime.");
          };
        }
      });
    }
  }
  return dbInstance;
}

// For backward compatibility, but will cause issues during build
export const db = getDb();
