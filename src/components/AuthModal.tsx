import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  LogIn,
  ArrowRight,
  CheckCircle2,
  X,
  AlertCircle,
  Briefcase,
  Send,
  ExternalLink,
  RefreshCw,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Plus,
  Target,
  BadgeCheck,
  Sparkles,
  Award,
  DollarSign,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserAccount } from '../types.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentUser: UserAccount | null;
  savedAccounts?: any[];
  onLogin: (email: string, pass: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  onRegister: (
    email: string,
    pass: string,
    fullName: string,
    headline?: string,
    telegramChatId?: string,
    details?: {
      target_roles?: string[];
      salary_expectation?: { min_lpa: number; max_lpa: number };
      preferred_locations?: string[];
      total_years_experience?: number;
      seniority_tier?: string;
      skills?: string[];
    }
  ) => Promise<{ success: boolean; error?: string; code?: string; email?: string; redirectTo?: string }>;
  onQuickSwitch?: (accountId: string) => Promise<{ success: boolean; error?: string }>;
  onLogout: () => Promise<void>;
  requireAuthToDismiss?: boolean;
  initialTab?: 'login' | 'register' | 'forgot-password';
}

// Seniority tiers with domain-specific suggested roles & salary baselines
const SENIORITY_LEVELS = [
  {
    id: 'intern',
    tier: 'Entry / Intern',
    range: '0–2 yrs',
    expYears: 1,
    defaultSalary: { min: 6, max: 12 },
    roles: [
      'Software Engineer Intern',
      'Associate Software Developer',
      'Junior Data Analyst',
      'Graduate Tech Trainee',
      'Junior Full Stack Developer',
      'QA / Test Automation Intern',
    ],
  },
  {
    id: 'mid',
    tier: 'Mid-Level',
    range: '2–5 yrs',
    expYears: 3.5,
    defaultSalary: { min: 14, max: 28 },
    roles: [
      'Full Stack Developer',
      'Backend Software Engineer',
      'Frontend Engineer (React)',
      'Data Analyst / BI Specialist',
      'Cloud DevOps Engineer',
      'Product Specialist',
      'Python / AI Developer',
    ],
  },
  {
    id: 'lead',
    tier: 'Senior / Lead / Staff',
    range: '5–8 yrs',
    expYears: 6.5,
    defaultSalary: { min: 28, max: 48 },
    roles: [
      'Staff Software Engineer',
      'Tech Lead',
      'Principal Engineer',
      'Engineering Manager',
      'Senior Solutions Architect',
      'Senior Cloud Architect',
      'Senior Data Engineer',
    ],
  },
  {
    id: 'executive',
    tier: 'VP / Director / Head',
    range: '8+ yrs',
    expYears: 10,
    defaultSalary: { min: 45, max: 80 },
    roles: [
      'VP of Engineering',
      'Director of Technology',
      'Head of Product',
      'Chief Architect',
      'VP of Product & Tech',
      'Director of Data & AI',
      'Engineering Leader / VP',
    ],
  },
];

