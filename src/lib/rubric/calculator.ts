import type { RubricDimension, FeasibilityVerdict, AnalysisResult, RiskItem } from "../schemas";

export interface RawDimensionEvaluation {
  dimension: string;
  weight: number;
  rawScore0To100: number;
  justification: string;
  evidenceFindingIds: string[];
  improvementCondition: string;
  confidence?: "high" | "medium" | "low";
}

/**
 * Standard rubric dimensions per Section 17:
 * - Market & Demand Evidence: 25%
 * - Unserved Position / Competition: 20%
 * - Execution Feasibility for Youth: 25%
 * - Regulatory & Operational Simplicity: 15%
 * - Evidence Quality & Data Rigor: 15%
 */
export const STANDARD_RUBRIC_CONFIG = [
  { dimension: "Market & Demand Evidence", weight: 25 },
  { dimension: "Competitive Edge & Unserved Space", weight: 20 },
  { dimension: "Youth Team Execution Feasibility", weight: 25 },
  { dimension: "Regulatory & Operational Simplicity", weight: 15 },
  { dimension: "Data Rigor & Evidence Quality", weight: 15 },
] as const;

/**
 * Calculates weighted score and determines calibrated verdict.
 */
export function calculateFeasibilityScore(
  evaluations: RawDimensionEvaluation[],
  risks: RiskItem[] = [],
  criticNotes?: string
): AnalysisResult {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  const dimensions: RubricDimension[] = evaluations.map((item) => {
    const weightedContribution = (item.rawScore0To100 * item.weight) / 100;
    totalWeightedScore += weightedContribution;
    totalWeight += item.weight;

    return {
      dimension: item.dimension,
      weight: item.weight,
      score: Math.round(item.rawScore0To100),
      justification: item.justification,
      evidenceFindingIds: item.evidenceFindingIds,
      confidence: item.confidence || "medium",
      improvementCondition: item.improvementCondition,
    };
  });

  // Normalize if weights don't sum to exactly 100
  const normalizedOverallScore = totalWeight > 0 
    ? Math.round((totalWeightedScore / totalWeight) * 100)
    : Math.round(totalWeightedScore);

  let verdict: FeasibilityVerdict = "refine_and_retry";
  let verdictSummary = "";

  if (normalizedOverallScore >= 70) {
    verdict = "forge_ahead";
    verdictSummary = "Strong empirical demand indicators, achievable scope for an agile team, and clear differentiation. Proceed to focused 14-day validation experiments.";
  } else if (normalizedOverallScore >= 45) {
    verdict = "refine_and_retry";
    verdictSummary = "Promising concept with viable elements, but critical assumptions in distribution or technical feasibility require de-risking before capital allocation.";
  } else {
    verdict = "rethink";
    verdictSummary = "High regulatory hurdles, saturated market without distinct moats, or unvalidated willingness to pay. Recommend testing an adjacent low-cost hypothesis.";
  }

  return {
    overallScore: Math.min(100, Math.max(0, normalizedOverallScore)),
    verdict,
    verdictSummary,
    dimensions,
    risks,
    criticNotes,
  };
}
