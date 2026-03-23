"use client";

import { useEffect, useState } from "react";

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

interface QuizBoxProps {
  questions: Question[];
  latestResult: QuizResult | null;
  onClear: () => void;
  onRegenerate: () => void;
  onQuizComplete: (result: QuizResult) => void;
  isLoading: boolean;
}

export default function QuizBox({
  questions,
  latestResult,
  onClear,
  onRegenerate,
  onQuizComplete,
  isLoading,
}: QuizBoxProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
  }, [questions]);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (!submitted) {
      const newAnswers = [...answers];
      newAnswers[questionIndex] = optionIndex;
      setAnswers(newAnswers);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const buildQuizResult = (): QuizResult => {
    const incorrectQuestions = questions.filter(
      (question, index) => answers[index] !== question.correctAnswer
    );
    const correctQuestions = questions.filter(
      (question, index) => answers[index] === question.correctAnswer
    );

    const weakTopics = Array.from(new Set(incorrectQuestions.map((question) => question.topic))).slice(0, 3);
    const strongestTopic = correctQuestions[0]?.topic ?? null;

    return {
      score: calculateScore(),
      weakTopics,
      strongestTopic,
      totalQuestions: questions.length,
    };
  };

  const handleSubmit = () => {
    if (answers.every((answer) => answer !== null)) {
      setSubmitted(true);
      onQuizComplete(buildQuizResult());
    }
  };

  const handleReset = () => {
    setAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
  };

  const score = calculateScore();
  const allAnswered = answers.every((answer) => answer !== null);

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-300">Adaptive quiz</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Test your understanding</h3>
        </div>
        <button
          onClick={onClear}
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          Clear
        </button>
      </div>

      {submitted && latestResult && (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className={`rounded-3xl p-5 ${score >= 70 ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-amber-50 dark:bg-amber-500/10"}`}>
            <p className={`text-lg font-semibold ${score >= 70 ? "text-emerald-800 dark:text-emerald-200" : "text-amber-800 dark:text-amber-200"}`}>
              Your Score: {score}%
            </p>
            <p className={`mt-2 text-sm ${score >= 70 ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>
              {score >= 70
                ? "Great job! You are retaining the core material well."
                : "Good effort. Your results point to the best topics to review next."}
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-800/70">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Weak topic tracker</p>
            {latestResult.weakTopics.length > 0 ? (
              <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <p>You struggle with:</p>
                <div className="flex flex-wrap gap-2">
                  {latestResult.weakTopics.map((topic) => (
                    <span key={topic} className="rounded-full bg-rose-100 px-3 py-1 font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
                      {topic}
                    </span>
                  ))}
                </div>
                <p className="pt-2 text-slate-600 dark:text-slate-300">
                  Focus on {latestResult.weakTopics.slice(0, 2).join(" and ")} before you retake the quiz.
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Amazing — no clear weak topic surfaced in this attempt.</p>
            )}
            {latestResult.strongestTopic && (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Strongest topic: <span className="font-semibold text-slate-900 dark:text-white">{latestResult.strongestTopic}</span>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                {question.topic}
              </span>
              <h4 className="font-medium text-slate-900 dark:text-white">
                Question {qIndex + 1}: {question.question}
              </h4>
            </div>
            <div className="space-y-2">
              {question.options.map((option, oIndex) => (
                <button
                  key={oIndex}
                  onClick={() => handleAnswer(qIndex, oIndex)}
                  disabled={submitted}
                  className={`w-full rounded-2xl border-2 p-3 text-left transition-colors ${
                    answers[qIndex] === oIndex
                      ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/10"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
                  } ${
                    submitted
                      ? answers[qIndex] === oIndex && oIndex === question.correctAnswer
                        ? "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/10"
                        : answers[qIndex] === oIndex && oIndex !== question.correctAnswer
                          ? "border-rose-500 bg-rose-50 dark:border-rose-400 dark:bg-rose-500/10"
                          : oIndex === question.correctAnswer
                            ? "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/10"
                            : ""
                      : "cursor-pointer disabled:cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      answers[qIndex] === oIndex
                        ? "border-blue-500 dark:border-blue-400"
                        : "border-slate-400 dark:border-slate-500"
                    }`}>
                      {answers[qIndex] === oIndex && (
                        <span className="h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400" />
                      )}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{option}</span>
                    {submitted && oIndex === question.correctAnswer && (
                      <span className="ml-auto text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ Correct
                      </span>
                    )}
                    {submitted && answers[qIndex] === oIndex && oIndex !== question.correctAnswer && (
                      <span className="ml-auto text-sm font-semibold text-rose-600 dark:text-rose-400">
                        ✗ Incorrect
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Retake Quiz
          </button>
        )}
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="rounded-2xl border border-slate-200 px-6 py-4 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}
