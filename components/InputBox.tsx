"use client";

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onGenerateSummary: () => void;
  onGenerateQuiz: () => void;
  isLoading: boolean;
  characterLimit?: number;
}

export default function InputBox({
  value,
  onChange,
  onGenerateSummary,
  onGenerateQuiz,
  isLoading,
  characterLimit = 5000,
}: InputBoxProps) {
  const remainingCharacters = characterLimit - value.length;
  const isLimitExceeded = remainingCharacters < 0;

  return (
    <div className="w-full space-y-6">
      <div className="grid gap-4 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:grid-cols-3">
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-slate-900/80">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">1. Drop in your notes</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Lecture notes, textbook snippets, or revision sheets all work.</p>
        </div>
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-slate-900/80">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">2. Summarize or quiz</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Choose the fastest way to learn or test retention.</p>
        </div>
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-slate-900/80">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">3. Get AI coaching</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Reveal weak topics and a simpler explanation on demand.</p>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Paste Your Notes
        </label>
        <textarea
          id="notes"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your study notes here... e.g. photosynthesis, the causes of World War I, fractions, or Python loops."
          disabled={isLoading}
          className={`h-56 w-full rounded-3xl border p-5 text-base shadow-inner focus:outline-none focus:ring-4 transition-all ${
            isLimitExceeded
              ? "border-red-500 bg-red-50 focus:ring-red-200 dark:border-red-500 dark:bg-red-950/20"
              : "border-slate-200 bg-slate-50 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-blue-950"
          } text-slate-900 placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50`}
        />
        <div className={`text-sm ${isLimitExceeded ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}>
          {remainingCharacters >= 0 ? (
            <>{remainingCharacters} characters remaining</>
          ) : (
            <>Exceeded limit by {Math.abs(remainingCharacters)} characters</>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={onGenerateSummary}
          disabled={isLoading || !value.trim() || isLimitExceeded}
          className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          ✨ Generate Summary
        </button>
        <button
          onClick={onGenerateQuiz}
          disabled={isLoading || !value.trim() || isLimitExceeded}
          className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          📝 Generate Quiz
        </button>
      </div>
    </div>
  );
}
