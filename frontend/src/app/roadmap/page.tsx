import type { Metadata } from "next";
import RoadmapGenerator from "./RoadmapGenerator";

export const metadata: Metadata = {
  title: "Career Roadmap Generator | CareerOS AI",
  description:
    "Generate a personalized learning roadmap, skills plan, projects, and interview prep for your target role.",
};

export default function RoadmapPage() {
  return <RoadmapGenerator />;
}
