# 🎯 CareerOps AI

[![CI & Build Validation](https://github.com/Pokedash01/CareerOps/actions/workflows/ci.yml/badge.svg)](https://github.com/Pokedash01/CareerOps/actions)
[![24/7 Autonomous Alert Trigger](https://github.com/Pokedash01/CareerOps/actions/workflows/workflow-cron.yml/badge.svg)](https://github.com/Pokedash01/CareerOps/actions)
[![Node.js Version](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org)

**CareerOps AI** is an intelligent candidate pipeline automation platform. It continuously scans corporate ATS job portals (Greenhouse, Lever, SmartRecruiters, Workday, etc.), evaluates semantic profile compatibility using Gemini AI, tailors custom ATS resumes and cover letters, and delivers instant Telegram alerts for high-fit opportunities 24/7.

---

## ⚡ Core Features

- **🌐 Autonomous 24/7 Job Discovery**: Scans top tech employer portals and job feeds automatically on a customizable cadence (2h, 4h, 8h, 12h) via GitHub Actions, Cloud Run, or Vercel Cron.
- **🛡️ Search Deduplication & Anti-Requery Memory**: Tracks every discovered, evaluated, rejected, or deleted job by URL and title signature. Dismissed or rejected roles are permanently excluded from future searches.
- **🔄 Real-Time Multi-Device State Sync**: Bidirectional state synchronization with timestamp-aware anti-rollback protection ensuring your discovered jobs, pipeline changes, and cadence selections never revert.
- **🧠 Gemini AI Profile Matching**: Evaluates job descriptions against candidate experience, extracting skill overlap, missing keywords, and generating a quantitative Fit Score (0–100%).
- **📄 ATS Document Studio**: Automatically crafts tailored, ATS-compliant resumes and cover letters highlighting relevant achievements, with instant PDF and text export.
- **📱 Instant Telegram Alerts**: Dispatches rich Telegram notifications with direct apply links, salary ranges, and matching rationale whenever a position exceeds your configured threshold.
- **🔗 Link Verifier Engine**: Periodically checks live job URLs to mark expired or filled positions automatically.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, jsPDF.
- **Backend**: Node.js 20, Express, Google GenAI SDK (`@google/genai`), esbuild, tsx.
- **Automation & Scheduling**: GitHub Actions (`workflow-cron.yml`), Vercel Cron (`/api/cron/trigger?wait=true`).
- **Containerization**: Multi-stage Dockerfile (`node:20-alpine`).

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 20+ (LTS)
- npm or bun

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Pokedash01/CareerOps.git
cd CareerOps

# Install dependencies using clean install
npm ci
```

### 3. Environment Configuration
Create a `.env` file in the root directory (based on `.env.example`):
```env
# Required for Gemini AI matching and document tailoring
GEMINI_API_KEY="your-gemini-api-key"

# Base URL for the app (used for self-referential webhooks & links)
APP_URL="http://localhost:3000"

# Optional: Telegram alert credentials
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_CHAT_ID="your-chat-id"

# Optional: Google Jobs / ATS live search key
SERPAPI_KEY=""
```

### 4. Development Mode
```bash
npm run dev
```
The app will be accessible at `http://localhost:3000`.

### 5. Production Build
```bash
# Compile frontend, bundle backend server.cjs, and generate serverless server.js
npm run build

# Start the compiled production server
npm start
```

---

## 🤖 24/7 GitHub Actions Automation

CareerOps includes a pre-configured GitHub Actions workflow located at `.github/workflows/workflow-cron.yml` that triggers autonomous pipeline scans every 4 hours.

### Setting up GitHub Actions:
1. Navigate to your GitHub repository:
   **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**:
   - **Name**: `CAREEROPS_APP_URL`
   - **Value**: Your live deployed app URL (e.g., `https://ais-dev-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app`)
3. The workflow will automatically trigger every 4 hours, or you can trigger it manually at any time via **Actions** > **CareerOps 24/7 Autonomous Alert Trigger** > **Run workflow**.

---

## 🐳 Docker Deployment

You can build and run CareerOps as a self-contained container:

```bash
# Build the Docker image
docker build -t careerops-ai .

# Run the container
docker run -d -p 3000:3000 \
  -e GEMINI_API_KEY="your-api-key" \
  -e TELEGRAM_BOT_TOKEN="your-bot-token" \
  -e TELEGRAM_CHAT_ID="your-chat-id" \
  careerops-ai
```

---

## 🧪 Testing & CI

Continuous integration is handled by `.github/workflows/ci.yml`:
```bash
# Run TypeScript typechecks
npm run lint

# Verify production compilation
npm run build
```

---

## 📄 License

MIT License. Designed for personal and production career automation.
