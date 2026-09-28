import React, { useState } from 'react';
import {
  Menu,
  Search,
  Command,
  Bell,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Database,
  User as UserIcon,
  LogOut,
  FileText,
  Briefcase,
  GraduationCap,
  Mic,
  LayoutDashboard,
  SearchCode,
  Settings,
  Crown,
} from 'lucide-react';
import { UserProfile } from '../types';
import { ActiveTab } from './Sidebar';

interface TopHeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile;
  onLogout: () => void;
  atsScore: number;
  onOpenMobileMenu: () => void;
  onOpenSidebar?: () => void;
  onOpenDataRetrieval: () => void;
  onOpenDataVault: () => void;
  onOpenProfileSettings: (tab?: 'profile' | 'settings') => void;
  onOpenGeminiChat?: () => void;
  onOpenImageStudio?: () => void;
  onOpenPlanModal?: () => void;
}

const TAB_CONFIG: Record<ActiveTab, { title: string; subtitle: string; icon: React.ReactNode }> = {
  dashboard: {
    title: 'Career Dashboard',
    subtitle: 'Overview of ATS metrics, application pipeline, and lab readiness',
    icon: <LayoutDashboard className="w-4 h-4 text-teal-400" />,
  },
  builder: {
    title: 'Resume Builder',
    subtitle: 'ATS-optimized resume editor with STAR metrics and live PDF export',
    icon: <FileText className="w-4 h-4 text-sky-400" />,
  },
  analyzer: {
    title: 'Resume Audit & ATS Scan',
    subtitle: 'Comprehensive ATS benchmark, keyword density for GATK/Python, and actionable tips',
    icon: <SearchCode className="w-4 h-4 text-indigo-400" />,
  },
  tracker: {
    title: 'Job Tracker & Pipeline',
    subtitle: 'Track computational biology applications from submission to offer',
    icon: <Briefcase className="w-4 h-4 text-emerald-400" />,
  },
  skills: {
    title: 'Courses & Internships',
    subtitle: 'Verified bioinformatics programs, Coursera free audits, NPTEL IIT courses & internships',
    icon: <GraduationCap className="w-4 h-4 text-purple-400" />,
  },
  'mock-interview': {
    title: 'Mock Interview Simulator',
    subtitle: 'Technical genomics practice benchmarked against industry STAR rubric',
    icon: <Mic className="w-4 h-4 text-rose-400" />,
  },
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  atsScore,
  onOpenMobileMenu,
  onOpenSidebar,
  onOpenDataRetrieval,
  onOpenDataVault,
  onOpenProfileSettings,
  onOpenGeminiChat,
  onOpenImageStudio,
  onOpenPlanModal,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const currentTabInfo = TAB_CONFIG[activeTab] || TAB_CONFIG.dashboard;
  const handleOpenDrawer = onOpenSidebar || onOpenMobileMenu;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side: Clickable Omic Hub Logo to slide open sidebar navigation */}
          <div className="flex items-center gap-3">
            {/* Omic Hub Logo Button */}
            <button
              onClick={handleOpenDrawer}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer group shadow-sm active:scale-95"
              title="Click Omic Hub logo to open navigation menu"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                </div>
              </div>
              <div className="text-left flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white group-hover:text-teal-300 transition-colors">
                  Omic Hub
                </span>
                <Menu className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-400 transition-colors" />
              </div>
            </button>

            {/* Breadcrumb Separator & Section Name */}
            <div className="h-5 w-px bg-slate-800 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
                {currentTabInfo.icon}
              </div>
              <div>
                <span className="text-xs font-semibold text-white">
                  {user.userType === 'recruiter' && activeTab === 'dashboard'
                    ? `${user.companyName || 'Recruiter'} Talent Hub`
                    : currentTabInfo.title}
                </span>
                <p className="hidden md:block text-[10px] text-slate-500 leading-none mt-0.5">
                  {user.userType === 'recruiter' && activeTab === 'dashboard'
                    ? 'Publish verified roles & review direct student applications'
                    : currentTabInfo.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Search, Real-Time Sync, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gemini Chatbot Trigger Button */}
            {onOpenGeminiChat && (
              <button
                type="button"
                onClick={onOpenGeminiChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all hover:scale-102 cursor-pointer"
                title="Launch Gemini Bioinformatics Assistant & Voice Conversations"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span className="hidden sm:inline">Gemini AI</span>
              </button>
            )}

            {/* Image Studio Trigger Button */}
            {onOpenImageStudio && (
              <button
                type="button"
                onClick={onOpenImageStudio}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all cursor-pointer"
                title="Open Scientific Visualization & Diagram Studio"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Visual Studio</span>
              </button>
            )}

            {/* Quick Data Retrieval Button */}
            <button
              type="button"
              onClick={onOpenDataRetrieval}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs cursor-pointer group"
              title="Search Any Saved Career Data (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-medium text-slate-300">Quick Find Data...</span>
              <span className="flex items-center gap-0.5 text-[9px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                <Command className="w-2.5 h-2.5" />K
              </span>
            </button>

            {/* Real-time Sync Status Pill */}
            <button
              type="button"
              onClick={onOpenDataVault}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800/80 text-xs transition-all cursor-pointer group"
              title="Real-Time Data Vault & Cloud Sync (Click to view backups & history)"
            >
              <div className="relative flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </div>
              <span className="hidden sm:inline text-[11px] font-bold text-slate-300 group-hover:text-white">
                Real-Time Synced
              </span>
            </button>

            {/* Subscription Status Badge */}
            {onOpenPlanModal && (
              <button
                type="button"
                onClick={onOpenPlanModal}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer group shadow-sm ${
                  user.planTier === 'basic'
                    ? 'bg-slate-900/90 hover:bg-slate-850 border-slate-700 text-slate-300 hover:border-slate-600'
                    : user.planTier === 'plus'
                    ? 'bg-indigo-950/40 hover:bg-indigo-900/40 border-indigo-500/40 text-indigo-200'
                    : 'bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15 hover:from-amber-500/25 hover:to-indigo-500/25 border-amber-500/40 text-amber-200 shadow-amber-500/10'
                }`}
                title="View Subscription Status & Plan Details"
              >
                {user.planTier === 'pro' ? (
                  <Crown className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                ) : user.planTier === 'plus' ? (
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                )}

                <span className="font-bold text-white text-[11px]">
                  {user.planTier === 'basic'
                    ? 'Free Tier'
                    : user.planTier === 'plus'
                    ? 'Basic Plus'
                    : 'Pro Tier'}
                </span>

                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border ${
                    user.planTier === 'basic'
                      ? 'bg-slate-800 text-amber-300 border-amber-500/30'
                      : user.planTier === 'plus'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {user.planTier === 'basic' ? 'Upgrade' : '3 Mo Free'}
                </span>
              </button>
            )}

            {/* Settings Quick Access Button */}
            <button
              type="button"
              onClick={() => onOpenProfileSettings('settings')}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors border border-slate-800"
              title="Open Settings & Targets"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors border border-slate-800"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Recent Alerts</span>
                    <span className="text-[10px] text-indigo-400 font-semibold">2 New</span>
                  </div>
                  <div className="space-y-3 pt-3">
                    <div className="flex items-start gap-3 text-left">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Stripe Final Round</p>
                        <p className="text-[11px] text-slate-400">Scheduled for Thursday at 2:00 PM PST.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">ATS Score Improved</p>
                        <p className="text-[11px] text-slate-400">Your resume now scores in the 89th percentile.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown / Profile Pop-up Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 transition-all cursor-pointer group"
                title="Click to view profile & settings menu"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/50 group-hover:ring-indigo-400 transition-colors"
                />
                <span className="hidden md:inline text-xs font-semibold text-white truncate max-w-[100px]">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  {/* Clickable Profile Card inside Dropdown */}
                  <div
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenProfileSettings('profile');
                    }}
                    className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800/80 cursor-pointer transition-colors group/card"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white group-hover/card:text-indigo-300 transition-colors">
                        {user.name}
                      </p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30">
                        Pop-up
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] px-2 py-1 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">ATS Rating</span>
                      <span className="text-emerald-400 font-bold">{atsScore}/100</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenProfileSettings('profile');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Edit Profile Details</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenProfileSettings('settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-sky-400" />
                      <span>App & Career Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                      <span>Career Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('builder');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Resume Builder</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
