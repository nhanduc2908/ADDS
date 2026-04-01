import { NextResponse } from "next/server";
import { CRITERIA, DOMAINS } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domainId = searchParams.get("domainId");
  const riskLevel = searchParams.get("riskLevel");
  const search = searchParams.get("search");

  let criteria = [...CRITERIA];

  if (domainId) {
    criteria = criteria.filter((c) => c.domainId === domainId);
  }
  if (riskLevel) {
    criteria = criteria.filter((c) => c.riskLevel === riskLevel);
  }
  if (search) {
    const s = search.toLowerCase();
    criteria = criteria.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.nameVi.toLowerCase().includes(s) ||
        c.code.toLowerCase().includes(s)
    );
  }

  return NextResponse.json({
    criteria,
    total: criteria.length,
    domains: DOMAINS,
  });
}
