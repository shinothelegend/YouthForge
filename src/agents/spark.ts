import type { IdeaIntake, ClarificationQuestion, ResearchTask } from "../lib/schemas";

export interface SparkPlanResult {
  needsClarification: boolean;
  clarifications: ClarificationQuestion[];
  tasks: ResearchTask[];
  coordinatorSummary: string;
}

/**
 * Spark: Intake & Coordinator Agent
 * Analyzes rough idea language, clarifies goal when needed, and plans research tasks.
 */
export async function runSparkAgent(idea: IdeaIntake): Promise<SparkPlanResult> {
  const isVague =
    idea.rawDescription.trim().length < 35 ||
    (!idea.targetUsers && !idea.rawDescription.toLowerCase().includes("for"));

  const clarifications: ClarificationQuestion[] = [];

  if (isVague && Object.keys(idea.clarificationAnswers).length === 0) {
    clarifications.push({
      id: "clarify-audience",
      question: "Who is your primary initial user or customer?",
      options: [
        "Individual young consumers / students",
        "Small businesses and local merchants in UAE",
        "Schools, universities, and educational hubs",
        "Government / municipal entities",
      ],
      suggestedAnswer: "Small businesses and local merchants in UAE",
    });

    clarifications.push({
      id: "clarify-distribution",
      question: "How will users first discover or access this solution?",
      options: [
        "Direct web & mobile application",
        "WhatsApp / Telegram automated assistant",
        "B2B pilot partnership",
      ],
      suggestedAnswer: "Direct web & mobile application",
    });

    clarifications.push({
      id: "clarify-monetization",
      question: "What is your initial value hypothesis?",
      options: [
        "Free tier with premium subscription ($10-30/mo)",
        "Per-transaction / coordination fee",
        "Open-source grant-supported non-profit",
      ],
      suggestedAnswer: "Free tier with premium subscription ($10-30/mo)",
    });

    return {
      needsClarification: true,
      clarifications,
      tasks: [],
      coordinatorSummary: "Spark identified 3 scope ambiguities. Requesting targeted clarification.",
    };
  }

  // Generate 4-5 focused research tasks tailored to the idea
  const cleanTitle = idea.title.trim();
  const region = idea.countryOrRegion || "UAE & Global";

  const tasks: ResearchTask[] = [
    {
      id: `task-${Date.now()}-1`,
      goal: `Investigate market demand & existing benchmarks for ${cleanTitle}`,
      query: `${cleanTitle} market demand statistics competitors ${region}`,
      tool: "web_search",
      expectedEvidence: "Industry growth rates, customer pain points, and current alternatives",
      dependencies: [],
      status: "pending",
      budgetCost: 1,
    },
    {
      id: `task-${Date.now()}-2`,
      goal: `Evaluate competitive landscape and pricing models in ${region}`,
      query: `${cleanTitle} competitor pricing business model ${region}`,
      tool: "competitor_lookup",
      expectedEvidence: "Leading incumbent solutions, pricing tiers, and underserved gaps",
      dependencies: [],
      status: "pending",
      budgetCost: 1,
    },
    {
      id: `task-${Date.now()}-3`,
      goal: `Analyze technical feasibility & architecture for a youth-led agile team`,
      query: `${cleanTitle} open source architecture APIs deployment best practices`,
      tool: "content_extract",
      expectedEvidence: "Available APIs, compute requirements, and estimated MVP development time",
      dependencies: [],
      status: "pending",
      budgetCost: 1,
    },
    {
      id: `task-${Date.now()}-4`,
      goal: `Examine regulatory, privacy, and compliance considerations in ${region}`,
      query: `UAE digital economy data privacy regulations compliance ${cleanTitle}`,
      tool: "regulatory_check",
      expectedEvidence: "Data protection standards, consumer privacy, and UAE compliance rules",
      dependencies: [],
      status: "pending",
      budgetCost: 1,
    },
  ];

  return {
    needsClarification: false,
    clarifications: [],
    tasks,
    coordinatorSummary: `Spark synthesized goal into ${tasks.length} targeted research tasks covering demand, competition, tech feasibility, and regulatory alignment in ${region}.`,
  };
}
