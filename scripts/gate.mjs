import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("=================================================");
console.log("🔥 YOUTHFORGE VERIFICATION GATE (`pnpm gate`)");
console.log("=================================================\n");

const results = [];
let hasFailure = false;

function runCheck(name, cmd) {
  process.stdout.write(`⏳ Running check: ${name}... `);
  const start = Date.now();
  try {
    execSync(cmd, { stdio: "pipe", encoding: "utf8" });
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`✅ PASS (${duration}s)`);
    results.push({ name, status: "PASS", duration: `${duration}s` });
  } catch (err) {
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`❌ FAIL (${duration}s)`);
    console.error(err.stdout || err.stderr || err.message);
    results.push({ name, status: "FAIL", duration: `${duration}s`, error: err.message });
    hasFailure = true;
  }
}

// 1. Secret Scanning Check
process.stdout.write("⏳ Running check: Secret Scanner... ");
try {
  const envExample = fs.readFileSync(".env.example", "utf8");
  if (/sk-[a-zA-Z0-9]{20,}/.test(envExample) || /ghp_[a-zA-Z0-9]{20,}/.test(envExample)) {
    throw new Error("Potential real secret detected in .env.example!");
  }
  console.log("✅ PASS (0.01s) — Clean");
  results.push({ name: "Secret Scanner", status: "PASS", duration: "0.01s" });
} catch (e) {
  console.log("❌ FAIL");
  results.push({ name: "Secret Scanner", status: "FAIL", error: e.message });
  hasFailure = true;
}

// 2. TypeScript Static Checks
runCheck("TypeScript Strict Typecheck", "cmd /c pnpm typecheck");

// 3. Unit Tests Suite
runCheck("Vitest Core Verification Suite", "cmd /c pnpm test");

console.log("\n=================================================");
console.log("📊 GATE SUMMARY TABLE");
console.log("=================================================");
console.table(results);

if (hasFailure) {
  console.error("\n❌ GATE FAILED: Required quality checks did not pass.");
  process.exit(1);
} else {
  console.log("\n✅ ALL GATE CHECKS PASSED: Ready for continuous execution.");
  process.exit(0);
}
