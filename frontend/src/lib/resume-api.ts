import { authStorage } from "./auth";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

export type SectionScores = {
  skills: number;
  projects: number;
  education: number;
  contact: number;
  structure: number;
};

export type ResumeAnalysis = {
  id: string;
  atsScore: number;
  sectionScores: SectionScores;
  skillsFound: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
};

export type ResumeHistoryItem = {
  id: string;
  atsScore: number;
  skillsFound: string[];
  strengths: string[];
  weaknesses: string[];
  originalFileName: string | null;
  createdAt: string;
};

export interface AnalyzeResponse {
  success: boolean;
  message: string;
  data?: ResumeAnalysis;
}

export interface LatestResumeResponse {
  success: boolean;
  data?: ResumeAnalysis | null;
}

export interface ResumeHistoryResponse {
  success: boolean;
  data?: ResumeHistoryItem[];
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

export async function analyzeResume(
  extractedText: string,
  originalFileName?: string,
): Promise<ResumeAnalysis> {
  const response = await fetch(`${API_BASE_URL}/resume/analyze`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ extractedText, originalFileName }),
  });

  const result = await handleResponse<AnalyzeResponse>(response);

  if (!result.success || !result.data) {
    throw new Error(result.message || "Failed to analyze resume");
  }

  return result.data;
}

export async function getLatestResume(): Promise<ResumeAnalysis | null> {
  const response = await fetch(`${API_BASE_URL}/resume`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result = await handleResponse<LatestResumeResponse>(response);

  if (!result.success) {
    throw new Error("Failed to fetch latest resume");
  }

  return result.data ?? null;
}

export async function getResumeHistory(): Promise<ResumeHistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/resume/history`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result = await handleResponse<ResumeHistoryResponse>(response);

  if (!result.success) {
    throw new Error("Failed to fetch resume history");
  }

  return result.data ?? [];
}