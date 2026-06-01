import type { Metadata } from "next";
import SkillGapAnalyzer from "./SkillGapAnalyzer";

export const metadata: Metadata = {
  title: "Skill Gap Analyzer | CareerOS AI",
  description:
    "Compare your current skills to target role requirements and get prioritized learning resources.",
};

export default function SkillGapPage() {
  return <SkillGapAnalyzer />;
}
