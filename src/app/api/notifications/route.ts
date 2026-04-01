import { NextResponse } from "next/server";
import { NOTIFICATIONS } from "@/lib/sample-data";

export async function GET() {
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;
  const byType = {
    critical: NOTIFICATIONS.filter((n) => n.type === "critical").length,
    warning: NOTIFICATIONS.filter((n) => n.type === "warning").length,
    info: NOTIFICATIONS.filter((n) => n.type === "info").length,
    success: NOTIFICATIONS.filter((n) => n.type === "success").length,
  };

  return NextResponse.json({
    notifications: NOTIFICATIONS,
    total: NOTIFICATIONS.length,
    unread,
    byType,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, read } = body;
    const notification = NOTIFICATIONS.find((n) => n.id === id);
    if (notification) {
      notification.read = read ?? true;
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
