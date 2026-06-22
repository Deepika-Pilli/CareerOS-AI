import { handleApiResponse } from "./auth";
import {
  DIFFICULTY_OPTIONS,
  type Difficulty,
  type InterviewQuestion,
  type InterviewResult,
  type TargetRole,
} from "@/lib/interview-coach";

export { DIFFICULTY_OPTIONS, type Difficulty, type TargetRole };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type GenerateInterviewRequest = {
  targetRole: TargetRole;
  difficulty: Difficulty;
};

type GenerateInterviewResponse = {
  success: boolean;
  message: string;
  data: {
    interviewId: string;
    role: TargetRole;
    difficulty: Difficulty;
    questions: InterviewQuestion[];
  };
};

type SubmitInterviewRequest = {
  interviewId: string;
  answers: Record<string, string>;
};

type SubmitInterviewResponse = {
  success: boolean;
  message: string;
  data: InterviewResult;
};

const TOKEN_KEY = "careeros_token";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return handleApiResponse<T>(response);
}

export async function generateInterviewAPI(
  role: TargetRole,
  difficulty: Difficulty
): Promise<{ interviewId: string; questions: InterviewQuestion[] }> {
  const response = await fetchWithAuth<GenerateInterviewResponse>(
    `${API_BASE_URL}/api/interview/generate`,
    {
      method: "POST",
      body: JSON.stringify({ targetRole: role, difficulty }),
    }
  );

  return {
    interviewId: response.data.interviewId,
    questions: response.data.questions,
  };
}

export async function submitInterviewAPI(
  interviewId: string,
  answers: Record<string, string>
): Promise<InterviewResult> {
  const response = await fetchWithAuth<SubmitInterviewResponse>(
    `${API_BASE_URL}/api/interview/submit`,
    {
      method: "POST",
      body: JSON.stringify({ interviewId, answers }),
    }
  );

  return response.data;
}