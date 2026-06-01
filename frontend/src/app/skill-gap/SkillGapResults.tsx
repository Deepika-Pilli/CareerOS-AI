import type { SkillGapAnalysis, SkillPriority } from "@/lib/analyze-skill-gap";

type Props = {
  analysis: SkillGapAnalysis;
};

const PRIORITY_STYLES: Record<SkillPriority, string> = {
  High: "border-red-500/30 bg-red-500/10 text-red-300",
  Medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Low: "border-slate-500/30 bg-slate-500/10 text-slate-300",
};

export default function SkillGapResults({ analysis }: Props) {
  const { matchPercent, skillsAvailable, missingSkills, learningPriority, recommendedResources, estimatedLearningDuration, targetRole } = analysis;

  return (
    <div className="mt-10 space-y-8">
      {/* Match score */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-transparent p-8">
        <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
          <div className="relative mx-auto h-32 w-32">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="url(#gapGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={2 * Math.PI * 54 * (1 - matchPercent / 100)}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{matchPercent}%</span>
              <span className="text-xs text-slate-500">role match</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Skill gap analysis</p>
            <h2 className="mt-1 text-2xl font-bold text-white">
              {targetRole}
            </h2>
            <p className="mt-2 text-slate-400">
              {skillsAvailable.length} of {skillsAvailable.length + missingSkills.length} required skills covered
            </p>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-slate-400">
                <span>Progress toward role requirements</span>
                <span>{matchPercent}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-1000"
                  style={{ width: `${matchPercent}%` }}
                />
              </div>
            </div>
            <p className="mt-4 rounded-lg border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
              <span className="font-medium">Estimated learning: </span>
              {estimatedLearningDuration}
            </p>
          </div>
        </div>
      </div>

      {/* Skills available & missing */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-emerald-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Skills already available
            <span className="ml-auto rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs">{skillsAvailable.length}</span>
          </h3>
          {skillsAvailable.length > 0 ? (
            <ul className="space-y-3">
              {skillsAvailable.map((skill) => (
                <li
                  key={skill.name}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3"
                >
                  <p className="font-medium text-white">{skill.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">Matched: &quot;{skill.matchedInput}&quot;</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No matching skills detected. Add skills you already know above.</p>
          )}
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-amber-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            Missing skills
            <span className="ml-auto rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs">{missingSkills.length}</span>
          </h3>
          {missingSkills.length > 0 ? (
            <ul className="space-y-3">
              {missingSkills.map((skill) => (
                <li
                  key={skill.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-white">{skill.name}</p>
                    <p className="text-xs text-slate-500">~{skill.weeksToLearn} weeks to learn</p>
                  </div>
                  <span className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[skill.priority]}`}>
                    {skill.priority}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-emerald-400/90">You have all required skills for this role. Great work!</p>
          )}
        </div>
      </div>

      {/* Learning priority */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="mb-6 font-semibold text-white">Learning priority</h3>
        <div className="space-y-6">
          {learningPriority.map((group) => (
            <div key={group.priority}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase ${PRIORITY_STYLES[group.priority]}`}>
                  {group.priority} priority
                </span>
                <span className="text-xs text-slate-500">{group.skills.length} skills</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    group.priority === "High"
                      ? "bg-red-500"
                      : group.priority === "Medium"
                        ? "bg-amber-500"
                        : "bg-slate-500"
                  }`}
                  style={{
                    width: `${Math.min(100, (group.skills.length / Math.max(missingSkills.length, 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
          {learningPriority.length === 0 && (
            <p className="text-sm text-slate-500">No gaps to prioritize — you&apos;re aligned with role requirements.</p>
          )}
        </div>
      </div>

      {/* Recommended resources */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
        <h3 className="mb-6 flex items-center gap-2 font-semibold text-blue-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          Recommended resources
        </h3>
        {recommendedResources.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {recommendedResources.map((item) => (
              <div
                key={item.skill}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="font-medium text-white">{item.skill}</p>
                <ul className="mt-2 space-y-1">
                  {item.resources.map((resource) => (
                    <li key={resource} className="flex gap-2 text-sm text-slate-400">
                      <span className="text-blue-400">→</span>
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No additional resources needed at this time.</p>
        )}
      </div>
    </div>
  );
}
