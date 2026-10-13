import Link from "next/link";
import {
  Flame,
  ArrowRight,
  ShieldCheck,
  Search,
  Scale,
  Hammer,
  Route,
  CheckCircle2,
  Lock,
  Layers,
  Award,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="space-y-24 py-12 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="grid lg:grid-cols-12 gap-12 items-center pt-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-semibold text-orange-400">
            <Award className="w-3.5 h-3.5" />
            Dubai Chambers Create AI Agents Championship — Best Youth AI Agent
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Turn an unpolished idea into a{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              researched, reality-checked
            </span>{" "}
            venture plan.
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            Not a chatbot that regurgitates generic text. YouthForge deploys a squad of 5 autonomous
            specialist agents to research real evidence, stress-test feasibility on a calibrated rubric,
            build your first 5 concrete validation experiments, and seal verifiable proof.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/app/new"
              className="px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 text-base"
            >
              Forge Your Idea Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/app"
              className="px-6 py-3.5 rounded-xl font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 transition-all text-base"
            >
              View Active Workspace
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real Web Citations
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 0-100 Feasibility Rubric
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Wallet Barrier
            </div>
          </div>
        </div>

        {/* Live Interactive Pipeline Preview Card */}
        <div className="lg:col-span-5">
          <div className="forge-card p-6 border border-white/10 bg-slate-950/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                Autonomous Agent Squad
              </span>
              <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  agent: "Spark",
                  role: "Coordinator & Intake",
                  badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                  icon: Flame,
                  desc: "Synthesizes goals and frames 4-5 empirical research vectors",
                },
                {
                  agent: "Scout",
                  role: "Research Squad",
                  badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
                  icon: Search,
                  desc: "Calls real web search & extracts primary sources (RTA, WAM, stats)",
                },
                {
                  agent: "Judge",
                  role: "Feasibility Critic",
                  badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                  icon: Scale,
                  desc: "Scores 0-100 on 5 weighted dimensions and audits claim integrity",
                },
                {
                  agent: "Smith",
                  role: "Actionable Planner",
                  badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                  icon: Hammer,
                  desc: "Constructs 1-14 day action items and seals SHA-256 canonical digest",
                },
                {
                  agent: "Trail",
                  role: "Milestone Tracker",
                  badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
                  icon: Route,
                  desc: "Tracks builder evidence and evolves plans to Version N+1",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-slate-900/90 border border-white/5 flex items-start gap-3 hover:border-orange-500/30 transition-colors"
                >
                  <div className="p-2 rounded-md bg-white/5 text-slate-300 mt-0.5">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">{item.agent}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${item.badge}`}>
                        {item.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Execution: Bounded State Graph</span>
              <span className="font-mono text-orange-400 font-medium">100% Deterministic</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Built for Young Founders, Engineered for Jurors
          </h2>
          <p className="text-slate-400 text-sm">
            Everything in YouthForge is designed to withstand rigorous inspection: traceable facts,
            calibrated disagreement, and actionable next steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="forge-card p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">1. Verified External Evidence</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              No hallucinated market sizes or fake testimonials. Scout gathers real public sources
              with exact publication dates, URLs, and excerpts. If evidence is lacking, it tells you honestly.
            </p>
          </div>

          <div className="forge-card p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">2. Calibrated 0–100 Rubric</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Judge calculates weighted scores across demand, competition, team feasibility, and
              regulation. It won't sugarcoat: a weak idea receives a respectful &ldquo;Rethink&rdquo; verdict with
              low-cost tests.
            </p>
          </div>

          <div className="forge-card p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">3. Cryptographic Portability</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Smith seals every plan with a canonical SHA-256 digest. Verify authenticity publicly
              at any time without putting private ideas on-chain or forcing a Web3 wallet.
            </p>
          </div>
        </div>
      </section>

      {/* Competition Banner */}
      <section className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/40 border border-orange-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider font-mono">
            <Flame className="w-4 h-4" /> Dubai Digital Economy Flagship
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            Competing for the USD 150,000 Category Grant
          </h3>
          <p className="text-sm text-slate-300 max-w-xl">
            Designed to meet the official Grand Final requirement: demonstrating a fully functional,
            autonomous working AI agent live on stage in Dubai.
          </p>
        </div>
        <Link
          href="/app/new"
          className="px-6 py-3 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white whitespace-nowrap transition-all shadow-md active:scale-95"
        >
          Enter Your Idea Free
        </Link>
      </section>
    </div>
  );
}
