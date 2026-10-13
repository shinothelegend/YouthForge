# YouthForge Verifiable Portability & Attestation Layer

> Authored per Section 30 and Section 31 of the build specification.

---

## 1. Canonical Serialization & Digest Spec

YouthForge implements a deterministic canonical plan representation:
1. **Key Sorting:** JSON keys are recursively sorted alphabetically using `canonicalJsonStringify`.
2. **Attribute Whitelist:** Only structural venture definitions (title, problem statement, target persona, proposed solution, rubric dimensions, action items, and sorted source URLs) are included in the digest.
3. **Digest Algorithm:** `SHA-256` encoded as a 64-character lowercase hex string (`algorithm: "SHA-256/YOUTHFORGE-V1"`).
4. **Offline Verifiability:** Anyone can verify the hash independently using standard tools:
   ```bash
   node -e 'const { computeCanonicalPlanHash } = require("./dist/canonical.js"); console.log(computeCanonicalPlanHash(planJson));'
   ```

---

## 2. On-Chain Testnet Attestation (EAS Adapter)

For founders seeking on-chain timestamp credentials:
* **Network:** Ethereum Sepolia Testnet (Chain ID 11155111)
* **Contract Address:** `0xC2679fBD37d54388Ce493F1DB75320D236e1815e` (Official Sepolia EAS Registry)
* **Payload Structure:** Only the `bytes32` canonical plan hash and schema identifier are submitted. No private idea text, notes, or founder identities are ever broadcasted on-chain.
* **Testnet Default:** Strictly guarded against mainnet deployment. Zero financial transactions or paid gas required from youth users.
