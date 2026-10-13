import type { Metadata } from "next";
import Link from "next/link";
import { Flame, ShieldCheck, Compass, Sparkles, Settings } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouthForge — Multi-Agent Venture Validation for Young Builders",
  description: "Transform unpolished ideas into evidence-backed, reality-checked ventures. Powered by 5 specialist autonomous AI agents for the Dubai Chambers Create AI Agents Championship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-forge-bg text-slate-100 min-h-screen flex flex-col antialiased selection:bg-orange-500/30 selection:text-orange-200">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-forge-bg/90 border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  YouthForge
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Dubai 2026/27
                  </span>
                </span>
                <span className="block text-[11px] text-slate-400 font-medium">
                  Autonomous Venture Studio
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link href="/app" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> Workspace
              </Link>
              <Link href="/app/new" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-400" /> Forge an Idea
              </Link>
              <Link href="/verify/check" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verify Proof
              </Link>
              <Link href="/app/settings" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                <Settings className="w-4 h-4" /> Settings & Privacy
              </Link>
            </nav>

            {/* Status Indicator */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-medium">5 Agents Ready</span>
              </div>
              <Link
                href="/app/new"
                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25 hover:brightness-110 active:scale-95 transition-all"
              >
                Start Free
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-slate-950/80 px-4 py-8 mt-16 text-center text-xs text-slate-400">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>
                <strong>YouthForge</strong> — Built for Dubai Chambers Create AI Agents Championship (Best Youth AI Agent)
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <span>Truthful Citations</span>
              <span>•</span>
              <span>Zero Minor PII</span>
              <span>•</span>
              <span>Verifiable Canonical Digests</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
