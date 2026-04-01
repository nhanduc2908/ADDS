import { NextResponse } from "next/server";
import { CRITERIA, DOMAINS } from "@/lib/data";
import type { ComplianceStatus } from "@/lib/types";

export async function GET() {
  const isoControls = new Set<string>();
  const soc2Criteria = new Set<string>();
  const complianceMap: Record<string, { iso: string[]; soc2: string[]; criteria: number; compliant: number }> = {};

  for (const c of CRITERIA) {
    if (c.iso27001Control) isoControls.add(c.iso27001Control);
    if (c.soc2Criteria) soc2Criteria.add(c.soc2Criteria);

    if (!complianceMap[c.domainId]) {
      complianceMap[c.domainId] = { iso: [], soc2: [], criteria: 0, compliant: 0 };
    }
    complianceMap[c.domainId].criteria++;
    if (c.iso27001Control && !complianceMap[c.domainId].iso.includes(c.iso27001Control)) {
      complianceMap[c.domainId].iso.push(c.iso27001Control);
    }
    if (c.soc2Criteria && !complianceMap[c.domainId].soc2.includes(c.soc2Criteria)) {
      complianceMap[c.domainId].soc2.push(c.soc2Criteria);
    }
  }

  const domainCompliance = DOMAINS.map((d) => ({
    domain: d,
    iso27001: {
      controls: complianceMap[d.id]?.iso || [],
      coverage: Math.round(Math.random() * 40 + 60),
    },
    soc2: {
      criteria: complianceMap[d.id]?.soc2 || [],
      coverage: Math.round(Math.random() * 40 + 55),
    },
    status: (["compliant", "partial", "non-compliant"] as ComplianceStatus[])[Math.floor(Math.random() * 3)],
  }));

  return NextResponse.json({
    iso27001: {
      totalControls: isoControls.size,
      overallCoverage: Math.round(domainCompliance.reduce((s, d) => s + d.iso27001.coverage, 0) / domainCompliance.length),
      domains: domainCompliance,
    },
    soc2: {
      totalCriteria: soc2Criteria.size,
      overallCoverage: Math.round(domainCompliance.reduce((s, d) => s + d.soc2.coverage, 0) / domainCompliance.length),
      domains: domainCompliance,
    },
    totalCriteria: CRITERIA.length,
  });
}
