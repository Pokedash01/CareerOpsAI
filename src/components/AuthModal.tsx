import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  LogIn,
  UserPlus,
  ArrowRight,
  Laptop,
  CheckCircle2,
  X,
  Sparkles,
  AlertCircle,
  KeyRound,
  Briefcase,
  Users,
  Send,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { UserAccount, SavedDeviceAccount } from '../types.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentUser: UserAccount | null;
  savedAccounts: SavedDeviceAccount[];
  onLogin: (email: string, pass: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  onRegister: (email: string, pass: string, fullName: string, headline?: string, telegramChatId?: string) => Promise<{ success: boolean; error?: string }>;
  onDemoLogin: (email?: string) => Promise<{ success: boolean; error?: string }>;
  onQuickSwitch: (accountId: string) => Promise<{ success: boolean; error?: string }>;
  onLogout: () => Promise<void>;
  requireAuthToDismiss?: boolean;
  initialTab?: 'login' | 'register' | 'saved';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  savedAccounts,
  onLogin,
  onRegister,
  onDemoLogin,
  onQuickSwitch,
  onLogout,
  requireAuthToDismiss = false,
  initialTab = 'login',
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'saved'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [skipTelegram, setSkipTelegram] = useState(false);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingStatus, setPingStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleTestTelegramPing = async () => {
    if (!telegramChatId.trim()) {
      setPingStatus({ success: false, message: 'Please enter a Telegram Chat ID first.' });
      return;
    }
    setIsTestingPing(true);
    setPingStatus(null);
    try {
      const res = await fetch('/api/telegram/test-ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId.trim(),
          full_name: fullName.trim() || 'Candidate',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPingStatus({
          success: true,
          message: '✅ Verified! Test alert dispatched to your Telegram app.',
        });
      } else {
        setPingStatus({
          success: false,
          message: data.hint || data.error || 'Could not reach this Chat ID. Open @CareerOpsBot and tap /start.',
        });
      }
    } catch (err: any) {
      setPingStatus({ success: false, message: err.message || 'Error connecting to Telegram.' });
    } finally {
      setIsTestingPing(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await onLogin(email, password, rememberMe);
      if (res.success) {
        setSuccessMessage('Successfully signed in! Your workspace is ready.');
        setTimeout(() => {
          if (onClose) onClose();
        }, 600);
      } else {
        setErrorMessage(res.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!fullName || !email || !password) {
      setErrorMessage('Please provide your full name, email, and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    try {
      const cleanTelegramId = skipTelegram ? undefined : telegramChatId.trim();
      const res = await onRegister(email, password, fullName, headline, cleanTelegramId);
      if (res.success) {
        setSuccessMessage('Account created! Your dedicated partition and Telegram sync are initialized.');
        setTimeout(() => {
          if (onClose) onClose();
        }, 700);
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async (targetEmail = 'kb270102@gmail.com') => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const res = await onDemoLogin(targetEmail);
      if (res.success) {
        setSuccessMessage('Signed in as verified workspace user!');
        setTimeout(() => {
          if (onClose) onClose();
        }, 600);
      } else {
        setErrorMessage(res.error || 'Failed to initialize demo session.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-[#0D1117] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden text-zinc-100"
      >
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
                User Access & Workspace Partitioning
              </h2>
              <p className="text-xs text-zinc-400">
                Persistent authentication via encrypted HTTP cookies & device session
              </p>
            </div>
          </div>
          {!requireAuthToDismiss && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Current User Pill if already signed in */}
        {currentUser && (() => {
          const displayName = (currentUser.name || currentUser.full_name || currentUser.email?.split('@')[0] || 'User').trim();
          const initials = (displayName.length >= 2 ? displayName.slice(0, 2) : displayName || 'US').toUpperCase();

          return (
            <div className="mx-6 mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{displayName}</p>
                  <p className="text-[11px] text-zinc-400">{currentUser.email}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
              >
                Sign Out
              </button>
            </div>
          );
        })()}

        {/* Tab Switcher */}
        <div className="flex px-6 pt-4 gap-2 border-b border-white/[0.06]">
          <button
            onClick={() => {
              setTab('login');
              setErrorMessage(null);
            }}
            className={`pb-2.5 text-xs font-semibold transition-colors relative ${
              tab === 'login' ? 'text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
            {tab === 'login' && (
              <motion.div
                layoutId="authTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              />
            )}
          </button>
          <button
            onClick={() => {
              setTab('register');
              setErrorMessage(null);
            }}
            className={`pb-2.5 text-xs font-semibold transition-colors relative ${
              tab === 'register' ? 'text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Create New Account
            {tab === 'register' && (
              <motion.div
                layoutId="authTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              />
            )}
          </button>
          {savedAccounts.length > 0 && (
            <button
              onClick={() => {
                setTab('saved');
                setErrorMessage(null);
              }}
              className={`pb-2.5 text-xs font-semibold transition-colors relative flex items-center gap-1.5 ${
                tab === 'saved' ? 'text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              Saved on Device ({savedAccounts.length})
              {tab === 'saved' && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </button>
          )}
        </div>

        {/* Error / Success Banners */}
        <div className="px-6 pt-4">
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3 mb-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3 mb-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tab 1: Sign In */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 pt-2 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@domain.com or kb270102@gmail.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your workspace password"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-black/40 border border-white/[0.2] text-blue-500 focus:ring-0 cursor-pointer"
                />
                <span>Remember me on this device (90-day cookies)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>Signing in...</>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In to Workspace
                </>
              )}
            </button>

            {/* Quick 1-click Demo credentials */}
            <div className="pt-2 border-t border-white/[0.06]">
              <p className="text-[11px] text-zinc-400 mb-2 text-center">
                Quick Access for Verified Workspace:
              </p>
              <button
                type="button"
                onClick={() => handleDemoSignIn('kb270102@gmail.com')}
                disabled={isLoading}
                className="w-full py-2 px-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-zinc-200 rounded-xl transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                    KB
                  </div>
                  <span>Kartik (kb270102@gmail.com)</span>
                </div>
                <span className="text-[10px] text-blue-400 flex items-center gap-1 font-semibold">
                  1-Click Sign In <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Create Account */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 pt-2 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Target Role / Headline (Optional)
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Automation Engineer / Data Analyst"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Telegram Instant Alerts Zero-Setup Card */}
            <div className="p-3.5 bg-gradient-to-br from-emerald-950/20 via-white/[0.02] to-transparent rounded-xl border border-emerald-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sync Telegram Push Alerts</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                  Shared Bot Ready
                </span>
              </div>

              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Receive instant notifications when high-fit jobs (&ge;75%) are discovered. No bot creation or API keys required—just enter your personal Chat ID.
              </p>

              {!skipTelegram ? (
                <div className="space-y-2 pt-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={telegramChatId}
                      onChange={(e) => {
                        setTelegramChatId(e.target.value);
                        setPingStatus(null);
                      }}
                      placeholder="Telegram Chat ID (e.g. 1368681854)"
                      className="flex-1 px-3 py-2 text-xs bg-black/50 border border-emerald-500/30 rounded-xl text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleTestTelegramPing}
                      disabled={isTestingPing || !telegramChatId.trim()}
                      className="px-3 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-500/30 transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shrink-0"
                    >
                      {isTestingPing ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Test Ping</span>
                    </button>
                  </div>

                  {pingStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-[11px] p-2 rounded-lg border flex items-start gap-1.5 ${
                        pingStatus.success
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}
                    >
                      <span>{pingStatus.message}</span>
                    </motion.div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-zinc-400 pt-0.5">
                    <a
                      href="https://t.me/userinfobot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Get my ID via @userinfobot</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <span>•</span>
                    <a
                      href="https://t.me/CareerOpsBot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Start @CareerOpsBot</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ) : null}

              <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-zinc-400 pt-1">
                <input
                  type="checkbox"
                  checked={skipTelegram}
                  onChange={(e) => setSkipTelegram(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-black/40 border border-white/[0.2] text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span>Skip for now (I will configure Telegram later in Settings)</span>
              </label>
            </div>

            <p className="text-[11px] text-zinc-400">
              Creating an account provisions an isolated personal partition for your jobs, tailored resumes, and settings. Credentials and persistent sessions are saved directly on this device via cookies.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>Provisioning Workspace...</>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create My Personal Workspace
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 3: Saved Accounts on This Device (Facebook-style account selector) */}
        {tab === 'saved' && (
          <div className="p-6 pt-2 space-y-3">
            <p className="text-xs text-zinc-400">
              Accounts recognized on this device. Click any account to restore your partition or re-authenticate instantly:
            </p>

            <div className="space-y-2">
              {savedAccounts.map((account) => {
                const isCurrent = currentUser?.id === account.id;
                const accName = (account.name || account.full_name || account.email?.split('@')[0] || 'User').trim();
                const accInitials = (accName.length >= 2 ? accName.slice(0, 2) : accName || 'US').toUpperCase();

                return (
                  <div
                    key={account.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'bg-blue-600/15 border-blue-500/40'
                        : 'bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                        {accInitials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-white">{accName}</p>
                          {isCurrent && (
                            <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-400/30 px-1.5 py-0.2 rounded font-medium">
                              Active Now
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400">{account.email}</p>
                        <p className="text-[10px] text-zinc-500">
                          Last active: {new Date(account.last_active_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isCurrent ? (
                        <button
                          onClick={onLogout}
                          className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
                        >
                          Sign Out
                        </button>
                      ) : (
                        <button
                          onClick={() => onQuickSwitch(account.id)}
                          disabled={isLoading}
                          className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          Switch <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setTab('login')}
                className="w-full py-2 text-xs text-zinc-400 hover:text-white text-center transition-colors"
              >
                Sign in with a different account &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Security & Device Storage Footer */}
        <div className="p-4 bg-black/50 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-400" />
            End-to-end device cookie encryption
          </span>
          <span>Zero external Firebase reliance</span>
        </div>
      </motion.div>
    </div>
  );
};
