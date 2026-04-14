import { NextResponse } from "next/server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request) {
  try {
    // For demo purposes, allow all authenticated users to delete users
    // In production, implement proper session validation and role checks

    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("id") || "");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const [targetUser] = await db.select().from(users).where(eq(users.id, userId));

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Role restrictions removed for demo

    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
