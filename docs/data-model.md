# YouthForge Data Model & Persistence Specification

> Authored per Section 23 and Section 24 of the build specification.

---

## 1. Core Data Entities

* **`IdeaIntake`**: Raw title, description, target users, geography, stage, and clarification answers.
* **`ResearchTask`**: ID, goal, query, tool, expected evidence, dependencies, and execution status.
* **`CitationSource`**: ID, verified URL, title, publisher, publication date, access date, excerpt, and validation status (`verified` | `cached`).
* **`Finding`**: ID, claim statement, category, confidence level, and linked `sourceIds`.
* **`AnalysisResult`**: Overall score (0–100), verdict (`forge_ahead` | `refine_and_retry` | `rethink`), summary, 5 rubric dimensions, and risk register.
* **`ActionablePlan`**: Versioned venture plan containing problem, persona, solution, evidence summary, 3 value models, first 5 next actions, and canonical hash.
* **`Milestone`**: Action tracking entity with status (`open` | `in_progress` | `completed`), completion timestamp, and founder evidence note.
* **`AgentRunEvent`**: Structured streaming telemetry event with role, stage, action summary, tool invoked, and source IDs.
* **`ProofRecord`**: Public proof entity holding plan ID, version, canonical SHA-256 digest, algorithm string, and optional testnet attestation UID.

---

## 2. Versioning & Immutability Rules
* Plans are strictly **append-only**. When Trail updates a plan, it generates Version N+1 with a traceable `changeReason`.
* The previous plan version remains intact and inspectable in the run's `planVersions` history.
* Canonical hashing normalizes keys alphabetically and ignores ephemeral timestamps, ensuring identical core contents hash identically.
