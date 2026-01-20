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
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Paste Your Notes
        </label>
        <textarea
          id="notes"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your study notes here... (max 5000 characters)"
          disabled={isLoading}
          className={`w-full h-48 p-4 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            isLimitExceeded
              ? "border-red-500 focus:ring-red-500 dark:border-red-600"
              : "border-gray-300 focus:ring-blue-500 dark:border-gray-600"
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        <div className={`text-sm ${isLimitExceeded ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
          {remainingCharacters >= 0 ? (
            <>{remainingCharacters} characters remaining</>
          ) : (
            <>Exceeded limit by {Math.abs(remainingCharacters)} characters</>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onGenerateSummary}
          disabled={isLoading || !value.trim() || isLimitExceeded}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          Generate Summary
        </button>
        <button
          onClick={onGenerateQuiz}
          disabled={isLoading || !value.trim() || isLimitExceeded}
          className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          Generate Quiz
        </button>
      </div>
    </div>
  );
}
