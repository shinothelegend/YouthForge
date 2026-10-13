import { describe, it, expect } from "vitest";
import { IdeaIntakeSchema } from "../../src/lib/schemas";
import { computeCanonicalPlanHash } from "../../src/lib/hash/canonical";
import { calculateFeasibilityScore } from "../../src/lib/rubric/calculator";
import { runSparkAgent } from "../../src/agents/spark";
import { runScoutAgent } from "../../src/agents/scout";
import { runJudgeAgent } from "../../src/agents/judge";
import { runSmithAgent } from "../../src/agents/smith";
import { runTrailAgent } from "../../src/agents/trail";
import { RunStore } from "../../src/lib/store/runs";

describe("YouthForge Core Verification Suite", () => {
  it("validates idea intake schema properly", () => {
    const valid = IdeaIntakeSchema.safeParse({
      title: "EcoRoute UAE",
      rawDescription: "AI courier batching platform for electric scooter couriers in Dubai",
      countryOrRegion: "Dubai, UAE",
      stage: "raw_idea",
    });
    expect(valid.success).toBe(true);

    const invalid = IdeaIntakeSchema.safeParse({
      title: "E",
      rawDescription: "short",
    });
    expect(invalid.success).toBe(false);
  });

  it("calculates calibrated feasibility score accurately per Section 17", () => {
    const highScores = [
      {
        dimension: "Market Demand",
        weight: 25,
        rawScore0To100: 80,
        justification: "Strong market demand",
        evidenceFindingIds: ["f1"],
        improvementCondition: "None",
      },
      {
        dimension: "Competitive Edge",
        weight: 20,
        rawScore0To100: 75,
        justification: "Clear positioning",
        evidenceFindingIds: ["f2"],
        improvementCondition: "None",
      },
      {
        dimension: "Youth Feasibility",
        weight: 25,
        rawScore0To100: 85,
        justification: "Very feasible",
        evidenceFindingIds: ["f3"],
        improvementCondition: "None",
      },
      {
        dimension: "Regulatory",
        weight: 15,
        rawScore0To100: 70,
        justification: "Standard sandbox",
        evidenceFindingIds: ["f4"],
        improvementCondition: "None",
      },
      {
        dimension: "Evidence Quality",
        weight: 15,
        rawScore0To100: 80,
        justification: "Verified citations",
        evidenceFindingIds: ["f5"],
        improvementCondition: "None",
      },
    ];

    const result = calculateFeasibilityScore(highScores);
    expect(result.overallScore).toBeGreaterThanOrEqual(70);
    expect(result.verdict).toBe("forge_ahead");

    // Test rethink band (< 45)
    const lowScores = highScores.map((s) => ({ ...s, rawScore0To100: 30 }));
    const rethinkResult = calculateFeasibilityScore(lowScores);
    expect(rethinkResult.overallScore).toBeLessThan(45);
    expect(rethinkResult.verdict).toBe("rethink");
  });

  it("produces deterministic canonical SHA-256 hashes for plans", () => {
    const samplePlan = {
      title: "EcoRoute UAE",
      problemStatement: "High idle time for couriers",
      targetPersona: "Scooter couriers in Dubai",
      proposedSolution: "Micro-hub batching algorithm",
      analysis: {
        overallScore: 78,
        verdict: "forge_ahead" as const,
        verdictSummary: "Strong demand",
        dimensions: [
          {
            dimension: "Market Demand",
            weight: 25,
            score: 78,
            justification: "High demand",
            evidenceFindingIds: [],
            confidence: "high" as const,
            improvementCondition: "Field surveys",
          },
        ],
        risks: [],
      },
      firstFiveActions: [
        {
          id: "act-1",
          order: 1,
          verb: "Interview",
          action: "Talk to 10 couriers",
          deliverable: "Survey sheet",
          estimatedDays: "2 days",
          whyItMatters: "Validates demand",
          lowBudgetAlternative: "Free interviews",
          completionCondition: "10 responses",
          status: "pending" as const,
        },
      ],
      sources: [
        {
          id: "s1",
          url: "https://www.rta.ae",
          title: "RTA Mobility",
          publisher: "RTA",
          accessDate: "2026-10-13",
          excerpt: "Green strategy",
          relevanceScore: 0.9,
          isCachedEvidence: true,
          validationStatus: "cached" as const,
        },
      ],
    };

    const hash1 = computeCanonicalPlanHash(samplePlan as any);
    const hash2 = computeCanonicalPlanHash(samplePlan as any);
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex string

    // Altering title must change the hash
    const alteredPlan = { ...samplePlan, title: "Altered Route" };
    const hash3 = computeCanonicalPlanHash(alteredPlan as any);
    expect(hash3).not.toBe(hash1);
  });

  it("runs the full 5-agent pipeline end-to-end", async () => {
    const idea = {
      title: "EcoRoute UAE",
      rawDescription: "An AI agent that aggregates last-mile parcel batches in Dubai Downtown and Marina for young couriers.",
      targetUsers: "Youth couriers in Dubai",
      countryOrRegion: "Dubai, UAE",
      stage: "raw_idea" as const,
      clarificationAnswers: {},
    };

    // 1. Spark
    const spark = await runSparkAgent(idea);
    expect(spark.needsClarification).toBe(false);
    expect(spark.tasks.length).toBeGreaterThanOrEqual(3);

    // 2. Scout
    const scout = await runScoutAgent(idea, spark.tasks);
    expect(scout.sources.length).toBeGreaterThanOrEqual(3);
    expect(scout.findings.length).toBeGreaterThanOrEqual(3);

    // 3. Judge
    const judge = await runJudgeAgent(idea.title, scout.findings, scout.sources);
    expect(judge.analysis.overallScore).toBeGreaterThan(0);
    expect(judge.analysis.risks.length).toBeGreaterThanOrEqual(2);

    // 4. Smith
    const smith = await runSmithAgent("test-run-1", idea, scout.sources, scout.findings, judge.analysis);
    expect(smith.plan.firstFiveActions.length).toBe(5);
    expect(smith.plan.canonicalHash).toBeDefined();

    // 5. Trail
    const trail = await runTrailAgent(smith.plan, "act-1", "Spoke with 12 couriers in Dubai Marina.");
    expect(trail.updatedPlan.version).toBe(2);
    expect(trail.updatedPlan.firstFiveActions[0].status).toBe("completed");
    expect(trail.updatedPlan.canonicalHash).not.toBe(smith.plan.canonicalHash);
  });
});
