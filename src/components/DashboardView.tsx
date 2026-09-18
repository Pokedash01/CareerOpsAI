import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Send,
  TrendingUp,
  MapPin,
  Building2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertTriangle,
  PlayCircle,
  PlusCircle,
  Search,
  Clock,
  RefreshCw,
  Zap,
  History,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { motion } from 'motion/react';
import { getSynchronizedRemaining } from '../lib/syncClock.js';
import { UserProfile, JobListing, PipelineStats, WorkflowState } from '../types.js';

interface DashboardViewProps {
  profile: UserProfile;
  jobs: JobListing[];
  stats?: PipelineStats;
  workflow?: WorkflowState | null;
  onSelectJobForTailor: (job: JobListing) => void;
  onRunPipeline: () => void;
  isPipelineRunning: boolean;
  onOpenAddJob: () => void;
  onDiscoverJobs: () => void;
  isDiscovering: boolean;
  onNotifyTelegram: (job: JobListing) => void;
  onTriggerWorkflow?: () => void;
  isWorkflowRunning?: boolean;
  setActiveTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  jobs,
  stats,
  workflow,
  onSelectJobForTailor,
  onRunPipeline,
  isPipelineRunning,
  onOpenAddJob,
  onDiscoverJobs,
  isDiscovering,
  onNotifyTelegram,
  onTriggerWorkflow,
  isWorkflowRunning,
  setActiveTab,
}) => {
  const highFitJobs = jobs.filter((j) => (j.fit?.match_score || 0) >= 75);
  const pendingEvaluation = jobs.filter((j) => !j.fit);

  const [remainingTime, setRemainingTime] = useState<string>('03h 48m 22s');

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = getSynchronizedRemaining(
        workflow?.next_run,
        workflow?.interval_hours || 4,
        Boolean(isWorkflowRunning || workflow?.is_running)
      );
      setRemainingTime(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [workflow?.next_run, workflow?.interval_hours, isWorkflowRunning, workflow?.is_running]);

  const metrics = [
    {
      title: 'Total Scanned',
      value: jobs.length,
      subtitle: 'ATS & Portal Listings',
      icon: Briefcase,
      color: 'text-zinc-100',
      badgeBg: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60 shadow-sm shadow-black/40',
    },
    {
      title: 'Viable Fit',
      value: jobs.filter((j) => j.fit?.is_viable).length,
      subtitle: 'Passed Hard Constraints',
      icon: ShieldCheck,
      color: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-sm shadow-cyan-500/10',
    },
    {
      title: 'High Match (≥75%)',
      value: highFitJobs.length,
      subtitle: 'Ready for Application',
      icon: TrendingUp,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10',
    },
    {
      title: 'Telegram Alerts',
      value: jobs.filter((j) => j.status === 'notified').length,
      subtitle: 'Dispatched to Bot',
      icon: Send,
      color: 'text-violet-400',
      badgeBg: 'bg-violet-500/10 text-violet-400 border-violet-500/30 shadow-sm shadow-violet-500/10',
    },
    {
      title: 'Applied',
      value: jobs.filter((j) => j.status === 'applied').length,
      subtitle: 'Tracked In Pipeline',
      icon: CheckCircle2,
      color: 'text-blue-400',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-sm shadow-blue-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Card with Organic Glow Blob & Refined Contrast */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#111622] via-[#0E121B] to-[#0A0D14] border border-white/[0.08] p-6 sm:p-7 text-zinc-100 shadow-xl shadow-black/40 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-blue-400/40 before:to-transparent"
      >
        {/* Organic Ambient Sphere Blob */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-80 h-80 bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 w-60 h-60 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Career Engine for {profile.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl font-normal">
              Continuous ATS discovery scans, deterministic constraint validation (tech stack, experience, location, CTC), and instant ATS-compliant document tailoring.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('jobs')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/25 border border-blue-400/30 cursor-pointer"
            >
              <span>Explore Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Autonomous Workflow Status Strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="glass-panel rounded-xl p-3 sm:p-3.5 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] text-zinc-300">
              <span className="text-zinc-500 text-[11px]">Cadence:</span>
              <span className="font-semibold text-white">4h Loop</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] text-zinc-300">
              <span className="text-zinc-500 text-[11px]">Last Run:</span>
              <span className="font-medium text-zinc-200">
                {workflow?.last_run
                  ? new Date(workflow.last_run).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Recent'}
              </span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 w-full sm:w-auto">
            <span className="text-xs text-zinc-400 font-mono flex items-center justify-between sm:justify-start gap-1.5">
              <span className="text-zinc-500">Next run:</span>
              <span className="text-cyan-400 font-semibold">{remainingTime}</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Metrics Funnel Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 + idx * 0.04 }}
              whileHover={{ y: -3 }}
              className={`glass-panel glass-panel-hover rounded-xl p-3.5 sm:p-4 flex flex-col justify-between group ${
                idx === 4 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  {metric.title}
                </span>
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-110 ${metric.badgeBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold font-mono tracking-tight ${metric.color}`}>
                  {metric.value}
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">{metric.subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Top High-Fit Opportunities Spotlight (≥75% Match) */}
      {highFitJobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.18 }}
          className="glass-panel rounded-2xl p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm">Priority Matches (≥75%)</h2>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('jobs')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition"
            >
              <span>View All ({highFitJobs.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {highFitJobs.slice(0, 3).map((job) => {
              const score = job.fit?.match_score || 0;
              return (
                <div
                  key={job.id}
                  className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-blue-500/30 rounded-xl p-3.5 transition-all flex flex-col justify-between gap-3 group shadow-sm"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-white text-xs sm:text-sm truncate group-hover:text-blue-300 transition">
                          {job.title}
                        </h4>
                        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-zinc-500" />
                          <span className="truncate">{job.company_name}</span>
                          <span>•</span>
                          <span className="truncate">{job.location}</span>
                        </p>
                      </div>

                      {/* Circular Gauge Badge */}
                      <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
                        <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/[0.06]" />
                          <circle
                            cx="18"
                            cy="18"
                            r="15"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${score}, 100`}
                            strokeLinecap="round"
                            className="text-emerald-400"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-bold font-mono text-emerald-400">{score}%</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                        {job.ats_source}
                      </span>
                      {job.experience_range_years && (
                        <span className="text-[10px] font-mono text-zinc-300 bg-white/[0.03] border border-white/[0.06] px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-blue-400" />
                          <span>{job.experience_range_years[0]}-{job.experience_range_years[1]} Yrs</span>
                          {job.experience_is_inferred && (
                            <span className="text-[9px] text-zinc-500 font-sans">(Inferred)</span>
                          )}
                        </span>
                      )}
                      {job.salary_range_lpa ? (
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <DollarSign className="w-2.5 h-2.5 text-emerald-400" />
                          <span>₹{job.salary_range_lpa[0]}-{job.salary_range_lpa[1]} LPA</span>
                          {job.salary_is_estimated && (
                            <span className="text-[9px] text-amber-400/90 font-sans ml-0.5">Est.</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-[10px] font-sans text-zinc-400 bg-white/[0.02] border border-white/[0.06] px-1.5 py-0.5 rounded">
                          Undisclosed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                    <button
                      onClick={() => onSelectJobForTailor(job)}
                      className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Tailor Documents</span>
                    </button>
                    <button
                      onClick={() => onNotifyTelegram(job)}
                      className="text-[11px] font-medium text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition cursor-pointer"
                    >
                      <Send className="w-3 h-3 text-indigo-400" />
                      <span>Alert</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Candidate Profile Summary & Target Spec */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-1 glass-panel rounded-2xl p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Candidate Match Spec</span>
            </h2>
            <button
              onClick={() => setActiveTab('profile')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition"
            >
              <span>Edit</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 pt-2 text-xs border-t border-white/[0.07]">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">Full Name</span>
              <span className="font-bold text-zinc-100 text-sm">{profile.full_name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/[0.02] p-2 rounded-lg border border-white/[0.05]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">Experience</span>
                <span className="font-semibold text-zinc-200">{profile.total_years_experience} Yrs ({profile.seniority_tier})</span>
              </div>
              <div className="bg-white/[0.02] p-2 rounded-lg border border-white/[0.05]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">Expected Comp</span>
                <span className="font-semibold font-mono text-emerald-400">
                  {profile.salary_expectation ? `₹${profile.salary_expectation.min_lpa} - ₹${profile.salary_expectation.max_lpa} LPA` : 'Open'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">Target Roles</span>
              <div className="flex flex-wrap gap-1">
                {(profile.target_roles || []).map((role, idx) => (
                  <span key={idx} className="text-[11px] bg-white/[0.03] border border-white/[0.07] text-zinc-200 px-2 py-0.5 rounded-md font-medium">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">Target Locations</span>
              <div className="flex flex-wrap gap-1">
                {(profile.preferred_locations || []).map((loc, idx) => (
                  <span key={idx} className="text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/25 px-2 py-0.5 rounded-md font-medium">
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">Core Tech Stack</span>
              <div className="flex flex-wrap gap-1">
                {(profile.skills || []).slice(0, 8).map((skill, idx) => (
                  <span key={idx} className="text-[10px] bg-white/[0.03] border border-white/[0.06] text-zinc-300 px-2 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
                {(profile.skills?.length || 0) > 8 && (
                  <span className="text-[10px] text-zinc-400 py-0.5">+{profile.skills.length - 8} more</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Workflow Execution History Log */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="lg:col-span-2 glass-panel rounded-2xl p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                <span>Workflow Execution History</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25 shadow-sm shadow-blue-500/10">
                  {workflow?.total_runs || 1} Runs
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Autonomous ATS discovery scans, link checks, and Telegram dispatches
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {(!workflow?.runs || workflow.runs.length === 0) ? (
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.06] text-xs text-zinc-400">
                No execution history yet.
              </div>
            ) : (
              workflow.runs.map((run) => (
                <div
                  key={run.id}
                  className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-all space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs">
                        {run.trigger === 'scheduled_4h' ? 'Autonomous Cadence' : 'Manual Trigger'}
                      </span>
                      <span
                        className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${
                          run.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {run.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {new Date(run.completed_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-zinc-300 text-[11px] leading-relaxed">{run.summary}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-zinc-400 pt-1 border-t border-white/[0.06] font-mono">
                    <span className="text-blue-400 font-semibold">+{run.new_jobs_found} fresh jobs</span>
                    <span className="text-emerald-400 font-semibold">{run.high_fit_count} high-fit matches</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
