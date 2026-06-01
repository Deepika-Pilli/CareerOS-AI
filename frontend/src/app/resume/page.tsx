import type { Metadata } from "next";
import ResumeAnalyzer from "./ResumeAnalyzer";

export const metadata: Metadata = {
  title: "AI Resume Review | CareerOS AI",
  description:
    "Upload your PDF resume for ATS scoring, skill detection, and personalized improvement suggestions.",
};

export default function ResumePage() {
  return <ResumeAnalyzer />;
}
