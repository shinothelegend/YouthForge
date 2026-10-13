"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Sparkles, ArrowRight, HelpCircle, MapPin, Target, FileText } from "lucide-react";

export default function NewIdeaPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [rawDescription, setRawDescription] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [countryOrRegion, setCountryOrRegion] = useState("Dubai & UAE");
  const [stage, setStage] = useState<"raw_idea" | "early_notes" | "prototype">("raw_idea");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillSample = () => {
    setTitle("EcoRoute UAE — AI Micro-Hub Delivery for Couriers");
    setRawDescription(
      "An autonomous agent that aggregates last-mile parcel batches in Dubai Downtown and Marina for young electric-scooter couriers, cutting delivery emissions and boosting rider earnings."
    );
    setTargetUsers("Independent urban delivery couriers aged 18-24 & local e-commerce merchants");
    setCountryOrRegion("Dubai, United Arab Emirates");
    setStage("raw_idea");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || rawDescription.trim().length < 10) {
      setError("Please provide a title and at least 10 characters describing the idea.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          rawDescription,
          targetUsers,
          countryOrRegion,
          stage,
          clarificationAnswers: {},
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to start run");
      }

      router.push(`/app/runs/${data.runId}`);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-4 lg:px-8 max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" /> Stage 1: Idea Intake
          </span>
          <button
            type="button"
            onClick={fillSample}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition-colors"
          >
            ⚡ Load Sample: EcoRoute UAE
          </button>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Forge a Venture Concept</h1>
        <p className="text-sm text-slate-400">
          Enter your idea in plain language. Spark will structure your goals, Scout will pull verified evidence, and Judge will stress-test feasibility.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="forge-card p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-200">
            Venture Name / Title <span className="text-orange-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. EcoRoute UAE"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-200">
            What is the core idea or problem? <span className="text-orange-400">*</span>
          </label>
          <textarea
            value={rawDescription}
            onChange={(e) => setRawDescription(e.target.value)}
            rows={4}
            placeholder="Describe what you want to build, who it helps, and how it works in 2-4 sentences..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-orange-400" /> Target Customer / Users
            </label>
            <input
              type="text"
              value={targetUsers}
              onChange={(e) => setTargetUsers(e.target.value)}
              placeholder="e.g. Independent young delivery riders"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" /> Geography / Region
            </label>
            <input
              type="text"
              value={countryOrRegion}
              onChange={(e) => setCountryOrRegion(e.target.value)}
              placeholder="e.g. Dubai, UAE"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Current Stage</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "raw_idea", label: "Early Concept", desc: "Just an idea" },
              { id: "early_notes", label: "Research Stage", desc: "Notes & surveys" },
              { id: "prototype", label: "Prototype Stage", desc: "Early mock/code" },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setStage(item.id as any)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  stage === item.id
                    ? "bg-orange-500/10 border-orange-500/50 text-white"
                    : "bg-slate-900 border-white/10 text-slate-400 hover:border-white/20"
                }`}
              >
                <div className="text-xs font-bold">{item.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Initializing 5-Agent Squad...
            </>
          ) : (
            <>
              Forge Venture Plan with Autonomous Agents <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
