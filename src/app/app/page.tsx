"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Shield,
  Layers,
} from "lucide-react";

interface RunSummary {
  id: string;
  title: string;
  status: string;
  currentVersion: number;
  verdict?: "forge_ahead" | "refine_and_retry" | "rethink";
  overallScore?: number;
  createdAt: string;
  executionMode: string;
}

export default function WorkspaceDashboard() {
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/runs")
      .then((res) => res.json())
      .then((data) => {
        setRuns(data.runs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load runs:", err);
        setLoading(false);
      });
  }, []);

  const getVerdictBadge = (verdict?: string) => {
    switch (verdict) {
      case "forge_ahead":
        return {
          label: "Forge Ahead",
          color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        };
      case "refine_and_retry":
        return {
          label: "Refine & Retry",
          color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        };
      case "rethink":
        return {
          label: "Rethink",
          color: "bg-rose-500/20 text-rose-300 border-rose-500/30",
        };
      default:
        return {
          label: "Evaluating...",
          color: "bg-slate-800 text-slate-300 border-slate-700",
        };
    }
  };

  return (
    <div className="py-10 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-orange-400" />
            Founder Workspace
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your venture hypotheses, review multi-agent validation traces, and track validation milestones.
          </p>
        </div>

        <Link
          href="/app/new"
          className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 text-sm self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" /> Forge New Idea
        </Link>
      </div>

      {/* Ideas & Runs List */}
      {loading ? (
        <div className="forge-card p-12 text-center text-slate-400 animate-pulse space-y-3">
          <div className="w-8 h-8 mx-auto rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          <p className="text-sm">Retrieving active venture records...</p>
        </div>
      ) : runs.length === 0 ? (
        <div className="forge-card p-12 text-center space-y-5 border-dashed border-white/20">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">No Ventures Forged Yet</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Submit your early-stage concept. Spark, Scout, Judge, Smith, and Trail will assemble an empirical plan in under 60 seconds.
            </p>
          </div>
          <Link
            href="/app/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white text-sm transition-all"
          >
            Launch Your First Idea <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {runs.map((run) => {
            const badge = getVerdictBadge(run.verdict);
            return (
              <div
                key={run.id}
                className="forge-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-orange-500/40 transition-all"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-white truncate">{run.title}</h3>
                    <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded border ${badge.color}`}>
                      {badge.label}
                    </span>
                    {run.overallScore !== undefined && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
                        Score: <strong>{run.overallScore}/100</strong>
                      </span>
                    )}
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      v{run.currentVersion}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(run.createdAt).toLocaleDateString()} at{" "}
                      {new Date(run.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-400">Mode: {run.executionMode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/app/runs/${run.id}`}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 transition-colors flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" /> Agent Trace
                  </Link>

                  <Link
                    href={`/app/plans/${run.id}`}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                  >
                    View Plan <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
