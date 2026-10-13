# YouthForge Architecture & Engineering Decision Log

All architecture and implementation choices are recorded here with context, options, choice, rationale, date, and reversibility.

---

## Decision 001: Monorepo & Core Runtime Stack
- **Date:** 2026-10-13
- **Context:** Building YouthForge as an autonomous, multi-agent product for the Dubai Chambers Create AI Agents Championship. Needs fast local execution, type-safe agent graph, streaming UI, and reproducible validation.
- **Options Considered:**
  1. Python FastAPI backend + Next.js frontend (two runtimes, serialization overhead, dual envs).
  2. Next.js 15 App Router + React 19 + TypeScript strict mode + LangGraph JS / LangChain Core + Zod shared validation + Tailwind CSS + Framer Motion (single unified runtime, shared schemas).
- **Chosen:** Option 2 (Unified TypeScript stack with Next.js App Router).
- **Rationale:** Minimizes boundaries, enables shared Zod schemas across client, server, and agent graph nodes; runs cleanly with `pnpm` on Windows; supports streaming SSE natively.
- **Reversibility:** Low (foundational), but standard Node.js/Next.js stack is easily maintained and migrated.

---

## Decision 002: Dual Execution Mode (Live Provider + Labelled Offline Fixture / Replay)
- **Date:** 2026-10-13
- **Context:** Evaluators and offline developers must be able to run and audit YouthForge without requiring immediate paid API keys, while live production runs real tools and real research APIs.
- **Options Considered:**
  1. Fail hard when API keys are absent (breaks offline demos and local testing).
  2. Fall back silently to mock data without disclosure (violates truthfulness rules).
  3. Strict dual-mode adapter interface: Live mode calls real APIs (OpenAI/Anthropic/Gemini + Valyu/Tavily), while Fixture Mode runs deterministic cached research clearly marked `CACHED DEMONSTRATION EVIDENCE` in UI.
- **Chosen:** Option 3.
- **Rationale:** Aligns with Sections 1, 4, 13, and 16 of the prompt. Transparent, reliable, and testable under CI.
- **Reversibility:** High (implemented behind interfaces).

---

## Decision 003: Five-Role Specialist Agent Architecture
- **Date:** 2026-10-13
- **Context:** Competition emphasizes real agentic behavior: goal understanding, tool use, multi-step planning, learning from feedback.
- **Chosen:**
  - **Spark:** Intake, clarification, goal structuring, and research plan generation.
  - **Scout:** Research squad executing parallel search, extraction, and citation recording.
  - **Judge:** Feasibility rubric scoring (0-100), risk register, and evidence critic.
  - **Smith:** Structured actionable plan builder (first 5 concrete actions, value model, exports).
  - **Trail:** Progress tracker, plan version updater, and milestone recorder.
- **Rationale:** Clear separation of concerns, explicit schema contracts, and intuitive mental model for both young builders and judging jury.
- **Reversibility:** Medium.

---

## Decision 004: Verifiable Digest & Portability Layer
- **Date:** 2026-10-13
- **Context:** Section 30 requires verifiable proof flow without forcing a wallet connection or writing private ideas on-chain.
- **Chosen:** Canonical plan normalization + SHA-256 digest + portable JSON export + optional EVM testnet attestation (Sepolia EAS adapter) + local verification route `/verify/[hash]`.
- **Rationale:** Preserves privacy (only digests are published/verified), zero barrier to entry for youth, fully verifiable offline and on-chain.
- **Reversibility:** High.
