import { NextRequest, NextResponse } from "next/server";
import { IdeaIntakeSchema } from "@/lib/schemas";
import { RunStore } from "@/lib/store/runs";
import { executeVentureOrchestration } from "@/agents/orchestrator";

export async function GET() {
  const runs = RunStore.getAllRuns();
  return NextResponse.json({
    runs: runs.map((r) => ({
      id: r.id,
      title: r.idea.title,
      status: r.status,
      currentVersion: r.currentPlanVersion,
      verdict: r.planVersions[r.planVersions.length - 1]?.analysis.verdict,
      overallScore: r.planVersions[r.planVersions.length - 1]?.analysis.overallScore,
      createdAt: r.createdAt,
      executionMode: r.executionMode,
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedIdea = IdeaIntakeSchema.safeParse(body);

    if (!parsedIdea.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsedIdea.error.flatten() },
        { status: 400 }
      );
    }

    const runId = `run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const executionMode = process.env.YOUTHFORGE_EXECUTION_MODE === "live" ? "live" : "fixture";

    // Initialize run record in store
    const run = RunStore.createRun(runId, parsedIdea.data, executionMode);

    // Launch background orchestration loop
    executeVentureOrchestration(runId, parsedIdea.data).catch((err) => {
      console.error(`Error in run ${runId}:`, err);
    });

    return NextResponse.json({
      runId,
      status: run.status,
      message: "Venture validation initiated across 5-agent pipeline",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