const POPULAR_LOCATIONS = [
  'Remote',
  'Hybrid',
  'Bengaluru',
  'Gurugram / Delhi NCR',
  'Mumbai',
  'Hyderabad',
  'Pune',
  'Noida',
  'US / Global Remote',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onRegister,
  onLogout,
  requireAuthToDismiss = false,
  initialTab = 'login',
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot-password'>(initialTab);
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3 | 4>(1);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotTelegramSent, setForgotTelegramSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);

  // Step 1: Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Step 2: Seniority & Roles (With Smart Popped Suggestions)
  const [selectedSeniorityId, setSelectedSeniorityId] = useState<string>('mid');
  const [resumeSnippet, setResumeSnippet] = useState('');
  const [targetRoles, setTargetRoles] = useState<string[]>([
    'Full Stack Developer',
    'Backend Software Engineer',
  ]);
  const [customRoleInput, setCustomRoleInput] = useState('');

  // Step 3: Salary & Locations (Mandatory)
  const [salaryMin, setSalaryMin] = useState<number>(14);
  const [salaryMax, setSalaryMax] = useState<number>(28);
  const [preferredLocations, setPreferredLocations] = useState<string[]>([
    'Remote',
    'Bengaluru',
    'Hybrid',
  ]);
  const [customLocationInput, setCustomLocationInput] = useState('');

  // Step 4: Telegram (Receiving messages only)
  const [telegramChatId, setTelegramChatId] = useState('');
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingStatus, setPingStatus] = useState<{ success: boolean; message: string } | null>(null);

  // UI state
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSwitchToLogin, setShowSwitchToLogin] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  // Active seniority configuration
  const currentSeniority = SENIORITY_LEVELS.find((s) => s.id === selectedSeniorityId) || SENIORITY_LEVELS[1];

  // Handle Seniority Change & adjust popped suggestions & salary recommendation
  const handleSelectSeniority = (seniorityId: string) => {
    setSelectedSeniorityId(seniorityId);
    const found = SENIORITY_LEVELS.find((s) => s.id === seniorityId);
    if (found) {
      setSalaryMin(found.defaultSalary.min);
      setSalaryMax(found.defaultSalary.max);
      // Pre-select top 2 popped roles for the chosen tier if target roles are empty or default
      if (targetRoles.length === 0) {
        setTargetRoles(found.roles.slice(0, 2));
      }
    }
  };

  // Extract / Suggest roles based on resume snippet input
  const handleResumeSnippetChange = (text: string) => {
    setResumeSnippet(text);
    const lower = text.toLowerCase();
    // Auto-detect seniority from resume snippet if user pasted executive keywords
    if (lower.includes('vp') || lower.includes('director') || lower.includes('head of') || lower.includes('chief')) {
      if (selectedSeniorityId !== 'executive') handleSelectSeniority('executive');
    } else if (lower.includes('staff') || lower.includes('principal') || lower.includes('lead') || lower.includes('manager')) {
      if (selectedSeniorityId !== 'lead') handleSelectSeniority('lead');
    } else if (lower.includes('intern') || lower.includes('trainee') || lower.includes('student') || lower.includes('fresher')) {
      if (selectedSeniorityId !== 'intern') handleSelectSeniority('intern');
    }
  };

  // Role toggle
  const toggleRole = (role: string) => {
    setTargetRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const addCustomRole = () => {
    const trimmed = customRoleInput.trim();
    if (trimmed && !targetRoles.includes(trimmed)) {
      setTargetRoles((prev) => [...prev, trimmed]);
      setCustomRoleInput('');
    }
  };

  const removeRole = (role: string) => {
    setTargetRoles((prev) => prev.filter((r) => r !== role));
  };

  // Location toggle
  const toggleLocation = (loc: string) => {
    setPreferredLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const addCustomLocation = () => {
    const trimmed = customLocationInput.trim();
    if (trimmed && !preferredLocations.includes(trimmed)) {
      setPreferredLocations((prev) => [...prev, trimmed]);
      setCustomLocationInput('');
    }
  };

  const removeLocation = (loc: string) => {
    setPreferredLocations((prev) => prev.filter((l) => l !== loc));
  };

  // Step 1 validation with proactive existing email check & redirect
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setShowSwitchToLogin(false);
    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // Proactively verify if this email is already registered before candidate fills steps 2, 3, 4
    setIsLoading(true);
    try {
      const checkRes = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const checkData = await checkRes.json().catch(() => null);
      if (checkData?.exists) {
        setIsLoading(false);
        setErrorMessage('An account with this email address already exists. Redirecting to Sign In...');
        setShowSwitchToLogin(true);
        setTimeout(() => {
          setTab('login');
          setErrorMessage('This email is already registered. Please sign in with your password, or use "Forgot password?" if needed.');
        }, 1100);
        return;
      }
    } catch {
      // Proceed if transient network offline
    } finally {
      setIsLoading(false);
    }

    setRegisterStep(2);
  };

  // Step 2 validation (Mandatory roles)
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (targetRoles.length === 0) {
      setErrorMessage('Please select or add at least one target job role.');
      return;
    }
    setRegisterStep(3);
  };

  // Step 3 validation (Mandatory salary & location)
  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (preferredLocations.length === 0) {
      setErrorMessage('Please select or add at least one preferred location.');
      return;
    }
    if (salaryMin <= 0) {
      setErrorMessage('Please enter a valid minimum expected salary.');
      return;
    }
    setRegisterStep(4);
  };

  // Test Telegram Ping
  const handleTestTelegramPing = async () => {
    if (!telegramChatId.trim()) {
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

  // Sign In submit
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
        }, 500);
      } else {
        setErrorMessage(res.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Final Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowSwitchToLogin(false);
    setIsLoading(true);

    try {
      const details = {
        target_roles: targetRoles,
        salary_expectation: { min_lpa: Number(salaryMin) || 12 },
        preferred_locations: preferredLocations,
        total_years_experience: currentSeniority.expYears,
        seniority_tier: currentSeniority.tier,
        skills: ['TypeScript', 'React', 'Node.js', 'Python', 'System Design'],
      };

      const cleanTelegramId = telegramChatId.trim() || undefined;

      const res = await onRegister(
        email,
        password,
        fullName,
        resumeSnippet || `${currentSeniority.tier} Professional`,
        cleanTelegramId,
        details
      );

      if (res.success) {
        setSuccessMessage('Account created successfully! Loading your job feed...');
        setTimeout(() => {
          if (onClose) onClose();
        }, 600);
      } else {
        const errText = res.error || 'Failed to create account.';
        const isDuplicate =
          (res as any).code === 'EMAIL_ALREADY_EXISTS' ||
          errText.toLowerCase().includes('already exists') ||
          (res as any).redirectTo === 'login';

        if (isDuplicate) {
          setErrorMessage('An account with this email address already exists. Redirecting to Sign In...');
          setShowSwitchToLogin(true);
          setTimeout(() => {
            setTab('login');
            setErrorMessage('This email is already registered. Please sign in with your password, or use "Forgot password?" if needed.');
          }, 1100);
        } else {
          setErrorMessage(errText);
        }
      }
    } catch (err: any) {
      const msg = err.message || 'Registration error.';
      if (msg.toLowerCase().includes('already exists')) {
        setErrorMessage('An account with this email address already exists. Redirecting to Sign In...');
        setShowSwitchToLogin(true);
        setTimeout(() => {
          setTab('login');
          setErrorMessage('This email is already registered. Please sign in with your password, or use "Forgot password?" if needed.');
        }, 1100);
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Forgot Password code generation and dispatch to Telegram and Email
  const handleSendResetCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const targetEmail = forgotEmail.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMessage('Please enter a valid registered candidate email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setForgotStep(2);
        setForgotCode(''); // Secure: Never display or auto-fill OTP on screen
        setForgotTelegramSent(Boolean(data.telegram_sent));
        setSuccessMessage(
          data.telegram_sent
            ? 'Verification code dispatched to your Telegram & registered email! Please check your messages.'
            : `Verification code sent to ${targetEmail}! Please check your email inbox and spam folder.`
        );
      } else {
        setErrorMessage(data?.error || 'Could not find a registered account with that email.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error requesting password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit code and new password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!forgotCode.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both password fields.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          code: forgotCode.trim(),
          new_password: forgotNewPassword,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        const token = data.session_token || data.token;
        if (token) {
          try { localStorage.setItem('careerops_auth_token', token); } catch {}
        }
        setSuccessMessage('🎉 Password successfully updated! Signing into your workspace...');
        // Automatically sign in with new credentials
        await onLogin(forgotEmail.trim(), forgotNewPassword, true);
        setTimeout(() => {
          if (onClose) onClose();
        }, 700);
      } else {
        setErrorMessage(data?.error || 'Password reset failed. Please check the code.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => {
        if (!requireAuthToDismiss && onClose) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-2 sm:p-4 flex items-center justify-center min-h-screen"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="relative w-full max-w-lg bg-[#0D1117] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden text-zinc-100 flex flex-col max-h-[min(90vh,760px)] my-auto"
      >
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 shrink-0" />

        {/* Modal Header (Fixed, Never Cut Off) */}
        <div className="p-3.5 sm:p-4 pb-3 flex items-center justify-between border-b border-white/[0.08] shrink-0 bg-[#0D1117]">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center shrink-0 ${
              tab === 'forgot-password'
                ? 'bg-amber-600/20 border-amber-500/30 text-amber-400'
                : 'bg-blue-600/20 border-blue-500/30 text-blue-400'
            }`}>
              {tab === 'forgot-password' ? <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" /> : <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                {tab === 'login'
                  ? 'Sign In to Workspace'
                  : tab === 'forgot-password'
                  ? 'Reset Account Password'
                  : 'Create Candidate Account'}
              </h2>
              <p className="text-[11px] text-zinc-400">
                {tab === 'forgot-password'
                  ? 'Recover access to your account'
                  : 'Personalized job matches and real-time alerts'}
              </p>
            </div>
          </div>
          {!requireAuthToDismiss && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Current User Bar if logged in */}
        {currentUser && (
          <div className="mx-3.5 sm:mx-4 mt-2.5 p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {(currentUser.full_name || currentUser.email || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-white truncate font-medium">{currentUser.email}</span>
            </div>
            <button
              onClick={onLogout}
              className="text-[11px] text-rose-400 hover:text-rose-300 px-2 py-0.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition cursor-pointer shrink-0"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Tabs: Sign In / Create Account / Reset Password */}
        <div className="flex px-3.5 sm:px-4 pt-2 gap-4 border-b border-white/[0.06] shrink-0 bg-[#0D1117]">
          <button
            onClick={() => {
              setTab('login');
              setErrorMessage(null);
              setShowSwitchToLogin(false);
            }}
            className={`pb-2 text-xs font-semibold transition-colors relative cursor-pointer ${
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
              setShowSwitchToLogin(false);
            }}
            className={`pb-2 text-xs font-semibold transition-colors relative cursor-pointer ${
              tab === 'register' ? 'text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Create Account
            {tab === 'register' && (
              <motion.div
                layoutId="authTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              />
            )}
          </button>
          {tab === 'forgot-password' && (
            <button
              onClick={() => {
                setTab('forgot-password');
                setErrorMessage(null);
              }}
              className="pb-2 text-xs font-semibold transition-colors relative cursor-pointer text-amber-400"
            >
              Reset Password
              <motion.div
                layoutId="authTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
              />
            </button>
          )}
        </div>

        {/* Step Indicator (Registration only) */}
        {tab === 'register' && (
          <div className="flex items-center justify-between px-3.5 sm:px-4 py-2 bg-white/[0.02] border-b border-white/[0.04] shrink-0">
            {[
              { num: 1, label: 'Account' },
              { num: 2, label: 'Roles' },
              { num: 3, label: 'Comp & Loc' },
              { num: 4, label: 'Alerts' },
            ].map((s) => {
              const isActive = registerStep === s.num;
              const isPast = registerStep > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (isPast) setRegisterStep(s.num as any);
                  }}
                  className={`flex items-center gap-1.5 text-xs font-medium ${
                    isActive
                      ? 'text-blue-400 font-semibold'
                      : isPast
                      ? 'text-emerald-400 cursor-pointer'
                      : 'text-zinc-500 cursor-default'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/[0.06] text-zinc-500'
                    }`}
                  >
                    {isPast ? '✓' : s.num}
                  </div>
                  <span className="text-[10px] sm:text-[11px]">{s.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Scrollable Form Body Container (Never Cut Off) */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-5 space-y-4 min-h-0">
          {/* Error / Alert banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
                {showSwitchToLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      setErrorMessage(null);
                      setShowSwitchToLogin(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold shrink-0 cursor-pointer transition"
                  >
                    Sign In Now
                  </button>
                )}
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB 1: SIGN IN */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@domain.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-zinc-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot-password');
                      setForgotEmail(email || '');
                      setForgotStep(1);
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-9 pr-10 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
                  <span>Remember me</span>
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
                    Sign In
                  </>
                )}
              </button>

              <div className="text-center pt-2 border-t border-white/[0.06] text-xs text-zinc-400">
                New candidate?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setErrorMessage(null);
                    setShowSwitchToLogin(false);
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline transition"
                >
                  Create workspace account
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {tab === 'forgot-password' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="text-amber-200 font-medium">Reset Your Account Password</p>
                  <p className="text-amber-300/80 text-[11px] mt-0.5">
                    {forgotStep === 1
                      ? 'Enter your registered candidate email address to generate a 6-digit password reset verification code.'
                      : `Enter the 6-digit code for ${forgotEmail} and choose a new password.`}
                  </p>
                </div>
              </div>

              {forgotStep === 1 ? (
                <form onSubmit={handleSendResetCode} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. user@domain.com"
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setTab('login');
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="flex-1 py-2 px-3 bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 text-xs font-medium rounded-xl transition cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-amber-600/25 transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isLoading ? (
                        <>Sending Code...</>
                      ) : (
                        <>
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Get Reset Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                  {/* Verification Code Dispatch Status Card */}
                  <div className="p-3.5 bg-blue-500/10 border border-blue-500/25 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold">
                      <Send className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Verification Code Dispatched</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      We have sent your confidential 6-digit verification code to:
                    </p>
                    <div className="space-y-1.5 text-[11px] bg-black/30 p-2.5 rounded-lg border border-white/[0.06]">
                      <div className="flex items-center gap-2 text-zinc-200">
                        <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Email: <strong className="text-white font-medium">{forgotEmail}</strong></span>
                      </div>
                      {forgotTelegramSent && (
                        <div className="flex items-center gap-2 text-emerald-300">
                          <Send className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Telegram: <strong className="text-emerald-200 font-medium">Instant Bot Alert Sent</strong></span>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-400 pt-1">
                      Check your Telegram app or email inbox (including spam folder) and enter the 6 digits below. Valid for 15 minutes.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-zinc-300">
                        Enter 6-Digit Verification Code *
                      </label>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleSendResetCode()}
                        className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline cursor-pointer disabled:opacity-50"
                      >
                        Resend Code
                      </button>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="• • • • • •"
                      maxLength={6}
                      autoFocus
                      required
                      className="w-full px-3 py-2.5 text-base tracking-[0.35em] font-mono text-center bg-black/50 border border-white/[0.12] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      New Password * (Min 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        className="w-full pl-9 pr-10 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                        aria-label={showForgotNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="password"
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        placeholder="Confirm matching password"
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep(1);
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="py-2 px-3 bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 text-xs font-medium rounded-xl transition cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-amber-600/25 transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isLoading ? (
                        <>Updating Password...</>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Update Password & Sign In</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: REGISTER - STEP 1 (Credentials) */}
          {tab === 'register' && registerStep === 1 && (
            <form id="register-step-1" onSubmit={handleStep1Submit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Password * (Min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
                <span>Your job search profile and preferences are kept strictly private.</span>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER - STEP 2 (Seniority & Smart Popped Roles) */}
          {tab === 'register' && registerStep === 2 && (
            <form id="register-step-2" onSubmit={handleStep2Submit} className="space-y-4">
              {/* Seniority Tier Selector */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-blue-400" />
                    Seniority / Career Level *
                  </span>
                  <span className="text-[10px] text-zinc-400 font-normal">
                    Select to adapt role suggestions
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {SENIORITY_LEVELS.map((level) => {
                    const isSelected = selectedSeniorityId === level.id;
                    return (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => handleSelectSeniority(level.id)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-inner'
                            : 'bg-white/[0.03] border-white/[0.07] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">{level.tier}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">{level.range}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Resume / Headline Snippet input to auto-filter */}
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1 flex items-center justify-between">
                  <span>Resume Summary or Title (Optional)</span>
                  <span className="text-[10px] text-blue-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Auto-suggests roles
                  </span>
                </label>
                <input
                  type="text"
                  value={resumeSnippet}
                  onChange={(e) => handleResumeSnippetChange(e.target.value)}
                  placeholder="e.g. VP Engineering with 10 yrs tech leadership or React intern"
                  className="w-full px-3 py-1.5 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Popped Role Recommendations */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-blue-400" />
                    Target Job Roles *
                  </label>
                  <span className="text-[10px] font-semibold text-blue-400">
                    {targetRoles.length} selected
                  </span>
                </div>

                {/* Active Selected Role Pills */}
                {targetRoles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-black/40 border border-white/[0.06] rounded-xl">
                    {targetRoles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-medium"
                      >
                        <span>{role}</span>
                        <button
                          type="button"
                          onClick={() => removeRole(role)}
                          className="text-blue-400 hover:text-white ml-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Popped options that user can directly click to select and add */}
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 block">
                    Popped suggestions for {currentSeniority.tier} (Click to directly add):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSeniority.roles.map((role) => {
                      const isSelected = targetRoles.includes(role);
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => toggleRole(role)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600/30 border-blue-500 text-white font-medium shadow-sm'
                              : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                          }`}
                        >
                          {isSelected ? `✓ ${role}` : `+ ${role}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Role Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomRole();
                      }
                    }}
                    placeholder="Add other role (e.g. VP Data Analytics)..."
                    className="flex-1 px-3 py-1.5 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomRole}
                    disabled={!customRoleInput.trim()}
                    className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 text-xs font-semibold rounded-xl border border-white/[0.1] transition disabled:opacity-40 cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER - STEP 3 (Comp & Locations Mandatory) */}
          {tab === 'register' && registerStep === 3 && (
            <form id="register-step-3" onSubmit={handleStep3Submit} className="space-y-4">
              {/* Salary Package */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Minimum Expected Salary (₹ LPA) *
                  </label>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    ₹{salaryMin}+ LPA
                  </span>
                </div>

                <div>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Math.max(1, Number(e.target.value)))}
                    required
                    placeholder="e.g. 15"
                    className="w-full px-3 py-2 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Filters out roles below this baseline compensation.
                  </p>
                </div>
              </div>

              {/* Preferred Locations */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    Target Locations & Mode *
                  </label>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {preferredLocations.length} chosen
                  </span>
                </div>

                {/* Selected Location Pills */}
                {preferredLocations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-black/40 border border-white/[0.06] rounded-xl">
                    {preferredLocations.map((loc) => (
                      <span
                        key={loc}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium"
                      >
                        <span>{loc}</span>
                        <button
                          type="button"
                          onClick={() => removeLocation(loc)}
                          className="text-cyan-400 hover:text-white ml-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Popped Location Badges */}
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 block">
                    Popped options (Click to add directly):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_LOCATIONS.map((loc) => {
                      const isSelected = preferredLocations.includes(loc);
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => toggleLocation(loc)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-600/30 border-cyan-500 text-white font-medium'
                              : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                          }`}
                        >
                          {isSelected ? `✓ ${loc}` : `+ ${loc}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Location input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customLocationInput}
                    onChange={(e) => setCustomLocationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomLocation();
                      }
                    }}
                    placeholder="Add other location..."
                    className="flex-1 px-3 py-1.5 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomLocation}
                    disabled={!customLocationInput.trim()}
                    className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 text-xs font-semibold rounded-xl border border-white/[0.1] transition disabled:opacity-40 cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER - STEP 4 (Telegram Receiving Only) */}
          {tab === 'register' && registerStep === 4 && (
            <form id="register-step-4" onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/40 via-blue-950/20 to-transparent border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    Direct Alert Delivery (Receive Only)
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    No Bot Setup Needed
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Your search preferences are completely stored in your workspace. Telegram is strictly used to push instant notifications whenever verified high-fit roles (&ge;75%) are discovered.
                </p>
              </div>

              {/* Chat ID Input */}
              <div className="space-y-2 p-3 bg-black/40 border border-white/[0.08] rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-200">
                    Telegram Chat ID (Optional)
                  </label>
                  <a
                    href="https://t.me/userinfobot"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Get ID via @userinfobot</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => {
                      setTelegramChatId(e.target.value);
                      setPingStatus(null);
                    }}
                    placeholder="e.g. 1368681854"
                    className="flex-1 px-3 py-2 text-xs bg-black/60 border border-emerald-500/30 rounded-xl text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={handleTestTelegramPing}
                    disabled={isTestingPing || !telegramChatId.trim()}
                    className="px-3 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-500/40 transition flex items-center gap-1 disabled:opacity-40 cursor-pointer shrink-0"
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
                  <div
                    className={`text-[11px] p-2 rounded-lg ${
                      pingStatus.success
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}
                  >
                    {pingStatus.message}
                  </div>
                )}
              </div>

              {/* Summary of what's being configured */}
              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs space-y-1">
                <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Workspace Summary</span>
                <p className="text-zinc-200">
                  <span className="text-zinc-400">Target Roles:</span> {targetRoles.slice(0, 3).join(', ')}
                </p>
                <p className="text-zinc-200">
                  <span className="text-zinc-400">Min Salary:</span> ₹{salaryMin}+ LPA
                </p>
                <p className="text-zinc-200">
                  <span className="text-zinc-400">Locations:</span> {preferredLocations.slice(0, 3).join(', ')}
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer with Action Buttons (Sticky, Never Cut Off) */}
        {tab === 'register' && (
          <div className="p-3 sm:p-4 bg-[#090D14] border-t border-white/[0.08] flex items-center justify-between shrink-0">
            {registerStep > 1 ? (
              <button
                type="button"
                onClick={() => setRegisterStep((prev) => (prev - 1) as any)}
                className="py-2 px-3 bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 text-xs font-medium rounded-xl transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-xs text-blue-400 hover:underline cursor-pointer"
              >
                Already registered? Sign In
              </button>
            )}

            {registerStep === 1 && (
              <button
                type="submit"
                form="register-step-1"
                className="py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition flex items-center gap-1 cursor-pointer"
              >
                <span>Continue: Job Roles</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {registerStep === 2 && (
              <button
                type="submit"
                form="register-step-2"
                className="py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition flex items-center gap-1 cursor-pointer"
              >
                <span>Continue: Comp & Location</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {registerStep === 3 && (
              <button
                type="submit"
                form="register-step-3"
                className="py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition flex items-center gap-1 cursor-pointer"
              >
                <span>Continue: Telegram Setup</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {registerStep === 4 && (
              <button
                type="submit"
                form="register-step-4"
                disabled={isLoading}
                className="py-2 px-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>Initializing Workspace...</>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Launch Clean Workspace</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
