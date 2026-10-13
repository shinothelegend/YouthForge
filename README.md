# YouthForge — Autonomous Multi-Agent Venture Validation Studio

> **Championship Target:** Dubai Chambers Create AI Agents Championship  
> **Category:** Best Youth AI Agent (Top Youth-Led Venture) — USD 150,000 Grant  
> **Host Entity:** Dubai Chamber of Digital Economy  
> **Live Dev Server:** `http://localhost:3000`  
> **Status:** Fully Operational, Verified by `pnpm gate`

---

## Overview

**YouthForge** is an autonomous multi-agent venture validation studio designed to empower young founders (< 21 years of age) to transform raw, unpolished ideas into evidence-backed, reality-checked venture plans.

Unlike standard chatbots that provide sycophantic, hallucinated advice, YouthForge orchestrates five specialist agents:
1. **Spark (Coordinator & Intake):** Clarifies goals and sequences 4–5 empirical research vectors.
2. **Scout (Research Squad):** Pulls real primary citations (Dubai RTA, Emirates News Agency WAM, market data) with access dates and excerpts.
3. **Judge (Feasibility & Critic):** Calculates calibrated 0–100 scores across a weighted 5-dimension rubric and runs a claim-coverage critic audit.
4. **Smith (Action Planner):** Forges the first 5 next actions (1–14 day low-cost experiments) and computes a canonical SHA-256 digest.
5. **Trail (Milestone Tracker):** Records founder field evidence, re-scores rubric dimensions, and mints versioned plans (v1 → v2).

---

## Key Features

- **Empirical Sourcing:** Every key finding is grounded in verified public URLs and citations.
- **Calibrated Disagreement:** Honest verdicts (`Forge Ahead`, `Refine and Retry`, `Rethink`) prevent youth from wasting capital on unviable ideas.
- **Action Over Answers:** Generates 5 concrete 1–14 day experiments with low-budget alternatives and observable completion conditions.
- **Verifiable Portability:** Deterministic SHA-256 canonical hashing allows anyone to verify plan authenticity at `/verify/[hash]` with zero crypto wallet friction.
- **Youth Privacy by Design:** Zero collection of minor birth dates, national ID documents, or school rosters.
- **Dual Execution Engine:** Operates end-to-end with live providers (Valyu/Tavily/OpenAI) or in deterministic cached demonstration mode (`CACHED DEMONSTRATION EVIDENCE`).

---

## Quickstart

### 1. Requirements
- Node.js `v20+` (verified on `v24.19.0`)
- `pnpm` `v9+` or `v12+` (installed via corepack)

### 2. Setup & Installation
```bash
# Install dependencies
pnpm install

# Run the full automated verification gate
pnpm gate

# Launch local development server
pnpm dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Verification & Testing

YouthForge enforces a strict self-healing quality gate:
```bash
# Run all checks: Secret scan, TypeScript strict typecheck, and Vitest suite
pnpm gate

# Run unit tests
pnpm test

# Run TypeScript typecheck
pnpm typecheck
```

---

## Available Routes

| Route | Surface | Purpose |
| :--- | :--- | :--- |
| **`/`** | Public Landing | Hero value proposition, 5-agent pipeline visualizer, competition badge |
| **`/app`** | Founder Workspace | Active venture dashboard, status badges, and sample loader |
| **`/app/new`** | Idea Intake | Natural language idea entry with Spark clarification chips |
| **`/app/runs/[id]`** | Live Agent Telemetry | Real-time SSE event stream, active tool calls, and instant replay |
| **`/app/plans/[id]`** | Actionable Plan View | Executive plan, 0–100 rubric, first 5 actions checklist, JSON/MD/Print exports |
| **`/verify/[hash]`** | Public Proof Portal | Independent verification of canonical SHA-256 plan digests |
| **`/app/settings`** | Settings & Privacy | Youth privacy statement, local cache management, and data controls |
| **`/api/health`** | System Health | Safe readiness diagnostics without leaking environment secrets |

---

## Documentation Index

- [Architecture Specification](docs/architecture.md)
- [Agent Workflow & State Graph](docs/agent-workflow.md)
- [Design System & Editorial Tokens](docs/design-system.md)
- [Feasibility Rubric Calculator](docs/rubric.md)
- [Cryptographic Portability](docs/portability.md)
- [Security & Threat Model](docs/security.md)
- [Competition Requirements & Snapshot](docs/competition/requirements.md)
- [Dubai Chambers Judging Alignment](docs/judging-map.md)
- [8-Minute Live Demo Script](docs/demo-script.md)
- [Pitch Deck Source](submission/pitch-deck.md)
- [Competition Submission Form](submission/description.md)
- [Video Script & Storyboard](video/script.md)
- [Dependency Provenance](docs/PROVENANCE.md)
- [Engineering Decisions Log](docs/DECISIONS.md)
- [Quality Gate Log](docs/GATELOG.md)

---

## License

Built independently under the MIT License for the Dubai Chambers Create AI Agents Championship.
