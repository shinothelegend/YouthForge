"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, AlertCircle, ArrowLeft, CheckCircle2, Copy, Check, ExternalLink } from "lucide-react";

interface VerificationResponse {
  verified: boolean;
  hash: string;
  planId?: string;
  title?: string;
  version?: number;
  overallScore?: number;
  verdict?: string;
  createdAt?: string;
  algorithm?: string;
  message: string;
}

export default function VerifyProofPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = use(params);
  const [inputHash, setInputHash] = useState(hash === "check" ? "" : hash);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const verifyHash = async (hashToTest: string) => {
    if (!hashToTest.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/verify/${hashToTest.trim()}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Verification query error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hash && hash !== "check") {
      verifyHash(hash);
    }
  }, [hash]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    verifyHash(inputHash);
  };

  const copyHash = () => {
    if (result?.hash) {
      navigator.clipboard.writeText(result.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-12 px-4 lg:px-8 max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <Link
          href="/app"
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
          <ShieldCheck className="w-4 h-4" /> Cryptographic Integrity Engine
        </div>
        <h1 className="text-3xl font-extrabold text-white">Public Proof Verification</h1>
        <p className="text-sm text-slate-400">
          Verify that a YouthForge venture plan existed at a specific time and that its core claims, scores, and actions have not been altered.
        </p>
      </div>

      {/* Hash Input Form */}
      <form onSubmit={handleSearch} className="forge-card p-6 space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Canonical Plan SHA-256 Digest
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputHash}
            onChange={(e) => setInputHash(e.target.value)}
            placeholder="Paste 64-character SHA-256 hash..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white text-xs transition-all disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Hash"}
          </button>
        </div>
      </form>

      {/* Result Card */}
      {result && (
        <div
          className={`forge-card p-6 sm:p-8 space-y-6 border transition-all ${
            result.verified
              ? "border-emerald-500/40 bg-emerald-950/10"
              : "border-rose-500/30 bg-rose-950/10"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                result.verified
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              }`}
            >
              {result.verified ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>

            <div className="space-y-1">
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                  result.verified
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                }`}
              >
                {result.verified ? "VERIFIED AUTHENTIC" : "NOT FOUND / UNVERIFIED"}
              </span>
              <h2 className="text-xl font-bold text-white pt-1">
                {result.title || "Unregistered Digest"}
              </h2>
              <p className="text-xs text-slate-300">{result.message}</p>
            </div>
          </div>

          {result.verified && (
            <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
              <div className="grid sm:grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-xl border border-white/5 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">VERSION</span>
                  <span className="font-bold text-white text-sm">v{result.version}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">FEASIBILITY SCORE</span>
                  <span className="font-bold text-orange-400 text-sm">{result.overallScore}/100</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ALGORITHM</span>
                  <span className="font-bold text-slate-300 text-xs">{result.algorithm}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 font-mono text-[11px] text-slate-400">
                <span className="truncate pr-2">Hash: {result.hash}</span>
                <button onClick={copyHash} className="hover:text-white flex items-center gap-1 flex-shrink-0">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {result.planId && (
                <div className="pt-2">
                  <Link
                    href={`/app/plans/${result.planId.replace(/^plan-/, "").replace(/-v\d+$/, "")}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
                  >
                    Open Venture Plan in Workspace <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
