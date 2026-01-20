"use client";

import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizBoxProps {
  questions: Question[];
  onClear: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
}

export default function QuizBox({
  questions,
  onClear,
  onRegenerate,
  isLoading,
}: QuizBoxProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (!submitted) {
      const newAnswers = [...answers];
      newAnswers[questionIndex] = optionIndex;
      setAnswers(newAnswers);
    }
  };

  const handleSubmit = () => {
    if (answers.every((answer) => answer !== null)) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
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

  const score = calculateScore();
  const allAnswered = answers.every((answer) => answer !== null);

  return (
    <div className="w-full space-y-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quiz
        </h3>
        <button
          onClick={onClear}
          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>

      {submitted && (
        <div className={`rounded-lg p-4 ${
          score >= 70
            ? "bg-green-100 dark:bg-green-900"
            : "bg-yellow-100 dark:bg-yellow-900"
        }`}>
          <p className={`text-lg font-semibold ${
            score >= 70
              ? "text-green-800 dark:text-green-200"
              : "text-yellow-800 dark:text-yellow-200"
          }`}>
            Your Score: {score}%
          </p>
          <p className={`text-sm ${
            score >= 70
              ? "text-green-700 dark:text-green-300"
              : "text-yellow-700 dark:text-yellow-300"
          }`}>
            {score >= 70
              ? "Great job! You've mastered this material!"
              : "Good effort! Review the material and try again."}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="space-y-3 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Question {qIndex + 1}: {question.question}
            </h4>
            <div className="space-y-2">
              {question.options.map((option, oIndex) => (
                <button
                  key={oIndex}
                  onClick={() => handleAnswer(qIndex, oIndex)}
                  disabled={submitted}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    answers[qIndex] === oIndex
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                  } ${
                    submitted
                      ? answers[qIndex] === oIndex && oIndex === question.correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-900 dark:border-green-400"
                        : answers[qIndex] === oIndex && oIndex !== question.correctAnswer
                        ? "border-red-500 bg-red-50 dark:bg-red-900 dark:border-red-400"
                        : oIndex === question.correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-900 dark:border-green-400"
                        : ""
                      : "cursor-pointer disabled:cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      answers[qIndex] === oIndex
                        ? "border-blue-500 dark:border-blue-400"
                        : "border-gray-400 dark:border-gray-500"
                    }`}>
                      {answers[qIndex] === oIndex && (
                        <span className="h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400" />
                      )}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                    {submitted && oIndex === question.correctAnswer && (
                      <span className="ml-auto text-green-600 dark:text-green-400 text-sm font-semibold">
                        ✓ Correct
                      </span>
                    )}
                    {submitted && answers[qIndex] === oIndex && oIndex !== question.correctAnswer && (
                      <span className="ml-auto text-red-600 dark:text-red-400 text-sm font-semibold">
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

      <div className="flex gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Retake Quiz
          </button>
        )}
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-blue-100 hover:bg-blue-200 disabled:bg-gray-200 dark:bg-blue-900 dark:hover:bg-blue-800 dark:disabled:bg-gray-700 text-blue-700 dark:text-blue-200 font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}
