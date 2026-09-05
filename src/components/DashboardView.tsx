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
  const [showRunHistory, setShowRunHistory] = useState<boolean>(false);

  useEffect(() => {
    const updateCountdown = () => {
      if (!workflow?.next_run) {
        setRemainingTime('04h 00m 00s');
        return;
      }
      const diff = new Date(workflow.next_run).getTime() - Date.now();
      if (diff <= 0) {
        setRemainingTime('Scanning now...');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setRemainingTime(
        `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [workflow?.next_run]);

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0F1115] border border-[#1F2937] p-6 sm:p-8 text-[#E5E7EB] shadow-xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Autonomous Career Agent for {profile.full_name}
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
              Scans enterprise ATS pipelines, validates deterministic constraints (tech stack, location, experience, salary), and generates ATS-tailored documents without hallucinations.
            </p>
          </div>
        </div>
      </div>

      {/* Autonomous Workflow Status Strip (Tags Only, Clean & Concise) */}
      <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#14171E] border border-[#1F2937] text-gray-300">
              <span className="text-gray-500 font-medium">Cadence:</span>
              <span className="font-semibold text-white">Every 4h</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#14171E] border border-[#1F2937] text-gray-300">
              <span className="text-gray-500 font-medium">Last Execution:</span>
              <span className="font-semibold text-gray-200">
                {workflow?.last_run
                  ? new Date(workflow.last_run).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '34m ago'}
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#14171E] border border-[#1F2937] text-emerald-400">
              <span className="text-gray-500 font-medium">Telegram Auto-Alerts:</span>
              <span className="font-semibold">Enabled (≥75%)</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#14171E] border border-[#1F2937] text-blue-400">
              <span className="text-gray-500 font-medium">Simultaneous UI Sync:</span>
              <span className="font-semibold">Live</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">
              Next scan: <span className="text-blue-400 font-semibold">{remainingTime}</span>
            </span>
            {onTriggerWorkflow && (
              <button
                onClick={onTriggerWorkflow}
                disabled={isWorkflowRunning}
                className="flex items-center gap-1.5 bg-[#1A1D23] hover:bg-[#252a33] text-gray-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#2D3139] transition cursor-pointer disabled:opacity-50"
              >
                {isWorkflowRunning ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Trigger Automation</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Funnel Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#0F1115] rounded-2xl p-4 sm:p-5 border border-[#1F2937] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">Total Scanned</span>
            <div className="w-8 h-8 rounded-lg bg-[#1A1D23] border border-[#2D3139] flex items-center justify-center text-gray-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-white">{jobs.length}</div>
          <p className="text-xs text-gray-500 mt-1">ATS & Custom Listings</p>
        </div>

        <div className="bg-[#0F1115] rounded-2xl p-4 sm:p-5 border border-[#1F2937] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">Viable Fit</span>
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-blue-400">
            {jobs.filter((j) => j.fit?.is_viable).length}
          </div>
          <p className="text-xs text-gray-500 mt-1">Passed Hard Constraints</p>
        </div>

        <div className="bg-[#0F1115] rounded-2xl p-4 sm:p-5 border border-[#1F2937] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">High Match (≥75%)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-emerald-400">
            {highFitJobs.length}
          </div>
          <p className="text-xs text-gray-500 mt-1">Ready for Application</p>
        </div>

        <div className="bg-[#0F1115] rounded-2xl p-4 sm:p-5 border border-[#1F2937] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">Telegram Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-indigo-400">
            {jobs.filter((j) => j.status === 'notified').length}
          </div>
          <p className="text-xs text-gray-500 mt-1">Dispatched to Bot</p>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-[#0F1115] rounded-2xl p-4 sm:p-5 border border-[#1F2937] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">Applied</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-purple-400">
            {jobs.filter((j) => j.status === 'applied').length}
          </div>
          <p className="text-xs text-gray-500 mt-1">Tracked In Pipeline</p>
        </div>
      </div>

      {/* Candidate Profile Summary & Target Spec */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-[#0F1115] rounded-2xl border border-[#1F2937] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white text-base flex items-center gap-2">
              <span>Candidate Specification</span>
            </h2>
            <button
              onClick={() => setActiveTab('profile')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Edit Profile</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 pt-2 text-sm border-t border-[#1F2937]">
            <div>
              <span className="text-xs text-gray-500 block">Candidate Name</span>
              <span className="font-semibold text-gray-200">{profile.full_name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-gray-500 block">Total Experience</span>
                <span className="font-semibold text-gray-200">{profile.total_years_experience} Years ({profile.seniority_tier})</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Expected Comp</span>
                <span className="font-semibold text-gray-200">
                  {profile.salary_expectation ? `₹${profile.salary_expectation.min_lpa} - ₹${profile.salary_expectation.max_lpa} LPA` : 'Open'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-500 block mb-1">Target Roles</span>
              <div className="flex flex-wrap gap-1.5">
                {(profile.target_roles || []).map((role, idx) => (
                  <span key={idx} className="text-xs bg-[#1A1D23] border border-[#2D3139] text-gray-300 px-2.5 py-0.5 rounded-full font-medium">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-500 block mb-1">Target Locations</span>
              <div className="flex flex-wrap gap-1.5">
                {(profile.preferred_locations || []).map((loc, idx) => (
                  <span key={idx} className="text-xs bg-blue-600/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md font-medium">
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-500 block mb-1">Core Tech Stack</span>
              <div className="flex flex-wrap gap-1">
                {(profile.skills || []).slice(0, 8).map((skill, idx) => (
                  <span key={idx} className="text-[11px] bg-[#1A1D23] border border-[#2D3139] text-gray-300 px-2 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
                {(profile.skills?.length || 0) > 8 && (
                  <span className="text-[11px] text-gray-500 py-0.5">+{profile.skills.length - 8} more</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Execution History Log */}
        <div className="lg:col-span-2 bg-[#0F1115] rounded-2xl border border-[#1F2937] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white text-base flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                <span>Workflow Execution History</span>
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20">
                  {workflow?.total_runs || 1} Total Runs
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Autonomous ATS scan logs, expired link checks, and Telegram notification dispatches
              </p>
            </div>
            {onTriggerWorkflow && (
              <button
                onClick={onTriggerWorkflow}
                disabled={isWorkflowRunning}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                {isWorkflowRunning ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3 text-amber-300" />
                    <span>Trigger Automation</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {(!workflow?.runs || workflow.runs.length === 0) ? (
              <div className="p-4 bg-[#14171E] rounded-xl border border-[#1F2937] text-xs text-gray-400">
                No execution history yet. Click "Trigger Automation" above to run the cycle now.
              </div>
            ) : (
              workflow.runs.map((run) => (
                <div
                  key={run.id}
                  className="p-3.5 bg-[#14171E] rounded-xl border border-[#1F2937] hover:border-[#2D3139] transition-all space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">
                        {run.trigger === 'scheduled_4h' ? 'Automated Cadence Run' : 'Manual Triggered Run'}
                      </span>
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${
                          run.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {run.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {new Date(run.completed_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-gray-300 text-xs leading-relaxed">{run.summary}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 pt-1 border-t border-[#1F2937] font-mono">
                    <span className="text-blue-400 font-semibold">+{run.new_jobs_found} fresh jobs</span>
                    <span className="text-emerald-400 font-semibold">{run.high_fit_count} high-fit matches</span>
                    <span className="text-indigo-400 font-semibold">{run.notified_count} Telegram alerts</span>
                    <span className="text-gray-500">Evaluated: {run.evaluated_count}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
