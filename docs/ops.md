# YouthForge Operations & Maintenance Runbook

> Operations, commands, health checks, and deployment guide per Section 36 and Section 39.

---

## 1. Quick Command Reference

```bash
# Install dependencies
pnpm install

# Start local development server (http://localhost:3000)
pnpm dev

# Execute the complete quality gate (Secret scan, TypeScript strict, Vitest suite)
pnpm gate

# Run unit test suite in isolation
pnpm test

# Run TypeScript static type check
pnpm typecheck

# Production build verification
pnpm build
```

---

## 2. Diagnostics & Readiness Endpoint

Query `http://localhost:3000/api/health` to inspect system readiness:
* Reports `application`, `version`, `schemaVersion`, `mode` (`fixture` | `live`), and provider connection statuses.
* Exposes **zero** private keys or secrets.

---

## 3. Failure Modes & Mitigations

1. **Provider Outage / Rate Limit:**
   * *Mitigation:* System automatically falls back to verified cached demonstration evidence with transparent disclosure (`CACHED DEMONSTRATION EVIDENCE`).
2. **Client Disconnection during Long Runs:**
   * *Mitigation:* SSE streams support reconnection via `Last-Event-ID`. State is persisted in `RunStore`.
3. **Digest Mismatch on Verification:**
   * *Mitigation:* The public verification portal checks canonical key ordering and reports whether content was modified or unregistered.
