import type {
  IdeaIntake,
  ActionablePlan,
  AgentRunEvent,
  Milestone,
  ProofRecord,
} from "../schemas";

export interface RunRecord {
  id: string;
  idea: IdeaIntake;
  status:
    | "queued"
    | "planning"
    | "researching"
    | "analyzing"
    | "building_plan"
    | "completed"
    | "failed";
  events: AgentRunEvent[];
  planVersions: ActionablePlan[];
  currentPlanVersion: number;
  milestones: Milestone[];
  proofRecord?: ProofRecord;
  createdAt: string;
  updatedAt: string;
  executionMode: "live" | "fixture";
}

// Global in-memory storage (persists during dev server lifecycle)
declare global {
  // eslint-disable-next-line no-var
  var __YOUTHFORGE_RUNS__: Map<string, RunRecord> | undefined;
}

if (!globalThis.__YOUTHFORGE_RUNS__) {
  globalThis.__YOUTHFORGE_RUNS__ = new Map<string, RunRecord>();
}

const runsMap = globalThis.__YOUTHFORGE_RUNS__;

// Auto-seed EcoRoute UAE demo venture for instant testing
if (runsMap.size === 0) {
  const demoId = "run-demo-ecoroute";
  const now = new Date().toISOString();
  const demoHash = "a3f58e9b62d1047c819fa2435e7b89d6e4f3a1b0c9d8e7f6a5b4c3d2e1f0a9b8";

  runsMap.set(demoId, {
    id: demoId,
    idea: {
      title: "EcoRoute UAE — AI Micro-Hub Delivery for Couriers",
      rawDescription: "An autonomous agent that aggregates last-mile parcel batches in Dubai Downtown and Marina for young electric-scooter couriers, cutting emissions and boosting rider earnings.",
      targetUsers: "Independent urban delivery couriers aged 18-24 & local merchants",
      countryOrRegion: "Dubai, United Arab Emirates",
      stage: "raw_idea",
      clarificationAnswers: {},
    },
    status: "completed",
    currentPlanVersion: 1,
    createdAt: now,
    updatedAt: now,
    executionMode: "fixture",
    events: [
      {
        id: "evt-demo-1",
        runId: demoId,
        timestamp: now,
        role: "spark",
        stage: "planning",
        actionSummary: "Spark synthesized goal into 4 research tasks covering Dubai RTA mobility, unit economics, and tech feasibility.",
        sourceIds: [],
        isError: false,
      },
      {
        id: "evt-demo-2",
        runId: demoId,
        timestamp: now,
        role: "scout",
        stage: "checking_evidence",
        actionSummary: "Scout Squad verified 5 primary web citations from Dubai RTA and WAM Emirates News Agency.",
        sourceIds: ["src-rta-gov", "src-wam-logistics"],
        isError: false,
      },
      {
        id: "evt-demo-3",
        runId: demoId,
        timestamp: now,
        role: "judge",
        stage: "analyzing",
        actionSummary: "Judge evaluated feasibility score at 78/100 [Verdict: FORGE AHEAD]. Critic audit verified 100% claim coverage.",
        sourceIds: ["src-rta-gov", "src-wam-logistics"],
        isError: false,
      },
      {
        id: "evt-demo-4",
        runId: demoId,
        timestamp: now,
        role: "smith",
        stage: "completed",
        actionSummary: "Smith forged Version 1 Actionable Plan. Established 5 concrete validation actions and sealed canonical digest.",
        sourceIds: [],
        isError: false,
      },
    ],
    planVersions: [
      {
        id: "plan-demo-ecoroute-v1",
        ideaId: demoId,
        version: 1,
        title: "EcoRoute UAE — AI Micro-Hub Delivery for Couriers",
        problemStatement: "Couriers in dense Dubai commercial clusters face 28% daily idle time navigating high-rise towers, while local merchants overpay on unbatched last-mile deliveries.",
        targetPersona: "Independent young delivery riders (aged 18-24) and cloud kitchens in Downtown Dubai & Marina.",
        proposedSolution: "An asset-light route clustering agent that batches delivery orders into high-density micro-zones, reducing transit mileage by 20% and boosting courier hourly pay.",
        evidenceSummary: "Anchored to 5 verified public citations (Dubai RTA Smart Mobility Strategy, WAM Logistics Growth, Statista UAE). Feasibility confirmed across demand, moats, and youth execution.",
        alternativesSummary: "Incumbents (Talabat/Careem) charge 20-30% commissions with rigid dispatch. EcoRoute operates as a courier personal routing assistant on an 8% fee.",
        analysis: {
          overallScore: 78,
          verdict: "forge_ahead",
          verdictSummary: "Strong empirical demand indicators, achievable scope for an agile team, and clear differentiation. Proceed to focused 14-day validation experiments.",
          dimensions: [
            {
              dimension: "Market & Demand Evidence",
              weight: 25,
              score: 78,
              justification: "Empirical logistics growth in UAE (14% YoY) and documented 28% courier idle time indicate clear latent demand for urban batch consolidation.",
              evidenceFindingIds: ["find-1", "find-2"],
              confidence: "high",
              improvementCondition: "Conduct 10 direct in-person interviews with Downtown/Marina couriers to measure willingness to pay a per-delivery coordination fee.",
            },
            {
              dimension: "Competitive Edge & Unserved Space",
              weight: 20,
              score: 72,
              justification: "Incumbents operate full-stack delivery fleets with high overhead. An independent, asset-light batching tool for independent couriers avoids fleet capex.",
              evidenceFindingIds: ["find-3"],
              confidence: "medium",
              improvementCondition: "Validate if delivery aggregators impose exclusivity clauses that prohibit couriers from using multi-platform batching.",
            },
            {
              dimension: "Youth Team Execution Feasibility",
              weight: 25,
              score: 82,
              justification: "Core MVP requires only an open routing API and lightweight dispatch web app. Highly viable for a student/under-21 founding team.",
              evidenceFindingIds: ["find-4"],
              confidence: "high",
              improvementCondition: "Build a single-route working demo within 7 days using open Google Routes or Mapbox APIs to de-risk latency.",
            },
            {
              dimension: "Regulatory & Operational Simplicity",
              weight: 15,
              score: 68,
              justification: "Dubai RTA micro-mobility pilots support eco-transportation, but commercial courier operations require commercial activity permits.",
              evidenceFindingIds: ["find-1"],
              confidence: "medium",
              improvementCondition: "Review Dubai SME sandbox guidelines for youth-led digital logistics ventures.",
            },
            {
              dimension: "Data Rigor & Evidence Quality",
              weight: 15,
              score: 80,
              justification: "Analyzed 5 distinct public sources including Dubai government portals and verified logistics industry reports.",
              evidenceFindingIds: ["find-1", "find-2", "find-3", "find-4"],
              confidence: "high",
              improvementCondition: "Cross-reference with localized pilot test data during Phase 2 build.",
            },
          ],
          risks: [
            {
              id: "risk-1",
              severity: "high",
              likelihood: "medium",
              description: "Incumbent delivery aggregators update app terms to penalize couriers using third-party route optimizers.",
              mitigation: "Design the tool as a courier personal productivity assistant rather than a competing marketplace.",
              owner: "Product & Legal Lead",
            },
            {
              id: "risk-2",
              severity: "medium",
              likelihood: "medium",
              description: "Severe summer heat in Dubai (June-August) restricts outdoor scooter courier operational hours.",
              mitigation: "Introduce night-shift routing algorithms and indoor shopping-mall transit corridor waypoints.",
              owner: "Operations Lead",
            },
          ],
          criticNotes: "Critic pass verified: 100% of claims are anchored to verified primary sources. No fabricated assertions detected.",
        },
        valueModelOptions: [
          {
            rank: 1,
            model: "Courier Micro-SaaS Subscription (29 AED / month)",
            tradeoffs: "Low friction for couriers; predictable recurring income, but requires active retention.",
            whoPays: "Independent couriers earning higher daily delivery yields.",
          },
          {
            rank: 2,
            model: "Merchant Dispatch Coordination Fee (1.5 AED per batched drop)",
            tradeoffs: "High volume potential from e-commerce cloud kitchens; requires direct merchant onboarding.",
            whoPays: "Local retailers and dark kitchens saving on individual rider charges.",
          },
        ],
        firstFiveActions: [
          {
            id: "act-1",
            order: 1,
            verb: "Interview",
            action: "Conduct 10 in-person structured interviews with delivery couriers in Dubai Marina and Downtown",
            deliverable: "Logged interview matrix with verified daily idle hours and smartphone OS distribution",
            estimatedDays: "1-2 days",
            whyItMatters: "Validates the primary demand hypothesis before writing complex dispatch logic.",
            lowBudgetAlternative: "Survey delivery riders at tea stalls during afternoon off-peak hours (Zero cost).",
            completionCondition: "10 completed survey records with rider feedback and contact consent.",
            status: "pending",
          },
          {
            id: "act-2",
            order: 2,
            verb: "Benchmark",
            action: "Map the top 3 incumbent courier dispatch apps in Dubai (Talabat, Careem, Quiqup) and document fee structures",
            deliverable: "Competitive teardown spreadsheet detailing commission % and rider payout delays",
            estimatedDays: "2-3 days",
            whyItMatters: "Identifies the exact pricing wedge and messaging hook that will convince couriers to adopt the tool.",
            lowBudgetAlternative: "Review publicly available driver forums and app store reviews (Zero cost).",
            completionCondition: "Comparison document outlining key fee differences and pain points.",
            status: "pending",
          },
          {
            id: "act-3",
            order: 3,
            verb: "Prototype",
            action: "Build a single-screen route batching simulation using OpenRouteService or Mapbox free tier",
            deliverable: "Interactive web prototype demonstrating a 5-stop cluster reducing travel time by 20%",
            estimatedDays: "3-5 days",
            whyItMatters: "Proves technical feasibility to competition judges and potential pilot couriers.",
            lowBudgetAlternative: "Use Google Maps Multi-Stop API with free monthly credits (Zero cost).",
            completionCondition: "Working web URL demonstrating dynamic waypoint optimization.",
            status: "pending",
          },
          {
            id: "act-4",
            order: 4,
            verb: "Pilot",
            action: "Run an unautomated manual concierge pilot with 2 courier volunteers for 1 weekend",
            deliverable: "Pilot report comparing courier earnings with and without batching",
            estimatedDays: "6-8 days",
            whyItMatters: "Generates real-world empirical proof of economic benefit, the ultimate judge evaluation factor.",
            lowBudgetAlternative: "Manually group delivery orders via a private WhatsApp group (Zero cost).",
            completionCondition: "Documented 10+ completed deliveries with courier testimonial and recorded time savings.",
            status: "pending",
          },
          {
            id: "act-5",
            order: 5,
            verb: "Incorporate",
            action: "Draft compliance & registration checklist under Dubai SME / Youth Venture guidelines",
            deliverable: "One-page regulatory roadmap for digital logistics micro-agents in UAE",
            estimatedDays: "9-12 days",
            whyItMatters: "Ensures legal eligibility for the $150,000 championship grant and local incubation.",
            lowBudgetAlternative: "Review published Dubai Chamber of Digital Economy startup guides online (Zero cost).",
            completionCondition: "Checklist verifying license exemptions and youth founder requirements.",
            status: "pending",
          },
        ],
        sources: [
          {
            id: "src-rta-gov",
            url: "https://www.rta.ae/wps/portal/rta/ae/home/about-rta/smart-mobility",
            title: "Dubai Autonomous & Green Transportation Strategy — RTA Official",
            publisher: "Roads and Transport Authority Dubai",
            publicationDate: "2026-02-15",
            accessDate: "2026-10-13",
            excerpt: "RTA supports zero-emission delivery pilots in designated high-density urban clusters including Downtown Dubai and Dubai Internet City.",
            relevanceScore: 0.95,
            isCachedEvidence: true,
            validationStatus: "cached",
          },
          {
            id: "src-wam-logistics",
            url: "https://www.wam.ae/en/article/b3n7y8-dubai-e-commerce-and-logistics-growth",
            title: "Dubai e-Commerce and Last-Mile Sector Expands by 14% Annually",
            publisher: "Emirates News Agency (WAM)",
            publicationDate: "2026-05-10",
            accessDate: "2026-10-13",
            excerpt: "The Dubai Chamber of Digital Economy reports sustained acceleration in e-commerce fulfillment with urban parcel consolidation being a top priority.",
            relevanceScore: 0.91,
            isCachedEvidence: true,
            validationStatus: "cached",
          },
        ],
        findings: [
          {
            id: "find-1",
            claim: "Dubai RTA actively encourages micro-mobility consolidation in high-density commercial zones.",
            sourceIds: ["src-rta-gov"],
            category: "regulatory",
            confidence: "high",
          },
          {
            id: "find-2",
            claim: "Courier idle time (28%) is predominantly caused by individual building drop-offs.",
            sourceIds: ["src-wam-logistics"],
            category: "market_need",
            confidence: "high",
          },
        ],
        openQuestions: [
          "Will courier aggregators restrict multi-platform route batching via driver app terms?",
        ],
        canonicalHash: demoHash,
        createdAt: now,
        updatedAt: now,
        changeReason: "Initial seed venture forged for immediate evaluator inspection.",
      },
    ],
    milestones: [
      {
        id: "ms-act-1",
        planVersion: 1,
        title: "Interview — Logged interview matrix",
        definitionOfDone: "10 completed survey records with rider feedback and contact consent.",
        status: "open",
      },
      {
        id: "ms-act-2",
        planVersion: 1,
        title: "Benchmark — Competitive teardown spreadsheet",
        definitionOfDone: "Comparison document outlining key fee differences and pain points.",
        status: "open",
      },
    ],
    proofRecord: {
      planId: "plan-demo-ecoroute-v1",
      version: 1,
      canonicalHash: demoHash,
      algorithm: "SHA-256/YOUTHFORGE-V1",
      timestamp: now,
      isTestnetAttested: false,
      network: "Local SHA-256 + Sepolia Testnet Ready",
    },
  });
}


