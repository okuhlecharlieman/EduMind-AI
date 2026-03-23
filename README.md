# EduMind AI - Personalized Study Coach

EduMind AI is a hackathon-ready Next.js app that turns student notes into AI summaries, adaptive quizzes, personalized weak-topic feedback, and a simple progress dashboard.

## Live demos

- https://edumind-ai2.netlify.app/
- https://edu-mind-ai-nine.vercel.app/

## Why this version stands out

EduMind AI now goes beyond generic summarization by adding:

- **Smart Personalization**: tracks weak quiz topics and recommends what to review next.
- **Progress Dashboard**: shows quizzes taken, average score, and topics studied.
- **Explain Like I’m 12**: rewrites summaries in simpler language for accessibility and quick revision.
- **Impact-first positioning**: designed to support students in under-resourced communities with limited access to tutoring.

## Quick Start

```bash
npm install
cp .env.example .env.local
# Add HUGGINGFACE_API_TOKEN to .env.local
npm run dev
```

Then open `http://localhost:3000`.

## Features

- AI-generated bullet summaries from pasted notes.
- AI quiz generation with topic labels for personalized feedback.
- Weak-topic tracker after quiz submission.
- Simplified summary mode for “Explain Like I’m 12”.
- Local progress dashboard stored in browser localStorage.
- Responsive Tailwind CSS UI with gradients, cards, and polished dashboard sections.
- Dark mode support.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- HuggingFace Inference API

## API Endpoints

### `POST /api/summarize`
Creates a concise summary from notes.

### `POST /api/quiz`
Creates a 5-question quiz with topic labels.

### `POST /api/simplify`
Rewrites a summary in a simpler, younger-student-friendly format.

## Environment Variables

```bash
HUGGINGFACE_API_TOKEN=hf_your_token_here
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm start
```

## Suggested demo flow

1. Paste class notes.
2. Generate the summary.
3. Click **Explain Like I’m 12**.
4. Generate the quiz.
5. Submit answers and show the weak-topic tracker plus dashboard metrics.

## Impact statement

> EduMind AI helps students study smarter with limited support by combining summarization, practice, and personalized guidance in one lightweight interface.
