import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  Send,
  FileText,
  ExternalLink,
  Plus,
  Loader2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JobListing, UserProfile } from '../types.js';

interface JobFeedViewProps {
  jobs: JobListing[];
  profile: UserProfile;
  onEvaluateFit: (jobId: string) => Promise<void>;
  onSelectForTailoring: (job: JobListing) => void;
  onNotifyTelegram: (job: JobListing) => void;
  onUpdateStatus: (jobId: string, status: any) => Promise<void>;
  onOpenAddJob: () => void;
  onDiscoverJobs: () => void;
  isDiscovering: boolean;
  isEvaluatingId: string | null;
  onVerifyJobLink?: (jobId: string) => Promise<void>;
  onBatchVerifyLinks?: () => Promise<void>;
  onRemoveExpiredJobs?: () => Promise<void>;
  onDeleteJob?: (jobId: string) => Promise<void>;
}

export const JobFeedView: React.FC<JobFeedViewProps> = ({
  jobs,
  profile,
  onEvaluateFit,
  onSelectForTailoring,
  onNotifyTelegram,
  onUpdateStatus,
  onOpenAddJob,
  onDiscoverJobs,
  isDiscovering,
  isEvaluatingId,
  onRemoveExpiredJobs,
  onDeleteJob,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'discovered' | 'applied' | 'interviewing' | 'rejected' | 'all'>('discovered');
  const [expandedJdId, setExpandedJdId] = useState<string | null>(null);

  const expiredCount = jobs.filter(
    (j) => j.status === 'expired' || j.verification_status === 'expired_or_invalid' || j.company_name.toLowerCase().includes('state street')
  ).length;

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company_name.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q);

    if (!matchQuery) return false;

    if (statusFilter === 'discovered') {
      return (
        (job.status === 'discovered' ||
          job.status === 'new' ||
          job.status === 'viable' ||
          job.status === 'notified' ||
          !job.status) &&
        job.status !== 'expired' &&
        job.verification_status !== 'expired_or_invalid' &&
        !job.company_name.toLowerCase().includes('state street')
      );
    }
    if (statusFilter === 'applied') {
      return job.status === 'applied';
    }
    if (statusFilter === 'interviewing') {
      return job.status === 'interviewing';
    }
    if (statusFilter === 'rejected') {
      return job.status === 'rejected';
    }

    return true;
  });

  // Sort: keep active high fit at top, expired/rejected at bottom
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const aIsBad = a.status === 'expired' || a.verification_status === 'expired_or_invalid' || a.status === 'rejected';
    const bIsBad = b.status === 'expired' || b.verification_status === 'expired_or_invalid' || b.status === 'rejected';
    if (aIsBad && !bIsBad) return 1;
    if (!aIsBad && bIsBad) return -1;
    return (b.fit?.match_score || 0) - (a.fit?.match_score || 0);
  });

  const filterTabs = [
    {
      id: 'discovered',
      label: 'Discovered',
      count: jobs.filter((j) => (j.status === 'discovered' || j.status === 'new' || j.status === 'viable' || j.status === 'notified' || !j.status) && j.status !== 'expired' && j.verification_status !== 'expired_or_invalid' && !j.company_name.toLowerCase().includes('state street')).length,
      activeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'applied',
      label: 'Applied',
      count: jobs.filter((j) => j.status === 'applied').length,
      activeColor: 'bg-sky-600 text-white',
    },
    {
      id: 'interviewing',
      label: 'Interviewing',
      count: jobs.filter((j) => j.status === 'interviewing').length,
      activeColor: 'bg-amber-600 text-white',
    },
    {
      id: 'rejected',
      label: 'Rejected',
      count: jobs.filter((j) => j.status === 'rejected').length,
      activeColor: 'bg-rose-600 text-white',
    },
    {
      id: 'all',
      label: 'All',
      count: jobs.filter((j) => j.status !== 'expired' && j.verification_status !== 'expired_or_invalid' && !j.company_name.toLowerCase().includes('state street')).length,
      activeColor: 'bg-zinc-700 text-white',
    },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Search & Actions Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 glass-panel p-4 rounded-xl shadow-sm"
      >
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles, companies, tech stacks, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.14] text-zinc-100 placeholder-zinc-500 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/30 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.07] text-xs">
            {filterTabs.map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer text-xs ${
                    isActive
                      ? `${tab.activeColor} shadow-sm`
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="ml-1.5 opacity-80 text-[11px] font-mono font-medium">({tab.count})</span>
                </button>
              );
            })}
          </div>

          {/* Remove Expired button */}
          {expiredCount > 0 && onRemoveExpiredJobs && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onRemoveExpiredJobs()}
              title="Remove expired or closed jobs"
              className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold px-3 py-2 rounded-xl border border-rose-500/25 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clean Expired</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenAddJob}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer border border-blue-400/25"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Job</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Jobs List */}
      <div className="space-y-3.5">
        {sortedJobs.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 sm:p-16 text-center space-y-4 shadow-xl border border-white/[0.08] relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/20 via-indigo-500/10 to-purple-500/20 border border-blue-500/30 flex items-center justify-center mx-auto shadow-inner">
              <Briefcase className="w-8 h-8 text-blue-400" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-white text-base sm:text-lg">No matching job requisitions found</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Try clearing your search query, adjusting your filters, or launching an automated discovery sweep.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-blue-300 border border-blue-500/30 transition shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        ) : (
          sortedJobs.map((job, idx) => {
            const isEvaluating = isEvaluatingId === job.id;
            const score = job.fit?.match_score ?? null;
            const isViable = job.fit?.is_viable;
            const isExpanded = expandedJdId === job.id;
            const isExpired = job.status === 'expired' || job.verification_status === 'expired_or_invalid';

            const daysAgo = job.posted_days_ago ?? 0;
            const recencyLabel = daysAgo === 0 ? 'Today' : `${daysAgo}d ago`;

            const currentStatus =
              job.status === 'applied'
                ? 'applied'
                : job.status === 'interviewing'
                ? 'interviewing'
                : job.status === 'rejected'
                ? 'rejected'
                : isExpired
                ? 'expired'
                : 'discovered';

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                className={`glass-panel glass-panel-hover rounded-xl p-4 sm:p-5 space-y-3.5 ${
                  isExpired ? 'border-rose-900/30 bg-[#120B0E]/60' : ''
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display font-bold text-white text-base tracking-tight leading-snug">
                        {job.title}
                      </h3>
                      
                      {/* ATS Source Tag */}
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                        {job.ats_source}
                      </span>

                      {/* Recency Tag */}
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/[0.03] text-zinc-400 border border-white/[0.06]">
                        <Clock className="w-2.5 h-2.5 text-zinc-500" />
                        <span>{recencyLabel}</span>
                      </span>

                      {/* Expired Tag */}
                      {isExpired && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>Expired</span>
                        </span>
                      )}
                    </div>

                    {/* Meta Row: Company, Location, Experience, Salary */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-400 pt-0.5">
                      <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        {job.company_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        {job.location}
                      </span>

                      {job.experience_range_years && (
                        <span className="flex items-center gap-1 text-zinc-300 font-mono text-[11px]">
                          <Clock className="w-3 h-3 text-blue-400" />
                          <span>{job.experience_range_years[0]}-{job.experience_range_years[1]} Yrs</span>
                          {job.experience_is_inferred ? (
                            <span
                              title={job.experience_inferred_reason || 'Inferred from role seniority'}
                              className="text-[10px] text-zinc-500 font-sans cursor-help ml-0.5"
                            >
                              (Inferred)
                            </span>
                          ) : (
                            <span
                              title={job.experience_inferred_reason || 'Exact requirement extracted from Job Description'}
                              className="text-[10px] text-blue-400/90 font-sans ml-0.5"
                            >
                              (Exact)
                            </span>
                          )}
                        </span>
                      )}

                      {job.salary_range_lpa ? (
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span className="flex items-center gap-1 font-bold text-emerald-400">
                            <DollarSign className="w-3 h-3 text-emerald-400" />
                            <span>₹{job.salary_range_lpa[0]} - ₹{job.salary_range_lpa[1]} LPA</span>
                          </span>
                          {job.salary_is_estimated ? (
                            <span
                              title={job.salary_source || 'Market benchmark based on AmbitionBox & Glassdoor'}
                              className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 cursor-help"
                            >
                              Estimated
                            </span>
                          ) : (
                            <span
                              title="Stated directly in job requisition"
                              className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            >
                              Stated in JD
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.03] text-zinc-400 border border-white/[0.06]">
                          Salary Undisclosed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Match Score Indicator (Circular Ring) */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    {job.fit ? (
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/[0.08]" />
                          <circle
                            cx="18"
                            cy="18"
                            r="15.915"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeDasharray={`${score || 0}, 100`}
                            strokeLinecap="round"
                            className={
                              (score || 0) >= 75
                                ? 'text-emerald-400'
                                : (score || 0) >= 50
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xs font-bold font-mono text-white leading-none">{score}%</span>
                          <span className="text-[7px] font-semibold uppercase text-zinc-400 mt-0.5">
                            {isViable ? 'Fit' : 'Off'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onEvaluateFit(job.id)}
                        disabled={isEvaluating}
                        className="flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-lg border border-white/[0.08] transition cursor-pointer"
                      >
                        {isEvaluating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span>{isEvaluating ? 'Evaluating...' : 'Evaluate Fit'}</span>
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Collapsible JD Excerpt */}
                <div>
                  <button
                    onClick={() => setExpandedJdId(isExpanded ? null : job.id)}
                    className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Description' : 'View Job Description'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2.5 p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.06] text-xs text-zinc-300 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto">
                          {job.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-white/[0.07]">
                  {/* Left: Status dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      value={currentStatus}
                      onChange={(e) => onUpdateStatus(job.id, e.target.value)}
                      className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border transition cursor-pointer focus:outline-none ${
                        currentStatus === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                          : currentStatus === 'interviewing'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                          : currentStatus === 'applied'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30 hover:bg-sky-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20'
                      }`}
                    >
                      <option value="discovered" className="bg-[#12151D] text-zinc-200">Discovered</option>
                      <option value="applied" className="bg-[#12151D] text-zinc-200">Applied</option>
                      <option value="interviewing" className="bg-[#12151D] text-zinc-200">Interviewing</option>
                      <option value="rejected" className="bg-[#12151D] text-zinc-200">Rejected</option>
                    </select>

                    {isExpired && onDeleteJob && (
                      <button
                        onClick={() => onDeleteJob(job.id)}
                        title="Remove expired job"
                        className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Right side: Telegram alert, Documents, Apply */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onNotifyTelegram(job)}
                      title="Send Telegram Alert"
                      aria-label="Send Telegram Alert"
                      className="flex items-center justify-center w-8 h-8 bg-white/[0.03] hover:bg-white/[0.08] text-blue-400 hover:text-blue-300 rounded-lg transition cursor-pointer border border-white/[0.08]"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectForTailoring(job)}
                      className="flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition border border-white/[0.08] cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>Documents</span>
                    </motion.button>

                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={job.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition shadow-md shadow-emerald-600/20 cursor-pointer border border-emerald-400/30"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3 h-3" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

