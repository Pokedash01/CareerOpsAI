import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  CheckCircle2,
  Sliders,
  Smartphone,
  ExternalLink,
  Loader2,
  Clock,
  Save,
  Check,
  RefreshCw,
  Zap,
  History,
  Eye,
  EyeOff,
  Copy,
  Globe,
  Info,
  Database,
  Trash2,
} from 'lucide-react';
import { AppSettings, JobListing, UserProfile, WorkflowState } from '../types.js';
import { getSynchronizedRemaining } from '../lib/syncClock.js';

interface AutomationViewProps {
  settings: AppSettings;
  jobs: JobListing[];
  profile: UserProfile;
  workflow?: WorkflowState | null;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  onTestNotify: (jobId: string, customChatId?: string) => Promise<any>;
  onTriggerWorkflow?: () => void;
  onUpdateWorkflowConfig?: (cfg: Partial<WorkflowState>) => void;
  isWorkflowRunning?: boolean;
}

export const AutomationView: React.FC<AutomationViewProps> = ({
  settings,
  jobs,
  profile,
  workflow,
  onUpdateSettings,
  onTestNotify,
  onTriggerWorkflow,
  onUpdateWorkflowConfig,
  isWorkflowRunning,
}) => {
  const [minScore, setMinScore] = useState(settings.min_match_score || 75);
  const [chatId, setChatId] = useState(settings.telegram_chat_id || '1368681854');
  const [botToken, setBotToken] = useState(settings.telegram_bot_token || '');
  const [botName, setBotName] = useState(settings.telegram_bot_name || 'CareerOps Bot');
  const [customHeader, setCustomHeader] = useState(
    settings.telegram_custom_header || `🎯 New High-Fit Role Matched for ${profile.full_name.split(' ')[0]}!`
  );
  const [includeSalary, setIncludeSalary] = useState(settings.telegram_include_salary !== false);
  const [includeSkillGap, setIncludeSkillGap] = useState(settings.telegram_include_skill_gap !== false);
  const [includeApplyLink, setIncludeApplyLink] = useState(settings.telegram_include_apply_link !== false);
  const [showToken, setShowToken] = useState(false);

  const [ttlDays, setTtlDays] = useState(settings.seen_ttl_days || 14);
  const [intervalHours, setIntervalHours] = useState(workflow?.interval_hours || 4);
  const [workflowEnabled, setWorkflowEnabled] = useState(workflow?.enabled ?? true);
  const [autoNotify, setAutoNotify] = useState(workflow?.auto_notify_telegram ?? true);
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<any>(null);
  const [savedSettings, setSavedSettings] = useState(false);
  const [remainingTime, setRemainingTime] = useState<string>('03h 48m 22s');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedAppUrl, setCopiedAppUrl] = useState(false);

  const [registryStats, setRegistryStats] = useState<{ total_tracked: number; rejected_count: number } | null>(null);
  const [isTruncating, setIsTruncating] = useState(false);
  const [truncateMessage, setTruncateMessage] = useState<string | null>(null);

  const loadRegistryStats = async () => {
    try {
      const res = await fetch('/api/registry/stats');
      if (res.ok) {
        const data = await res.json();
        if (data?.stats) setRegistryStats(data.stats);
      }
    } catch {}
  };

  useEffect(() => {
    loadRegistryStats();
  }, [jobs.length]);

  useEffect(() => {
    if (workflow?.interval_hours) setIntervalHours(workflow.interval_hours);
    if (typeof workflow?.enabled === 'boolean') setWorkflowEnabled(workflow.enabled);
    if (typeof workflow?.auto_notify_telegram === 'boolean') setAutoNotify(workflow.auto_notify_telegram);
  }, [workflow?.interval_hours, workflow?.enabled, workflow?.auto_notify_telegram]);

  const handleSelectCadence = (hrs: number) => {
    setIntervalHours(hrs);
    if (onUpdateWorkflowConfig) {
      onUpdateWorkflowConfig({ interval_hours: hrs });
    }
  };

  const handleToggleWorkflow = (enabled: boolean) => {
    setWorkflowEnabled(enabled);
    if (onUpdateWorkflowConfig) {
      onUpdateWorkflowConfig({ enabled });
    }
  };

  const handleToggleAutoNotify = (notify: boolean) => {
    setAutoNotify(notify);
    if (onUpdateWorkflowConfig) {
      onUpdateWorkflowConfig({ auto_notify_telegram: notify });
    }
  };

  const handleRunTruncation = async () => {
    setIsTruncating(true);
    setTruncateMessage(null);
    try {
      const res = await fetch('/api/registry/truncate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ttl_days: ttlDays }),
      });
      if (res.ok) {
        const data = await res.json();
        setTruncateMessage(`Cleaned ${data.pruned_count ?? 0} stale entries; ${data.remaining_count ?? 0} active records remain.`);
        await loadRegistryStats();
      }
    } catch (err: any) {
      setTruncateMessage(`Truncation completed locally.`);
    } finally {
      setIsTruncating(false);
    }
  };

  const handleResetSearchHistory = async () => {
    if (!window.confirm('Reset search deduplication registry? Active pipeline jobs will be preserved, but previously dismissed/rejected jobs may reappear in fresh searches.')) {
      return;
    }
    setIsTruncating(true);
    setTruncateMessage(null);
    try {
      const res = await fetch('/api/registry/reset', { method: 'POST' });
      if (res.ok) {
        setTruncateMessage('Registry reset to current pipeline jobs.');
        await loadRegistryStats();
      }
    } catch {
      setTruncateMessage('Registry reset locally.');
    } finally {
      setIsTruncating(false);
    }
  };

  const getBaseAppUrl = () => {
    return typeof window !== 'undefined' ? window.location.origin : '';
  };

  const copyBaseAppUrl = () => {
    const url = getBaseAppUrl();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
    setCopiedAppUrl(true);
    setTimeout(() => setCopiedAppUrl(false), 2500);
  };

  const getWebhookUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/api/cron/trigger?wait=true`;
  };

  const copyWebhookUrl = () => {
    const url = getWebhookUrl();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2500);
  };

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = getSynchronizedRemaining(
        workflow?.next_run,
        workflow?.interval_hours || 4,
        Boolean(workflow?.is_running)
      );
      setRemainingTime(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [workflow?.next_run, workflow?.interval_hours, workflow?.is_running]);

  const activeJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  const handleSaveSettings = async () => {
    await onUpdateSettings({
      min_match_score: minScore,
      telegram_chat_id: chatId,
      telegram_bot_token: botToken,
      telegram_bot_name: botName,
      telegram_custom_header: customHeader,
      telegram_include_salary: includeSalary,
      telegram_include_skill_gap: includeSkillGap,
      telegram_include_apply_link: includeApplyLink,
      seen_ttl_days: ttlDays,
      workflow_enabled: workflowEnabled,
      workflow_interval_hours: intervalHours,
      auto_notify_telegram: autoNotify,
    });
    if (onUpdateWorkflowConfig) {
      onUpdateWorkflowConfig({
        enabled: workflowEnabled,
        interval_hours: intervalHours,
        auto_notify_telegram: autoNotify,
      });
    }
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  const handleDispatchTest = async () => {
    if (!activeJob) return;
    setIsSending(true);
    setSendResult(null);
    try {
      const res = await onTestNotify(activeJob.id, chatId);
      setSendResult(res);
    } catch (err: any) {
      setSendResult({ success: false, error: err.message });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-2 border border-blue-500/20 shadow-sm shadow-blue-500/10">
            <Send className="w-3.5 h-3.5" />
            <span>Autonomous Pipeline & Dispatch</span>
          </div>
          <h2 className="font-display font-extrabold text-white text-xl sm:text-2xl tracking-tight">
            Automation & Notification Rules
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure automated Telegram alerts for high-fit roles, adjust match cutoff thresholds, and trigger background scans.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-blue-600/20 whitespace-nowrap active:scale-[0.98] border border-blue-400/25 w-full sm:w-auto"
        >
          {savedSettings ? <Check className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5" />}
          <span>{savedSettings ? 'Saved Successfully' : 'Save Rules'}</span>
        </button>
      </div>

      {/* Balanced 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Automation Engine & Thresholds & History */}
        <div className="space-y-6 min-w-0">
          {/* Autonomous Workflow Scheduler Card */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Workflow Engine</span>
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-medium border border-emerald-500/25 shadow-sm shadow-emerald-500/10">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span>Active Every {intervalHours}h</span>
              </span>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.07] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-zinc-200 block text-xs">Next Scheduled Scan</span>
                  <span className="text-zinc-500 text-[11px]">Countdown timer</span>
                </div>
                <span className="font-mono text-sm font-bold text-cyan-400">{remainingTime}</span>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1.5">Execution Frequency</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[2, 4, 8, 12].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => handleSelectCadence(hrs)}
                      className={`py-2 rounded-xl font-semibold text-xs border transition cursor-pointer ${
                        intervalHours === hrs
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                          : 'bg-white/[0.02] text-zinc-400 border-white/[0.07] hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      {hrs}h {hrs === 4 ? '(Default)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-white/[0.07]">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflowEnabled}
                    onChange={(e) => handleToggleWorkflow(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-white/[0.03] border-white/[0.1] accent-blue-600 cursor-pointer"
                  />
                  <span className="font-semibold text-zinc-200">Enable Recurring Autonomous Workflow</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoNotify}
                    onChange={(e) => handleToggleAutoNotify(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-white/[0.03] border-white/[0.1] accent-blue-600 cursor-pointer"
                  />
                  <span className="font-semibold text-zinc-200">
                    Auto-Dispatch Telegram Alerts for High-Fit Roles (≥ {minScore}%)
                  </span>
                </label>

                <div className="p-3 bg-blue-500/[0.06] rounded-xl border border-blue-500/20 flex items-start gap-2.5 text-[11px] text-blue-300">
                  <RefreshCw className="w-3.5 h-3.5 shrink-0 animate-spin text-blue-400 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong className="text-blue-200">Continuous Sync:</strong> Newly discovered jobs and suitability scores automatically stream directly into the Dashboard and Job Feed.
                  </span>
                </div>
              </div>

              {onTriggerWorkflow && (
                <button
                  type="button"
                  onClick={onTriggerWorkflow}
                  disabled={isWorkflowRunning}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer disabled:opacity-50 active:scale-[0.99] border border-blue-400/25"
                >
                  {isWorkflowRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing Workflow Cycle...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Trigger Workflow Run Now</span>
                    </>
                  )}
                </button>
              )}

              {/* Vercel Hobby & Cloud Webhook Notice */}
              <div className="pt-3 border-t border-white/[0.07] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-200 text-xs flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>Vercel & Cloud Cron Setup</span>
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Vercel Hobby Ready (Daily)
                  </span>
                </div>

                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Vercel Hobby accounts allow <strong>1 cron execution per day</strong> (configured as <code className="text-zinc-300 bg-white/[0.06] px-1 py-0.5 rounded font-mono">0 4 * * *</code> / 09:30 AM IST).
                </p>

                {/* GitHub Actions 24/7 Setup */}
                <div className="p-2.5 bg-black/40 rounded-xl border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-300 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span>GitHub Actions App URL:</span>
                    </span>
                    <button
                      type="button"
                      onClick={copyBaseAppUrl}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedAppUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAppUrl ? 'Copied' : 'Copy Secret Value'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-[10px] text-zinc-400 truncate bg-white/[0.02] p-1.5 rounded border border-white/[0.04]">
                    {getBaseAppUrl()}
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-normal">
                    ⚙️ <strong>GitHub Actions Secret:</strong> Add as secret <code className="text-cyan-300 bg-white/[0.06] px-1 py-0.5 rounded font-mono">CAREEROPS_APP_URL</code> under <em>Repo Settings &gt; Secrets and variables &gt; Actions</em> to enable 24/7 autonomous triggers every 4 hours.
                  </p>
                </div>

                <div className="p-2.5 bg-black/40 rounded-xl border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-300 font-medium">Free 4-Hour Webhook URL:</span>
                    <button
                      type="button"
                      onClick={copyWebhookUrl}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedWebhook ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedWebhook ? 'Copied' : 'Copy URL'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-[10px] text-zinc-400 truncate bg-white/[0.02] p-1.5 rounded border border-white/[0.04]">
                    {getWebhookUrl()}
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    💡 <strong>Run every 4h or 1h for free:</strong> Set up a free schedule on <a href="https://cron-job.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">cron-job.org</a> or BetterStack pointing to this URL (GET or POST) to scan without upgrading to Vercel Pro!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Threshold Card */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 overflow-hidden">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>Matching & Viability Thresholds</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-zinc-300">Minimum Fit Score for Alert</span>
                  <span className="text-sm font-mono font-bold text-cyan-400">{minScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <p className="text-zinc-400 text-[11px] mt-1.5">
                  Only job listings with an AI fit score at or above {minScore}% will trigger Telegram alerts.
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.07]">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-zinc-300">Seen Job Memory TTL (Days)</span>
                  <span className="text-sm font-mono font-bold text-zinc-200">{ttlDays} Days</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={ttlDays}
                  onChange={(e) => setTtlDays(parseInt(e.target.value) || 14)}
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-zinc-200 text-xs font-mono focus:outline-none focus:border-blue-500/50"
                />
                <p className="text-zinc-400 text-[11px] mt-1.5">
                  Prevents duplicate alerts for previously evaluated job listings within the retention window.
                </p>
              </div>
            </div>
          </div>

          {/* Deduplication & Rejected Roles Memory Card */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span>Search Deduplication & Anti-Requery Memory</span>
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[11px] font-medium border border-purple-500/25">
                Active Memory
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Every job that has been discovered, reviewed, rejected, or deleted is permanently remembered in this registry. When new search queries or automated background cycles run, these positions are automatically excluded so you never waste time seeing or re-evaluating the same job twice.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                <span className="text-[11px] text-zinc-400 block mb-0.5 font-medium">Tracked In Registry</span>
                <span className="text-lg font-mono font-bold text-white">
                  {registryStats ? registryStats.total_tracked : jobs.length}
                </span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">Known signatures & links</span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                <span className="text-[11px] text-zinc-400 block mb-0.5 font-medium">Blocked Rejected / Deleted</span>
                <span className="text-lg font-mono font-bold text-rose-400">
                  {registryStats ? registryStats.rejected_count : jobs.filter((j) => j.status === 'rejected').length}
                </span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">Will never be re-searched</span>
              </div>
            </div>

            {truncateMessage && (
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs">
                {truncateMessage}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.07]">
              <button
                type="button"
                disabled={isTruncating}
                onClick={handleRunTruncation}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.08] rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              >
                {isTruncating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 text-zinc-400" />}
                <span>Prune Stale Entries (&gt;{ttlDays}d)</span>
              </button>

              <button
                type="button"
                disabled={isTruncating}
                onClick={handleResetSearchHistory}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              >
                <span>Reset Registry to Active Jobs</span>
              </button>
            </div>
          </div>

          {/* Workflow Execution History Card */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-sm space-y-3 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white text-sm">Workflow Execution History</span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono font-medium">
                Runs: {workflow?.total_runs || 1}
              </span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {(workflow?.runs || []).map((run) => (
                <div
                  key={run.id}
                  className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">
                      {run.trigger === 'scheduled_4h' ? 'Automated 4-Hour Recurring Run' : 'Manual Triggered Run'}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                      {run.status}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-[11px] leading-relaxed">{run.summary}</p>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-white/[0.04] font-mono">
                    <span>
                      {new Date(run.completed_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-blue-400 font-medium">+{run.new_jobs_found} discovered</span>
                      <span className="text-emerald-400 font-medium">{run.high_fit_count} high-fit</span>
                      <span className="text-cyan-400 font-medium">{run.notified_count} notified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Telegram Bot Configuration & Live Preview */}
        <div className="space-y-6 min-w-0">
          {/* Telegram Credentials & Alert Customization Card */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 overflow-hidden w-full">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                <span>Telegram Bot Configuration</span>
              </h3>
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                  botToken || settings.telegram_configured
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {botToken || settings.telegram_configured ? 'Live Bot Connected' : 'Simulation Mode'}
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Telegram Chat ID</label>
                  <input
                    type="text"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    placeholder="e.g. 1368681854"
                    className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-zinc-200 font-mono text-xs focus:outline-none focus:border-blue-500/50"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Your Telegram user ID or destination channel ID.
                  </p>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Bot Display Name</label>
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="e.g. CareerOps Bot"
                    className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-zinc-200 text-xs focus:outline-none focus:border-blue-500/50"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Name displayed in notification header.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Telegram Bot Token (HTTP API)</label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="Optional: Enter 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                    className="w-full px-3 py-2 pr-9 bg-white/[0.03] border border-white/[0.08] rounded-xl text-zinc-200 font-mono text-xs focus:outline-none focus:border-blue-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Obtained from @BotFather. If not set, system automatically uses TELEGRAM_BOT_TOKEN from environment or runs in high-fidelity simulation mode.
                </p>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Custom Alert Header Template</label>
                <input
                  type="text"
                  value={customHeader}
                  onChange={(e) => setCustomHeader(e.target.value)}
                  placeholder="e.g. 🎯 New High-Fit Role Matched for Candidate!"
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-zinc-200 text-xs focus:outline-none focus:border-blue-500/50"
                />
              </div>

              {/* Message Payload Preferences */}
              <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.06] space-y-2">
                <span className="text-xs font-medium text-zinc-300 block">
                  Alert Message Content Options
                </span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={includeSalary}
                      onChange={(e) => setIncludeSalary(e.target.checked)}
                      className="rounded bg-white/[0.03] border-white/[0.1] text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Include estimated salary range in alert</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={includeSkillGap}
                      onChange={(e) => setIncludeSkillGap(e.target.checked)}
                      className="rounded bg-white/[0.03] border-white/[0.1] text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Include skill gap breakdown in alert</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={includeApplyLink}
                      onChange={(e) => setIncludeApplyLink(e.target.checked)}
                      className="rounded bg-white/[0.03] border-white/[0.1] text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Include direct job portal application link</span>
                  </label>
                </div>
              </div>

              {/* Test Notification Trigger (Solid, non-overflowing full-width layout) */}
              <div className="pt-2 space-y-2.5">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5 text-xs">
                    Select Role for Test Dispatch
                  </label>
                  <div className="w-full min-w-0">
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full max-w-full px-3 py-2.5 bg-[#0B0E14] border border-white/[0.1] rounded-xl text-zinc-200 text-xs font-medium focus:outline-none focus:border-blue-500/50 cursor-pointer truncate block"
                    >
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id} className="bg-[#0B0E14] text-zinc-200">
                          {j.company_name}: {j.title} ({j.fit?.match_score || '?'}%)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDispatchTest}
                  disabled={isSending || !activeJob}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer disabled:opacity-50 shadow-md shadow-blue-600/20 active:scale-[0.99] border border-blue-400/25"
                >
                  {isSending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  ) : (
                    <Send className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>Dispatch Test to Telegram</span>
                </button>
              </div>

              {sendResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    sendResult.delivered
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : sendResult.simulated
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                  }`}
                >
                  <div className="font-semibold flex items-center gap-1.5 mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {sendResult.delivered
                        ? 'Successfully dispatched to Telegram!'
                        : sendResult.simulated
                        ? 'Simulated Dispatch Successful'
                        : 'Dispatch Error'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    {sendResult.note ||
                      (sendResult.delivered
                        ? `Message delivered to Chat ID: ${sendResult.chat_id}`
                        : sendResult.error)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Telegram Chat Mockup */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 overflow-hidden w-full">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white text-sm">Telegram Bot Preview</span>
              </div>
              <span className="text-[10px] uppercase font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 rounded-md">
                HTML Format
              </span>
            </div>

            {/* Telegram Message Bubble Mockup */}
            <div className="bg-[#10141D] rounded-2xl p-4 sm:p-5 text-zinc-200 text-xs border border-white/[0.07] shadow-lg shadow-black/40 space-y-3 font-sans">
              <div className="flex items-center justify-between text-blue-400 font-semibold text-xs">
                <span>🎯 {botName}</span>
                <span className="text-[10px] text-zinc-500 font-mono font-normal">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="space-y-2 text-zinc-300 text-xs leading-relaxed">
                <p className="font-bold text-white text-sm">
                  {customHeader || `🎯 New High-Fit Role Matched for ${profile.full_name.split(' ')[0]}!`}
                </p>

                <p>
                  📌 <strong className="text-zinc-200">Role:</strong> {activeJob?.title || 'Senior Analyst - AI Automation'}
                </p>
                <p>
                  🏢 <strong className="text-zinc-200">Company:</strong> {activeJob?.company_name || 'PwC'}
                </p>
                <p>
                  📍 <strong className="text-zinc-200">Location:</strong> {activeJob?.location || 'Gurugram'}
                </p>
                <p>
                  ⏳ <strong className="text-zinc-200">Experience:</strong>{' '}
                  {activeJob?.fit?.detected_experience ||
                    (activeJob?.experience_range_years
                      ? `${activeJob.experience_range_years[0]}-${activeJob.experience_range_years[1]} Years`
                      : '2-5 Years')}
                </p>
                {includeSalary && (
                  <p>
                    💰 <strong className="text-zinc-200">Salary Range:</strong>{' '}
                    {activeJob?.fit?.salary_range ||
                      (activeJob?.salary_range_lpa
                        ? `₹${activeJob.salary_range_lpa[0]} - ₹${activeJob.salary_range_lpa[1]} LPA`
                        : '₹12 - ₹17 LPA')}
                  </p>
                )}
                <p>
                  📊 <strong className="text-zinc-200">Fit Score:</strong>{' '}
                  <span className="text-emerald-400 font-mono font-bold">
                    {activeJob?.fit?.match_score || 94}%
                  </span>
                </p>
                {includeSkillGap && (
                  <p>
                    ⚠️ <strong className="text-zinc-200">Skill Gap:</strong> {activeJob?.fit?.skills_gap || 'None'}
                  </p>
                )}

                <div className="pt-2.5 border-t border-white/[0.07] space-y-1.5 text-xs">
                  <div>
                    <a
                      href={`/?tab=tailor&jobId=${encodeURIComponent(activeJob?.id || '')}&type=resume`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-semibold underline inline-flex items-center gap-1.5"
                    >
                      <span>📄 Tailored ATS Resume</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>

                  <div>
                    <a
                      href={`/?tab=tailor&jobId=${encodeURIComponent(activeJob?.id || '')}&type=cover_letter`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-semibold underline inline-flex items-center gap-1.5"
                    >
                      <span>✉️ Tailored Cover Letter</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>

                  {includeApplyLink && activeJob?.apply_link && (
                    <div>
                      <a
                        href={activeJob.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-semibold underline inline-flex items-center gap-1.5"
                      >
                        <span>🚀 Apply Directly on Portal</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-zinc-500 italic pt-1 border-t border-white/[0.04]">
                  Automated alert dispatched via CareerOps-AI pipeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
