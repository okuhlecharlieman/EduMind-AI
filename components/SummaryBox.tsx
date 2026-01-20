"use client";

interface SummaryBoxProps {
  summary: string;
  onClear: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
}

export default function SummaryBox({
  summary,
  onClear,
  onRegenerate,
  isLoading,
}: SummaryBoxProps) {
  const bulletPoints = summary
    .split("\n")
    .filter((line) => line.trim().length > 0);

  return (
    <div className="w-full space-y-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Summary
        </h3>
        <button
          onClick={onClear}
          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="space-y-3">
        {bulletPoints.map((point, index) => (
          <div key={index} className="flex gap-3">
            <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-xs font-semibold text-blue-600 dark:text-blue-300 flex-shrink-0">
              ✓
            </span>
            <p className="text-gray-700 dark:text-gray-300">{point}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onRegenerate}
        disabled={isLoading}
        className="mt-4 w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 disabled:bg-gray-200 dark:bg-blue-900 dark:hover:bg-blue-800 dark:disabled:bg-gray-700 text-blue-700 dark:text-blue-200 font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        Regenerate
      </button>
    </div>
  );
}
