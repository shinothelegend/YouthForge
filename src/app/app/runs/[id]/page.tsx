"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Search,
  Scale,
  Hammer,
  Route,
  CheckCircle2,
  Clock,
  ArrowRight,
  Terminal,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import type { AgentRunEvent } from "@/lib/schemas";

export default function RunTracePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [events, setEvents] = useState<AgentRunEvent[]>([]);
  const [status, setStatus] = useState<string>("running");
  const [ideaTitle, setIdeaTitle] = useState<string>("");
  const [currentStage, setCurrentStage] = useState<string>("planning");

  useEffect(() => {
    // 1. Fetch initial run metadata
    fetch(`/api/runs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.idea?.title) {
          setIdeaTitle(data.idea.title);
        }
        if (data.status) {
          setStatus(data.status);
        }
      })
      .catch((err) => console.error("Error fetching run metadata:", err));

    // 2. Open Server-Sent Events stream
    const eventSource = new EventSource(`/api/runs/${id}/events`);

    eventSource.onmessage = (e) => {
      try {
        const event: AgentRunEvent = JSON.parse(e.data);
        setEvents((prev) => {
          if (prev.some((p) => p.id === event.id)) return prev;
          return [...prev, event];
        });

        setCurrentStage(event.stage);

        if (event.stage === "completed" || event.stage === "failed") {
          setStatus(event.stage);
          eventSource.close();
        }
      } catch (err) {
        console.error("SSE parsing error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn("EventSource disconnected or closed:", err);
      eventSource.close();
      // Fetch latest state on close
      fetch(`/api/runs/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status) setStatus(data.status);
        });
    };

    return () => {
      eventSource.close();
    };
  }, [id]);

  const stages = [
    { id: "planning", label: "Spark Planning", icon: Flame },
    { id: "researching", label: "Scout Research", icon: Search },
    { id: "analyzing", label: "Judge Evaluation", icon: Scale },
    { id: "building_plan", label: "Smith Synthesis", icon: Hammer },
    { id: "completed", label: "Plan Sealed", icon: ShieldCheck },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "spark":
        return { label: "Spark", bg: "bg-purple-500/20 text-purple-300 border-purple-500/30" };
      case "scout":
        return { label: "Scout Squad", bg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" };
      case "judge":
        return { label: "Judge Analyst", bg: "bg-amber-500/20 text-amber-300 border-amber-500/30" };
      case "smith":
        return { label: "Smith Planner", bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
      case "trail":
        return { label: "Trail Tracker", bg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" };
      default:
        return { label: "System", bg: "bg-slate-800 text-slate-300 border-slate-700" };
    }
  };

  return (
    <div className="py-10 px-4 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" /> Live Multi-Agent Telemetry
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">
            {ideaTitle || "Autonomous Venture Validation Run"}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">Run ID: {id}</p>
        </div>

        {status === "completed" && (
          <Link
            href={`/app/plans/${id}`}
            className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 text-sm self-start md:self-auto"
          >
            View Completed Action Plan <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Stage Progression Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {stages.map((st, idx) => {
          const isPassed =
            status === "completed" ||
            stages.findIndex((s) => s.id === currentStage) >= idx;
          const isCurrent = currentStage === st.id && status !== "completed";

          return (
            <div
              key={st.id}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                isPassed
                  ? "bg-slate-900 border-emerald-500/40 text-emerald-300"
                  : isCurrent
                  ? "bg-orange-500/10 border-orange-500 text-orange-300 animate-pulse"
                  : "bg-slate-950/60 border-white/5 text-slate-500"
              }`}
            >
              <st.icon className="w-4 h-4 flex-shrink-0" />
              <div className="min-w-0">
                <span className="block text-xs font-bold truncate">{st.label}</span>
                <span className="block text-[10px] opacity-75">
                  {isPassed ? "Complete" : isCurrent ? "Executing" : "Pending"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Telemetry Log */}
      <div className="forge-card border border-white/10 bg-slate-950 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-3.5 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-mono font-bold text-slate-200">AGENT_EVENT_STREAM</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>{events.length} Events Logged</span>
            <span>•</span>
            <span className={status === "completed" ? "text-emerald-400 font-semibold" : "text-amber-400"}>
              {status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-5 font-mono text-xs space-y-4 max-h-[600px] overflow-y-auto">
          {events.length === 0 ? (
            <div className="py-12 text-center text-slate-500 animate-pulse">
              Connecting to SSE orchestration stream...
            </div>
          ) : (
            events.map((evt) => {
              const badge = getRoleBadge(evt.role);
              return (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-lg bg-slate-900/60 border border-white/5 space-y-2 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-slate-300 font-medium">{evt.actionSummary}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {evt.toolInvoked && (
                    <div className="text-[11px] text-slate-400 pl-3 border-l-2 border-orange-500/40">
                      <span className="text-orange-400 font-semibold">Tool:</span> {evt.toolInvoked}
                      {evt.toolOutputSummary && (
                        <div className="text-slate-400 mt-0.5">{evt.toolOutputSummary}</div>
                      )}
                    </div>
                  )}

                  {evt.reasoningSummary && (
                    <div className="text-[11px] text-slate-400 pl-3 border-l-2 border-slate-700 italic">
                      &ldquo;{evt.reasoningSummary}&rdquo;
                    </div>
                  )}

                  {evt.sourceIds && evt.sourceIds.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-slate-500">Sources:</span>
                      {evt.sourceIds.map((srcId) => (
                        <span
                          key={srcId}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                        >
                          #{srcId}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
