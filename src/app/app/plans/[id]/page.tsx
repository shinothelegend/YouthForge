"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Download,
  Printer,
  Copy,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCode,
} from "lucide-react";
import confetti from "canvas-confetti";
import type { ActionablePlan, Milestone } from "@/lib/schemas";

export default function PlanViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [plan, setPlan] = useState<ActionablePlan | null>(null);
  const [allVersions, setAllVersions] = useState<ActionablePlan[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState(false);
  const [activeTab, setActiveTab] = useState<"plan" | "rubric" | "actions" | "sources">("plan");
  const [updatingActionId, setUpdatingActionId] = useState<string | null>(null);
  const [founderNote, setFounderNote] = useState<string>("");

  useEffect(() => {
    fetch(`/api/runs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.latestPlan) {
          setPlan(data.latestPlan);
        }
        if (data.planVersions) {
          setAllVersions(data.planVersions);
        }
        if (data.milestones) {
          setMilestones(data.milestones);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load plan:", err);
        setLoading(false);
      });
  }, [id]);

  const copyHash = () => {
    if (plan?.canonicalHash) {
      navigator.clipboard.writeText(plan.canonicalHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleCompleteAction = async (actionId: string) => {
    setUpdatingActionId(actionId);
    try {
      const res = await fetch(`/api/runs/${id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionId,
          userEvidenceNote: founderNote || "Founder completed action verification.",
          status: "completed",
        }),
      });

      const data = await res.json();
      if (data.updatedPlan) {
        setPlan(data.updatedPlan);
        setAllVersions((prev) => [...prev, data.updatedPlan]);
        setFounderNote("");

        // Trigger celebratory confetti for milestone achievement
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch (err) {
      console.error("Failed to update milestone:", err);
    } finally {
      setUpdatingActionId(null);
    }
  };

  const exportJson = () => {
    if (!plan) return;
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${plan.title.replace(/\s+/g, "_")}_v${plan.version}.json`;
    a.click();
  };

  const exportMarkdown = () => {
    if (!plan) return;
    const md = `# ${plan.title} (Version ${plan.version})
**Canonical Hash:** ${plan.canonicalHash}
**Overall Feasibility:** ${plan.analysis.overallScore}/100 [Verdict: ${plan.analysis.verdict.toUpperCase()}]

## Problem Statement
${plan.problemStatement}

## Target Persona
${plan.targetPersona}

## Proposed Solution
${plan.proposedSolution}

## First 5 Next Actions
${plan.firstFiveActions.map((a) => `### ${a.order}. ${a.verb}: ${a.action}
- **Deliverable:** ${a.deliverable}
- **Timeline:** ${a.estimatedDays}
- **Completion Condition:** ${a.completionCondition}
- **Status:** ${a.status.toUpperCase()}
`).join("\n")}

## Verified Citations
${plan.sources.map((s) => `- [${s.title}](${s.url}) — ${s.publisher} (Accessed: ${s.accessDate})`).join("\n")}
`;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${plan.title.replace(/\s+/g, "_")}_v${plan.version}.md`;
    a.click();
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 mx-auto rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        <p className="text-sm">Retrieving forged venture plan...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Plan Not Found</h2>
        <p className="text-sm text-slate-400">The requested venture plan could not be located.</p>
        <Link href="/app" className="text-sm text-orange-400 hover:underline">
          Return to Workspace
        </Link>
      </div>
    );
  }

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case "forge_ahead":
        return {
          label: "Forge Ahead",
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          text: "Strong indicators across all dimensions. Proceed directly into empirical validation experiments.",
        };
      case "refine_and_retry":
        return {
          label: "Refine & Retry",
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          text: "Viable thesis with promising angles, but key customer acquisition or regulatory assumptions require tightening.",
        };
      default:
        return {
          label: "Rethink",
          badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
          text: "Saturated market without structural advantages or severe execution bottlenecks. Test low-cost adjacent angles.",
        };
    }
  };

  const verdictStyle = getVerdictStyle(plan.analysis.verdict);

  return (
    <div className="py-10 px-4 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Top Banner with Version & Exports */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30">
              VERSION {plan.version}
            </span>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${verdictStyle.badge}`}>
              {verdictStyle.label}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
              Feasibility: <strong>{plan.analysis.overallScore}/100</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{plan.title}</h1>
          <p className="text-xs text-slate-400 font-mono">Plan ID: {plan.id}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={exportJson}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" /> JSON
          </button>
          <button
            onClick={exportMarkdown}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Markdown
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      {/* Verifiable Proof Banner */}
      {plan.canonicalHash && (
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div className="font-mono">
              <span className="text-slate-400 block sm:inline">Canonical SHA-256 Digest: </span>
              <strong className="text-emerald-300 break-all">{plan.canonicalHash}</strong>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyHash}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors flex items-center gap-1 text-[11px]"
            >
              {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedHash ? "Copied" : "Copy"}
            </button>
            <Link
              href={`/verify/${plan.canonicalHash}`}
              className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors flex items-center gap-1 text-[11px]"
            >
              Verify Portal <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-2">
        {[
          { id: "plan", label: "Executive Plan" },
          { id: "actions", label: `First 5 Actions (${plan.firstFiveActions.filter((a) => a.status === "completed").length}/5)` },
          { id: "rubric", label: "0-100 Rubric & Risks" },
          { id: "sources", label: `Evidence & Citations (${plan.sources.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Executive Plan */}
      {activeTab === "plan" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="forge-card p-6 space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
                Problem Statement
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">{plan.problemStatement}</p>
            </div>

            <div className="forge-card p-6 space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
                Target Customer Persona
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">{plan.targetPersona}</p>
            </div>
          </div>

          <div className="forge-card p-6 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
              Proposed Autonomous Solution
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">{plan.proposedSolution}</p>
          </div>

          {/* Value Models */}
          <div className="forge-card p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
              Ranked Value & Monetization Hypotheses
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {plan.valueModelOptions.map((vm) => (
                <div key={vm.rank} className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Rank #{vm.rank}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                      Model
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-orange-300">{vm.model}</h4>
                  <p className="text-[11px] text-slate-400">{vm.tradeoffs}</p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    <strong>Payer:</strong> {vm.whoPays}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: First 5 Next Actions & Trail Evolution */}
      {activeTab === "actions" && (
        <div className="space-y-6">
          <div className="forge-card p-6 border-orange-500/20 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              Trail Milestone Progression & Plan Evolution
            </h3>
            <p className="text-xs text-slate-400">
              Marking an action complete records your real-world evidence and invokes the <strong>Trail</strong> agent
              to re-score the feasibility rubric and forge Version N+1.
            </p>
          </div>

          <div className="space-y-4">
            {plan.firstFiveActions.map((action) => {
              const isCompleted = action.status === "completed";
              return (
                <div
                  key={action.id}
                  className={`forge-card p-5 space-y-3 transition-all ${
                    isCompleted ? "border-emerald-500/40 bg-emerald-950/10" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs mt-0.5">
                        {action.order}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold uppercase text-orange-400">
                            {action.verb}
                          </span>
                          <span className="text-sm font-bold text-white">{action.action}</span>
                        </div>
                        <p className="text-xs text-slate-300">{action.whyItMatters}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap ${
                        isCompleted
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border-white/10"
                      }`}
                    >
                      {isCompleted ? "COMPLETED" : action.estimatedDays}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-xs bg-slate-900/80 p-3 rounded-lg border border-white/5">
                    <div>
                      <strong className="text-slate-400 block text-[11px]">Deliverable:</strong>
                      <span className="text-slate-200">{action.deliverable}</span>
                    </div>
                    <div>
                      <strong className="text-slate-400 block text-[11px]">Completion Condition:</strong>
                      <span className="text-slate-200">{action.completionCondition}</span>
                    </div>
                  </div>

                  {isCompleted ? (
                    <div className="text-xs text-emerald-400 flex items-center gap-1.5 pt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed on {new Date(action.completedAt || "").toLocaleDateString()}: &ldquo;{action.userNote}&rdquo;
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 pt-2">
                      <input
                        type="text"
                        placeholder="Log founder notes or evidence link (e.g., 'Interviewed 10 riders in Marina')..."
                        value={founderNote}
                        onChange={(e) => setFounderNote(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-orange-500"
                      />
                      <button
                        onClick={() => handleCompleteAction(action.id)}
                        disabled={updatingActionId === action.id}
                        className="px-4 py-1.5 rounded-lg font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-white transition-all disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5"
                      >
                        {updatingActionId === action.id ? "Updating..." : "Mark Complete & Advance Plan"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Rubric Breakdown & Risks */}
      {activeTab === "rubric" && (
        <div className="space-y-6">
          <div className="forge-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">5-Dimension Calibrated Rubric Breakdown</h3>
            <div className="space-y-4">
              {plan.analysis.dimensions.map((dim, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-white">{dim.dimension}</span>
                      <span className="text-xs text-slate-500 ml-2 font-mono">Weight: {dim.weight}%</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-orange-400">
                      {dim.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full transition-all"
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{dim.justification}</p>
                  <div className="text-[11px] text-amber-300/90 pt-1">
                    <strong>Improvement Condition:</strong> {dim.improvementCondition}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Matrix */}
          <div className="forge-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Risk Register & Mitigation Roadmap</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {plan.analysis.risks.map((risk) => (
                <div key={risk.id} className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                      {risk.severity} Severity
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Likelihood: {risk.likelihood}</span>
                  </div>
                  <p className="text-xs text-slate-200 font-semibold">{risk.description}</p>
                  <p className="text-[11px] text-slate-400">
                    <strong>Mitigation:</strong> {risk.mitigation}
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">Owner: {risk.owner}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Verified Citations & Findings */}
      {activeTab === "sources" && (
        <div className="space-y-6">
          <div className="forge-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Primary Web Citations & Evidence Base</h3>
            <div className="space-y-3">
              {plan.sources.map((src) => (
                <div key={src.id} className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sm text-cyan-300 hover:underline flex items-center gap-1.5"
                    >
                      {src.title} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {src.validationStatus.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic pl-3 border-l-2 border-cyan-500/40">
                    &ldquo;{src.excerpt}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
                    <span>Publisher: {src.publisher}</span>
                    <span>•</span>
                    <span>Accessed: {src.accessDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
