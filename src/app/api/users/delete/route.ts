import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request) {
  try {
    await requireRole("manager", "admin");
    const currentUser = await requireRole("manager", "admin");

    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("id") || "");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (currentUser.id === userId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    const [targetUser] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "admin" && currentUser.role !== "admin") {
      return NextResponse.json({ error: "Only admins can delete admin accounts" }, { status: 403 });
    }

    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
