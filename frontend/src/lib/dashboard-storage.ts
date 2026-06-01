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

export const DASHBOARD_STORAGE_KEY = "careeros-dashboard-v1";

const STORAGE_KEY = DASHBOARD_STORAGE_KEY;

export const DASHBOARD_UPDATED_EVENT = "careeros-dashboard-updated";

const DEFAULT_PROFILE: DashboardProfile = {
  userName: "Career Explorer",
  currentGoal: "Land your dream tech role",
};

const DEFAULT_STATS: DashboardStats = {
  atsScore: null,
  skillMatchPercent: null,
  interviewScore: null,
  roadmapProgress: null,
};

function loadRaw(): DashboardData {
  if (typeof window === "undefined") {
    return { profile: DEFAULT_PROFILE, stats: DEFAULT_STATS, activities: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { profile: DEFAULT_PROFILE, stats: DEFAULT_STATS, activities: [] };
    }
    const parsed = JSON.parse(raw) as Partial<DashboardData>;
    return {
      profile: { ...DEFAULT_PROFILE, ...parsed.profile },
      stats: { ...DEFAULT_STATS, ...parsed.stats },
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
    };
  } catch {
    return { profile: DEFAULT_PROFILE, stats: DEFAULT_STATS, activities: [] };
  }
}

function save(data: DashboardData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent(DASHBOARD_UPDATED_EVENT));
}

export function getDashboardData(): DashboardData {
  return loadRaw();
}

export function updateProfile(profile: Partial<DashboardProfile>): DashboardProfile {
  const data = loadRaw();
  data.profile = { ...data.profile, ...profile };
  save(data);
  return data.profile;
}

export function updateStats(stats: Partial<DashboardStats>): DashboardStats {
  const data = loadRaw();
  data.stats = { ...data.stats, ...stats };
  save(data);
  return data.stats;
}

export function addActivity(
  activity: Omit<DashboardActivity, "id" | "timestamp"> & { timestamp?: number },
): DashboardActivity {
  const data = loadRaw();
  const entry: DashboardActivity = {
    id: `${activity.type}-${Date.now()}`,
    timestamp: activity.timestamp ?? Date.now(),
    ...activity,
  };
  data.activities = [entry, ...data.activities].slice(0, 12);
  save(data);
  return entry;
}

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

/** Persist ATS score + activity after resume analysis. */
export function syncResumeAnalysis(atsScore: number, skillsFoundCount: number): void {
  updateStats({ atsScore });
  addActivity({
    type: "resume",
    title: ACTIVITY_TITLES.resume,
    description: `ATS score: ${atsScore}% · ${skillsFoundCount} skills detected`,
  });
}

/** Persist skill match % + activity after skill gap analysis. */
export function syncSkillGapAnalysis(matchPercent: number, targetRole: string): void {
  updateStats({ skillMatchPercent: matchPercent });
  addActivity({
    type: "skill-gap",
    title: ACTIVITY_TITLES["skill-gap"],
    description: `${matchPercent}% skill match for ${targetRole}`,
  });
}

/** Persist interview score + activity after mock interview. */
export function syncInterviewCompletion(overallScore: number, role: string): void {
  updateStats({ interviewScore: overallScore });
  addActivity({
    type: "interview",
    title: ACTIVITY_TITLES.interview,
    description: `Overall score: ${overallScore}% · ${role}`,
  });
}

/** Persist roadmap progress + activity after roadmap generation. */
export function syncRoadmapGeneration(targetRole: string, estimatedTimeline: string): void {
  const data = loadRaw();
  const current = data.stats.roadmapProgress ?? 0;
  const roadmapProgress = Math.min(100, current + 25);

  updateStats({ roadmapProgress });
  addActivity({
    type: "roadmap",
    title: ACTIVITY_TITLES.roadmap,
    description: `${targetRole} · ${estimatedTimeline}`,
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
