"use client";

import { useState } from "react";
import Link from "next/link";
import InputBox from "@/components/InputBox";
import SummaryBox from "@/components/SummaryBox";
import QuizBox from "@/components/QuizBox";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

type DisplayMode = "input" | "summary" | "quiz";

export default function Dashboard() {
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("input");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(false);

  const handleGenerateSummary = async () => {
    if (!notes.trim()) {
      setError("Please enter some notes first");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
      setDisplayMode("summary");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!notes.trim()) {
      setError("Please enter some notes first");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz");
      }

      const data = await response.json();
      setQuiz(data.questions);
      setDisplayMode("quiz");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setDisplayMode("input");
    setSummary("");
    setQuiz([]);
  };

  const handleRegenerate = () => {
    if (displayMode === "summary") {
      handleGenerateSummary();
    } else if (displayMode === "quiz") {
      handleGenerateQuiz();
    }
  };

  const handleClearAll = () => {
    setNotes("");
    setSummary("");
    setQuiz([]);
    setDisplayMode("input");
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-black z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <h1 className="text-xl font-bold">EduMind AI</h1>
            </Link>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          {/* Error Toast */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {isLoading && <LoadingSpinner message="Processing your notes with AI..." />}

          {!isLoading && displayMode === "input" && (
            <div className="space-y-6">
              <InputBox
                value={notes}
                onChange={setNotes}
                onGenerateSummary={handleGenerateSummary}
                onGenerateQuiz={handleGenerateQuiz}
                isLoading={isLoading}
              />
              {notes.trim() && (
                <div className="flex justify-end">
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors underline"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          )}

          {!isLoading && displayMode === "summary" && (
            <div className="space-y-6">
              <SummaryBox
                summary={summary}
                onClear={handleClear}
                onRegenerate={handleRegenerate}
                isLoading={isLoading}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setDisplayMode("input")}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                >
                  Back to Notes
                </button>
                <button
                  onClick={handleGenerateQuiz}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Generate Quiz
                </button>
              </div>
            </div>
          )}

          {!isLoading && displayMode === "quiz" && quiz.length > 0 && (
            <div className="space-y-6">
              <QuizBox
                questions={quiz}
                onClear={handleClear}
                onRegenerate={handleRegenerate}
                isLoading={isLoading}
              />
              <button
                onClick={() => setDisplayMode("input")}
                className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Back to Notes
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Built with ❤️ for students • Powered by OpenAI</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
