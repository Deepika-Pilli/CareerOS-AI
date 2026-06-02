import { authStorage } from "./auth";

const API_BASE_URL = "http://localhost:5000/api";

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

async function handleResponse(response: Response): Promise<DashboardResponse> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboard data");
  }

  return data;
}

export async function getDashboardData(): Promise<DashboardData> {
  const token = authStorage.getToken();
  
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const result = await handleResponse(response);

  if (!result.success || !result.data) {
    throw new Error(result.message || "Failed to fetch dashboard data");
  }

  return result.data;
}
