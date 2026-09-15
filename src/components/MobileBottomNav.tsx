import React from 'react';
import { LayoutDashboard, Briefcase, FileText, UserCheck, Send } from 'lucide-react';
import { motion } from 'motion/react';

export type AppTab = 'dashboard' | 'jobs' | 'tailor' | 'profile' | 'automation';

interface MobileBottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

interface NavTabItem {
  id: AppTab;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_TABS: NavTabItem[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'tailor', label: 'Docs', icon: FileText },
  { id: 'profile', label: 'Profile', icon: UserCheck },
  { id: 'automation', label: 'Alerts', icon: Send },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = React.memo(({
  activeTab,
  setActiveTab,
}) => {
  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080B11]/95 backdrop-blur-xl border-t border-white/[0.1] px-1 pt-1 pb-[max(env(safe-area-inset-bottom,0px),8px)] shadow-2xl shadow-black/90"
      style={{
        contain: 'layout style',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
      }}
    >
      <div className="grid grid-cols-5 gap-0.5 max-w-md mx-auto">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-colors select-none min-h-[46px] cursor-pointer ${
                isActive
                  ? 'text-blue-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 active:text-zinc-100'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTabGlow"
                  className="absolute inset-0 bg-blue-500/10 rounded-xl border border-blue-500/25 shadow-inner"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'scale-110 text-blue-400' : 'text-zinc-400'
                  }`}
                />
                <span
                  className={`text-[10px] tracking-tight truncate max-w-full ${
                    isActive ? 'font-bold text-white' : 'font-medium text-zinc-400'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Seamless underlay filling any rubber-band stretch without jitter */}
      <div
        className="absolute top-full left-0 right-0 h-48 bg-[#080B11] pointer-events-none"
        aria-hidden="true"
      />
    </nav>
  );
});

MobileBottomNav.displayName = 'MobileBottomNav';
