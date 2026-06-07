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

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
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

  const result = await handleResponse<DashboardResponse>(response);

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

  const result = await handleResponse<ProfileUpdateResponse>(response);

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

  const result = await handleResponse<StatsUpdateResponse>(response);

  if (!result.success || !result.data) {
    throw new Error(result.message || "Failed to update stats");
  }

  return result.data;
}