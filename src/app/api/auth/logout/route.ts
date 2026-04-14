import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE = "session_id";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}