"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DIFFICULTY_OPTIONS,
  evaluateInterviewWithDelay,
  generateQuestionsWithDelay,
  TARGET_ROLE_OPTIONS,
  type Difficulty,
  type InterviewQuestion,
  type InterviewResult,
  type TargetRole,
} from "@/lib/interview-coach";
import { syncInterviewCompletion } from "@/lib/dashboard-storage";
import InterviewResults from "./InterviewResults";

type Phase = "setup" | "interview" | "results";

export default function InterviewCoach() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [role, setRole] = useState<TargetRole>("Frontend Developer");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setError(null);
    setResult(null);
    setAnswers({});
    setIsLoading(true);

    try {
      const generated = await generateQuestionsWithDelay(role, difficulty);
      setQuestions(generated);
      setPhase("interview");
    } catch {
      setError("Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const evaluation = await evaluateInterviewWithDelay(role, difficulty, questions, answers);
      setResult(evaluation);
      syncInterviewCompletion(evaluation.overallInterviewScore, evaluation.role);
      setPhase("results");
    } catch {
      setError("Failed to evaluate answers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPhase("setup");
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setError(null);
  };

  const updateAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
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
            AI Interview Coach
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Practice your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              interview skills
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-slate-400">
            Answer role-specific questions and get AI feedback on confidence, communication, and technical depth.
          </p>
        </div>

        {phase === "setup" && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="role" className="mb-3 block text-sm font-medium text-slate-300">
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as TargetRole)}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
                >
                  {TARGET_ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-slate-300">Difficulty</p>
                <div className="flex flex-col gap-3">
                  {DIFFICULTY_OPTIONS.map((level) => (
                    <label
                      key={level}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                        difficulty === level
                          ? "border-violet-500/50 bg-violet-500/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        value={level}
                        checked={difficulty === level}
                        onChange={() => setDifficulty(level)}
                        disabled={isLoading}
                        className="accent-violet-500"
                      />
                      <span className="font-medium">{level}</span>
                      <span className="ml-auto text-xs text-slate-500">
                        {level === "Easy" && "Foundational"}
                        {level === "Medium" && "Standard"}
                        {level === "Hard" && "Advanced"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => void handleStart()}
                disabled={isLoading}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:from-blue-500 hover:to-violet-500 disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
                Start Interview
              </button>
            </div>
          </div>
        )}

        {isLoading && phase === "setup" && (
          <LoadingPanel message="Generating interview questions…" sub={`${role} · ${difficulty}`} />
        )}

        {phase === "interview" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <div>
                <p className="font-medium text-white">{role}</p>
                <p className="text-sm text-slate-500">{difficulty} · {questions.length} questions</p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="text-sm text-slate-400 hover:text-white disabled:opacity-50"
              >
                Change settings
              </button>
            </div>

            {questions.map((q, index) => (
              <div
                key={q.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="mb-4 flex flex-wrap items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/30 to-violet-600/30 text-sm font-bold text-violet-300 ring-1 ring-white/10">
                    Q{index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {q.type}
                    </span>
                    <p className="mt-1 font-medium text-white">{q.question}</p>
                  </div>
                </div>
                <textarea
                  value={answers[q.id] ?? ""}
                  onChange={(e) => updateAnswer(q.id, e.target.value)}
                  placeholder="Type your answer here…"
                  rows={5}
                  disabled={isLoading}
                  className="w-full resize-y rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
                />
              </div>
            ))}

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-violet-600/30 hover:from-blue-500 hover:to-violet-500 disabled:opacity-50"
              >
                Submit Answers
              </button>
            </div>
          </div>
        )}

        {isLoading && phase === "interview" && (
          <LoadingPanel message="Analyzing your answers…" sub="Scoring confidence, communication & technical depth" />
        )}

        {phase === "results" && result && <InterviewResults result={result} />}

        {phase === "results" && (
          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white hover:from-blue-500 hover:to-violet-500"
            >
              New Interview
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}

function LoadingPanel({ message, sub }: { message: string; sub: string }) {
  return (
    <div className="mt-8 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-blue-600/10 to-violet-600/10 p-10">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6 h-16 w-16">
          <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600">
            <svg className="h-8 w-8 animate-pulse text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
        </div>
        <p className="text-lg font-medium text-white">{message}</p>
        <p className="mt-2 text-sm text-slate-400">{sub}</p>
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
  );
}
