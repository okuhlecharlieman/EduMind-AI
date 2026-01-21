This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# EduMind AI - Smart Study Assistant

https://edumind-ai2.netlify.app/

or

https://edu-mind-ai-nine.vercel.app/

A production-ready, mobile-first AI-powered study assistant web application built for hackathon submission.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up your HuggingFace API token
cp .env.example .env.local
# Edit .env.local and add your HuggingFace API token (FREE!)

# 3. Run the development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

## ✨ Features

- **AI-Powered Summaries**: Turn your study notes into concise bullet-point summaries with key concepts
- **Smart Quiz Generator**: Create 5-question multiple choice quizzes from any text with instant scoring
- **Mobile-First Design**: Fully responsive interface optimized for all devices
- **Dark Mode Support**: Built-in dark mode for comfortable studying anytime
- **Real-Time Processing**: Lightning-fast AI responses powered by HuggingFace
- **100% FREE**: Uses HuggingFace free tier - no credit card required!

## 📋 Tech Stack

- **Next.js 16** - Modern React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Beautiful, responsive UI
- **HuggingFace Inference API** - Free AI for instant summaries and quizzes
- **Vercel Ready** - Deploy with one click

## 📖 How It Works

### Home Page (`/`)
- Beautiful landing page with app features
- Dark mode toggle
- "Start Studying" call-to-action button

### Dashboard (`/dashboard`)
1. **Input your notes** - Paste study material (up to 5000 characters)
2. **Choose an action**:
   - Click "Generate Summary" for key points
   - Click "Generate Quiz" for practice questions
3. **Get results**:
   - Summary: Bullet-point key concepts
   - Quiz: Answer 5 questions, get instant feedback and score

## 🔌 API Endpoints

### `POST /api/summarize`
Generate a summary from study notes.

### `POST /api/quiz`
Generate quiz questions from study notes.

## 🛠️ Environment Setup

### Required Environment Variables

```bash
HUGGINGFACE_API_TOKEN=hf_your_token_here
```

**Get your FREE token**: https://huggingface.co/settings/tokens

See [Environment Setup Guide](../ENVIRONMENT_SETUP.md) for detailed instructions.

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Add your `HUGGINGFACE_API_TOKEN` as an environment variable during setup.

## 🔒 Security

- ✅ API tokens only used on server-side
- ✅ No sensitive data exposed to client
- ✅ Input validation on all API routes
- ✅ Environment variables for secrets

## 🐛 Troubleshooting

**"HuggingFace API token not configured"**
- Verify `.env.local` exists in this directory
- Check your token at https://huggingface.co/settings/tokens
- Restart the dev server after changing `.env.local`

**Slow responses**
- Keep notes under 2000 characters for faster processing
- Free tier may have rate limits during peak hours

## 📈 Performance

- Summary generation: ~3-7 seconds (free tier)
- Quiz generation: ~5-12 seconds (free tier)
- **FREE**: Unlimited requests on HuggingFace free tier

## 🤝 Contributing

This is a hackathon MVP. Feel free to fork and improve!

## 📄 License

MIT License - Use freely in your projects

## 🔗 Resources

- [Full Documentation](../README.md)
- [Environment Setup Guide](../ENVIRONMENT_SETUP.md)
- [Next.js Docs](https://nextjs.org/docs)
- [HuggingFace Inference API](https://huggingface.co/inference-api)
- [Tailwind CSS](https://tailwindcss.com)

---

Made with ❤️ for students everywhere. Happy studying! 📚
