import { NextResponse } from "next/server";
import { login, getSession } from "@/lib/server-auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Tên đăng nhập và mật khẩu là bắt buộc" }, { status: 400 });
    }

    const result = await login(username, password);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Đăng nhập thất bại" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Lỗi đăng nhập. Vui lòng thử lại." }, { status: 500 });
  }
}
