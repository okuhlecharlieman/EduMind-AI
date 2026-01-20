"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-white">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <h1 className="text-xl font-bold">EduMind AI</h1>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <div className="max-w-2xl w-full py-12 sm:py-20">
            {/* Hero Section */}
            <div className="space-y-8 text-center">
              {/* Logo/Icon */}
              <div className="flex justify-center">
                <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-5xl">📚</span>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                  EduMind AI
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Turn notes into instant summaries and quizzes using AI
                </p>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 py-8">
                <div className="space-y-2">
                  <div className="text-3xl">✨</div>
                  <h3 className="font-semibold">Smart Summaries</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Generate key points instantly
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl">📝</div>
                  <h3 className="font-semibold">AI Quizzes</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Test your knowledge
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl">⚡</div>
                  <h3 className="font-semibold">Lightning Fast</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Real-time processing
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl">📱</div>
                  <h3 className="font-semibold">Mobile Ready</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Study anywhere
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 px-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Studying
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Built with ❤️ for students • Powered by OpenAI</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
