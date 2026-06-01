"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { extractTextFromPdf } from "@/lib/extract-pdf-text";

export default function ResumeAnalyzer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setError(null);
    setExtractedText(null);
    setFileName(file.name);
    setIsLoading(true);

    try {
      const text = await extractTextFromPdf(file);
      if (!text) {
        setError("No text could be extracted from this PDF. It may be image-only or scanned.");
        return;
      }
      setExtractedText(text);
    } catch {
      setError("Failed to read the PDF. Please try another file.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/30 blur-[120px]" />
        <div className="absolute top-1/3 -left-32 h-[500px] w-[500px] rounded-full bg-blue-600/25 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-indigo-500/20 blur-[100px]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-4xl items-center justify-between px-6 py-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-violet-500/25">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">CareerOS AI</span>
        </Link>
        <Link
          href="/"
          className="text-sm text-slate-400 transition-colors hover:text-white"
        >
          ← Back to home
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-16 sm:px-8">
        <div className="mb-10 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
            Resume Analyzer
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Upload your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              resume
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-slate-400">
            Upload a PDF to extract and preview the text content from your resume.
          </p>
        </div>

        {/* Upload zone */}
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
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
            isDragging
              ? "border-violet-400 bg-violet-500/10"
              : "border-white/15 bg-white/[0.03] hover:border-violet-500/40 hover:bg-white/[0.05]"
          }`}
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

        {/* File name */}
        {fileName && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-4a1 1 0 01-1-1V4zM8 12h8v2H8v-2zm0 4h5v2H8v-2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Uploaded file
                </p>
                <p className="truncate font-medium text-white">{fileName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition-colors hover:border-white/20 hover:text-white"
            >
              Clear
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] py-8 text-slate-400">
            <svg className="h-5 w-5 animate-spin text-violet-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Extracting text from PDF…
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Extracted text */}
        {extractedText && !isLoading && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Extracted text</h2>
              <span className="text-sm text-slate-500">
                {extractedText.length.toLocaleString()} characters
              </span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-violet-900/10 backdrop-blur-sm">
              <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300">
                {extractedText}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
