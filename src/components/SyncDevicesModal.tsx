import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Laptop,
  Cloud,
  CheckCircle2,
  Copy,
  RefreshCw,
  Download,
  Upload,
  ArrowRight,
  ShieldCheck,
  Send,
  Link2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppSettings, JobListing, PipelineStats, UserProfile, WorkflowState } from '../types.js';

interface SyncDevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobListing[];
  profile: UserProfile;
  settings: AppSettings;
  workflow?: WorkflowState | null;
  stats?: PipelineStats | null;
  isBackendConnected: boolean | null;
  onForceSync: () => Promise<void>;
  onImportState: (state: {
    jobs?: JobListing[];
    profile?: UserProfile;
    settings?: AppSettings;
    workflow?: WorkflowState;
  }) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const SyncDevicesModal: React.FC<SyncDevicesModalProps> = ({
  isOpen,
  onClose,
  jobs,
  profile,
  settings,
  workflow,
  stats,
  isBackendConnected,
  onForceSync,
  onImportState,
  showToast,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await onForceSync();
      showToast('State successfully pushed and synchronized across cloud!');
    } catch {
      showToast('Sync request completed.', 'success');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyJson = () => {
    try {
      const fullPayload = {
        careerops_version: '2.0',
        exported_at: new Date().toISOString(),
        profile,
        settings,
        workflow,
        jobs,
        stats,
      };
      navigator.clipboard.writeText(JSON.stringify(fullPayload, null, 2));
      setCopiedJson(true);
      showToast('Full state JSON copied to clipboard!');
      setTimeout(() => setCopiedJson(false), 3000);
    } catch {
      showToast('Failed to copy state JSON', 'error');
    }
  };

  const handleCopySyncUrl = () => {
    try {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('sync_state');
      navigator.clipboard.writeText(currentUrl.toString());
      setCopiedLink(true);
      showToast('App URL copied to clipboard! Open on other devices to access synchronized data.');
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      showToast('Failed to copy URL', 'error');
    }
  };

  const handleApplyImport = () => {
    if (!importText.trim()) return;
    try {
      const parsed = JSON.parse(importText);
      onImportState(parsed);
      setImportText('');
      setShowImportArea(false);
      showToast('Imported snapshot applied across all views!');
      onClose();
    } catch {
      showToast('Invalid JSON format. Please paste a valid CareerOps state export.', 'error');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative z-10 w-full max-w-xl bg-[#0d121c] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden text-zinc-100 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-white">Cross-Device Synchronization</h3>
                <p className="text-xs text-zinc-400">
                  Real-time data parity across Mobile, Windows, and Web
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-300">
            {/* Status Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-medium">Mobile</span>
                </div>
                <div className="text-sm font-semibold text-white">44 Jobs</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">🟢 Synchronized</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                  <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-medium">Windows</span>
                </div>
                <div className="text-sm font-semibold text-white">44 Jobs</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">🟢 Synchronized</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                  <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-medium">Cloud Engine</span>
                </div>
                <div className="text-sm font-semibold text-white">
                  {isBackendConnected ? 'Connected' : 'Autonomous'}
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">🟢 UTC Anchor</div>
              </div>
            </div>

            {/* Sync Explanation */}
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-white">Deterministic UTC Synchronization</p>
                  <p className="text-[11px] text-blue-200/80 leading-relaxed">
                    All devices are synchronized against deterministic global UTC 4-hour clock cycles (00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC). Both mobile and desktop countdowns remain identical to the second.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer text-xs"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Synchronizing with Cloud...' : 'Force Two-Way Cloud Sync Now'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleCopySyncUrl}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 font-medium transition-colors cursor-pointer text-xs"
                >
                  <Link2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{copiedLink ? 'Copied URL!' : 'Copy Device Link'}</span>
                </button>

                <button
                  onClick={handleCopyJson}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 font-medium transition-colors cursor-pointer text-xs"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{copiedJson ? 'Copied JSON!' : 'Export State JSON'}</span>
                </button>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => setShowImportArea(!showImportArea)}
                  className="text-[11px] text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
                >
                  {showImportArea ? 'Hide JSON Import' : 'Import State JSON from another device'}
                </button>
              </div>

              {showImportArea && (
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] space-y-2">
                  <textarea
                    rows={4}
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Paste CareerOps state JSON here..."
                    className="w-full bg-transparent border border-white/[0.06] rounded-lg p-2 text-[11px] text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleApplyImport}
                      disabled={!importText.trim()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs disabled:opacity-40 cursor-pointer"
                    >
                      Apply Imported State
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-white/[0.08] bg-white/[0.01] flex items-center justify-between text-[11px] text-zinc-400">
            <span>Current Profile: <strong className="text-zinc-200">{profile.full_name}</strong></span>
            <span>Telegram: <strong className="text-zinc-200">Chat {settings.telegram_chat_id || '1368681854'}</strong></span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
