# Environment Setup Guide

This document covers setting up EduMind AI for local development and deployment.

## Local Development Setup

### 1. Prerequisites

Ensure you have the following installed:
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (comes with Node.js)

Check your versions:
```bash
node --version
npm --version
```

### 2. Get Your HuggingFace API Token (FREE!)

1. Go to https://huggingface.co/settings/tokens
2. Sign in with your HuggingFace account (create free account if needed)
3. Click "New token"
4. Select "Read" permissions
5. Copy the token (keep it safe - don't share!)

**Free tier includes:**
- Unlimited inference API requests
- No credit card required
- Perfect for hackathons and personal projects

### 3. Clone and Install

```bash
# Clone the repository
git clone https://github.com/okuhlecharlieman/EduMind-AI.git
cd EduMind-AI

# Install dependencies
npm install
```

### 4. Configure Environment Variables

Create a file named `.env.local` in the root directory:

```bash
# Create the file
touch .env.local
```

Edit `.env.local` and add:

```
HUGGINGFACE_API_TOKEN=hf_your_actual_token_here
```

Replace `hf_your_actual_token_here` with your actual HuggingFace API token.

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Deployment Setup

### Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest deployment option for Next.js apps.

#### Steps:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Root directory will auto-detect (no need to configure)

3. **Add Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add variable: `HUGGINGFACE_API_TOKEN` with your token
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app is live!

### Option 2: Deploy to Other Platforms

#### Heroku
```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variable
heroku config:set HUGGINGFACE_API_TOKEN=hf_your_token

# Deploy
git push heroku main
```

#### Docker (Any Cloud Provider)
```bash
# Build
docker build -t edumind-ai .

# Run locally
docker run -p 3000:3000 -e HUGGINGFACE_API_TOKEN=hf_your_token edumind-ai
```

#### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `HUGGINGFACE_API_TOKEN` | ✅ Yes | HuggingFace API token for free tier inference |

## Troubleshooting

### "HuggingFace API token not configured"

**Problem**: Getting this error when trying to generate summary/quiz

**Solutions**:
1. Verify `.env.local` exists in the root directory
2. Check the file has correct format: `HUGGINGFACE_API_TOKEN=hf_...`
3. Restart dev server after changing `.env.local`
4. Verify token is valid: https://huggingface.co/settings/tokens

### "Module not found" errors

**Problem**: Dependency installation failed

**Solutions**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use npm cache clean
npm cache clean --force
npm install
```

### Port 3000 already in use

**Problem**: Dev server won't start

**Solutions**:
```bash
# Use different port
npm run dev -- -p 3001

# Or kill process on port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Build errors

**Problem**: `npm run build` fails with TypeScript errors

**Solutions**:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Build with verbose output
npm run build -- --debug

# Clear Next.js cache
rm -rf .next
npm run build
```

## Performance Tuning

### API Response Time
- Keep notes under 2000 characters for faster processing
- Summary generation typically takes 3-7 seconds (free tier)
- Quiz generation typically takes 5-12 seconds (free tier)

### Cost Optimization
- HuggingFace free tier: **100% free**
- Unlimited requests on free inference API
- No credit card required
- Monitor usage at https://huggingface.co/settings/tokens

## Security Best Practices

1. ✅ **Never commit `.env.local` to Git**
   - Add to `.gitignore` (already done)

2. ✅ **Rotate tokens regularly**
   - Delete old tokens on HuggingFace dashboard
   - Generate new ones monthly

3. ✅ **Monitor API usage**
   - Check activity at https://huggingface.co/settings/tokens
   - Free tier has no spending limits

4. ✅ **Use environment variables**
   - Never hardcode API keys
   - Use `.env.local` for development
   - Use platform-specific secret management for production

## Development Workflow

### Hot Reload
Changes to files automatically reload in development:
```bash
npm run dev
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
npm start
```

## Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Mobile browsers: ✅ All modern versions

## Version Information

- Next.js: 16.1.4
- React: 19.2.3
- TypeScript: ^5
- Tailwind CSS: ^4
- HuggingFace: @huggingface/inference ^2.6.4

## Available AI Models (Free Tier)

EduMind AI uses these models on free tier:

**Primary Model:**
- `mistralai/Mistral-7B-Instruct-v0.1` - Fast & accurate (RECOMMENDED)

**Alternative Models:**
- `meta-llama/Llama-2-7b-chat-hf` - Good quality
- `NousResearch/Nous-Hermes-2-Mistral-7B-DPO` - Specialized

### Changing Models

Edit `app/api/summarize/route.ts` and `app/api/quiz/route.ts`:

```typescript
const response = await hf.textGeneration({
  model: "mistralai/Mistral-7B-Instruct-v0.1", // Change here
  inputs: prompt,
  // ... rest of config
});
```

## Additional Resources

- [Next.js Getting Started](https://nextjs.org/docs/getting-started)
- [HuggingFace API Reference](https://huggingface.co/inference-api)
- [Tailwind CSS Installation](https://tailwindcss.com/docs/installation)
- [Vercel Documentation](https://vercel.com/docs)
- [HuggingFace Models](https://huggingface.co/models)

## Support

Having issues? 

1. Check this guide for common problems
2. Review the main [README.md](./README.md)
3. Check HuggingFace status: https://status.huggingface.co
4. Create a GitHub issue with error details

---

Happy studying! 📚

**Remember**: HuggingFace free tier is completely FREE - no credit card needed! 🎉
