# YouthForge 5-Agent Workflow & Orchestration Specification

> Prepared per Section 14 through Section 21 of the build specification.

---

## 1. Specialist Roles & Responsibilities

| Role | Codename | Purpose | Core Outputs |
| :--- | :--- | :--- | :--- |
| **Agent 1** | **Spark** | Intake, goal framing, clarification, and task planning | `ClarificationQuestion[]`, `ResearchTask[]` |
| **Agent 2** | **Scout** | Web retrieval, extraction, and citation normalization | `CitationSource[]`, `Finding[]` |
| **Agent 3** | **Judge** | 0-100 rubric scoring, risk register, and claim critic | `AnalysisResult` (Verdict, Dimensions, Risks) |
| **Agent 4** | **Smith** | Action synthesis, next 5 actions, and canonical hash | `ActionablePlan` (Version N), `canonicalHash` |
| **Agent 5** | **Trail** | Milestone execution, evidence review, and plan evolution | `ActionablePlan` (Version N+1) |

---

## 2. Execution Path & State Transitions

1. `QUEUED`: Request validated against `IdeaIntakeSchema`. Run record created in `RunStore`.
2. `PLANNING (Spark)`: Input evaluated for vagueness. If ambiguous (< 35 chars without audience context), 3 clarification chips are offered. Otherwise, 4–5 empirical research tasks are sequenced.
3. `RESEARCHING & CHECKING EVIDENCE (Scout)`: Research tasks executed in parallel. Sources normalized with URL, title, publisher, and access date. Claims linked to source IDs.
4. `ANALYZING (Judge)`: Weighted rubric calculates 0–100 score across 5 dimensions. Critic verifies 100% claim coverage.
5. `BUILDING PLAN (Smith)`: Synthesizes problem, persona, proposed solution, value models, and the first 5 next actions (1–14 days). Canonical SHA-256 digest is sealed.
6. `COMPLETED`: Run marked complete. Full plan accessible for inspection, JSON/Markdown/Print export, and verification.
7. `TRACKING (Trail)`: When user marks a milestone complete with evidence, Trail re-evaluates the rubric and mints Version N+1.
