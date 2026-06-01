import type { Metadata } from "next";
import ResumeAnalyzer from "./ResumeAnalyzer";

export const metadata: Metadata = {
  title: "Resume Analyzer | CareerOS AI",
  description: "Upload your PDF resume and extract text for analysis.",
};

export default function ResumePage() {
  return <ResumeAnalyzer />;
}
