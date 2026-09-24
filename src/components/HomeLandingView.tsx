import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  Zap,
  Send,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Sliders,
  Smartphone,
  ExternalLink,
  Lock,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  Check,
  Layers,
  Cpu,
  RefreshCw,
  Globe,
  Terminal,
} from 'lucide-react';

interface HomeLandingViewProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const HomeLandingView: React.FC<HomeLandingViewProps> = ({
  onOpenRegister,
  onOpenLogin,
}) => {
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const pipelineStages = [
    {
      step: '01',
      title: 'Portal Discovery',
      badge: 'Continuous Crawl',
      desc: 'Autonomous scraper targets direct company ATS boards (Greenhouse, Lever, Ashby, Workday) rather than aggregated spam boards.',
      sampleData: {
        sources: ['Greenhouse API', 'Lever Postings', 'Ashby HQ', 'Workday Direct'],
        status: 'Active Crawling',
        lastScanFound: '14 New Openings',
      },
    },
    {
      step: '02',
      title: 'Anti-Ghost Check',
      badge: 'HTTP Verification',
      desc: 'Every single link is pinged with real-time HTTP validation. 404s, expired positions, and closed requisitions are pruned immediately.',
      sampleData: {
        verifiedLinks: '100% Live URLs',
        deadLinksPruned: '4 Expired Skipped',
        validationTime: '<150ms per link',
      },
    },
    {
      step: '03',
      title: 'Precision Fit Engine',
      badge: 'Smart Matching',
      desc: 'Evaluates role alignment: technical skills match, verified experience, and compensation criteria. Only roles scoring ≥75% are prioritized.',
      sampleData: {
        accuracy: 'Skills & Seniority Match',
        criteria: 'Skills (40%), Experience (30%), Salary (20%), Location (10%)',
        fitScore: '94% Viable Match',
      },
    },
    {
      step: '04',
      title: 'Telegram Dispatch',
      badge: 'Instant Push',
      desc: 'Dispatches instant push alerts directly to your phone Telegram with direct application links and tailored ATS resume ready for download.',
      sampleData: {
        destination: 'Personal Telegram ID',
        latency: 'Instant (< 2s)',
        payload: 'Role, CTC, Match %, 1-Click ATS Resume, Direct Apply',
      },
    },
  ];

  const faqs = [
    {
      q: 'How does the autonomous 4-hour schedule work for my personal account?',
      a: 'Every registered candidate receives an independent background schedule. When you create your account (e.g. at 9:27 AM), your 4-hour cycle begins based on your personal clock. Even when your browser tab is closed or your computer is asleep, our cloud agent continues crawling verified ATS portals for your target roles and dispatches alerts directly to your phone.',
    },
    {
      q: 'Do I need to build, code, or host a Telegram bot?',
      a: 'No. You do not need to visit BotFather, create bot tokens, or write any code. CareerOps AI operates a centralized, verified notification dispatcher. During sign-up, simply enter your Telegram Chat ID (we provide a 1-click link to retrieve it in 5 seconds). When high-fit roles (≥75%) are discovered, your phone buzzes immediately.',
    },
    {
      q: 'How does CareerOps AI prevent ghost jobs and dead links?',
      a: 'Unlike traditional job boards that aggregate months-old reposts, our pipeline performs real-time link verification before ever presenting a job to you. Any position that has expired, closed, or been removed is filtered out automatically.',
    },
    {
      q: 'How does the role fit scoring work?',
      a: 'We evaluate your resume profile and career preferences against the job description. The system analyzes skill overlap, required years of experience, and compensation alignment, generating clear match scores and explaining why the role is a good fit.',
    },
    {
      q: 'Can I export tailored resumes and cover letters for each job?',
      a: 'Yes. Our 1-Click Document Studio dynamically crafts an ATS-optimized resume and tailored cover letter specifically aligned to the keywords and competencies of each high-fit job description. You can preview, edit, copy, or export them in seconds.',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 py-4 sm:py-8">
      {/* 1. HERO SECTION */}
      <section className="relative text-center max-w-5xl mx-auto pt-4 sm:pt-10 space-y-7">
        {/* Ambient Top Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>Autonomous 24/7 Career Operations & Phone Dispatch</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]"
        >
          Land Your Dream Job on{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            Autonomous Autopilot.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed"
        >
          Stop spending hours skimming stale job boards. CareerOps AI continuously scans direct company career portals 24/7, eliminates expired links with active verification, evaluates role fit against your profile, and sends instant alerts straight to your personal Telegram.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-blue-400/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-6 py-4 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white font-medium text-sm rounded-xl border border-white/[0.1] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-blue-400" />
            <span>Existing Candidate? Sign In</span>
          </button>
        </motion.div>

        {/* Real-time Interactive Pipeline Simulator Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="pt-6"
        >
          <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/[0.12] bg-[#0c1019]/90 shadow-2xl text-left max-w-4xl mx-auto space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs text-zinc-300 font-medium pl-2">
                  Automated Search & Alerts
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Search Service Active</span>
              </div>
            </div>

            {/* Pipeline Stage Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {pipelineStages.map((stage, idx) => {
                const isActive = activePipelineStep === idx;
                return (
                  <button
                    key={stage.step}
                    onClick={() => setActivePipelineStep(idx)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/20 border-blue-500/50 shadow-md shadow-blue-500/10'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-blue-400 font-bold">{stage.step}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                        isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-white/[0.04] text-zinc-400'
                      }`}>
                        {stage.badge}
                      </span>
                    </div>
                    <p className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                      {stage.title}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Simulation Inspector */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-xs text-zinc-300 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-white/[0.06]">
                <span className="flex items-center gap-1.5 text-blue-400 font-sans font-medium">
                  <Terminal className="w-3.5 h-3.5" />
                  Stage Details: {pipelineStages[activePipelineStep].title}
                </span>
                <span className="text-zinc-500 text-[10px]">Click any stage above to inspect</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {pipelineStages[activePipelineStep].desc}
              </p>
              <div className="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                {Object.entries(pipelineStages[activePipelineStep].sampleData).map(([k, v]) => (
                  <div key={k} className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                    <span className="text-[10px] text-zinc-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                    <p className="text-emerald-400 font-semibold truncate mt-0.5">
                      {Array.isArray(v) ? v.join(', ') : String(v)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto text-left"
        >
          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>24/7 Autonomous</span>
            </div>
            <p className="text-[11px] text-zinc-400">Automatically checks for new jobs every 4 hours</p>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Setup Telegram</span>
            </div>
            <p className="text-[11px] text-zinc-400">Pre-configured dispatcher delivers instant phone alerts</p>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Anti-Ghosting Check</span>
            </div>
            <p className="text-[11px] text-zinc-400">Real-time HTTP link checks prune 404s and expired roles</p>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Private Workspace</span>
            </div>
            <p className="text-[11px] text-zinc-400">Your profile, preferences, and matched jobs are kept private</p>
          </div>
        </motion.div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-6xl mx-auto space-y-10 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Autonomous Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How CareerOps AI Solves Job Hunting
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            From verified company ATS portals to tailored resumes and phone notifications in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-blue-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">Step 01</span>
            <h3 className="font-bold text-white text-base">Direct ATS Crawling</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Continuously crawls live openings across Greenhouse, Lever, Ashby, and Workday. Bypasses recruiter spam and third-party scrapers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Step 02</span>
            <h3 className="font-bold text-white text-base">HTTP Link Verification</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Every job listing undergoes an HTTP probe. 404s, expired postings, and closed requisitions are filtered out before you ever see them.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">Step 03</span>
            <h3 className="font-bold text-white text-base">Precision Fit Scoring</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Calculates tech stack overlap, verified experience brackets, and salary requirements. Only roles with match score ≥75% trigger alerts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-amber-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">Step 04</span>
            <h3 className="font-bold text-white text-base">Instant Telegram Dispatch</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Instant alerts sent directly to your phone. Includes direct application links, salary brackets, and tailored ATS resume ready in 1 click.
            </p>
          </div>
        </div>
      </section>

      {/* 3. ATS ENGINE & DOCUMENT STUDIO */}
      <section id="ats-engine" className="max-w-5xl mx-auto scroll-mt-20">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/[0.1] bg-gradient-to-b from-white/[0.03] to-transparent shadow-2xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                <FileText className="w-3.5 h-3.5" />
                <span>Precision ATS Alignment</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                No Generic Hallucinations.<br />
                <span className="text-indigo-400">Tailored Strictly to Your Real Achievements.</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Most AI resume tools hallucinate fake experience that fails technical interviews. CareerOps AI takes your authentic career trajectory and maps your proven skills to the exact keywords and competency bars demanded by the hiring manager.
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Deterministic keyword match scoring across core tech stacks</span>
                </div>
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-Click tailored cover letter generated per job opening</span>
                </div>
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Export to clean ATS-compliant text or professional PDF</span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={onOpenRegister}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Try Document Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document Diff Card */}
            <div className="lg:col-span-6 space-y-3">
              <div className="p-4 rounded-2xl bg-[#111622] border border-white/[0.08] space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    ATS Optimization Comparison
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                    94% Match
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20 text-[11px] text-zinc-300">
                    <span className="text-rose-400 font-bold text-[10px] block mb-0.5">Generic Resume Keyword Overlap (42%):</span>
                    "Worked on frontend web applications using common libraries and deployed backend services."
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-zinc-300">
                    <span className="text-emerald-400 font-bold text-[10px] block mb-0.5">CareerOps Tailored ATS Resume (94%):</span>
                    "Architected responsive React/TypeScript frontend microservices, integrated REST APIs with 99.9% uptime, and reduced bundle load latency by 38%."
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>Target: Senior Frontend Engineer</span>
                  <span className="text-indigo-400">ATS Compliant &bull; 0 Hallucinations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INDEPENDENT AUTOMATION CADENCE */}
      <section id="cadence" className="max-w-5xl mx-auto scroll-mt-20">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#0c1019] to-transparent shadow-2xl space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
              <Clock className="w-3.5 h-3.5" />
              <span>Automated Background Search</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Hands-Free Job Search.<br />
              <span className="text-blue-400">Fresh opportunities delivered on schedule.</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Set your preferred search schedule and let CareerOps AI handle the discovery. It continuously checks verified company career portals for your target roles and alerts you as soon as matching openings are posted.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Runs in the Cloud</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                You do not need to keep a browser tab open. Schedulers run automatically in the background.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>Manual Trigger Anytime</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Need fresh jobs immediately? Click "Trigger Search" in your top navigation bar at any time to run an instant on-demand scan.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Private & Secure</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Your target roles, salary criteria, notification history, and tailored resumes are saved strictly to your personal account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TELEGRAM SHOWCASE SECTION */}
      <section id="telegram-alerts" className="max-w-5xl mx-auto scroll-mt-20">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/[0.1] bg-gradient-to-b from-white/[0.04] to-transparent shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side: Why Telegram explanation */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <Send className="w-3.5 h-3.5" />
                <span>Zero-Friction Phone Alerts</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                No Bot Creation. No API Keys.<br />
                <span className="text-emerald-400">Just enter your Telegram ID.</span>
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Traditional notification setups force you to visit BotFather, manage private bot tokens, or deploy webhook servers.
              </p>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                CareerOps AI runs a pre-configured central notification dispatcher. When you register, simply paste your numeric Telegram Chat ID. The moment a verified job scores ≥75%, your phone buzzes with the exact salary, match analysis, direct apply link, and tailored resume.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>First-applicant advantage: Apply within minutes of a role going live</span>
                </div>
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Includes salary ranges (LPA), ATS fit score, and skill gaps preview</span>
                </div>
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-click verification test ping right during registration wizard</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenRegister}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Connect Your Telegram ID</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right side: Telegram Notification Preview Mock */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-[#17212B] border border-cyan-500/20 shadow-2xl p-4 text-white font-sans text-xs space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-[11px]">
                      CO
                    </div>
                    <div>
                      <p className="font-semibold text-white text-xs">CareerOps Bot</p>
                      <p className="text-[10px] text-cyan-400 font-medium">bot &bull; online</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400">Just now</span>
                </div>

                {/* Bubble Message */}
                <div className="bg-[#1E2C3A] rounded-xl p-3.5 space-y-2 border border-white/[0.04]">
                  <p className="font-bold text-emerald-400 text-xs">
                    🎯 New High-Fit Role Matched! (CareerOps AI)
                  </p>

                  <div className="space-y-1 text-[11px] text-zinc-200 leading-normal">
                    <p>📌 <b>Role:</b> Senior Full Stack Engineer</p>
                    <p>🏢 <b>Company:</b> Razorpay Software</p>
                    <p>📍 <b>Location:</b> Bengaluru, India (Hybrid / Remote)</p>
                    <p>⏳ <b>Experience Required:</b> 2 - 5 Years</p>
                    <p>💰 <b>Salary Range:</b> ₹18.0 - ₹28.0 LPA</p>
                    <p className="text-emerald-400 font-bold">📊 Fit Score: 94%</p>
                    <p>⚠️ <b>Skill Gap:</b> None (100% Core Competency Overlap)</p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.08] space-y-1.5">
                    <div className="p-2 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-between text-[11px] text-blue-300">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        Tailored ATS Resume Ready
                      </span>
                      <ExternalLink className="w-3 h-3 text-blue-400" />
                    </div>

                    <div className="p-2 rounded-lg bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-between text-[11px] text-emerald-300">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        Apply Directly on Razorpay Careers
                      </span>
                      <ExternalLink className="w-3 h-3 text-emerald-400" />
                    </div>
                  </div>

                  <p className="text-[9px] text-zinc-400 italic pt-1">
                    Alert sent via CareerOps AI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMPARISON TABLE */}
      <section id="comparison" className="max-w-5xl mx-auto scroll-mt-20">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Why Manual Job Hunting Fails
            </h3>
            <p className="text-xs text-zinc-400">
              See how automation transforms your search efficiency and callback rates.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.1] text-zinc-400">
                  <th className="py-3 px-4 font-semibold">Capability</th>
                  <th className="py-3 px-4 font-semibold text-zinc-400">Manual Job Search</th>
                  <th className="py-3 px-4 font-semibold text-zinc-400">Generic Job Newsletters</th>
                  <th className="py-3 px-4 font-bold text-blue-400 bg-blue-500/10 rounded-t-lg">
                    CareerOps AI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-zinc-300">
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Discovery Speed</td>
                  <td className="py-3 px-4 text-zinc-400">3+ hours spent skimming tabs daily</td>
                  <td className="py-3 px-4 text-zinc-400">Bulk daily or weekly emails</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400 bg-blue-500/5">
                    Autonomous 24/7 background agent
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Ghost / Dead Links</td>
                  <td className="py-3 px-4 text-zinc-400">High (30%+ expired requisitions)</td>
                  <td className="py-3 px-4 text-zinc-400">No link validation performed</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400 bg-blue-500/5">
                    100% Verified active links
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Fit Accuracy</td>
                  <td className="py-3 px-4 text-zinc-400">Subjective manual skimming</td>
                  <td className="py-3 px-4 text-zinc-400">Broad keyword match (low relevance)</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400 bg-blue-500/5">
                    Precision multi-factor match (&ge;75%)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Phone Alerts</td>
                  <td className="py-3 px-4 text-zinc-400">None</td>
                  <td className="py-3 px-4 text-zinc-400">Lost in email spam</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400 bg-blue-500/5">
                    Instant Telegram push to your phone
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Resume Tailoring</td>
                  <td className="py-3 px-4 text-zinc-400">30–45 mins per application</td>
                  <td className="py-3 px-4 text-zinc-400">None provided</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400 bg-blue-500/5">
                    1-Click ATS Document Studio
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="max-w-4xl mx-auto space-y-6 scroll-mt-20">
        <div className="text-center space-y-2">
          <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            Everything you need to know about CareerOps AI.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white/[0.02] border border-white/[0.08] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition"
                >
                  <span className="font-semibold text-white text-xs sm:text-sm">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 sm:px-5 pb-4 text-xs text-zinc-300 leading-relaxed border-t border-white/[0.04] pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. BOTTOM WORLDWIDE CONVERSION CTA */}
      <section className="max-w-4xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-blue-900/40 border border-blue-500/30 shadow-2xl space-y-5">
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ready to Automate Your Career Search?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
          Create your private candidate workspace in seconds. Select your target roles, locations, and salary brackets, and let CareerOps AI handle the rest 24/7.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer border border-blue-400/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started Free
          </button>
          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-6 py-4 bg-white/[0.06] hover:bg-white/[0.1] text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/[0.12] transition-all cursor-pointer"
          >
            Candidate Sign In
          </button>
        </div>
      </section>

      {/* 9. MINIMALIST FOOTER */}
      <footer className="pt-8 pb-4 border-t border-white/[0.08] max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
            CO
          </div>
          <span className="font-semibold text-white">CareerOps AI</span>
          <span className="text-zinc-600">&bull;</span>
          <span className="text-zinc-400">Automated Job Search & Matching</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
          <a href="#ats-engine" className="hover:text-white transition">Resume Studio</a>
          <a href="#cadence" className="hover:text-white transition">Automation</a>
          <a href="#telegram-alerts" className="hover:text-white transition">Telegram</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </div>
      </footer>
    </div>
  );
};
