import React from 'react';
import { motion } from 'motion/react';
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
  Bot,
  Lock,
  Search,
  BellRing,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface HomeLandingViewProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onExploreDemo: () => void;
}

export const HomeLandingView: React.FC<HomeLandingViewProps> = ({
  onOpenRegister,
  onOpenLogin,
  onExploreDemo,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8">
      {/* 1. Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto pt-6 sm:pt-12 space-y-6">
        {/* Ambient Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>Autonomous 24/7 Career Operations & Phone Alerts</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
        >
          Job Hunting on Autopilot.{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            Real-time ATS Matches Delivered to Your Telegram.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed"
        >
          Never miss a high-fit opening again. CareerOps AI autonomously scans verified job portals 24/7, scores opportunities against your exact skills and experience brackets, generates ATS-tailored resumes, and sends instant push notifications straight to your Telegram phone.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Create Free Workspace</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 font-semibold text-sm rounded-xl border border-white/[0.1] transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-white/[0.2]"
          >
            <Bot className="w-4 h-4 text-blue-400" />
            <span>1-Click Verified Demo</span>
          </button>

          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-5 py-3.5 text-zinc-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Existing Member? Sign In
          </button>
        </motion.div>

        {/* Trust Badges Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto text-left"
        >
          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>24/7 Autonomous</span>
            </div>
            <p className="text-[11px] text-zinc-400">Scrapes verified postings every 4 hours automatically</p>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Setup Telegram</span>
            </div>
            <p className="text-[11px] text-zinc-400">Pre-configured bot sends instant phone alerts</p>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Anti-Ghosting Check</span>
            </div>
            <p className="text-[11px] text-zinc-400">HTTP link verification filters 404s and expired roles</p>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Private Partition</span>
            </div>
            <p className="text-[11px] text-zinc-400">Isolated workspace and device cookies for each user</p>
          </div>
        </motion.div>
      </section>

      {/* 2. Interactive Telegram Showcase Section */}
      <section id="telegram-alerts" className="max-w-5xl mx-auto">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/[0.1] bg-gradient-to-b from-white/[0.04] to-transparent shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side: Why Telegram & Zero Effort explanation */}
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
                Traditional notification systems force you to visit BotFather, generate bot tokens, deploy servers, or configure complicated webhooks.
              </p>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                With CareerOps AI, we run a centralized notification dispatcher. During sign-up, simply enter your Telegram Chat ID (we provide a 1-click link to retrieve it in 5 seconds). When high-fit roles matching your profile (&ge;75%) are discovered, your phone buzzes immediately with direct apply links and tailored resumes.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Each registered user has their own isolated Telegram destination ID</span>
                </div>
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant 1-click verification test ping during registration</span>
                </div>
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Includes salary ranges, ATS fit score, and skill gaps preview</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenRegister}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Connect Your Telegram ID</span>
                  <ChevronRight className="w-3.5 h-3.5" />
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
                      <p className="text-[10px] text-cyan-400 font-medium">bot • online</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400">Just now</span>
                </div>

                {/* Bubble Message */}
                <div className="bg-[#1E2C3A] rounded-xl p-3.5 space-y-2 border border-white/[0.04]">
                  <p className="font-bold text-emerald-400 text-xs">
                    🎯 New High-Fit Role Matched for Kartik! (CareerOps AI)
                  </p>

                  <div className="space-y-1 text-[11px] text-zinc-200 leading-normal">
                    <p>📌 <b>Role:</b> Lead Automation Specialist</p>
                    <p>🏢 <b>Company:</b> KPMG Global Services</p>
                    <p>📍 <b>Location:</b> Gurugram, India (Hybrid)</p>
                    <p>⏳ <b>Experience Required:</b> 3 - 5 Years</p>
                    <p>💰 <b>Salary Range:</b> ₹14.0 - ₹20.0 LPA</p>
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
                        Apply Directly on KPMG Career Portal
                      </span>
                      <ExternalLink className="w-3 h-3 text-emerald-400" />
                    </div>
                  </div>

                  <p className="text-[9px] text-zinc-400 italic pt-1">
                    Automated workflow dispatch via CareerOps-AI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 5-Step Solution Architecture */}
      <section id="solution" className="max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How CareerOps AI Solves Job Hunting
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            A complete autonomous pipeline from web discovery to ATS submission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-blue-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">1. Multi-Portal Scraping</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Continuously crawls live openings across LinkedIn, Google Jobs, and direct company ATS portals. Automatically skips recruiter spam and irrelevant listings.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">2. Anti-Ghosting Link Check</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Every job listing is tested with an HTTP verification check. 404s, expired positions, and closed corporate requisitions are immediately pruned so you never waste time.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">3. Gemini ATS Fit Scoring</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Evaluates tech stack overlap, verified years of experience, and role expectations. Jobs scoring &ge;75% are prioritized; mismatches are filed with transparent reasoning.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-amber-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">4. Telegram Push Alerts</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Instant alerts sent directly to your phone. Includes direct application links, salary brackets, and fit analysis so you can apply within minutes of a posting going live.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">5. ATS Document Studio</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Generates customized resumes and tailored cover letters grounded strictly in your real career accomplishments. Export to professional PDF or clean text in 1 click.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-blue-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">6. Private Data Partitioning</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Each user gets an isolated workspace, personal Telegram alerts, and 90-day device-persistent cookie login without requiring third-party cloud database dependencies.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Comparison Table: Manual vs Traditional vs CareerOps */}
      <section className="max-w-5xl mx-auto">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Why Manual Job Hunting Fails
            </h3>
            <p className="text-xs text-zinc-400">
              See the difference when automation powers your career search.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.1] text-zinc-400">
                  <th className="py-3 px-4 font-semibold">Feature</th>
                  <th className="py-3 px-4 font-semibold text-zinc-400">Manual Job Search</th>
                  <th className="py-3 px-4 font-semibold text-zinc-400">Generic Job Alerts</th>
                  <th className="py-3 px-4 font-bold text-blue-400 bg-blue-500/10 rounded-t-lg">
                    CareerOps AI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-zinc-300">
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Discovery Speed</td>
                  <td className="py-3 px-4 text-zinc-400">Hours spent browsing tabs daily</td>
                  <td className="py-3 px-4 text-zinc-400">Daily bulk email newsletters</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400 bg-blue-500/5">
                    Real-time 24/7 background scraping
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Ghost / 404 Links</td>
                  <td className="py-3 px-4 text-zinc-400">Frequent dead ends & closed portals</td>
                  <td className="py-3 px-4 text-zinc-400">No link validation performed</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400 bg-blue-500/5">
                    Automated HTTP link check (0 dead links)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Fit Accuracy</td>
                  <td className="py-3 px-4 text-zinc-400">Manual keyword skimming</td>
                  <td className="py-3 px-4 text-zinc-400">Broad keyword alerts (low relevance)</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400 bg-blue-500/5">
                    Multi-modal ATS & experience fit (&ge;75%)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Phone Notifications</td>
                  <td className="py-3 px-4 text-zinc-400">None</td>
                  <td className="py-3 px-4 text-zinc-400">Email spam (easily lost)</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400 bg-blue-500/5">
                    Instant Telegram push to your personal ID
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Resume Customization</td>
                  <td className="py-3 px-4 text-zinc-400">Manual editing per application</td>
                  <td className="py-3 px-4 text-zinc-400">None</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400 bg-blue-500/5">
                    1-Click ATS Tailored PDF & Text
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA Box */}
      <section className="max-w-4xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-blue-900/40 border border-blue-500/30 shadow-2xl space-y-5">
        <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          Ready to Automate Your Career Search?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto">
          Create your private workspace in seconds. Enter your Telegram ID to receive instant alerts for verified high-fit roles.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            Create Free Account & Sync Telegram
          </button>
          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/[0.06] hover:bg-white/[0.1] text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/[0.12] transition-all cursor-pointer"
          >
            Explore Live Demo Workspace
          </button>
        </div>
      </section>
    </div>
  );
};
