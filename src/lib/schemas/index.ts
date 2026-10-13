import { z } from "zod";

// ==========================================
// 1. Idea & Intake Schemas (Spark)
// ==========================================

export const ClarificationQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).default([]),
  suggestedAnswer: z.string().optional(),
});

export const IdeaIntakeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  rawDescription: z.string().min(10, "Please provide at least 10 characters describing the idea"),
  targetUsers: z.string().optional(),
  countryOrRegion: z.string().default("UAE & Global"),
  stage: z.enum(["raw_idea", "early_notes", "prototype"]).default("raw_idea"),
  constraints: z.string().optional(),
  successDefinition: z.string().optional(),
  clarificationAnswers: z.record(z.string()).default({}),
});

export type IdeaIntake = z.infer<typeof IdeaIntakeSchema>;
export type ClarificationQuestion = z.infer<typeof ClarificationQuestionSchema>;

// ==========================================
// 2. Research Task & Source Schemas (Scout)
// ==========================================

export const ResearchTaskSchema = z.object({
  id: z.string(),
  goal: z.string(),
  query: z.string(),
  tool: z.enum(["web_search", "content_extract", "competitor_lookup", "regulatory_check"]),
  expectedEvidence: z.string(),
  dependencies: z.array(z.string()).default([]),
  status: z.enum(["pending", "in_progress", "completed", "failed"]).default("pending"),
  budgetCost: z.number().default(1),
});

export const CitationSourceSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string(),
  publisher: z.string(),
  publicationDate: z.string().optional(),
  accessDate: z.string(),
  excerpt: z.string(),
  relevanceScore: z.number().min(0).max(1).default(0.8),
  isCachedEvidence: z.boolean().default(false),
  validationStatus: z.enum(["verified", "cached", "unverified"]).default("verified"),
});

export const FindingSchema = z.object({
  id: z.string(),
  claim: z.string(),
  sourceIds: z.array(z.string()),
  category: z.enum(["market_need", "competitor", "feasibility", "regulatory", "risk"]),
  confidence: z.enum(["high", "medium", "low"]).default("medium"),
});

export type ResearchTask = z.infer<typeof ResearchTaskSchema>;
export type CitationSource = z.infer<typeof CitationSourceSchema>;
export type Finding = z.infer<typeof FindingSchema>;

// ==========================================
// 3. Feasibility Rubric & Analysis (Judge)
// ==========================================

export const RubricDimensionSchema = z.object({
  dimension: z.string(),
  weight: z.number(), // Percentage e.g. 25
  score: z.number().min(0).max(100),
  justification: z.string(),
  evidenceFindingIds: z.array(z.string()).default([]),
  confidence: z.enum(["high", "medium", "low"]).default("medium"),
  improvementCondition: z.string(),
});

export const RiskItemSchema = z.object({
  id: z.string(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  likelihood: z.enum(["high", "medium", "low"]),
  description: z.string(),
  mitigation: z.string(),
  owner: z.string().default("Founding Team"),
});

export const FeasibilityVerdictSchema = z.enum(["forge_ahead", "refine_and_retry", "rethink"]);

export const AnalysisResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  verdict: FeasibilityVerdictSchema,
  verdictSummary: z.string(),
  dimensions: z.array(RubricDimensionSchema),
  risks: z.array(RiskItemSchema),
  criticNotes: z.string().optional(),
});

export type RubricDimension = z.infer<typeof RubricDimensionSchema>;
export type RiskItem = z.infer<typeof RiskItemSchema>;
export type FeasibilityVerdict = z.infer<typeof FeasibilityVerdictSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// ==========================================
// 4. Structured Plan & Next Actions (Smith)
// ==========================================

export const NextActionSchema = z.object({
  id: z.string(),
  order: z.number().min(1).max(5),
  verb: z.string(),
  action: z.string(),
  deliverable: z.string(),
  estimatedDays: z.string(), // e.g. "1-2 days"
  whyItMatters: z.string(),
  lowBudgetAlternative: z.string(),
  completionCondition: z.string(),
  status: z.enum(["pending", "completed"]).default("pending"),
  completedAt: z.string().optional(),
  userNote: z.string().optional(),
});

export const ValueModelOptionSchema = z.object({
  model: z.string(), // e.g. "Freemium + B2B School Partnerships"
  tradeoffs: z.string(),
  whoPays: z.string(),
  rank: z.number(),
});

export const ActionablePlanSchema = z.object({
  id: z.string(),
  ideaId: z.string(),
  version: z.number().default(1),
  title: z.string(),
  problemStatement: z.string(),
  targetPersona: z.string(),
  proposedSolution: z.string(),
  evidenceSummary: z.string(),
  alternativesSummary: z.string(),
  analysis: AnalysisResultSchema,
  valueModelOptions: z.array(ValueModelOptionSchema),
  firstFiveActions: z.array(NextActionSchema),
  sources: z.array(CitationSourceSchema),
  findings: z.array(FindingSchema),
  openQuestions: z.array(z.string()).default([]),
  canonicalHash: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  changeReason: z.string().optional(),
});

export type NextAction = z.infer<typeof NextActionSchema>;
export type ValueModelOption = z.infer<typeof ValueModelOptionSchema>;
export type ActionablePlan = z.infer<typeof ActionablePlanSchema>;

// ==========================================
// 5. Progress Tracker & Milestones (Trail)
// ==========================================

export const MilestoneSchema = z.object({
  id: z.string(),
  planVersion: z.number(),
  title: z.string(),
  definitionOfDone: z.string(),
  status: z.enum(["open", "in_progress", "completed"]).default("open"),
  completedAt: z.string().optional(),
  userEvidenceNote: z.string().optional(),
  attestationHash: z.string().optional(),
});

export type Milestone = z.infer<typeof MilestoneSchema>;

// ==========================================
// 6. Real-time Agent Streaming Events
// ==========================================

export const AgentRoleSchema = z.enum(["spark", "scout", "judge", "smith", "trail", "system"]);

export const AgentRunEventSchema = z.object({
  id: z.string(),
  runId: z.string(),
  timestamp: z.string(),
  role: AgentRoleSchema,
  stage: z.enum([
    "queued",
    "planning",
    "researching",
    "checking_evidence",
    "analyzing",
    "building_plan",
    "tracking",
    "completed",
    "degraded",
    "failed",
  ]),
  actionSummary: z.string(),
  toolInvoked: z.string().optional(),
  toolInputSummary: z.string().optional(),
  toolOutputSummary: z.string().optional(),
  sourceIds: z.array(z.string()).default([]),
  reasoningSummary: z.string().optional(),
  isError: z.boolean().default(false),
});

export type AgentRole = z.infer<typeof AgentRoleSchema>;
export type AgentRunEvent = z.infer<typeof AgentRunEventSchema>;

// ==========================================
// 7. Verifiable Proof Record
// ==========================================

export const ProofRecordSchema = z.object({
  planId: z.string(),
  version: z.number(),
  canonicalHash: z.string(), // SHA-256
  algorithm: z.literal("SHA-256/YOUTHFORGE-V1"),
  timestamp: z.string(),
  isTestnetAttested: z.boolean().default(false),
  network: z.string().default("Local SHA-256 + Sepolia Testnet Ready"),
  attestationUid: z.string().optional(),
  explorerUrl: z.string().optional(),
});

export type ProofRecord = z.infer<typeof ProofRecordSchema>;
