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
} from 'lucide-react';
import { AppSettings, JobListing, UserProfile, WorkflowState } from '../types.js';

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
                      onClick={() => setIntervalHours(hrs)}
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
                    onChange={(e) => setWorkflowEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-white/[0.03] border-white/[0.1] accent-blue-600 cursor-pointer"
                  />
                  <span className="font-semibold text-zinc-200">Enable Recurring Autonomous Workflow</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoNotify}
                    onChange={(e) => setAutoNotify(e.target.checked)}
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
