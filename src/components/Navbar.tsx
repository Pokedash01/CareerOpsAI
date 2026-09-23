import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  LayoutDashboard,
  FileText,
  UserCheck,
  Send,
  Sparkles,
  PlayCircle,
  Loader2,
  Lock,
  User,
  LogOut,
  ChevronDown,
  Laptop,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PipelineStats, UserAccount } from '../types.js';

interface NavbarProps {
  activeTab: 'dashboard' | 'jobs' | 'tailor' | 'profile' | 'automation';
  setActiveTab: (tab: 'dashboard' | 'jobs' | 'tailor' | 'profile' | 'automation') => void;
  stats?: PipelineStats;
  onRunPipeline: () => void;
  isPipelineRunning: boolean;
  candidateName: string;
  currentUser?: UserAccount | null;
  onOpenAuth: (initialTab?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onRunPipeline,
  isPipelineRunning,
  candidateName,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  interface NavTabItem {
    id: NavbarProps['activeTab'];
    label: string;
    icon: typeof LayoutDashboard;
  }

  const navTabs: NavTabItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'tailor', label: 'Documents', icon: FileText },
    { id: 'profile', label: 'Profile', icon: UserCheck },
    { id: 'automation', label: 'Telegram & Alerts', icon: Send },
  ];

  return (
    <>
      {/* Pinned Fixed Navigation Bar - Remains locked to top on any scroll depth */}
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 25 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-[#080B11]/95 backdrop-blur-xl border-b border-white/[0.1] shadow-xl shadow-black/50 py-0'
            : 'bg-[#080B11]/85 backdrop-blur-md border-b border-white/[0.06] shadow-sm py-0.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-600/25 border border-blue-400/30 ring-1 ring-white/20 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-white" />
              </motion.div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base tracking-tight text-white flex items-center">
                    CareerOps<span className="text-blue-400 font-bold ml-0.5">AI</span>
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 hidden sm:block">
                  {currentUser ? (
                    <>
                      Candidate: <span className="text-zinc-200 font-medium">{candidateName}</span>
                    </>
                  ) : (
                    <span className="text-zinc-400">Autonomous Job & Alert Engine</span>
                  )}
                </p>
              </div>
            </div>

            {/* Center Navigation: Tabs for authenticated users, Solution links for visitors */}
            {currentUser ? (
              <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.07] backdrop-blur-sm shadow-inner shadow-black/20">
                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none ${
                        isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.02]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute inset-0 bg-blue-600 rounded-lg shadow-md shadow-blue-600/30 border border-blue-400/30"
                          transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" />
                        <span
                          className={
                            tab.id === 'automation'
                              ? 'hidden lg:inline'
                              : tab.id === 'profile'
                              ? 'hidden sm:inline'
                              : ''
                          }
                        >
                          {tab.label}
                        </span>
                      </span>
                    </motion.button>
                  );
                })}
              </nav>
            ) : (
              <nav className="hidden lg:flex items-center gap-1">
                <a
                  href="#how-it-works"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#ats-engine"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  ATS Engine
                </a>
                <a
                  href="#cadence"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  Automation
                </a>
                <a
                  href="#telegram-alerts"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Telegram Alerts</span>
                </a>
                <a
                  href="#comparison"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  Why Us
                </a>
                <a
                  href="#faq"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  FAQ
                </a>
              </nav>
            )}

            {/* Right Action: Authenticated Controls or Visitor Auth Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {currentUser ? (
                <>
                  <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-white/[0.06]">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>Gemini 3.8 Flash</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onRunPipeline}
                    disabled={isPipelineRunning}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold px-3 sm:px-3.5 py-2 min-h-[38px] rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-blue-400/20"
                  >
                    {isPipelineRunning ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span className="hidden sm:inline">Executing...</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Trigger Automation</span>
                        <span className="sm:hidden font-bold">Run</span>
                      </>
                    )}
                  </motion.button>

                  {/* User Account / Device Session Control */}
                  <div className="relative" ref={userMenuRef}>
                    {(() => {
                      const displayName = (currentUser.name || currentUser.full_name || currentUser.email?.split('@')[0] || 'User').trim();
                      const initials = (displayName.length >= 2 ? displayName.slice(0, 2) : displayName || 'US').toUpperCase();
                      const firstName = displayName.split(' ')[0] || displayName;

                      return (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowUserDropdown((prev) => !prev)}
                            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white text-xs font-medium transition-all cursor-pointer shadow-sm"
                          >
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shadow">
                              {initials}
                            </div>
                            <span className="max-w-[90px] truncate hidden sm:inline">
                              {firstName}
                            </span>
                            <ChevronDown className="w-3 h-3 text-zinc-400" />
                          </motion.button>

                          {/* Dropdown Menu */}
                          <AnimatePresence>
                            {showUserDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0D1117] border border-white/[0.12] shadow-2xl p-2 z-50 text-zinc-200"
                              >
                                <div className="p-2.5 pb-2 border-b border-white/[0.07]">
                                  <div className="flex items-center gap-2.5 mb-1">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                      {initials}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-semibold text-white truncate">
                                        {displayName}
                                      </p>
                                      <p className="text-[11px] text-zinc-400 truncate">
                                        {currentUser.email}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium mt-2 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                    <Lock className="w-2.5 h-2.5" />
                                    <span>Saved on device via encrypted cookie</span>
                                  </div>
                                </div>

                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      setShowUserDropdown(false);
                                      setActiveTab('profile');
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/[0.06] rounded-xl flex items-center gap-2 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                  >
                                    <User className="w-3.5 h-3.5 text-blue-400" />
                                    <span>Profile & Career Preferences</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowUserDropdown(false);
                                      setActiveTab('automation');
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/[0.06] rounded-xl flex items-center gap-2 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                  >
                                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Telegram Push & Alerts</span>
                                  </button>
                                </div>

                                <div className="pt-1 border-t border-white/[0.07]">
                                  <button
                                    onClick={() => {
                                      setShowUserDropdown(false);
                                      onLogout();
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-rose-500/15 rounded-xl flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                                  >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Sign Out</span>
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      );
                    })()}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-zinc-200 hover:text-white transition-all cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Sign In</span>
                  </button>

                  <button
                    onClick={() => onOpenAuth('register')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all cursor-pointer border border-blue-400/25 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Get Started</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Structural layout spacer guaranteeing page content never gets covered by fixed navbar */}
      <div className="h-16 shrink-0 w-full" aria-hidden="true" />
    </>
  );
};

