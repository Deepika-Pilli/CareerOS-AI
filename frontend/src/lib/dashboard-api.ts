import { authStorage, handleApiResponse } from "./auth";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

export type DashboardProfile = {
  userName: string;
  currentGoal: string;
};

export type DashboardStats = {
  atsScore: number | null;
  skillMatchPercent: number | null;
  interviewScore: number | null;
  roadmapProgress: number | null;
};

export type ActivityType = "resume" | "skill-gap" | "interview" | "roadmap";

export type DashboardActivity = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: number;
};

export type DashboardData = {
  profile: DashboardProfile;
  stats: DashboardStats;
  activities: DashboardActivity[];
};

export interface DashboardResponse {
  success: boolean;
  message: string;
  data?: DashboardData;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data?: DashboardProfile;
}

export interface StatsUpdateResponse {
  success: boolean;
  message: string;
  data?: DashboardStats;
}


function getAuthHeaders(): HeadersInit {
  const token = authStorage.getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result = await handleApiResponse<DashboardResponse>(response);

  if (!result.success || !result.data) {
    throw new Error(result.message || "Failed to fetch dashboard data");
  }

  return result.data;
}

export async function updateProfile(profile: Partial<DashboardProfile>): Promise<DashboardProfile> {
  const response = await fetch(`${API_BASE_URL}/dashboard/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profile),
  });

  const result = await handleApiResponse<ProfileUpdateResponse>(response);

  if (!result.success || !result.data) {
    throw new Error(result.message || "Failed to update profile");
  }

  return result.data;
}

export async function updateStats(stats: Partial<DashboardStats>): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(stats),
  });

  const result = await handleApiResponse<StatsUpdateResponse>(response);

  if (!result.success || !result.data) {
    throw new Error(result.message || "Failed to update stats");
  }

  return result.data;
}

// ---------------------------------------------------------------------------
// Utility functions (consolidated from dashboard-storage.ts)
// ---------------------------------------------------------------------------

export const ACTIVITY_TITLES = {
  resume: "Resume analyzed",
  "skill-gap": "Skill gap analyzed",
  interview: "Interview completed",
  roadmap: "Roadmap generated",
} as const;

export function formatActivityTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function formatActivityTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getRecommendedActions(stats: DashboardStats): { label: string; href: string; reason: string }[] {
  const actions: { label: string; href: string; reason: string; priority: number }[] = [];

  if (stats.atsScore === null) {
    actions.push({
      label: "Analyze your resume",
      href: "/resume",
      reason: "Get your ATS score and improvement tips",
      priority: 1,
    });
  } else if (stats.atsScore < 70) {
    actions.push({
      label: "Improve resume ATS score",
      href: "/resume",
      reason: `Current ATS score is ${stats.atsScore}% — aim for 75+`,
      priority: 2,
    });
  }

  if (stats.skillMatchPercent === null) {
    actions.push({
      label: "Run skill gap analysis",
      href: "/skill-gap",
      reason: "See which skills you need for your target role",
      priority: 1,
    });
  } else if (stats.skillMatchPercent < 60) {
    actions.push({
      label: "Close skill gaps",
      href: "/skill-gap",
      reason: `Skill match is ${stats.skillMatchPercent}% — review learning priorities`,
      priority: 2,
    });
  }

  if (stats.interviewScore === null) {
    actions.push({
      label: "Practice mock interview",
      href: "/interview",
      reason: "Build confidence with AI interview coaching",
      priority: 3,
    });
  } else if (stats.interviewScore < 70) {
    actions.push({
      label: "Retake interview practice",
      href: "/interview",
      reason: `Interview score ${stats.interviewScore}% — practice weak areas`,
      priority: 3,
    });
  }

  if (stats.roadmapProgress === null) {
    actions.push({
      label: "Generate career roadmap",
      href: "/roadmap",
      reason: "Get a step-by-step plan for your target role",
      priority: 4,
    });
  } else if (stats.roadmapProgress < 100) {
    actions.push({
      label: "Continue roadmap",
      href: "/roadmap",
      reason: `Roadmap ${stats.roadmapProgress}% — keep following your learning phases`,
      priority: 4,
    });
  }

  if (actions.length === 0) {
    return [
      {
        label: "Review all tools",
        href: "/resume",
        reason: "Great progress! Fine-tune resume and interview answers",
      },
    ];
  }

  return actions
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 4)
    .map(({ label, href, reason }) => ({ label, href, reason }));
}