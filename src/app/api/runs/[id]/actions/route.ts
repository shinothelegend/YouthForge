import { NextRequest, NextResponse } from "next/server";
import { RunStore } from "@/lib/store/runs";
import { runTrailAgent } from "@/agents/trail";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const run = RunStore.getRun(id);

    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    const body = await req.json();
    const { actionId, userEvidenceNote, status } = body;

    if (!actionId) {
      return NextResponse.json({ error: "Missing actionId" }, { status: 400 });
    }

    const latestPlan = run.planVersions[run.planVersions.length - 1];
    if (!latestPlan) {
      return NextResponse.json({ error: "No plan available for this run" }, { status: 400 });
    }

    // Update milestone in RunStore
    RunStore.updateMilestone(id, `ms-${actionId}`, status || "completed", userEvidenceNote);

    // Invoke Trail agent to forge Version N+1
    const trailResult = await runTrailAgent(
      latestPlan,
      actionId,
      userEvidenceNote || "Builder verified milestone completion."
    );

    RunStore.addPlanVersion(id, trailResult.updatedPlan);

    // Record trail event in run log
    RunStore.addEvent(id, {
      id: `evt-${Date.now()}-trail`,
      runId: id,
      timestamp: new Date().toISOString(),
      role: "trail",
      stage: "tracking",
      actionSummary: trailResult.trailSummary,
      sourceIds: [],
      isError: false,
    });

    return NextResponse.json({
      success: true,
      message: trailResult.trailSummary,
      updatedPlan: trailResult.updatedPlan,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
