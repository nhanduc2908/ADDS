import { NextResponse } from "next/server";
import { CRITERIA } from "@/lib/data";
import { importFromJSON, importFromCSV, calculateOverallScore } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "Không có file được tải lên" }, { status: 400 });
      }

      const text = await file.text();
      const ext = file.name.split(".").pop()?.toLowerCase();

      let result;
      if (ext === "json") {
        result = importFromJSON(text);
      } else if (ext === "csv") {
        result = importFromCSV(text);
      } else {
        return NextResponse.json({ error: `Định dạng .${ext} không được hỗ trợ` }, { status: 400 });
      }

      if (result.assessment) {
        const validIds = new Set(CRITERIA.map((c) => c.id));
        result.assessment.results = result.assessment.results.filter((r) => validIds.has(r.criterionId));
        result.assessment.overallScore = calculateOverallScore(result.assessment.results);
      }

      return NextResponse.json(result);
    }

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const text = JSON.stringify(body);
      const result = importFromJSON(text);

      if (result.assessment) {
        const validIds = new Set(CRITERIA.map((c) => c.id));
        result.assessment.results = result.assessment.results.filter((r) => validIds.has(r.criterionId));
        result.assessment.overallScore = calculateOverallScore(result.assessment.results);
      }

      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Content-Type không được hỗ trợ" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: `Lỗi xử lý: ${e instanceof Error ? e.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
