import { NextResponse } from "next/server";
import { CRITERIA, DOMAINS } from "@/lib/data";
import { generateSampleAssessment, calculateOverallScore, calculateDomainScores } from "@/lib/utils";

const assessment = generateSampleAssessment(CRITERIA);
assessment.domainScores = calculateDomainScores(assessment.results, CRITERIA, DOMAINS);
assessment.overallScore = calculateOverallScore(assessment.results);

export async function GET() {
  return NextResponse.json({
    assessment,
    criteriaCount: CRITERIA.length,
    domainCount: DOMAINS.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { criterionId, score, status, notes } = body;

    const resultIndex = assessment.results.findIndex((r) => r.criterionId === criterionId);
    if (resultIndex >= 0) {
      assessment.results[resultIndex] = {
        ...assessment.results[resultIndex],
        score,
        status,
        notes: notes || "",
        assessedAt: new Date().toISOString(),
      };
    }

    assessment.domainScores = calculateDomainScores(assessment.results, CRITERIA, DOMAINS);
    assessment.overallScore = calculateOverallScore(assessment.results);
    assessment.updatedAt = new Date().toISOString();

    return NextResponse.json({ success: true, assessment });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
