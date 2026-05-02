# SentiSum Diagnostic — Vercel Deployment

## Project structure
```
sentisum-vercel/
├── api/
│   └── generate.js       ← serverless function (API key lives here, server-side only)
├── public/
│   └── index.html        ← frontend (calls /api/generate, no API key exposed)
├── vercel.json           ← routing config
├── package.json          ← Node runtime spec
└── DEPLOY.md             ← this file
```

## Deploy in 3 steps

### Step 1 — Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2 — Deploy
```bash
cd sentisum-vercel
vercel
```
Follow the prompts:
- Set up and deploy? → Y
- Which scope? → your account
- Link to existing project? → N
- Project name? → sentisum-diagnostic (or anything)
- In which directory is your code? → . (just press Enter)

### Step 3 — Add your API key
After the first deploy, go to:
**Vercel dashboard → your project → Settings → Environment Variables**

Add:
- Key: `ANTHROPIC_API_KEY`
- Value: `sk-ant-...` (your Anthropic API key)
- Environment: Production + Preview + Development

Then redeploy to pick up the env var:
```bash
vercel --prod
```

Your app is now live at `https://sentisum-diagnostic.vercel.app` (or similar).

## That's it
- Every diagnostic generates a shareable URL automatically
- History is saved in the browser (localStorage)
- Download exports a .txt report
- API key is never exposed to the browser

## To get your Anthropic API key
Go to https://console.anthropic.com → API Keys → Create Key
