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
  return (
    <header className="bg-[#0F1115] border-b border-[#1F2937] sticky top-0 z-40 text-[#E5E7EB] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-600/25 border border-blue-400/30">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center">
                  CareerOps<span className="text-blue-400 font-extrabold ml-0.5">AI</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">
                Candidate: <span className="text-gray-200 font-medium">{candidateName}</span>
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-[#0A0B0E] p-1 rounded-xl border border-[#1F2937]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D23]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all relative ${
                activeTab === 'jobs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D23]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Jobs</span>
              {stats?.high_fit_count ? (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {stats.high_fit_count}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => setActiveTab('tailor')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                activeTab === 'tailor'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D23]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">ATS Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D23]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('automation')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                activeTab === 'automation'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D23]'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden lg:inline">Telegram & Alerts</span>
            </button>
          </nav>

          {/* Right Action: Run Pipeline & AI status */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 text-xs text-gray-400 bg-[#1A1D23] px-2.5 py-1 rounded-lg border border-[#2D3139]">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Gemini 3.8 Flash</span>
            </div>

            <button
              onClick={onRunPipeline}
              disabled={isPipelineRunning}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPipelineRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span className="hidden sm:inline">Executing Automation...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Trigger Automation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
