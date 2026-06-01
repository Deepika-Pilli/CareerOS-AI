import type { Metadata } from "next";
import InterviewCoach from "./InterviewCoach";

export const metadata: Metadata = {
  title: "AI Interview Coach | CareerOS AI",
  description:
    "Practice role-specific interview questions and get feedback on confidence, communication, and technical skills.",
};

export default function InterviewPage() {
  return <InterviewCoach />;
}
