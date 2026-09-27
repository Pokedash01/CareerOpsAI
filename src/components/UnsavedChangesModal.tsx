import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Save, Trash2, X } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onSaveAndContinue: () => void;
  onDiscardAndContinue: () => void;
  onCancel: () => void;
  targetTabName?: string;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onSaveAndContinue,
  onDiscardAndContinue,
  onCancel,
  targetTabName = 'the next section',
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-md bg-[#0e131f] border border-amber-500/30 rounded-2xl shadow-2xl p-6 space-y-4 ring-1 ring-amber-500/20"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base">
                Unsaved Profile Changes
              </h3>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                You have modified your candidate profile in draft mode. Leaving for <strong className="text-white capitalize">{targetTabName}</strong> without saving will discard these recent edits.
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-400 bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
            Would you like to save your profile changes to your database account before switching, or discard them?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-xl transition cursor-pointer border border-white/[0.08]"
            >
              Keep Editing
            </button>

            <button
              type="button"
              onClick={onDiscardAndContinue}
              className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition cursor-pointer border border-rose-500/25"
            >
              Discard & Leave
            </button>

            <button
              type="button"
              onClick={onSaveAndContinue}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-xl transition shadow-md shadow-emerald-600/20 cursor-pointer border border-emerald-400/25 flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Continue</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
