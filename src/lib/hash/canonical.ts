import { createHash } from "crypto";
import type { ActionablePlan } from "../schemas";

/**
 * Normalizes an object into a canonical JSON string with strictly sorted keys
 * ensuring deterministic hashing across platforms and runs.
 */
export function canonicalJsonStringify(obj: any): string {
  if (obj === null || obj === undefined) {
    return "null";
  }
  if (typeof obj !== "object") {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return "[" + obj.map((item) => canonicalJsonStringify(item)).join(",") + "]";
  }

  const keys = Object.keys(obj).sort();
  const sortedPairs = keys.map((key) => {
    return JSON.stringify(key) + ":" + canonicalJsonStringify(obj[key]);
  });
  return "{" + sortedPairs.join(",") + "}";
}

/**
 * Generates a verifiable SHA-256 canonical digest for an ActionablePlan.
 * Strips mutable metadata like timestamps, leaving the immutable venture definition.
 */
export function computeCanonicalPlanHash(plan: Partial<ActionablePlan>): string {
  // Extract core deterministic attributes
  const corePlanPayload = {
    title: (plan.title || "").trim(),
    problemStatement: (plan.problemStatement || "").trim(),
    targetPersona: (plan.targetPersona || "").trim(),
    proposedSolution: (plan.proposedSolution || "").trim(),
    overallScore: plan.analysis?.overallScore ?? 0,
    verdict: plan.analysis?.verdict ?? "refine_and_retry",
    rubricDimensions: (plan.analysis?.dimensions || []).map((d) => ({
      dimension: d.dimension,
      weight: d.weight,
      score: d.score,
    })),
    firstFiveActions: (plan.firstFiveActions || []).map((a) => ({
      order: a.order,
      verb: a.verb,
      action: a.action,
      deliverable: a.deliverable,
    })),
    sourceUrls: (plan.sources || []).map((s) => s.url).sort(),
  };

  const canonicalJson = canonicalJsonStringify(corePlanPayload);
  return createHash("sha256").update(canonicalJson, "utf8").digest("hex");
}
