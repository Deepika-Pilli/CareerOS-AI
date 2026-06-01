import type { CareerRoadmap } from "@/lib/generate-roadmap";

type Props = {
  roadmap: CareerRoadmap;
};

export default function RoadmapResults({ roadmap }: Props) {
  return (
    <div className="mt-10 space-y-8">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-transparent p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Your personalized plan</p>
        <h2 className="mt-2 text-2xl font-bold text-white">
          Path to{" "}
          <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            {roadmap.targetRole}
          </span>
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300">
            Status: {roadmap.currentStatus}
          </span>
          <span className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-sm font-medium text-violet-300">
            Timeline: {roadmap.estimatedTimeline}
          </span>
        </div>
      </div>

      {/* Learning timeline */}
      <div>
        <h3 className="mb-6 text-lg font-semibold text-white">Learning roadmap</h3>
        <div className="relative space-y-0">
          <div className="absolute bottom-0 left-[1.125rem] top-4 w-0.5 bg-gradient-to-b from-blue-500 via-violet-500 to-violet-500/20 sm:left-6" />
          {roadmap.learningRoadmap.map((phase, index) => (
            <div key={phase.phase} className="relative flex gap-6 pb-10 last:pb-0">
              <div className="relative z-10 flex shrink-0 flex-col items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold shadow-lg shadow-violet-500/30 sm:h-12 sm:w-12 sm:text-base">
                  {index + 1}
                </div>
              </div>
              <article className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-violet-500/30 hover:bg-white/[0.05]">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-violet-400">
                      {phase.phase}
                    </span>
                    <h4 className="mt-1 text-lg font-semibold text-white">{phase.title}</h4>
                  </div>
                  <span className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                    {phase.duration}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{phase.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {phase.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & projects */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-violet-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Skills to learn
          </h3>
          <ul className="space-y-2">
            {roadmap.skillsToLearn.map((skill) => (
              <li key={skill} className="flex gap-2 text-sm text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-blue-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Recommended projects
          </h3>
          <ul className="space-y-2">
            {roadmap.recommendedProjects.map((project) => (
              <li key={project} className="flex gap-2 text-sm text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                {project}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interview prep */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-emerald-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
          Interview preparation plan
        </h3>
        <ol className="space-y-3">
          {roadmap.interviewPrepPlan.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm text-slate-300">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-400">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
