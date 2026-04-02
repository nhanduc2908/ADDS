import { NextResponse } from "next/server";
import type { AssessmentFile } from "@/lib/types";

const files: AssessmentFile[] = [];

export async function GET() {
  return NextResponse.json({ files });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const file = body as AssessmentFile;
    file.createdAt = new Date().toISOString();
    file.updatedAt = new Date().toISOString();
    files.unshift(file);
    return NextResponse.json({ success: true, file });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const idx = files.findIndex((f) => f.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    files[idx] = { ...files[idx], ...updates, updatedAt: new Date().toISOString() };
    return NextResponse.json({ success: true, file: files[idx] });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const idx = files.findIndex((f) => f.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    files.splice(idx, 1);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
