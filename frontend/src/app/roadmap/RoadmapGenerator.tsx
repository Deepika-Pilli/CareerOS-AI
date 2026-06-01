"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CURRENT_STATUS_OPTIONS,
  generateRoadmapWithDelay,
  TARGET_ROLE_OPTIONS,
  type CareerRoadmap,
  type CurrentStatus,
  type TargetRole,
} from "@/lib/generate-roadmap";
import { syncRoadmapGeneration } from "@/lib/dashboard-storage";
import RoadmapResults from "./RoadmapResults";

export default function RoadmapGenerator() {
  const [currentStatus, setCurrentStatus] = useState<CurrentStatus>("Student");
  const [targetRole, setTargetRole] = useState<TargetRole>("Frontend Developer");
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setRoadmap(null);
    setIsGenerating(true);

    try {
      const result = await generateRoadmapWithDelay(currentStatus, targetRole);
      setRoadmap(result);
      syncRoadmapGeneration(result.targetRole, result.estimatedTimeline);
    } catch {
      setError("Failed to generate roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = !isGenerating;

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
            Career Roadmap Generator
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Plan your path to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              success
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-slate-400">
            Get a personalized learning roadmap, project ideas, interview prep, and timeline for your target role.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-slate-300">Current status</legend>
              <div className="flex flex-col gap-3">
                {CURRENT_STATUS_OPTIONS.map((status) => (
                  <label
                    key={status}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                      currentStatus === status
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="currentStatus"
                      value={status}
                      checked={currentStatus === status}
                      onChange={() => setCurrentStatus(status)}
                      className="h-4 w-4 accent-violet-500"
                    />
                    <span className="font-medium text-white">{status}</span>
                  </label>
                ))}
              </div>
            </fieldset>

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
              <p className="mt-3 text-xs text-slate-500">
                Roadmap content is tailored to your selected career path.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => void handleGenerate()}
              disabled={!canGenerate}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:from-blue-500 hover:to-violet-500 hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.24.12-.55.12-.79 0L9.75 3.75c-.836-.42-1.875.21-1.875 1.006v8.25c0 .426.241.816.622 1.006l4.875 2.437a1.125 1.125 0 001.006 0z"
                />
              </svg>
              Generate Roadmap
            </button>
          </div>
        </div>

        {isGenerating && (
          <div className="mt-8 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-blue-600/10 to-violet-600/10 p-10">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6 h-16 w-16">
                <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600">
                  <svg className="h-8 w-8 animate-pulse text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.24.12-.55.12-.79 0L9.75 3.75c-.836-.42-1.875.21-1.875 1.006v8.25c0 .426.241.816.622 1.006l4.875 2.437a1.125 1.125 0 001.006 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-lg font-medium text-white">Building your career roadmap…</p>
              <p className="mt-2 text-sm text-slate-400">
                Mapping skills, projects, and interview prep for {targetRole}
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

        {roadmap && !isGenerating && <RoadmapResults roadmap={roadmap} />}

        {roadmap && !isGenerating && (
          <div className="mt-6 flex justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => void handleGenerate()}
              className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-slate-400 transition-colors hover:border-violet-500/40 hover:text-white"
            >
              Regenerate roadmap
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