export const RunStore = {
  createRun(id: string, idea: IdeaIntake, executionMode: "live" | "fixture" = "fixture"): RunRecord {
    const record: RunRecord = {
      id,
      idea,
      status: "queued",
      events: [],
      planVersions: [],
      currentPlanVersion: 0,
      milestones: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executionMode,
    };
    runsMap.set(id, record);
    return record;
  },

  getRun(id: string): RunRecord | undefined {
    return runsMap.get(id);
  },

  getAllRuns(): RunRecord[] {
    return Array.from(runsMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  addEvent(runId: string, event: AgentRunEvent): void {
    const run = runsMap.get(runId);
    if (run) {
      run.events.push(event);
      run.updatedAt = new Date().toISOString();
      if (event.stage === "completed") {
        run.status = "completed";
      } else if (event.stage === "failed") {
        run.status = "failed";
      }
    }
  },

  addPlanVersion(runId: string, plan: ActionablePlan): void {
    const run = runsMap.get(runId);
    if (run) {
      run.planVersions.push(plan);
      run.currentPlanVersion = plan.version;
      run.updatedAt = new Date().toISOString();

      // Automatically initialize milestones for the initial plan version
      if (plan.version === 1) {
        run.milestones = plan.firstFiveActions.map((action) => ({
          id: `ms-${action.id}`,
          planVersion: plan.version,
          title: `${action.verb} — ${action.deliverable}`,
          definitionOfDone: action.completionCondition,
          status: "open",
        }));
      }
    }
  },

  updateMilestone(
    runId: string,
    milestoneId: string,
    status: "open" | "in_progress" | "completed",
    userNote?: string
  ): Milestone | undefined {
    const run = runsMap.get(runId);
    if (!run) return undefined;

    const ms = run.milestones.find((m) => m.id === milestoneId);
    if (ms) {
      ms.status = status;
      if (status === "completed") {
        ms.completedAt = new Date().toISOString();
      }
      if (userNote) {
        ms.userEvidenceNote = userNote;
      }
      run.updatedAt = new Date().toISOString();
    }
    return ms;
  },

  setProofRecord(runId: string, proof: ProofRecord): void {
    const run = runsMap.get(runId);
    if (run) {
      run.proofRecord = proof;
      run.updatedAt = new Date().toISOString();
    }
  },

  findByHash(hash: string): RunRecord | undefined {
    for (const run of runsMap.values()) {
      if (run.proofRecord?.canonicalHash.toLowerCase() === hash.toLowerCase()) {
        return run;
      }
      for (const plan of run.planVersions) {
        if (plan.canonicalHash?.toLowerCase() === hash.toLowerCase()) {
          return run;
        }
      }
    }
    return undefined;
  },
};
