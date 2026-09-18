import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  LayoutDashboard,
  FileText,
  UserCheck,
  Send,
  Sparkles,
  PlayCircle,
  Loader2,
  Cloud,
} from 'lucide-react';
import { motion } from 'motion/react';
import { PipelineStats } from '../types.js';

interface NavbarProps {
  activeTab: 'dashboard' | 'jobs' | 'tailor' | 'profile' | 'automation';
  setActiveTab: (tab: 'dashboard' | 'jobs' | 'tailor' | 'profile' | 'automation') => void;
  stats?: PipelineStats;
  onRunPipeline: () => void;
  isPipelineRunning: boolean;
  candidateName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onRunPipeline,
  isPipelineRunning,
  candidateName,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
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
                  Candidate: <span className="text-zinc-200 font-medium">{candidateName}</span>
                </p>
              </div>
            </div>

            {/* Center Navigation Tabs with Animated Spring Pill (Desktop only) */}
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

            {/* Right Action: Run Pipeline & AI status */}
            <div className="flex items-center gap-2 sm:gap-2.5">
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
            </div>
          </div>
        </div>
      </motion.header>

      {/* Structural layout spacer guaranteeing page content never gets covered by fixed navbar */}
      <div className="h-16 shrink-0 w-full" aria-hidden="true" />
    </>
  );
};

