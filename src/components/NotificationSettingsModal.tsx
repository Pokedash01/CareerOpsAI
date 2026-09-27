import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Bell,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Shield,
  Sliders,
  DollarSign,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppSettings, UserAccount } from '../types.js';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => Promise<void> | void;
  currentUser?: UserAccount | null;
  isAdmin?: boolean;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentUser,
  isAdmin = false,
}) => {
  const [chatId, setChatId] = useState(settings.telegram_chat_id || '');
  const [botToken, setBotToken] = useState(settings.telegram_bot_token || '');
  const [includeSalary, setIncludeSalary] = useState(settings.telegram_include_salary !== false);
  const [includeSkillGap, setIncludeSkillGap] = useState(settings.telegram_include_skill_gap !== false);
  const [includeApplyLink, setIncludeApplyLink] = useState(settings.telegram_include_apply_link !== false);
  const [customHeader, setCustomHeader] = useState(settings.telegram_custom_header || '🎯 New High-Fit Role Matched!');
  const [minMatchScore, setMinMatchScore] = useState(settings.min_match_score || 75);

  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingStatus, setPingStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAdminSection, setShowAdminSection] = useState(false);

  // Sync state whenever settings change or modal opens
  useEffect(() => {
    if (isOpen) {
      setChatId(settings.telegram_chat_id || '');
      setBotToken(settings.telegram_bot_token || '');
      setIncludeSalary(settings.telegram_include_salary !== false);
      setIncludeSkillGap(settings.telegram_include_skill_gap !== false);
      setIncludeApplyLink(settings.telegram_include_apply_link !== false);
      setCustomHeader(settings.telegram_custom_header || '🎯 New High-Fit Role Matched!');
      setMinMatchScore(settings.min_match_score || 75);
      setPingStatus(null);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleTestPing = async () => {
    if (!chatId.trim()) {
      setPingStatus({ success: false, message: 'Please enter a numeric Telegram Chat ID first.' });
      return;
    }

    setIsTestingPing(true);
    setPingStatus(null);
    try {
      const res = await fetch('/api/telegram/test-ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId.trim(),
          full_name: currentUser?.name || currentUser?.full_name || 'Candidate',
          bot_token: botToken.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setPingStatus({
          success: true,
          message: data.muted_in_ai_studio
            ? 'Chat ID verified! (Alerts paused in AI Studio; live push notifications deliver from your Vercel deployment).'
            : 'Connection verified! Test alert sent to your Telegram.',
        });
      } else {
        setPingStatus({
          success: false,
          message: data?.hint || data?.error || 'Could not reach this Chat ID. Start @CareerOpsBot on Telegram first.',
        });
      }
    } catch (err: any) {
      setPingStatus({
        success: false,
        message: err.message || 'Network exception verifying Telegram chat.',
      });
    } finally {
      setIsTestingPing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateSettings({
        telegram_chat_id: chatId.trim(),
        telegram_configured: Boolean(chatId.trim()),
        telegram_include_salary: includeSalary,
        telegram_include_skill_gap: includeSkillGap,
        telegram_include_apply_link: includeApplyLink,
        telegram_custom_header: customHeader.trim(),
        min_match_score: minMatchScore,
        ...(isAdmin && botToken.trim() ? { telegram_bot_token: botToken.trim() } : {}),
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-[#0D1117] border border-white/[0.12] rounded-2xl shadow-2xl p-6 text-zinc-100 my-8 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-base">Alert & Notification Settings</h3>
                <p className="text-xs text-zinc-400">Customize what appears in your automated role notifications</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
            {/* Environment Status Banner */}
            <div className="p-3 bg-blue-500/[0.06] rounded-xl border border-blue-500/20 text-blue-300 text-[11px] leading-relaxed">
              <span className="font-semibold text-blue-200">Delivery Status:</span> Alerts in the AI Studio preview environment are muted. Live push alerts are dispatched directly to your Telegram from your Vercel deployment repository.
            </div>

            {/* Telegram Destination */}
            <div className="space-y-2">
              <label className="font-semibold text-zinc-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  <span>Telegram Chat ID</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-normal">Obtain from @userinfobot</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatId}
                  onChange={(e) => {
                    setChatId(e.target.value);
                    setPingStatus(null);
                  }}
                  placeholder="e.g. 1368681854"
                  className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-blue-500 text-xs"
                />
                <button
                  type="button"
                  onClick={handleTestPing}
                  disabled={isTestingPing || !chatId.trim()}
                  className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-blue-300 text-xs font-semibold rounded-xl border border-white/[0.08] transition flex items-center gap-1 disabled:opacity-40 cursor-pointer shrink-0"
                >
                  {isTestingPing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Test Ping</span>
                  )}
                </button>
              </div>

              {/* Ping feedback */}
              {pingStatus && (
                <div
                  className={`p-2.5 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
                    pingStatus.success
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {pingStatus.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                  )}
                  <span>{pingStatus.message}</span>
                </div>
              )}
            </div>

            {/* Alert Content Toggles */}
            <div className="space-y-3 pt-2 border-t border-white/[0.07]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                Message Content Customization
              </span>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">Include Expected Salary Range</span>
                  <span className="text-[11px] text-zinc-400">
                    Display posted CTC figures or predicted salary ranges in Lakhs Per Annum
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={includeSalary}
                  onChange={(e) => setIncludeSalary(e.target.checked)}
                  className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">Include ATS Skill Gap Analysis</span>
                  <span className="text-[11px] text-zinc-400">
                    List specific keywords or technical gaps identified by the qualification model
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={includeSkillGap}
                  onChange={(e) => setIncludeSkillGap(e.target.checked)}
                  className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">Include Direct Career Portal Apply Link</span>
                  <span className="text-[11px] text-zinc-400">
                    One-tap button to open the corporate requisition page on Greenhouse / Workday
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={includeApplyLink}
                  onChange={(e) => setIncludeApplyLink(e.target.checked)}
                  className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Match Threshold & Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300 block">
                  Alert Score Threshold
                </label>
                <select
                  value={minMatchScore}
                  onChange={(e) => setMinMatchScore(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                >
                  <option value={70} className="bg-[#121620] text-white">≥ 70% Match (Broad)</option>
                  <option value={75} className="bg-[#121620] text-white">≥ 75% Match (Recommended)</option>
                  <option value={80} className="bg-[#121620] text-white">≥ 80% Match (Strict)</option>
                  <option value={85} className="bg-[#121620] text-white">≥ 85% Match (High Precision)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300 block">
                  Custom Alert Header
                </label>
                <input
                  type="text"
                  value={customHeader}
                  onChange={(e) => setCustomHeader(e.target.value)}
                  placeholder="e.g. 🎯 New High-Fit Role Matched!"
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            {/* Optional Admin Controls */}
            {isAdmin && (
              <div className="pt-2 border-t border-white/[0.07]">
                <button
                  type="button"
                  onClick={() => setShowAdminSection((prev) => !prev)}
                  className="flex items-center justify-between w-full text-zinc-400 hover:text-white py-1 transition"
                >
                  <span className="flex items-center gap-1.5 font-semibold text-[11px] text-cyan-400">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Bot Credentials</span>
                  </span>
                  {showAdminSection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showAdminSection && (
                  <div className="mt-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <label className="text-[11px] font-semibold text-zinc-300 block">
                      Telegram Bot Token (from @BotFather)
                    </label>
                    <input
                      type="password"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                      placeholder="8624209195:AAGn..."
                      className="w-full px-3 py-2 bg-black/60 border border-white/[0.1] rounded-xl text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-semibold rounded-xl border border-white/[0.08] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/25 transition cursor-pointer border border-blue-400/25 flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
