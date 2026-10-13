import { NextRequest, NextResponse } from "next/server";
import { RunStore } from "@/lib/store/runs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const run = RunStore.getRun(id);

  if (!run) {
    return NextResponse.json({ error: "Run not found" }, { status: 404 });
  }

  const latestPlan = run.planVersions[run.planVersions.length - 1] || null;

  return NextResponse.json({
    id: run.id,
    idea: run.idea,
    status: run.status,
    events: run.events,
    planVersions: run.planVersions,
    latestPlan,
    milestones: run.milestones,
    proofRecord: run.proofRecord,
    createdAt: run.createdAt,
    updatedAt: run.updatedAt,
    executionMode: run.executionMode,
  });
}
