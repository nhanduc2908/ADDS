import { NextResponse } from "next/server";
import { THREATS } from "@/lib/sample-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const severity = searchParams.get("severity");

  let threats = [...THREATS];

  if (category) {
    threats = threats.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }
  if (severity) {
    threats = threats.filter((t) => t.severity === severity);
  }

  const categories = [...new Set(THREATS.map((t) => t.category))];
  const severityDistribution = {
    critical: THREATS.filter((t) => t.severity === "critical").length,
    high: THREATS.filter((t) => t.severity === "high").length,
    medium: THREATS.filter((t) => t.severity === "medium").length,
    low: THREATS.filter((t) => t.severity === "low").length,
  };

  return NextResponse.json({
    threats,
    total: threats.length,
    categories,
    severityDistribution,
  });
}
