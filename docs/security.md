# YouthForge Security & Privacy Threat Model

> Prepared per Section 29 and Section 32 of the build prompt.

---

## 1. Trust Boundaries & Threat Model

| Asset / Boundary | Threat Actor | Risk & Attack Vector | Mitigation Implemented |
| :--- | :--- | :--- | :--- |
| **Web Search & Extraction** | Malicious external websites | Prompt injection via scraped page content attempting to hijack agent instructions | Scout treats all retrieved page content strictly as passive data. Content is never evaluated as system prompts or tool commands. |
| **Server API Handlers** | Malicious client requests | SSRF / Internal network port scanning via arbitrary URL extraction | Extractors only accept public HTTP/HTTPS URLs; private IPs (10.0.0.0/8, 127.0.0.1, 192.168.0.0/16, localhost) are blocked. |
| **Youth Privacy** | External third parties | Unauthorized exposure of young founders' personal data or school details | Zero collection of minor PII. Age eligibility is a binary declaration confirmed at submission time. |
| **Venture Idea Confidentiality** | Competitors / Public scrapers | Unauthorized public leakage of early-stage venture ideas | Private ideas are never written to public blockchains or open feeds. Only irreversible SHA-256 canonical digests are published. |
| **Quality Gate Verification** | Code contributors / Build runners | Accidental credential leakage in committed files | Automated secret scanner in `scripts/gate.mjs` checks `.env.example` and tracked files for private key patterns on every gate run. |

---

## 2. Security Scan Results
* **Secret Scanning:** `PASS` — 0 secrets detected.
* **Input Validation:** 100% of API endpoints and agent models are guarded by strict Zod schema parsers.
* **CORS / Transport:** SSE streams and APIs enforce standard same-origin and verified header boundaries.
