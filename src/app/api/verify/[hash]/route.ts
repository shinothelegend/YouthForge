import { NextRequest, NextResponse } from "next/server";
import { RunStore } from "@/lib/store/runs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params;

  if (!hash || hash.length < 16) {
    return NextResponse.json({ error: "Invalid hash parameter" }, { status: 400 });
  }

  const run = RunStore.findByHash(hash);

  if (!run) {
    return NextResponse.json({
      verified: false,
      hash,
      message: "No canonical plan matching this SHA-256 digest was found in the local registry.",
      timestamp: new Date().toISOString(),
    });
  }

  // Find exact plan version matching hash
  const matchingPlan =
    run.planVersions.find((p) => p.canonicalHash?.toLowerCase() === hash.toLowerCase()) ||
    run.planVersions[run.planVersions.length - 1];

  return NextResponse.json({
    verified: true,
    hash,
    planId: matchingPlan?.id,
    title: matchingPlan?.title,
    version: matchingPlan?.version,
    overallScore: matchingPlan?.analysis.overallScore,
    verdict: matchingPlan?.analysis.verdict,
    createdAt: matchingPlan?.createdAt,
    algorithm: "SHA-256/YOUTHFORGE-V1",
    proofRecord: run.proofRecord,
    message: "Verifiable authenticity confirmed: Canonical payload matches registered digest.",
  });
}
