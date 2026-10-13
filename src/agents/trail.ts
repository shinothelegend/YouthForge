import type { ActionablePlan, NextAction } from "../lib/schemas";
import { computeCanonicalPlanHash } from "../lib/hash/canonical";
import { calculateFeasibilityScore } from "../lib/rubric/calculator";

export interface TrailUpdateResult {
  updatedPlan: ActionablePlan;
  trailSummary: string;
}

/**
 * Trail: Progress Tracker & Evolution Agent
 * Takes an existing plan version and updates milestones/evidence,
 * incrementing to Version N+1 with updated scores and traceable change reasons.
 */
export async function runTrailAgent(
  currentPlan: ActionablePlan,
  completedActionId: string,
  userEvidenceNote: string
): Promise<TrailUpdateResult> {
  const nextVersion = currentPlan.version + 1;
  const nowIso = new Date().toISOString();

  // 1. Update the matching action
  const updatedActions: NextAction[] = currentPlan.firstFiveActions.map((action) => {
    if (action.id === completedActionId) {
      return {
        ...action,
        status: "completed" as const,
        completedAt: nowIso,
        userNote: userEvidenceNote,
      };
    }
    return action;
  });

  const completedAction = currentPlan.firstFiveActions.find((a) => a.id === completedActionId);
  const actionName = completedAction ? completedAction.verb : "Action";

  // 2. Adjust rubric score based on completed milestone
  // E.g., if user completed interviews, boost Market & Demand Evidence score by +5 points
  const updatedDimensions = currentPlan.analysis.dimensions.map((dim) => {
    if (dim.dimension.includes("Market") && completedActionId === "act-1") {
      return {
        ...dim,
        rawScore0To100: Math.min(100, dim.score + 6),
        confidence: "high" as const,
        justification: `${dim.justification} [Update: Founder validated with direct field interviews: "${userEvidenceNote}"]`,
      };
    }
    if (dim.dimension.includes("Execution") && completedActionId === "act-3") {
      return {
        ...dim,
        rawScore0To100: Math.min(100, dim.score + 5),
        confidence: "high" as const,
        justification: `${dim.justification} [Update: Technical prototype proved feasible: "${userEvidenceNote}"]`,
      };
    }
    return {
      ...dim,
      rawScore0To100: dim.score,
    };
  });

  const updatedAnalysis = calculateFeasibilityScore(
    updatedDimensions,
    currentPlan.analysis.risks,
    `Trail review: Action '${actionName}' verified with builder notes. Score updated accordingly.`
  );

  const updatedPlan: ActionablePlan = {
    ...currentPlan,
    id: `plan-${currentPlan.ideaId}-v${nextVersion}`,
    version: nextVersion,
    firstFiveActions: updatedActions,
    analysis: updatedAnalysis,
    updatedAt: nowIso,
    changeReason: `Milestone '${actionName}' marked complete. Evidence: "${userEvidenceNote.substring(0, 80)}..."`,
  };

  // Re-seal updated canonical hash
  updatedPlan.canonicalHash = computeCanonicalPlanHash(updatedPlan);

  return {
    updatedPlan,
    trailSummary: `Trail advanced plan to Version ${nextVersion}. Score increased to ${updatedAnalysis.overallScore}/100. New canonical digest sealed: ${updatedPlan.canonicalHash?.substring(0, 16)}...`,
  };
}
