import React from 'react';
import {
  Briefcase,
  LayoutDashboard,
  FileText,
  UserCheck,
  Send,
  Sparkles,
  PlayCircle,
  Loader2,
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
  interface NavTabItem {
    id: NavbarProps['activeTab'];
    label: string;
    icon: typeof LayoutDashboard;
    count?: number;
  }

  const navTabs: NavTabItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, count: stats?.high_fit_count },
    { id: 'tailor', label: 'Documents', icon: FileText },
    { id: 'profile', label: 'Profile', icon: UserCheck },
    { id: 'automation', label: 'Telegram & Alerts', icon: Send },
  ];

  return (
    <header className="bg-[#080B11]/85 backdrop-blur-xl border-b border-white/[0.07] sticky top-0 z-40 text-[#E2E8F0] transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-600/25 border border-blue-400/30 ring-1 ring-white/20">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base tracking-tight text-white flex items-center">
                  CareerOps<span className="text-blue-400 font-bold ml-0.5">AI</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Candidate: <span className="text-zinc-200 font-medium">{candidateName}</span>
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs with Motion Indicator */}
          <nav className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.07] backdrop-blur-sm">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
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
                    <span className={tab.id === 'automation' ? 'hidden lg:inline' : tab.id === 'profile' ? 'hidden sm:inline' : ''}>
                      {tab.label}
                    </span>
                    {typeof tab.count === 'number' && tab.count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold border ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Run Pipeline & AI status */}
          <div className="flex items-center gap-2.5">
            <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-white/[0.06]">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>Gemini 3.8 Flash</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRunPipeline}
              disabled={isPipelineRunning}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-blue-400/20"
            >
              {isPipelineRunning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span className="hidden sm:inline">Executing Automation...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Trigger Automation</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};
