import type { InterviewResult } from "@/lib/interview-coach";

type Props = {
  result: InterviewResult;
};

function ScoreCard({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: "blue" | "violet" | "emerald";
}) {
  const stroke = { blue: "#3b82f6", violet: "#8b5cf6", emerald: "#34d399" }[color];
  const text = { blue: "text-blue-400", violet: "text-violet-400", emerald: "text-emerald-400" }[color];
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/10" />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke={stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${text}`}>{score}</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-300">{label}</p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: stroke }}
        />
      </div>
    </div>
  );
}

export default function InterviewResults({ result }: Props) {
  return (
    <div className="mt-10 space-y-8">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-transparent p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Interview feedback</p>
        <h2 className="mt-2 text-2xl font-bold text-white">
          {result.role}{" "}
          <span className="font-normal text-slate-400">· {result.difficulty}</span>
        </h2>

        <div className="mt-8 flex flex-col items-center border-b border-white/10 pb-8">
          <p className="text-sm text-slate-500">Overall interview score</p>
          <p className="mt-2 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-5xl font-bold text-transparent">
            {result.overallInterviewScore}
          </p>
          <div className="mt-4 h-3 w-full max-w-md overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-1000"
              style={{ width: `${result.overallInterviewScore}%` }}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <ScoreCard label="Confidence" score={result.confidenceScore} color="blue" />
          <ScoreCard label="Communication" score={result.communicationScore} color="violet" />
          <ScoreCard label="Technical" score={result.technicalScore} color="emerald" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-emerald-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Strengths
          </h3>
          <ul className="space-y-2">
            {result.strengths.map((s) => (
              <li key={s} className="flex gap-2 text-sm text-slate-300">
                <span className="text-emerald-400">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-amber-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Weaknesses
          </h3>
          <ul className="space-y-2">
            {result.weaknesses.map((w) => (
              <li key={w} className="flex gap-2 text-sm text-slate-300">
                <span className="text-amber-400">−</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-blue-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.845 1.586-2.008a5.001 5.001 0 005.828 0c.928.163 1.586 1.025 1.586 2.008V18" />
          </svg>
          Suggestions for improvement
        </h3>
        <ul className="space-y-2">
          {result.suggestions.map((s) => (
            <li key={s} className="flex gap-2 text-sm text-slate-300">
              <span className="text-blue-400">→</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Per-question feedback</h3>
        <div className="space-y-4">
          {result.evaluations.map((ev, index) => (
            <article
              key={ev.questionId}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex flex-wrap items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold">
                  {index + 1}
                </span>
                <p className="min-w-0 flex-1 font-medium text-white">{ev.question}</p>
              </div>
              {!ev.isAnswered ? (
                <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                  Please answer this question.
                </p>
              ) : (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: "Confidence", score: ev.confidenceScore, color: "text-blue-400" },
                    { label: "Communication", score: ev.communicationScore, color: "text-violet-400" },
                    { label: "Technical", score: ev.technicalScore, color: "text-emerald-400" },
                  ].map(({ label, score, color }) => (
                    <div key={label} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-center">
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className={`text-lg font-bold ${color}`}>{score}</p>
                    </div>
                  ))}
                </div>
              )}
              <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-4">
                {ev.suggestions.map((s) => (
                  <li
                    key={s}
                    className={`text-sm ${!ev.isAnswered ? "font-medium text-amber-300" : "text-slate-400"}`}
                  >
                    • {s}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
