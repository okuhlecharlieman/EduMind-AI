"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import InputBox from "@/components/InputBox";
import SummaryBox from "@/components/SummaryBox";
import QuizBox from "@/components/QuizBox";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
}

interface QuizResult {
  score: number;
  weakTopics: string[];
  strongestTopic: string | null;
  totalQuestions: number;
}

interface ProgressStats {
  quizzesTaken: number;
  averageScore: number;
  topicsStudied: string[];
  lastWeakTopics: string[];
  totalStudySessions: number;
}

type DisplayMode = "input" | "summary" | "quiz";
type AiMode = "live" | "fallback";

const initialStats: ProgressStats = {
  quizzesTaken: 0,
  averageScore: 0,
  topicsStudied: [],
  lastWeakTopics: [],
  totalStudySessions: 0,
};

export default function Dashboard() {
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [simplifiedSummary, setSimplifiedSummary] = useState("");
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("input");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [progressStats, setProgressStats] = useState<ProgressStats>(initialStats);
  const [latestQuizResult, setLatestQuizResult] = useState<QuizResult | null>(null);
  const [aiMode, setAiMode] = useState<AiMode>("live");

  useEffect(() => {
    const savedStats = window.localStorage.getItem("edumind-progress");
    const savedTheme = window.localStorage.getItem("edumind-theme");

    if (savedStats) {
      setProgressStats(JSON.parse(savedStats) as ProgressStats);
    }

    if (savedTheme === "dark") {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("edumind-progress", JSON.stringify(progressStats));
  }, [progressStats]);

  useEffect(() => {
    window.localStorage.setItem("edumind-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const studyInsights = useMemo(() => {
    if (progressStats.quizzesTaken === 0) {
      return {
        status: "New learner",
        message: "Take your first quiz to unlock personalized recommendations.",
      };
    }

    if (progressStats.averageScore >= 80) {
      return {
        status: "Confident streak",
        message: "You are building strong retention. Push with harder notes and mixed-topic reviews.",
      };
    }

    if (progressStats.lastWeakTopics.length > 0) {
      return {
        status: "Focus area detected",
        message: `Spend 10 focused minutes reviewing ${progressStats.lastWeakTopics
          .slice(0, 2)
          .join(" and ")} before your next quiz.`,
      };
    }

    return {
      status: "Momentum building",
      message: "Keep practicing. One more quiz will sharpen your personalized feedback.",
    };
  }, [progressStats]);

  const updateProgressStats = (result: QuizResult, questions: Question[]) => {
    setProgressStats((current) => {
      const nextQuizCount = current.quizzesTaken + 1;
      const combinedTopics = Array.from(
        new Set([...current.topicsStudied, ...questions.map((question) => question.topic)])
      );
      const averageScore = Math.round(
        (current.averageScore * current.quizzesTaken + result.score) / nextQuizCount
      );

      return {
        quizzesTaken: nextQuizCount,
        averageScore,
        topicsStudied: combinedTopics,
        lastWeakTopics: result.weakTopics,
        totalStudySessions: current.totalStudySessions + 1,
      };
    });
  };

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

      const data = (await response.json()) as { summary: string; fallback?: boolean };
      setSummary(data.summary);
      setAiMode(data.fallback ? "fallback" : "live");
      setSimplifiedSummary("");
      setLatestQuizResult(null);
      setDisplayMode("summary");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimplifySummary = async () => {
    if (!summary.trim()) {
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary }),
      });

      if (!response.ok) {
        throw new Error("Failed to simplify summary");
      }

      const data = (await response.json()) as { summary: string; fallback?: boolean };
      setSimplifiedSummary(data.summary);
      setAiMode(data.fallback ? "fallback" : "live");
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

      const data = (await response.json()) as { questions: Question[]; fallback?: boolean };
      setQuiz(data.questions);
      setAiMode(data.fallback ? "fallback" : "live");
      setLatestQuizResult(null);
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
    setSimplifiedSummary("");
    setQuiz([]);
    setLatestQuizResult(null);
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
    setSimplifiedSummary("");
    setQuiz([]);
    setLatestQuizResult(null);
    setDisplayMode("input");
  };

  const handleQuizComplete = (result: QuizResult) => {
    setLatestQuizResult(result);
    updateProgressStats(result, quiz);
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-lg shadow-blue-500/25">
                <span className="text-lg">📚</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-300">
                  AI Study Coach
                </p>
                <h1 className="text-xl font-bold">EduMind AI</h1>
              </div>
            </Link>
            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Impact</p>
                <h2 className="mt-2 text-2xl font-bold">Built for students who need support fast</h2>
                <p className="mt-3 text-sm text-blue-50/90">
                  Designed to help learners in under-resourced communities study smarter with instant coaching, clearer explanations, and measurable progress.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 p-6">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Quizzes taken</p>
                  <p className="mt-2 text-3xl font-bold">{progressStats.quizzesTaken}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Average score</p>
                  <p className="mt-2 text-3xl font-bold">{progressStats.averageScore}%</p>
                </div>
                <div className="col-span-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Topics studied</p>
                      <p className="mt-2 text-3xl font-bold">{progressStats.topicsStudied.length}</p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500" />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-500">Smart personalization</p>
                  <h3 className="mt-2 text-xl font-bold">{studyInsights.status}</h3>
                </div>
                <span className="text-3xl">🧠</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{studyInsights.message}</p>
              {progressStats.lastWeakTopics.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {progressStats.lastWeakTopics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-200"
                    >
                      Review: {topic}
                    </span>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
              <h3 className="text-lg font-semibold">Demo highlights</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80">✨ Generate a summary instantly.</div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80">🎯 Tap “Explain like I&apos;m 12” for a simpler version.</div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80">📊 Finish a quiz to reveal weak topics and progress stats.</div>
              </div>
            </section>

          </aside>

          <section className="space-y-6">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
                <p className="font-medium">{error}</p>
              </div>
            )}

            {isLoading && <LoadingSpinner message="Processing your notes with AI..." />}

            {!isLoading && displayMode === "input" && (
              <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-300">Your study lab</p>
                    <h2 className="mt-2 text-3xl font-bold">Turn class notes into a personalized learning session</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Paste notes from class, tutoring, or self-study. EduMind AI will summarize key ideas, generate a quiz, and track where you need more practice.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
                      <span className={aiMode === "live" ? "text-emerald-600" : "text-amber-600"}>
                        {aiMode === "live" ? "● Live AI mode" : "● Reliable fallback mode"}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {aiMode === "live" ? "Cloud model connected." : "Still works even if provider fails."}
                      </span>
                    </div>
                  </div>
                  {notes.trim() && (
                    <button
                      onClick={handleClearAll}
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      Clear session
                    </button>
                  )}
                </div>
                <InputBox
                  value={notes}
                  onChange={setNotes}
                  onGenerateSummary={handleGenerateSummary}
                  onGenerateQuiz={handleGenerateQuiz}
                  isLoading={isLoading}
                />
              </div>
            )}

            {!isLoading && displayMode === "summary" && (
              <div className="space-y-6">
                <SummaryBox
                  summary={summary}
                  simplifiedSummary={simplifiedSummary}
                  onClear={handleClear}
                  onRegenerate={handleRegenerate}
                  onSimplify={handleSimplifySummary}
                  isLoading={isLoading}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setDisplayMode("input")}
                    className="rounded-2xl border border-slate-200 px-6 py-4 font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Back to Notes
                  </button>
                  <button
                    onClick={handleGenerateQuiz}
                    className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
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
                  latestResult={latestQuizResult}
                  onClear={handleClear}
                  onRegenerate={handleRegenerate}
                  onQuizComplete={handleQuizComplete}
                  isLoading={isLoading}
                />
                <button
                  onClick={() => setDisplayMode("input")}
                  className="w-full rounded-2xl border border-slate-200 px-6 py-4 font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Back to Notes
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
