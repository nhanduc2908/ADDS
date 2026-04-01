import { NextResponse } from "next/server";
import { CRITERIA, DOMAINS } from "@/lib/data";
import { generateSampleAssessment, exportToJSON, exportToCSV, exportToTXT, exportToHTML } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";

  const assessment = generateSampleAssessment(CRITERIA);
  const domainScores: Record<string, number> = {};
  for (const d of DOMAINS) {
    const dResults = assessment.results.filter((r) =>
      CRITERIA.some((c) => c.id === r.criterionId && c.domainId === d.id)
    );
    if (dResults.length > 0) {
      domainScores[d.id] = Math.round(
        (dResults.reduce((s, r) => s + r.score, 0) / (dResults.length * 5)) * 100
      );
    }
  }
  assessment.domainScores = domainScores;

  switch (format) {
    case "json":
      return new NextResponse(exportToJSON(assessment), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": "attachment; filename=assessment.json",
        },
      });
    case "csv":
      return new NextResponse(exportToCSV(assessment, CRITERIA), {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=assessment.csv",
        },
      });
    case "txt":
      return new NextResponse(exportToTXT(assessment, CRITERIA), {
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition": "attachment; filename=assessment.txt",
        },
      });
    case "html":
      return new NextResponse(exportToHTML(assessment, CRITERIA), {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": "attachment; filename=assessment.html",
        },
      });
    default:
      return NextResponse.json({ error: "Unsupported format. Use: json, csv, txt, html" }, { status: 400 });
  }
}
