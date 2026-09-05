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
  ShieldCheck,
  Info,
} from 'lucide-react';
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
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'high_fit' | 'viable' | 'fresh' | 'rejected' | 'applied'>('all');
  const [expandedJdId, setExpandedJdId] = useState<string | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company_name.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q);

    if (!matchQuery) return false;

    if (statusFilter === 'high_fit') {
      return (job.fit?.match_score || 0) >= 75;
    }
    if (statusFilter === 'viable') {
      return job.fit?.is_viable === true;
    }
    if (statusFilter === 'fresh') {
      return (job.posted_days_ago ?? 0) <= 3;
    }
    if (statusFilter === 'benchmarked') {
      return Boolean(job.salary_is_estimated || job.salary_search_query);
    }
    if (statusFilter === 'verified') {
      return job.verification_status === 'verified_active' || job.verification_status === 'active_portal';
    }
    if (statusFilter === 'rejected') {
      return job.fit?.is_viable === false || job.status === 'rejected';
    }
    if (statusFilter === 'applied') {
      return job.status === 'applied';
    }

    return true;
  });

  // Keep rejected / non-viable jobs at the bottom
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const aIsRejected = a.fit?.is_viable === false || a.status === 'rejected';
    const bIsRejected = b.fit?.is_viable === false || b.status === 'rejected';
    if (aIsRejected && !bIsRejected) return 1;
    if (!aIsRejected && bIsRejected) return -1;
    return (b.fit?.match_score || 0) - (a.fit?.match_score || 0);
  });

  return (
    <div className="space-y-6">
      {/* Search & Actions Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0F1115] p-4 sm:p-5 rounded-2xl border border-[#1F2937] shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles, companies, tech stacks, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1A1D23] border border-[#2D3139] text-[#E5E7EB] placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter buttons */}
          <div className="flex flex-wrap items-center gap-1 bg-[#0A0B0E] p-1 rounded-xl border border-[#1F2937] text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D23]'
              }`}
            >
              All ({jobs.length})
            </button>
            <button
              onClick={() => setStatusFilter('fresh')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'fresh'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'text-gray-400 hover:text-emerald-400 hover:bg-[#1A1D23]'
              }`}
            >
              Fresh (≤3d)
            </button>
            <button
              onClick={() => setStatusFilter('high_fit')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'high_fit'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-emerald-400 hover:bg-[#1A1D23]'
              }`}
            >
              High Fit ({jobs.filter((j) => (j.fit?.match_score || 0) >= 75).length})
            </button>
            <button
              onClick={() => setStatusFilter('viable')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'viable'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-blue-400 hover:bg-[#1A1D23]'
              }`}
            >
              Viable
            </button>
            <button
              onClick={() => setStatusFilter('applied')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'applied'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-gray-400 hover:text-purple-400 hover:bg-[#1A1D23]'
              }`}
            >
              Applied
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'rejected'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-gray-400 hover:text-rose-400 hover:bg-[#1A1D23]'
              }`}
            >
              Rejected
            </button>
          </div>

          <button
            onClick={onOpenAddJob}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Job / JD</span>
          </button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {sortedJobs.length === 0 ? (
          <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-12 text-center space-y-3 shadow-sm">
            <Briefcase className="w-10 h-10 text-gray-600 mx-auto" />
            <h3 className="font-semibold text-white text-base">No matching job listings found</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Try modifying your search keywords or clearing status filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer pt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          sortedJobs.map((job) => {
            const isEvaluating = isEvaluatingId === job.id;
            const score = job.fit?.match_score ?? null;
            const isViable = job.fit?.is_viable;
            const isExpanded = expandedJdId === job.id;

            // Recency computation
            const daysAgo = job.posted_days_ago ?? 0;
            const recencyLabel = daysAgo === 0 ? 'Posted Today' : `Posted ${daysAgo}d ago`;

            return (
              <div
                key={job.id}
                className="bg-[#0F1115] rounded-2xl border border-[#1F2937] hover:border-[#2D3139] transition-all p-5 shadow-sm space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white text-base">{job.title}</h3>
                      
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1A1D23] text-gray-400 border border-[#2D3139]">
                        {job.ats_source}
                      </span>

                      {/* Recency Badge (< 3 Days) */}
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{recencyLabel}</span>
                      </span>

                      {/* Direct Posting Badge */}
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>Direct ATS Requisition</span>
                      </span>

                      {job.status === 'applied' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
                          Applied
                        </span>
                      )}
                      {job.status === 'notified' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                          Notified via Telegram
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400 pt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-gray-200">
                        <Building2 className="w-3.5 h-3.5 text-gray-500" />
                        {job.company_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        {job.location}
                      </span>

                      {/* Experience with Inferred Provenance */}
                      {job.experience_range_years && (
                        <div className="flex items-center gap-1.5">
                          <span className="flex items-center gap-1 text-gray-200">
                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                            <span>{job.experience_range_years[0]}-{job.experience_range_years[1]} Yrs</span>
                          </span>
                          {job.experience_is_inferred ? (
                            <span
                              title={job.experience_inferred_reason || 'Omitted in JD; auto-inferred from role title seniority'}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 cursor-help"
                            >
                              <Info className="w-2.5 h-2.5" />
                              <span>Inferred Seniority</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#1A1D23] text-gray-400 border border-[#2D3139]">
                              In JD
                            </span>
                          )}
                        </div>
                      )}

                      {/* Salary with Benchmark Provenance */}
                      {job.salary_range_lpa && (
                        <div className="flex items-center gap-1.5">
                          <span className="flex items-center gap-1 font-semibold text-emerald-400">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                            <span>₹{job.salary_range_lpa[0]} - ₹{job.salary_range_lpa[1]} LPA</span>
                          </span>
                          {job.salary_is_estimated ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              <span>AmbitionBox & Glassdoor Est.</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              In JD
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Match Score Indicator */}
                  <div className="flex items-center gap-3 shrink-0">
                    {job.fit ? (
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 font-bold text-base bg-[#1A1D23] ${
                            score! >= 75
                              ? 'text-emerald-400 border-[#1F2937]'
                              : score! >= 50
                              ? 'text-amber-400 border-[#1F2937]'
                              : 'text-rose-400 border-[#1F2937]'
                          }`}
                        >
                          <span>{score}%</span>
                          <span className="text-[8px] font-medium uppercase tracking-widest text-gray-500 -mt-0.5">
                            {isViable ? 'Viable' : 'Filtered'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => onEvaluateFit(job.id)}
                        disabled={isEvaluating}
                        className="flex items-center gap-1.5 bg-[#1A1D23] hover:bg-[#252a33] text-gray-300 text-xs font-semibold px-3 py-2 rounded-xl border border-[#2D3139] transition cursor-pointer"
                      >
                        {isEvaluating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span>{isEvaluating ? 'Evaluating...' : 'Evaluate Fit'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Collapsible JD Excerpt */}
                <div>
                  <button
                    onClick={() => setExpandedJdId(isExpanded ? null : job.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-300 transition cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Job Description' : 'View Full Job Description'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-4 bg-[#14171E] rounded-xl border border-[#1F2937] text-xs text-gray-300 whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto">
                      {job.description}
                    </div>
                  )}
                </div>

                {/* Bottom Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1F2937]">
                  <div className="flex items-center gap-2.5">
                    <a
                      href={job.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      <span>Direct Portal Apply</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <span className="text-gray-700">|</span>

                    {/* Status Toggle */}
                    <select
                      value={job.status}
                      onChange={(e) => onUpdateStatus(job.id, e.target.value)}
                      className="text-xs bg-[#1A1D23] border border-[#2D3139] rounded-lg px-2 py-1 text-gray-300 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="new">Status: Discovered</option>
                      <option value="viable">Status: Viable</option>
                      <option value="notified">Status: Notified</option>
                      <option value="applied">Status: Applied</option>
                      <option value="interviewing">Status: Interviewing</option>
                      <option value="rejected">Status: Rejected</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNotifyTelegram(job)}
                      className="flex items-center gap-1 bg-[#1A1D23] hover:bg-[#252a33] text-gray-300 hover:text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer border border-[#2D3139]"
                    >
                      <Send className="w-3.5 h-3.5 text-blue-400" />
                      <span>Telegram Alert</span>
                    </button>

                    <button
                      onClick={() => onSelectForTailoring(job)}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition shadow-sm cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>ATS Document Studio</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

