# 🎯 CareerOps AI — Autonomous Career Pipeline Engine

[![CI & Build Validation](https://github.com/Pokedash01/CareerOps/actions/workflows/ci.yml/badge.svg)](https://github.com/Pokedash01/CareerOps/actions)
[![24/7 Autonomous Alert Trigger](https://github.com/Pokedash01/CareerOps/actions/workflows/workflow-cron.yml/badge.svg)](https://github.com/Pokedash01/CareerOps/actions)
[![Node.js Version](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**CareerOps AI** is a production-grade, autonomous candidate operations system. It continuously scans corporate ATS job portals (Greenhouse, Lever, SmartRecruiters, Workday, etc.), semantically scores candidate-to-role compatibility using Google's Gemini AI, automatically tailors ATS-compliant resumes and cover letters, and dispatches instant Telegram alerts for high-fit positions 24 hours a day, 7 days a week.

---

## 📑 Table of Contents

- [Core Capabilities](#-core-capabilities)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Local Installation](#local-installation)
  - [Environment Configuration](#environment-configuration)
- [24/7 Automation & Scheduling](#-247-automation--scheduling)
  - [GitHub Actions 24/7 Cron](#github-actions-247-cron)
  - [Vercel Cron & Cloud Run](#vercel-cron--cloud-run)
- [State Synchronization & Deduplication](#-state-synchronization--deduplication)
- [API Reference](#-api-reference)
- [Docker Deployment](#-docker-deployment)
- [CI/CD & Code Quality](#-cicd--code-quality)
- [License](#-license)

---

## ⚡ Core Capabilities

1. **🌐 Autonomous 24/7 ATS Job Discovery**
   - Directly indexes opportunities from primary ATS portals (Greenhouse, Lever, SmartRecruiters, Workday, Taleo, Ashby) and verified search indices.
   - Eliminates junk aggregator reposts by enforcing strict canonical link resolution and domain validation.

2. **🧠 Deep Gemini AI Semantic Matching**
   - Analyzes full job descriptions against candidate experience, projects, skills, and seniority tiers.
   - Generates quantitative Fit Scores (0–100%), detailed justification breakdowns, identified core strengths, and missing prerequisite keywords.

3. **📄 Automated ATS Document Studio**
   - Instantly generates tailored resumes with quantified impact metrics and customized cover letters for any discovered or manually tracked position.
   - One-click PDF export using custom high-legibility formatting, plus raw Markdown/Plaintext export for direct ATS form submissions.

4. **📱 Real-Time Telegram Alerts**
   - Automatically sends formatted alerts to your Telegram chat whenever a position exceeds your configured match threshold (e.g., ≥80%).
   - Includes direct application links, compensation estimates (LPA / USD), and matching rationale.

5. **🛡️ Search Deduplication & Anti-Requery Memory**
   - Every reviewed, rejected, or deleted job is permanently remembered in a canonical signature registry.
   - Dismissed or rejected roles are guaranteed never to re-appear in subsequent automated cycles or ad-hoc searches.

6. **🔄 Timestamp-Aware Anti-Rollback State Sync**
   - Synchronizes application state across multiple browser tabs, mobile devices, and serverless peers using ISO-timestamped reconciliation.
   - Prevents stale peer containers from reverting user-curated pipelines or cadence preferences.

---

## 🏗 System Architecture

```
                    ┌────────────────────────────────────────────────────────┐
                    │            24/7 Scheduled Automation Drivers           │
                    │  (GitHub Actions Cron / Vercel Cron / Cloud Scheduler) │
                    └──────────────────────────┬─────────────────────────────┘
                                               │ Webhook Dispatch
                                               ▼
                              ┌──────────────────────────────────┐
                              │    POST /api/cron/trigger        │
                              └────────────────┬─────────────────┘
                                               │
                                               ▼
                         ┌───────────────────────────────────────────┐
                         │       Candidate Profile Ingestion         │
                         │      (Work History, Skills, Goals)        │
                         └─────────────────────┬─────────────────────┘
                                               │
                                               ▼
                         ┌───────────────────────────────────────────┐
                         │         Direct ATS Scraping Engine        │
                         │   Greenhouse • Lever • SmartRecruiters    │
                         └─────────────────────┬─────────────────────┘
                                               │
                         ┌─────────────────────▼─────────────────────┐
                         │     Deduplication & Anti-Requery Registry │
                         │ (Filter out seen, rejected & deleted jobs)│
                         └─────────────────────┬─────────────────────┘
                                               │ New Unique Listings
                                               ▼
                         ┌───────────────────────────────────────────┐
                         │        Gemini AI Semantic Scoring         │
                         │  (Match Score, Strengths, Gaps, Strategy) │
                         └─────────────────────┬─────────────────────┘
                                               │
                    ┌──────────────────────────┴──────────────────────────┐
                    │ If Match Score >= Configured Minimum Threshold     │
                    ▼                                                     ▼
┌─────────────────────────────────────────┐             ┌───────────────────────────────────┐
│       ATS Document Studio Tailoring     │             │    Telegram Instant Alert Dispatch│
│ • Custom Targeted Bullet Points         │             │ • One-Click Apply URL             │
│ • Cover Letter Customization            │             │ • Compensation Estimate           │
│ • PDF / Plaintext Export Ready          │             │ • Key Compatibility Factors       │
└─────────────────────────────────────────┘             └───────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, jsPDF |
| **Backend Runtime** | Node.js 20, Express, Google GenAI SDK (`@google/genai`), esbuild, tsx |
| **AI Models** | Google Gemini (`gemini-3.8-flash` / `gemini-2.5-flash`) |
| **Automation** | GitHub Actions (`workflow-cron.yml`), Vercel Cron, Cloud Run Scheduler |
| **State & Storage** | JSON Store with Cross-Peer KV Replication, LocalStorage Fallback |
| **Containerization** | Multi-stage Dockerfile (`node:20-alpine`) |

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Continuous Integration: Lint & build validation
│       └── workflow-cron.yml      # 24/7 Autonomous Alert Cron Trigger
├── api/
│   └── index.ts                   # Vercel Serverless entrypoint
├── data/
│   └── careerops_store.json       # Persistent job & workflow state store
├── public/
│   └── favicon.svg                # Application branding icon
├── server/
│   ├── gemini.ts                  # Google GenAI SDK initialization & helpers
│   ├── jobSearch.ts               # Direct ATS query engine & URL normalizers
│   ├── linkVerifier.ts            # Headless posting status & dead-link detector
│   ├── matcher.ts                 # Gemini prompt engineering for job fit evaluation
│   ├── resumeScraper.ts           # Resume PDF & DOCX extraction and profile enrichment
│   ├── salaryEstimator.ts         # Experience-to-LPA compensation estimation
│   ├── salaryHelpers.ts           # Currency parsing and salary normalizers
│   ├── seedData.ts                # Seed re-exports for server bootstrapping
│   ├── storage.ts                 # Disk persistence & peer sync handlers
│   └── tailor.ts                  # Gemini prompt for targeted ATS documents
├── src/
│   ├── components/
│   │   ├── AddJobModal.tsx        # Manual position entry modal
│   │   ├── AutomationView.tsx     # 24/7 Cadence & Deduplication Memory controls
│   │   ├── DashboardView.tsx      # Metrics, pipeline funnels & high-fit highlights
│   │   ├── DocumentStudioView.tsx # Resume & cover letter editor with PDF export
│   │   ├── JobFeedView.tsx        # Search, filters, status pipeline, bulk actions
│   │   ├── MobileBottomNav.tsx    # Mobile-responsive bottom navigation
│   │   ├── Navbar.tsx             # Main header navigation bar
│   │   └── ProfileView.tsx        # Profile resume management & skill editor
│   ├── lib/
│   │   ├── clientAutomation.ts    # Browser-side background polling runner
│   │   ├── dateUtils.ts           # Relative time formatting utilities
│   │   ├── pdfExport.ts           # High-resolution ATS resume PDF compiler
│   │   ├── searchedRegistry.ts    # Client-side deduplication memory store
│   │   ├── syncClock.ts           # Multi-device clock reconciliation
│   │   └── telegramClient.ts      # Direct Telegram Bot API client
│   ├── App.tsx                    # Main state orchestration & peer sync engine
│   ├── index.css                  # Global Tailwind CSS styles
│   ├── main.tsx                   # React DOM root entrypoint
│   ├── seedData.ts                # Baseline candidate profile & job state
│   └── types.ts                   # Shared TypeScript interfaces
├── Dockerfile                     # Multi-stage production container image
├── package.json                   # Project metadata, scripts, and dependencies
├── server.ts                      # Express API server & Vite development middleware
├── tsconfig.json                  # TypeScript compiler options
└── vercel.json                    # Vercel serverless functions & cron rules
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v20.x or later
- **npm** or **bun**
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### Local Installation

```bash
# 1. Clone the repository
git clone https://github.com/Pokedash01/CareerOps.git
cd CareerOps

# 2. Install all dependencies
npm ci

# 3. Create your local environment file
cp .env.example .env
```

### Environment Configuration

Configure your `.env` file with the required keys:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY="your-gemini-api-key"

# Base URL for the local server
APP_URL="http://localhost:3000"

# Optional: Telegram instant alerts
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
TELEGRAM_CHAT_ID="your-telegram-chat-id"

# Optional: Search key for additional job board coverage
SERPAPI_KEY=""
```

#### Obtaining Telegram Credentials:
1. Create a bot by messaging [@BotFather](https://t.me/BotFather) on Telegram and copy the API token.
2. Retrieve your chat ID by messaging [@userinfobot](https://t.me/userinfobot).
3. Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to your `.env` or GitHub Secrets.

### Running in Development Mode
```bash
npm run dev
```
The application will be live at `http://localhost:3000`.

### Production Build & Launch
```bash
# Build Vite frontend and compile standalone server bundle
npm run build

# Start the Node.js production server
npm start
```

---

## 🤖 24/7 Automation & Scheduling

CareerOps can execute autonomous searches and send alerts completely in the background without needing an open browser window.

### GitHub Actions 24/7 Cron
The workflow located at `.github/workflows/workflow-cron.yml` runs every 4 hours automatically:

1. In your GitHub repository, open **Settings** > **Secrets and variables** > **Actions**.
2. Add a new repository secret:
   - **Name**: `CAREEROPS_APP_URL`
   - **Value**: Your deployed app URL (e.g., `https://ais-dev-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app`)
3. Optional inputs can be triggered on-demand via **Actions** > **Trigger CareerOps Workflow** > **Run workflow**.

### Features of the GitHub Actions Runner:
- **Resilient Retry Policy**: Employs `--connect-timeout 20 --max-time 90 --retry 2` with automatic POST-to-GET method fallback.
- **Failover Target Resolution**: Automatically falls back to secondary preview URLs if the primary instance is warming up from a cold start.
- **Visual Summary Output**: Generates rich Markdown status logs directly inside `$GITHUB_STEP_SUMMARY`.

---

## 🛡️ State Synchronization & Deduplication

### Deduplication Registry
Every job is assigned a deterministic ID and composite signature:
```ts
signature = `${company_name.toLowerCase()}_${title.toLowerCase()}`
```
When any job is reviewed, rejected, or deleted:
- It is permanently indexed into `searchedRegistry`.
- ATS search scrapers match raw candidate listings against canonical URLs and signatures.
- Rejected listings are filtered out before reaching the Gemini evaluation stage, preventing unnecessary token usage and duplicate notifications.

### Anti-Rollback Synchronization
To avoid race conditions across multiple open browser tabs or ephemeral cloud containers:
- All state updates carry a `last_updated` ISO timestamp.
- Incoming data is only applied if its timestamp is newer than the local state.
- If a client has local additions unknown to the cloud, it heals the cloud store automatically by issuing an immediate sync payload.

---

## 📡 API Reference

### Authentication & Multi-Tenant Partitioning
| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/me` | `GET` | Verifies current session from encrypted cookie or Bearer token |
| `/api/auth/login` | `POST` | Authenticates user credentials, sets 90-day device cookie, returns session |
| `/api/auth/register` | `POST` | Provisions new user account with dedicated partitioned workspace |
| `/api/auth/demo-login`| `POST` | 1-click workspace access for verified candidate |
| `/api/auth/switch-account`| `POST` | Switches active user partition on recognized device |
| `/api/auth/logout` | `POST` | Clears device session cookie and invalidates session token |

### Career Pipeline & Jobs
| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Health check returning service status and Gemini API key configuration |
| `/api/jobs` | `GET` | Returns all active job listings in the authenticated user's pipeline |
| `/api/jobs` | `POST` | Discovers and indexes fresh positions matching candidate profile |
| `/api/jobs/status` | `POST` | Updates job review status (new, viable, applied, rejected) |
| `/api/jobs/:id` | `DELETE` | Removes listing and indexes signature into deduplication memory |
| `/api/match` | `POST` | Evaluates a single position against the user profile using Gemini AI |
| `/api/tailor` | `POST` | Generates tailored resume bullets and cover letters |
| `/api/download-resume`| `GET` | Downloads ATS resume in `.doc` or `.txt` format |
| `/api/download-cover-letter`| `GET` | Downloads tailored cover letter in `.doc` or `.txt` format |
| `/api/cron/trigger` | `GET / POST` | Triggers the autonomous 24/7 discovery, scoring, and alert workflow |
| `/api/state/sync` | `GET / POST` | Bidirectional state sync endpoint with anti-rollback merging per user partition |
| `/api/registry/stats` | `GET` | Returns count of tracked, rejected, and active deduplication entries |
| `/api/registry/truncate`| `POST` | Prunes stale deduplication entries exceeding retention TTL |

---

## 🐳 Docker Deployment

A multi-stage, production-ready `Dockerfile` is included in the root directory:

```bash
# 1. Build the Docker container image
docker build -t careerops-ai .

# 2. Run container on port 3000
docker run -d -p 3000:3000 \
  -e GEMINI_API_KEY="your-gemini-api-key" \
  -e APP_URL="http://localhost:3000" \
  -e TELEGRAM_BOT_TOKEN="your-telegram-bot-token" \
  -e TELEGRAM_CHAT_ID="your-telegram-chat-id" \
  --name careerops \
  careerops-ai
```

---

## 🧪 CI/CD & Code Quality

CareerOps maintains strict code quality standards:

```bash
# Validate TypeScript type consistency across client and server
npm run lint

# Compile production bundles
npm run build

# Clean temporary build artifacts
npm run clean
```

All pushes and pull requests trigger automated GitHub Actions CI (`.github/workflows/ci.yml`) to verify type safety and clean compilation.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Built for automated candidate excellence.
