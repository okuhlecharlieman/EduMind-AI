"use client";

interface SummaryBoxProps {
  summary: string;
  simplifiedSummary: string;
  onClear: () => void;
  onRegenerate: () => void;
  onSimplify: () => void;
  isLoading: boolean;
}

export default function SummaryBox({
  summary,
  simplifiedSummary,
  onClear,
  onRegenerate,
  onSimplify,
  isLoading,
}: SummaryBoxProps) {
  const bulletPoints = summary
    .split("\n")
    .filter((line) => line.trim().length > 0);

  const simplifiedPoints = simplifiedSummary
    .split("\n")
    .filter((line) => line.trim().length > 0);

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-300">AI summary</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Key ideas at a glance</h3>
        </div>
        <button
          onClick={onClear}
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          Clear
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-3xl bg-slate-50 p-5 dark:bg-slate-800/70">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Main summary</p>
          {bulletPoints.map((point, index) => (
            <div key={`${point}-${index}`} className="flex gap-3">
              <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                ✓
              </span>
              <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{point}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-3xl bg-amber-50 p-5 dark:bg-amber-500/10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-200">Explain like I&apos;m 12</p>
              <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-100/80">Turn the summary into simpler, friendlier language.</p>
            </div>
            <button
              onClick={onSimplify}
              disabled={isLoading}
              className="rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:-translate-y-0.5 hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Simplify this
            </button>
          </div>

          {simplifiedPoints.length > 0 ? (
            simplifiedPoints.map((point, index) => (
              <div key={`${point}-${index}`} className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-amber-600 dark:bg-amber-100/20 dark:text-amber-200">
                  ★
                </span>
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{point}</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-amber-300 p-4 text-sm text-amber-800 dark:border-amber-300/30 dark:text-amber-100">
              Tap the button to create a simpler version that is easier to explain in a demo or share with younger learners.
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="rounded-2xl border border-slate-200 px-4 py-3 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Regenerate
        </button>
        <button
          onClick={onSimplify}
          disabled={isLoading}
          className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          🎯 Explain like I&apos;m 12
        </button>
      </div>
    </div>
  );
}
