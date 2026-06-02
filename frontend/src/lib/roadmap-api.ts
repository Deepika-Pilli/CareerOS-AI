const API_BASE_URL = "http://localhost:5000/api/roadmap";

export type CurrentStatus = "Student" | "Fresher";
export type TargetRole = "Frontend Developer" | "Full Stack Developer" | "Data Analyst" | "AI Engineer" | "Cybersecurity Analyst";

export type RoadmapPhase = {
  phase: string;
  duration: string;
  title: string;
  description: string;
  topics: string[];
};

export type CareerRoadmap = {
  targetRole: TargetRole;
  currentStatus: CurrentStatus;
  estimatedTimeline: string;
  skillsToLearn: string[];
  recommendedProjects: string[];
  interviewPrepPlan: string[];
  learningRoadmap: RoadmapPhase[];
};

export interface RoadmapResponse {
  success: boolean;
  message?: string;
  data?: CareerRoadmap;
}

export interface RoadmapError {
  message: string;
}

export async function generateRoadmap(
  currentStatus: CurrentStatus,
  targetRole: TargetRole,
): Promise<RoadmapResponse> {
  const token = localStorage.getItem("careeros_token");
  
  if (!token) {
    throw new Error("Authorization token required");
  }

  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      targetRole,
      currentStatus,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Roadmap generation failed");
  }

  return data;
}
