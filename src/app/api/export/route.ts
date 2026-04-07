import { NextResponse } from "next/server";
import { CRITERIA, DOMAINS } from "@/lib/data";
import { generateSampleAssessment, exportToJSON, exportToCSV, exportToTXT, exportToHTML, exportToXML, exportToMarkdown, exportToYAML } from "@/lib/utils";

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

  const contentTypes: Record<string, string> = {
    json: "application/json",
    csv: "text/csv",
    excel: "text/csv",
    txt: "text/plain",
    html: "text/html",
    pdf: "application/pdf",
    xml: "application/xml",
    md: "text/markdown",
    yaml: "application/x-yaml",
  };

  const fileNames: Record<string, string> = {
    json: "assessment.json",
    csv: "assessment.csv",
    excel: "assessment.csv",
    txt: "assessment.txt",
    html: "assessment.html",
    pdf: "assessment.pdf",
    xml: "assessment.xml",
    md: "assessment.md",
    yaml: "assessment.yaml",
  };

  let content: string;
  let ext = format;
  switch (format) {
    case "json":
      content = exportToJSON(assessment);
      break;
    case "csv":
    case "excel":
      content = exportToCSV(assessment, CRITERIA);
      ext = "csv";
      break;
    case "txt":
      content = exportToTXT(assessment, CRITERIA);
      break;
    case "html":
      content = exportToHTML(assessment, CRITERIA);
      break;
    case "xml":
      content = exportToXML(assessment, CRITERIA);
      break;
    case "md":
      content = exportToMarkdown(assessment, CRITERIA);
      break;
    case "yaml":
      content = exportToYAML(assessment, CRITERIA);
      break;
    default:
      return NextResponse.json({ error: "Unsupported format. Use: json, csv, excel, txt, html, xml, md, yaml" }, { status: 400 });
  }

  return new NextResponse(content, {
    headers: {
      "Content-Type": contentTypes[format] || "text/plain",
      "Content-Disposition": `attachment; filename=${fileNames[format] || `assessment.${ext}`}`,
    },
  });
}
