import React, { useState, useEffect } from 'react';
import {
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Sparkles,
  Smartphone,
  ExternalLink,
  Loader2,
  Clock,
  Save,
  Check,
  RefreshCw,
  Zap,
  History,
  Bot,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-400 text-xs font-semibold mb-1 border border-blue-500/20">
            <Send className="w-3.5 h-3.5" />
            <span>Telegram Channel & Notification Rules</span>
          </div>
          <h2 className="font-semibold text-white text-xl tracking-tight">
            Pipeline Automation & Dispatch
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure automated Telegram alerts for high-fit roles and set match cutoff thresholds.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
        >
          {savedSettings ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{savedSettings ? 'Saved!' : 'Save Automation Rules'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Settings Configuration */}
        <div className="lg:col-span-6 space-y-6">
          {/* Autonomous Workflow Scheduler Card */}
          <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Workflow Engine</span>
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Active Every {intervalHours}h</span>
              </span>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="p-3 bg-[#14171E] rounded-xl border border-[#1F2937] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-200 block">Next Scheduled Run</span>
                  <span className="text-gray-500 text-[11px]">Countdown timer</span>
                </div>
                <span className="font-mono text-sm font-bold text-blue-400">{remainingTime}</span>
              </div>

              <div>
                <label className="font-medium text-gray-300 block mb-1.5">Execution Frequency (Hours)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 4, 8, 12].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setIntervalHours(hrs)}
                      className={`py-2 rounded-xl font-semibold text-xs border transition cursor-pointer ${
                        intervalHours === hrs
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                          : 'bg-[#14171E] text-gray-400 border-[#1F2937] hover:text-gray-200 hover:bg-[#1A1D23]'
                      }`}
                    >
                      {hrs} Hours {hrs === 4 ? '(Default)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#1F2937]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workflowEnabled}
                    onChange={(e) => setWorkflowEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-[#14171E] border-[#2D3139] accent-blue-600"
                  />
                  <span className="font-medium text-gray-200">Enable 4-Hour Recurring Autonomous Workflow</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoNotify}
                    onChange={(e) => setAutoNotify(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-[#14171E] border-[#2D3139] accent-blue-600"
                  />
                  <span className="font-medium text-gray-200">
                    Auto-Dispatch Telegram Alerts for High-Fit Roles (≥ {minScore}%)
                  </span>
                </label>

                <div className="p-2.5 bg-blue-950/20 rounded-xl border border-blue-500/20 flex items-center gap-2 text-[11px] text-blue-300">
                  <RefreshCw className="w-3.5 h-3.5 shrink-0 animate-spin text-blue-400" />
                  <span>
                    <b>Simultaneous Updates:</b> Newly discovered jobs and status evaluations stream directly into the Dashboard and Job Feed in real time.
                  </span>
                </div>
              </div>

              {onTriggerWorkflow && (
                <button
                  onClick={onTriggerWorkflow}
                  disabled={isWorkflowRunning}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer disabled:opacity-50"
                >
                  {isWorkflowRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Running Automation Cycle...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Trigger Automation</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Threshold Card */}
          <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>Matching & Viability Thresholds</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-medium text-gray-300">Minimum Fit Score for Alert</span>
                  <span className="text-sm font-semibold text-blue-400">{minScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <p className="text-gray-500 mt-1">
                  Only job listings with an AI fit score at or above {minScore}% will trigger Telegram alerts.
                </p>
              </div>

              <div className="pt-2 border-t border-[#1F2937]">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-medium text-gray-300">Seen Job Memory TTL (Days)</span>
                  <span className="text-sm font-semibold text-gray-200">{ttlDays} Days</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={ttlDays}
                  onChange={(e) => setTtlDays(parseInt(e.target.value) || 14)}
                  className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-gray-500 mt-1">
                  Prevents duplicate alerts for previously evaluated job listings within the retention window.
                </p>
              </div>
            </div>
          </div>

          {/* Telegram Credentials & Alert Customization Card */}
          <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                <span>Telegram Bot & Alert Settings</span>
              </h3>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  botToken || settings.telegram_configured
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {botToken || settings.telegram_configured ? 'Live Bot Mode' : 'Simulation Mode'}
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-medium mb-1">Telegram Chat ID</label>
                  <input
                    type="text"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    placeholder="e.g. 1368681854"
                    className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Your Telegram user ID or destination channel ID.
                  </p>
                </div>

                <div>
                  <label className="block text-gray-400 font-medium mb-1">Bot Display Name</label>
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="e.g. CareerOps Bot"
                    className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Name displayed in notification header.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-medium mb-1">Telegram Bot Token (HTTP API)</label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="Optional: Enter 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                    className="w-full px-3 py-2 pr-9 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-200 cursor-pointer"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Obtained from @BotFather. If not set, system automatically uses TELEGRAM_BOT_TOKEN from environment or runs in high-fidelity simulation mode.
                </p>
              </div>

              <div>
                <label className="block text-gray-400 font-medium mb-1">Custom Alert Header Template</label>
                <input
                  type="text"
                  value={customHeader}
                  onChange={(e) => setCustomHeader(e.target.value)}
                  placeholder="e.g. 🎯 New High-Fit Role Matched for Candidate!"
                  className="w-full px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              {/* Message Payload Preferences */}
              <div className="p-3 bg-[#14171E] rounded-xl border border-[#1F2937] space-y-2">
                <span className="text-xs font-semibold text-gray-300 block">
                  Alert Message Content Options
                </span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="checkbox"
                      checked={includeSalary}
                      onChange={(e) => setIncludeSalary(e.target.checked)}
                      className="rounded bg-[#1A1D23] border-[#2D3139] text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Include estimated salary range in alert</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="checkbox"
                      checked={includeSkillGap}
                      onChange={(e) => setIncludeSkillGap(e.target.checked)}
                      className="rounded bg-[#1A1D23] border-[#2D3139] text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Include skill gap breakdown in alert</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="checkbox"
                      checked={includeApplyLink}
                      onChange={(e) => setIncludeApplyLink(e.target.checked)}
                      className="rounded bg-[#1A1D23] border-[#2D3139] text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Include direct job portal application link</span>
                  </label>
                </div>
              </div>

              {/* Test Notification Trigger */}
              <div className="pt-2">
                <label className="block text-gray-400 font-medium mb-1.5">Select Role for Test Dispatch</label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-gray-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id} className="bg-[#1A1D23] text-gray-200">
                        {j.company_name}: {j.title} ({j.fit?.match_score || '?'}%)
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleDispatchTest}
                    disabled={isSending || !activeJob}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3.5 py-2 rounded-lg text-xs transition cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isSending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Dispatch Test</span>
                  </button>
                </div>
              </div>

              {sendResult && (
                <div
                  className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    sendResult.delivered
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                      : sendResult.simulated
                      ? 'bg-blue-950/30 border-blue-500/30 text-blue-300'
                      : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="font-semibold flex items-center gap-1.5 mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {sendResult.delivered
                        ? 'Successfully dispatched to Telegram!'
                        : sendResult.simulated
                        ? 'Simulated Dispatch Successful'
                        : 'Dispatch Error'}
                    </span>
                  </div>
                  <p className="text-[11px]">
                    {sendResult.note ||
                      (sendResult.delivered
                        ? `Message delivered to Chat ID: ${sendResult.chat_id}`
                        : sendResult.error)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Telegram Chat Mockup */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-5 text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-sm">Telegram Bot Preview</span>
              </div>
              <span className="text-[10px] uppercase font-semibold text-gray-400 bg-[#1A1D23] border border-[#2D3139] px-2 py-0.5 rounded">
                HTML Format
              </span>
            </div>

            {/* Telegram Message Bubble Mockup */}
            <div className="bg-[#141B23] rounded-xl p-4 text-gray-200 text-xs shadow-inner space-y-2.5 font-sans border border-[#1F2937] max-w-md mx-auto">
              <div className="flex items-center justify-between text-blue-400 font-semibold text-xs">
                <span>🎯 {botName}</span>
                <span className="text-[10px] text-gray-500 font-normal">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="space-y-1.5 text-gray-300 text-xs">
                <p className="font-semibold text-white text-sm">
                  {customHeader || `🎯 New High-Fit Role Matched for ${profile.full_name.split(' ')[0]}!`}
                </p>

                <p>
                  📌 <b className="text-gray-200">Role:</b> {activeJob?.title || 'Senior Analyst - AI Automation'}
                </p>
                <p>
                  🏢 <b className="text-gray-200">Company:</b> {activeJob?.company_name || 'PwC'}
                </p>
                <p>
                  📍 <b className="text-gray-200">Location:</b> {activeJob?.location || 'Gurugram'}
                </p>
                <p>
                  ⏳ <b className="text-gray-200">Experience Required:</b>{' '}
                  {activeJob?.fit?.detected_experience ||
                    (activeJob?.experience_range_years
                      ? `${activeJob.experience_range_years[0]}-${activeJob.experience_range_years[1]} Years`
                      : '2-5 Years')}
                </p>
                {includeSalary && (
                  <p>
                    💰 <b className="text-gray-200">Salary Range:</b>{' '}
                    {activeJob?.fit?.salary_range ||
                      (activeJob?.salary_range_lpa
                        ? `₹${activeJob.salary_range_lpa[0]} - ₹${activeJob.salary_range_lpa[1]} LPA`
                        : '₹12 - ₹17 LPA')}
                  </p>
                )}
                <p>
                  📊 <b className="text-gray-200">Fit Score:</b>{' '}
                  <span className="text-emerald-400 font-semibold">
                    {activeJob?.fit?.match_score || 94}%
                  </span>
                </p>
                {includeSkillGap && (
                  <p>
                    ⚠️ <b className="text-gray-200">Skill Gap:</b> {activeJob?.fit?.skills_gap || 'None'}
                  </p>
                )}

                <div className="pt-2 border-t border-[#1F2937] space-y-1">
                  {includeApplyLink && (
                    <a
                      href={activeJob?.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>🔗 Apply Directly on Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <p className="text-gray-400 text-[11px]">
                    📄 ATS Resume & Cover Letter ready for export
                  </p>
                </div>

                <p className="text-[10px] text-gray-500 italic pt-1">
                  Automated alert dispatched via CareerOps-AI pipeline.
                </p>
              </div>
            </div>
          </div>

          {/* Workflow Execution History Card */}
          <div className="bg-[#0F1115] rounded-2xl border border-[#1F2937] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white text-sm">Workflow Execution History</span>
              </div>
              <span className="text-[11px] text-gray-500 font-mono">
                Total Runs: {workflow?.total_runs || 1}
              </span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {(workflow?.runs || []).map((run) => (
                <div
                  key={run.id}
                  className="p-3 bg-[#14171E] rounded-xl border border-[#1F2937] space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">
                      {run.trigger === 'scheduled_4h' ? 'Automated 4-Hour Recurring Run' : 'Manual Triggered Run'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {run.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-400 text-[11px] leading-relaxed">{run.summary}</p>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-[#1F2937] font-mono">
                    <span>
                      {new Date(run.completed_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">+{run.new_jobs_found} discovered</span>
                      <span className="text-emerald-400">{run.high_fit_count} high-fit</span>
                      <span className="text-indigo-400">{run.notified_count} notified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
