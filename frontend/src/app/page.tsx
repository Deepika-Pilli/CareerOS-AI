"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import type React from "react";

const features: {
  title: string;
  description: string;
  href?: string;
  icon: React.ReactNode;
}[] = [
  {
    title: "Resume Analyzer",
    href: "/resume",
    description:
      "Upload your PDF for ATS scoring, skill detection, strengths, weaknesses, and improvement suggestions.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "AI Interview Coach",
    href: "/interview",
    description:
      "Practice 5 role-specific questions with scores for confidence, communication, and technical depth.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    title: "Career Roadmap Generator",
    href: "/roadmap",
    description:
      "Get a personalized learning roadmap, projects, interview prep, and timeline for your target role.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.24.12-.55.12-.79 0L9.75 3.75c-.836-.42-1.875.21-1.875 1.006v8.25c0 .426.241.816.622 1.006l4.875 2.437a1.125 1.125 0 001.006 0z" />
      </svg>
    ),
  },
  {
    title: "Skill Gap Analysis",
    href: "/skill-gap",
    description:
      "Compare your skills to role requirements, see gaps, priorities, resources, and learning duration.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-3.75v3.75" />
      </svg>
    ),
  },
];

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-full overflow-hidden bg-slate-950 text-white">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/30 blur-[120px]" />
        <div className="absolute top-1/3 -left-32 h-[500px] w-[500px] rounded-full bg-blue-600/25 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-indigo-500/20 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-violet-500/25">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">CareerOS AI</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate-400 sm:gap-8">
          <a href="#features" className="hidden transition-colors hover:text-white sm:inline">
            Features
          </a>
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-medium text-white backdrop-blur-sm transition-colors hover:border-violet-500/40 hover:bg-white/10"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-medium text-white backdrop-blur-sm transition-colors hover:border-violet-500/40 hover:bg-white/10"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 font-medium text-white shadow-lg shadow-violet-600/30 transition-all hover:from-blue-500 hover:to-violet-500 hover:shadow-violet-500/40"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-12 text-center sm:px-8 sm:pt-20 lg:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            AI-powered career platform
          </div>

          <h1 className="mx-auto max-w-4xl bg-gradient-to-r from-white via-blue-100 to-violet-200 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            CareerOS AI
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            AI-powered career guidance, resume analysis, interview preparation and skill roadmap
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={isAuthenticated ? "/dashboard" : "/register"}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:from-blue-500 hover:to-violet-500 hover:shadow-violet-500/40"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
            {[
              { value: "4+", label: "Core AI tools" },
              { value: "24/7", label: "Always available" },
              { value: "100%", label: "Personalized guidance" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-6 pb-24 sm:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                accelerate your career
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Four powerful AI tools designed to help you land your next role with confidence.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {features.map((feature) => {
              const card = (
                <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-white/[0.06]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-violet-600/0 opacity-0 transition-opacity group-hover:from-blue-600/5 group-hover:to-violet-600/10 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-5 inline-flex rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 p-3 text-blue-400 ring-1 ring-white/10">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="mt-3 leading-relaxed text-slate-400">{feature.description}</p>
                    {feature.href && (
                      <p className="mt-4 text-sm font-medium text-violet-400 group-hover:text-violet-300">
                        Open tool →
                      </p>
                    )}
                  </div>
                </article>
              );

              return feature.href ? (
                <Link key={feature.title} href={feature.href} className="block">
                  {card}
                </Link>
              ) : (
                <div key={feature.title}>{card}</div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} CareerOS AI. Built for the future of work.</p>
      </footer>
    </div>
  );
}
