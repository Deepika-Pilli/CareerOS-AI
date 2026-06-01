"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  DASHBOARD_STORAGE_KEY,
  DASHBOARD_UPDATED_EVENT,
  formatActivityTime,
  formatActivityTimestamp,
  getDashboardData,
  getRecommendedActions,
  updateProfile,
  type DashboardActivity,
  type DashboardData,
} from "@/lib/dashboard-storage";

const QUICK_NAV = [
  { label: "Resume Analyzer", href: "/resume", icon: "document" },
  { label: "Skill Gap Analysis", href: "/skill-gap", icon: "chart" },
  { label: "Interview Coach", href: "/interview", icon: "mic" },
  { label: "Career Roadmap", href: "/roadmap", icon: "map" },
] as const;

function NavIcon({ type }: { type: (typeof QUICK_NAV)[number]["icon"] }) {
  const className = "h-5 w-5";
  if (type === "document") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    );
  }
  if (type === "chart") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-3.75v3.75" />
      </svg>
    );
  }
  if (type === "mic") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.24.12-.55.12-.79 0L9.75 3.75c-.836-.42-1.875.21-1.875 1.006v8.25c0 .426.241.816.622 1.006l4.875 2.437a1.125 1.125 0 001.006 0z" />
    </svg>
  );
}

function ActivityIcon({ type }: { type: DashboardActivity["type"] }) {
  const colors: Record<DashboardActivity["type"], string> = {
    resume: "text-red-400 bg-red-500/15",
    "skill-gap": "text-violet-400 bg-violet-500/15",
    interview: "text-blue-400 bg-blue-500/15",
    roadmap: "text-emerald-400 bg-emerald-500/15",
  };
  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colors[type]}`}>
      <NavIcon
        type={
          type === "resume"
            ? "document"
            : type === "skill-gap"
              ? "chart"
              : type === "interview"
                ? "mic"
                : "map"
        }
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  progress,
  accent,
}: {
  label: string;
  value: string;
  suffix?: string;
  progress: number | null;
  accent: "blue" | "violet" | "emerald" | "amber";
}) {
  const gradients = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
    violet: "from-violet-500/20 to-violet-600/5 border-violet-500/20",
    emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
    amber: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
  };
  const barColors = {
    blue: "bg-blue-500",
    violet: "bg-violet-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-xl ${gradients[accent]}`}
    >
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">
        {value}
        {suffix && <span className="text-lg text-slate-500">{suffix}</span>}
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColors[accent]}`}
          style={{ width: `${progress ?? 0}%` }}
        />
      </div>
    </div>
  );
}

function formatStat(value: number | null, suffix = ""): string {
  if (value === null) return "—";
  return `${value}${suffix}`;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [goalInput, setGoalInput] = useState("");

  const refresh = useCallback(() => {
    setData(getDashboardData());
  }, []);

  useEffect(() => {
    refresh();

    const onStorage = (e: StorageEvent) => {
      if (e.key === DASHBOARD_STORAGE_KEY) refresh();
    };
    const onDashboardUpdated = () => refresh();
    const onFocus = () => refresh();

    window.addEventListener("storage", onStorage);
    window.addEventListener(DASHBOARD_UPDATED_EVENT, onDashboardUpdated);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(DASHBOARD_UPDATED_EVENT, onDashboardUpdated);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  const saveProfile = () => {
    updateProfile({ userName: nameInput.trim() || "Career Explorer", currentGoal: goalInput.trim() || "Land your dream tech role" });
    setEditingProfile(false);
    refresh();
  };

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading dashboard…
      </div>
    );
  }

  const { profile, stats, activities } = data;
  const recommended = getRecommendedActions(stats);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute top-1/3 -left-32 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-indigo-500/15 blur-[100px]" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-violet-500/25">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold">CareerOS AI</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm sm:gap-6">
            <Link href="/" className="text-slate-400 transition-colors hover:text-white">
              Home
            </Link>
            <span className="font-medium text-violet-400">Dashboard</span>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:px-8 sm:py-10">
        {/* Welcome */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-violet-900/10 backdrop-blur-xl sm:p-8">
          {!editingProfile ? (
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Welcome back</p>
                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Hello,{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                    {profile.userName}
                  </span>
                </h1>
                <p className="mt-3 flex items-center gap-2 text-slate-300">
                  <span className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm">
                    Goal: {profile.currentGoal}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNameInput(profile.userName);
                  setGoalInput(profile.currentGoal);
                  setEditingProfile(true);
                }}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm transition-colors hover:border-white/20 hover:text-white"
              >
                Edit profile
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Edit profile</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="userName" className="mb-1 block text-sm text-slate-400">
                    Your name
                  </label>
                  <input
                    id="userName"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-white outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label htmlFor="currentGoal" className="mb-1 block text-sm text-slate-400">
                    Current goal
                  </label>
                  <input
                    id="currentGoal"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-white outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={saveProfile}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2 text-sm font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="rounded-lg border border-white/10 px-5 py-2 text-sm text-slate-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="ATS Score"
            value={formatStat(stats.atsScore)}
            suffix={stats.atsScore !== null ? "%" : undefined}
            progress={stats.atsScore}
            accent="blue"
          />
          <StatCard
            label="Skill Match"
            value={formatStat(stats.skillMatchPercent)}
            suffix={stats.skillMatchPercent !== null ? "%" : undefined}
            progress={stats.skillMatchPercent}
            accent="violet"
          />
          <StatCard
            label="Interview Score"
            value={formatStat(stats.interviewScore)}
            suffix={stats.interviewScore !== null ? "%" : undefined}
            progress={stats.interviewScore}
            accent="emerald"
          />
          <StatCard
            label="Roadmap Progress"
            value={formatStat(stats.roadmapProgress)}
            suffix={stats.roadmapProgress !== null ? "%" : undefined}
            progress={stats.roadmapProgress}
            accent="amber"
          />
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Recent activities */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold">Recent activities</h2>
            {activities.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {activities.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm"
                  >
                    <ActivityIcon type={activity.type} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{activity.title}</p>
                      <p className="mt-0.5 text-sm text-slate-400">{activity.description}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatActivityTime(activity.timestamp)}
                        <span className="mx-1.5 text-slate-600">·</span>
                        {formatActivityTimestamp(activity.timestamp)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                No activity yet. Use the tools below to start building your career profile.
              </p>
            )}
          </section>

          {/* Recommended actions */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold">Recommended actions</h2>
            <ul className="mt-4 space-y-3">
              {recommended.map((action) => (
                <li key={action.href + action.label}>
                  <Link
                    href={action.href}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-violet-500/30 hover:bg-violet-500/5"
                  >
                    <div>
                      <p className="font-medium text-white group-hover:text-violet-200">{action.label}</p>
                      <p className="mt-0.5 text-sm text-slate-400">{action.reason}</p>
                    </div>
                    <span className="shrink-0 text-violet-400">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Quick navigation */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Quick navigation</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all hover:border-violet-500/40 hover:bg-white/10 hover:shadow-lg hover:shadow-violet-900/20"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 text-violet-300 ring-1 ring-white/10 group-hover:from-blue-500/30 group-hover:to-violet-600/30">
                  <NavIcon type={item.icon} />
                </div>
                <span className="font-medium text-slate-200 group-hover:text-white">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
