import type { Metadata } from "next";
import Dashboard from "./Dashboard";

export const metadata: Metadata = {
  title: "Dashboard | CareerOS AI",
  description: "Your career progress hub — ATS score, skills, interviews, and roadmap at a glance.",
};

export default function DashboardPage() {
  return <Dashboard />;
}
