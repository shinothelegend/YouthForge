"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings, Shield, Lock, Trash2, Download, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function SettingsPrivacyPage() {
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your local session cache?")) {
      localStorage.clear();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="py-10 px-4 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <Link
          href="/app"
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
        </Link>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-orange-400" />
          Settings & Youth Privacy Policy
        </h1>
        <p className="text-sm text-slate-400">
          Transparency by design: how YouthForge handles venture data, models, and cryptographic hashes.
        </p>
      </div>

      <div className="forge-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Youth Privacy Architecture (Section 29)</h3>
            <span className="text-xs text-slate-400">Compliant with UAE child & minor data safety principles</span>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Minor PII Collection
            </h4>
            <p>
              YouthForge explicitly does <strong>not</strong> collect or store exact birth dates, national ID documents, school affiliations, or personal contact directories of minors. Competition age verification is strictly a binary declaration confirmed at submission time.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-400" /> Private Venture Ideas Stay Private
            </h4>
            <p>
              Your venture ideas, notes, and founder responses are never written to public blockchains or open social feeds. Only irreversible <strong>SHA-256 canonical digests</strong> are generated for verifiable timestamp proofs.
            </p>
          </div>
        </div>

        {/* Local Data Controls */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-white block">Workspace Cache Controls</span>
            <span className="text-[11px] text-slate-400">Wipe browser state and local memory cached entries</span>
          </div>

          <div className="flex items-center gap-3">
            {cleared && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cache Cleared
              </span>
            )}
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Wipe Local Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
