"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { analyzeResumeWithDelay, type ResumeAnalysis } from "@/lib/analyze-resume";
import { syncResumeAnalysis } from "@/lib/dashboard-storage";
import { extractTextFromPdf } from "@/lib/extract-pdf-text";
import ResumeAnalysisResults from "./ResumeAnalysisResults";

export default function ResumeAnalyzer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setError(null);
    setExtractedText(null);
    setAnalysis(null);
    setFileName(file.name);
    setIsExtracting(true);

    try {
      const text = await extractTextFromPdf(file);
      if (!text) {
        setError("No text could be extracted from this PDF. It may be image-only or scanned.");
        setFileName(null);
        return;
      }
      setExtractedText(text);
    } catch {
      setError("Failed to read the PDF. Please try another file.");
      setFileName(null);
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!extractedText) return;

    setError(null);
    setAnalysis(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzeResumeWithDelay(extractedText);
      setAnalysis(result);
      syncResumeAnalysis(result.atsScore, result.skillsFound.length);
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const handleClear = () => {
    setFileName(null);
    setExtractedText(null);
    setAnalysis(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const readyToAnalyze = extractedText && !isExtracting && !isAnalyzing;

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
            AI Resume Review
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Analyze your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              resume
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-slate-400">
            Upload a PDF, then run an AI-powered ATS review with skill detection and actionable feedback.
          </p>
        </div>

        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isAnalyzing && inputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
            isDragging
              ? "border-violet-400 bg-violet-500/10"
              : "border-white/15 bg-white/[0.03] hover:border-violet-500/40 hover:bg-white/[0.05]"
          } ${isAnalyzing ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload PDF resume"
          />
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 text-blue-400 ring-1 ring-white/10">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-white">
            {isDragging ? "Drop your PDF here" : "Drag & drop your PDF resume"}
          </p>
          <p className="mt-2 text-sm text-slate-500">or click to browse · PDF only</p>
        </div>

        {fileName && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-4a1 1 0 01-1-1V4zM8 12h8v2H8v-2zm0 4h5v2H8v-2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Uploaded file</p>
                <p className="truncate font-medium text-white">{fileName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              disabled={isAnalyzing}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition-colors hover:border-white/20 hover:text-white disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        )}

        {isExtracting && (
          <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] py-8 text-slate-400">
            <svg className="h-5 w-5 animate-spin text-violet-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Reading PDF…
          </div>
        )}

        {readyToAnalyze && !analysis && (
          <div className="mt-6 flex justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => void handleAnalyze()}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:from-blue-500 hover:to-violet-500 hover:shadow-violet-500/40"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
              Analyze Resume
            </button>
          </div>
        )}

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
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-lg font-medium text-white">Analyzing your resume…</p>
              <p className="mt-2 text-sm text-slate-400">
                Calculating ATS score, detecting skills, and generating recommendations
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

        {analysis && !isAnalyzing && <ResumeAnalysisResults analysis={analysis} />}

        {readyToAnalyze && analysis && (
          <div className="mt-6 flex justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => void handleAnalyze()}
              className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-slate-400 transition-colors hover:border-violet-500/40 hover:text-white"
            >
              Re-analyze resume
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
