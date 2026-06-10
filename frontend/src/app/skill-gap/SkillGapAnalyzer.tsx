"use client";

import Link from "next/link";
import { useState } from "react";
import {
  TARGET_ROLE_OPTIONS,
  type SkillGapAnalysis,
  type TargetRole,
} from "@/lib/analyze-skill-gap";
import { authStorage } from "@/lib/auth";
import SkillGapResults from "./SkillGapResults";

const PLACEHOLDER_SKILLS =
  "e.g. JavaScript, React, Git, HTML, CSS, Python, SQL\n(separate with commas or new lines)";

export default function SkillGapAnalyzer() {
  const [currentSkills, setCurrentSkills] = useState("");
  const [targetRole, setTargetRole] = useState<TargetRole>("Frontend Developer");
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!currentSkills.trim()) {
      setError("Please enter at least one current skill.");
      return;
    }

    const token = authStorage.getToken();
    if (!token) {
      setError("Please log in to analyze your skill gap.");
      return;
    }

    setError(null);
    setAnalysis(null);
    setIsAnalyzing(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE_URL}/api/skill-gap/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetRole,
          currentSkills,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Analysis failed");
      }

      setAnalysis(data.data);
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/30 blur-[120px]" />
        <div className="absolute top-1/3 -left-32 h-[500px] w-[500px] rounded-full bg-blue-600/25 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-indigo-500/20 blur-[100px]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-violet-500/25">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">CareerOS AI</span>
        </Link>
        <Link href="/" className="text-sm text-slate-400 transition-colors hover:text-white">
          ← Back to home
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-16 sm:px-8">
        <div className="mb-10 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
            Skill Gap Analyzer
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Close your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              skill gaps
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-slate-400">
            Compare your current skills against role requirements and get a prioritized learning plan.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <label htmlFor="currentSkills" className="mb-3 block text-sm font-medium text-slate-300">
                Current skills
              </label>
              <textarea
                id="currentSkills"
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
                placeholder={PLACEHOLDER_SKILLS}
                rows={8}
                className="w-full resize-y rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              />
              <p className="mt-2 text-xs text-slate-500">
                List skills separated by commas or new lines. We&apos;ll match them to role requirements.
              </p>
            </div>

            <div>
              <label htmlFor="targetRole" className="mb-3 block text-sm font-medium text-slate-300">
                Target role
              </label>
              <select
                id="targetRole"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as TargetRole)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition-colors focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              >
                {TARGET_ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Required skills preview
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Analysis compares your skills against {TARGET_ROLE_OPTIONS.length} role profiles including{" "}
                  <span className="text-violet-300">{targetRole}</span> requirements.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => void handleAnalyze()}
              disabled={isAnalyzing}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:from-blue-500 hover:to-violet-500 hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-3.75v3.75"
                />
              </svg>
              Analyze Skill Gap
            </button>
          </div>
        </div>

        {isAnalyzing && (
          <div className="mt-8 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-blue-600/10 to-violet-600/10 p-10">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6 h-16 w-16">
                <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600">
                  <svg className="h-8 w-8 animate-pulse text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-3.75v3.75"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-lg font-medium text-white">Analyzing your skill gap…</p>
              <p className="mt-2 text-sm text-slate-400">
                Comparing your skills against {targetRole} requirements
              </p>
              <div className="mt-6 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-violet-400"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {analysis && !isAnalyzing && <SkillGapResults analysis={analysis} />}

        {analysis && !isAnalyzing && (
          <div className="mt-6 flex justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => void handleAnalyze()}
              className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-slate-400 transition-colors hover:border-violet-500/40 hover:text-white"
            >
              Re-analyze
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
