import type { ReactNode } from "react";
import type { ResumeAnalysis } from "@/lib/analyze-resume";

type Props = {
  analysis: ResumeAnalysis;
};

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";
  const stroke =
    score >= 75 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171";

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-white/10"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${color}`}>{score}</span>
        <span className="text-xs text-slate-500">/ 100</span>
      </div>
    </div>
  );
}

function ListCard({
  title,
  items,
  variant,
  icon,
}: {
  title: string;
  items: string[];
  variant: "success" | "warning" | "info" | "skills" | "missing";
  icon: ReactNode;
}) {
  const styles = {
    success: "border-emerald-500/20 bg-emerald-500/5",
    warning: "border-amber-500/20 bg-amber-500/5",
    info: "border-blue-500/20 bg-blue-500/5",
    skills: "border-violet-500/20 bg-violet-500/5",
    missing: "border-slate-500/20 bg-slate-500/5",
  };

  const titleColors = {
    success: "text-emerald-400",
    warning: "text-amber-400",
    info: "text-blue-400",
    skills: "text-violet-400",
    missing: "text-slate-400",
  };

  return (
    <div className={`rounded-2xl border p-6 backdrop-blur-sm ${styles[variant]}`}>
      <div className={`mb-4 flex items-center gap-2 font-semibold ${titleColors[variant]}`}>
        {icon}
        {title}
      </div>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">None detected</p>
      )}
    </div>
  );
}

export default function ResumeAnalysisResults({ analysis }: Props) {
  const { atsScore, sectionScores, skillsFound, missingSkills, strengths, weaknesses, suggestions } =
    analysis;

  const sectionBreakdown = [
    { label: "Skills", score: sectionScores.skills },
    { label: "Projects", score: sectionScores.projects },
    { label: "Education", score: sectionScores.education },
    { label: "Contact", score: sectionScores.contact },
    { label: "Structure", score: sectionScores.structure },
  ];

  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-xl font-semibold text-white">AI Resume Review</h2>

      {/* ATS Score hero card */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-transparent p-8 shadow-xl shadow-violet-900/20">
        <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
          <ScoreRing score={atsScore} />
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">ATS Score</p>
            <h3 className="mt-1 text-2xl font-bold text-white">
              {atsScore >= 75
                ? "Strong ATS compatibility"
                : atsScore >= 50
                  ? "Moderate ATS compatibility"
                  : "Needs improvement for ATS"}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Scored across skills, projects, education, contact info, and resume structure.
            </p>
            <div className="mt-6 space-y-3">
              {sectionBreakdown.map(({ label, score }) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-slate-300">{score}/20</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700"
                      style={{ width: `${(score / 20) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skills row */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-violet-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Skills Found
          </h3>
          {skillsFound.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skillsFound.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-violet-400/30 bg-violet-500/15 px-3 py-1.5 text-sm font-medium text-violet-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No tracked technical skills detected.</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-500/20 bg-slate-500/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            Missing Skills
          </h3>
          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-emerald-400/90">All tracked skills are present on your resume.</p>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ListCard
          title="Resume Strengths"
          items={strengths}
          variant="success"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <ListCard
          title="Resume Weaknesses"
          items={weaknesses}
          variant="warning"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          }
        />
        <ListCard
          title="Suggestions for Improvement"
          items={suggestions}
          variant="info"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.845 1.586-2.008a5.001 5.001 0 005.828 0c.928.163 1.586 1.025 1.586 2.008V18" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
