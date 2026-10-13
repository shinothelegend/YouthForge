import { RunStore } from "../lib/store/runs";
import type { IdeaIntake, AgentRunEvent } from "../lib/schemas";
import { runSparkAgent } from "./spark";
import { runScoutAgent } from "./scout";
import { runJudgeAgent } from "./judge";
import { runSmithAgent } from "./smith";

export interface OrchestrationCallbacks {
  onEvent?: (event: AgentRunEvent) => void;
}

/**
 * Master 5-Agent Orchestrator
 * Connects Spark, Scout, Judge, and Smith into an autonomous, observable state graph.
 */
export async function executeVentureOrchestration(
  runId: string,
  idea: IdeaIntake,
  callbacks?: OrchestrationCallbacks
): Promise<void> {
  const emit = (
    role: AgentRunEvent["role"],
    stage: AgentRunEvent["stage"],
    actionSummary: string,
    extra: Partial<AgentRunEvent> = {}
  ) => {
    const event: AgentRunEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      runId,
      timestamp: new Date().toISOString(),
      role,
      stage,
      actionSummary,
      sourceIds: [],
      isError: false,
      ...extra,
    };
    RunStore.addEvent(runId, event);
    callbacks?.onEvent?.(event);
  };

  try {
    // ----------------------------------------------------
    // Step 1: Spark Coordinator
    // ----------------------------------------------------
    emit("spark", "planning", "Spark inspecting idea input and scoping research vectors", {
      reasoningSummary: "Analyzing problem definition, target persona, and regulatory jurisdiction.",
    });

    const sparkResult = await runSparkAgent(idea);

    if (sparkResult.needsClarification) {
      emit("spark", "planning", sparkResult.coordinatorSummary, {
        reasoningSummary: "Ambiguities detected in scope. Waiting on user clarification chips.",
      });
      return;
    }

    emit(
      "spark",
      "planning",
      `Spark formulated ${sparkResult.tasks.length} research tasks. Handing off to Scout Squad.`,
      {
        toolInvoked: "coordinator_plan_tasks",
        toolOutputSummary: `Planned: ${sparkResult.tasks.map((t) => t.tool).join(", ")}`,
      }
    );

    // ----------------------------------------------------
    // Step 2: Scout Research Squad
    // ----------------------------------------------------
    emit("scout", "researching", "Scout Squad executing parallel web retrieval and extraction", {
      toolInvoked: "valyu_search / web_search",
      toolInputSummary: `Queries: ${sparkResult.tasks.map((t) => t.query).join(" | ")}`,
    });

    const scoutResult = await runScoutAgent(idea, sparkResult.tasks);

    emit(
      "scout",
      "checking_evidence",
      scoutResult.scoutSummary,
      {
        toolInvoked: "citation_normalization_gate",
        toolOutputSummary: `Verified ${scoutResult.sources.length} sources and ${scoutResult.findings.length} empirical findings.`,
        sourceIds: scoutResult.sources.map((s) => s.id),
      }
    );

    // ----------------------------------------------------
    // Step 3: Judge Feasibility & Critic
    // ----------------------------------------------------
    emit("judge", "analyzing", "Judge executing 5-dimension feasibility rubric and risk matrix", {
      reasoningSummary: "Weighing empirical market evidence (25%), competitive moats (20%), youth feasibility (25%), regulatory compliance (15%), and data rigor (15%).",
    });

    const judgeResult = await runJudgeAgent(
      idea.title,
      scoutResult.findings,
      scoutResult.sources
    );

    emit(
      "judge",
      "analyzing",
      judgeResult.judgeSummary,
      {
        toolInvoked: "calibrated_rubric_critic",
        toolOutputSummary: `Score: ${judgeResult.analysis.overallScore}/100 | Verdict: ${judgeResult.analysis.verdict.toUpperCase()}`,
        sourceIds: scoutResult.sources.map((s) => s.id),
      }
    );

    // ----------------------------------------------------
    // Step 4: Smith Action Planner
    // ----------------------------------------------------
    emit("smith", "building_plan", "Smith synthesizing actionable plan and concrete 1-14 day action items", {
      reasoningSummary: "Formulating first 5 next actions, ranking value models, and generating verifiable canonical hash.",
    });

    const smithResult = await runSmithAgent(
      runId,
      idea,
      scoutResult.sources,
      scoutResult.findings,
      judgeResult.analysis,
      1
    );

    // Save plan version into RunStore
    RunStore.addPlanVersion(runId, smithResult.plan);

    // Set proof record
    if (smithResult.plan.canonicalHash) {
      RunStore.setProofRecord(runId, {
        planId: smithResult.plan.id,
        version: 1,
        canonicalHash: smithResult.plan.canonicalHash,
        algorithm: "SHA-256/YOUTHFORGE-V1",
        timestamp: new Date().toISOString(),
        isTestnetAttested: false,
        network: "Local SHA-256 + Sepolia Testnet Ready",
      });
    }

    emit(
      "smith",
      "completed",
      smithResult.smithSummary,
      {
        toolInvoked: "canonical_sha256_hasher",
        toolOutputSummary: `Canonical Plan Hash: ${smithResult.plan.canonicalHash}`,
        sourceIds: scoutResult.sources.map((s) => s.id),
      }
    );
  } catch (err: any) {
    emit("system", "failed", `Orchestration encountered an unhandled error: ${err?.message || "Unknown"}`, {
      isError: true,
    });
  }
}
