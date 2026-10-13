import { NextResponse } from "next/server";

export async function GET() {
  const isValyuConfigured = Boolean(process.env.VALYU_API_KEY);
  const isTavilyConfigured = Boolean(process.env.TAVILY_API_KEY);
  const isLlmConfigured = Boolean(
    process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY
  );

  return NextResponse.json({
    status: "ok",
    application: "YouthForge",
    version: "1.0.0",
    schemaVersion: "2026.10-v1",
    mode: process.env.YOUTHFORGE_EXECUTION_MODE || "fixture",
    demoModeActive: true,
    competitionCategory: "Best Youth AI Agent (Top Youth-Led Venture)",
    host: "Dubai Chambers Create AI Agents Championship",
    providers: {
      research: {
        valyu: isValyuConfigured ? "configured" : "unconfigured (fixture fallback active)",
        tavily: isTavilyConfigured ? "configured" : "unconfigured",
      },
      llm: {
        status: isLlmConfigured ? "configured" : "unconfigured (deterministic orchestrator active)",
      },
      proof: {
        network: "Local SHA-256 + Sepolia Testnet Ready",
        status: "operational",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
