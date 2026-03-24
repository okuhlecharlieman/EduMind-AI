"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
        <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-lg shadow-blue-500/25">
                <span className="text-lg">📚</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-300">AI Study Coach</p>
                <h1 className="text-xl font-bold">EduMind AI</h1>
              </div>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-12 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="space-y-8">
              <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200">
                Personalized learning for students with limited support
              </div>
              <div className="space-y-5">
                <h2 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
                  Your AI-powered study assistant that teaches, tests, and tracks progress.
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                  EduMind AI summarizes class notes, turns them into quizzes, spots weak topics, and can explain tough material in simpler words for younger learners or quick revision.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 text-base font-semibold text-white shadow-2xl shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-blue-500/40"
                >
                  Start Studying
                </Link>
                <a
                  href="#features"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-slate-200 bg-white px-8 text-base font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  See demo moments
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                  <p className="text-3xl font-bold">5s</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Fast AI summaries for last-minute review sessions.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                  <p className="text-3xl font-bold">1 click</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Explain Like I&apos;m 12 creates a simpler version instantly.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                  <p className="text-3xl font-bold">∞</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Progress feedback that helps students improve over time.</p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
              <div className="absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
              <div className="relative space-y-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300/20 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30 sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Demo flow</p>
                    <h3 className="mt-2 text-2xl font-bold">Why it stands out</h3>
                  </div>
                  <span className="text-4xl">🚀</span>
                </div>

              <div id="features" className="space-y-4">
                  {[
                    ["✨ Smart summaries", "Highlight key concepts from long notes in seconds."],
                    ["🎯 Explain Like I’m 12", "Rewrite hard ideas in simpler language for accessibility."],
                    ["🧠 Weak topic tracker", "Reveal topics the learner should revisit after every quiz."],
                    ["📊 Progress dashboard", "Show quizzes taken, average score, and topics studied."],
                  ].map(([title, description]) => (
                    <div key={title} className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-800/70">
                      <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
                    </div>
                  ))}
                </div>

              </div>
            </section>
          </div>
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-600 dark:text-slate-400 sm:px-6">
            <p>Built with ❤️ for students everywhere • Powered by HuggingFace</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
