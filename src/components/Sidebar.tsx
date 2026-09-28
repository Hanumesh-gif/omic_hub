import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  SearchCode,
  Briefcase,
  GraduationCap,
  Mic,
  Database,
  Search,
  Command,
  Sparkles,
  LogOut,
  ChevronRight,
  X,
  Bell,
  CheckCircle2,
  Menu,
  Settings,
  Crown,
} from 'lucide-react';
import { UserProfile, SubscriptionPlanTier } from '../types';

export type ActiveTab = 'dashboard' | 'builder' | 'analyzer' | 'tracker' | 'skills' | 'mock-interview';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile;
  onLogout: () => void;
  atsScore: number;
  totalApplications: number;
  onOpenDataRetrieval: () => void;
  onOpenDataVault: () => void;
  onOpenProfileSettings: (tab?: 'profile' | 'settings') => void;
  onOpenPlanModal?: () => void;
  onTriggerUpgrade?: (feature: string, requiredTier?: SubscriptionPlanTier) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  atsScore,
  totalApplications,
  onOpenDataRetrieval,
  onOpenDataVault,
  onOpenProfileSettings,
  onOpenPlanModal,
  onTriggerUpgrade,
  mobileOpen = false,
  setMobileOpen,
  isOpen,
  setIsOpen,
}) => {
  const isDrawerOpen = isOpen !== undefined ? isOpen : mobileOpen;
  const handleClose = () => {
    if (setIsOpen) setIsOpen(false);
    if (setMobileOpen) setMobileOpen(false);
  };
  const isAuditLocked = user.planTier === 'basic';
  const isInterviewLocked = user.planTier !== 'pro';

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string; locked?: boolean }[] = [
    {
      id: 'dashboard',
      label: user.userType === 'recruiter' ? 'Recruiter Talent Hub' : 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: user.userType === 'recruiter' ? 'Recruiter' : undefined,
      badgeColor: 'bg-teal-500/15 text-teal-300 border-teal-500/25',
    },
    {
      id: 'builder',
      label: 'Resume Builder',
      icon: <FileText className="w-4 h-4" />,
      badge: user.isResumeUploaded ? `${atsScore}% ATS` : 'Lab-Ready',
      badgeColor: user.isResumeUploaded
        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
        : 'bg-amber-500/15 text-amber-300 border-amber-500/25',
    },
    {
      id: 'analyzer',
      label: 'Resume Audit & ATS',
      icon: <SearchCode className="w-4 h-4" />,
      badge: isAuditLocked ? '₹9 Plus' : 'Audit',
      badgeColor: isAuditLocked
        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
        : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
      locked: isAuditLocked,
    },
    {
      id: 'tracker',
      label: 'Job Tracker',
      icon: <Briefcase className="w-4 h-4" />,
      badge: `${totalApplications}`,
      badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/25',
    },
    {
      id: 'skills',
      label: 'Courses & Internships',
      icon: <GraduationCap className="w-4 h-4" />,
      badge: 'Verified',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
    },
    {
      id: 'mock-interview',
      label: 'Mock Interview',
      icon: <Mic className="w-4 h-4" />,
      badge: isInterviewLocked ? '₹49 Pro' : 'Live AI',
      badgeColor: isInterviewLocked
        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        : 'bg-amber-500/15 text-amber-300 border-amber-500/25',
      locked: isInterviewLocked,
    },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    if (tab === 'analyzer' && isAuditLocked) {
      if (onTriggerUpgrade) {
        onTriggerUpgrade('AI Resume Audit & ATS Scoring', 'plus');
      } else if (onOpenPlanModal) {
        onOpenPlanModal();
      }
      handleClose();
      return;
    }

    if (tab === 'mock-interview' && isInterviewLocked) {
      if (onTriggerUpgrade) {
        onTriggerUpgrade('Live AI Mock Interview Simulator', 'pro');
      } else if (onOpenPlanModal) {
        onOpenPlanModal();
      }
      handleClose();
      return;
    }

    setActiveTab(tab);
    handleClose();
  };

  return (
    <>
      {/* Backdrop overlay when sidebar is open */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in"
          onClick={handleClose}
        />
      )}

      {/* Left Side Corner Sidebar: Collapsed by default, ONLY slides open when user clicks Omic Hub logo */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900/98 border-r border-slate-800 shadow-2xl flex flex-col backdrop-blur-2xl transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top-Left Corner: Brand & Logo with Close Button */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-sky-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  Omic Hub
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                  AI
                </span>
              </div>
              <span className="block text-[10px] text-slate-400 font-medium -mt-0.5">
                Career Acceleration Platform
              </span>
            </div>
          </button>

          {/* Close button: visible whenever drawer is open */}
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Shortcut */}
        <div className="px-4 pt-4 pb-2">
          <button
            type="button"
            onClick={() => {
              onOpenDataRetrieval();
              handleClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs transition-all cursor-pointer group shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-medium text-slate-300">Quick Find Data...</span>
            </div>
            <span className="flex items-center gap-0.5 text-[9px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              <Command className="w-2.5 h-2.5" />K
            </span>
          </button>
        </div>

        {/* Navigation Items (Left Corner Menu) */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* Main Tools Section */}
          <div className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Career Workspace
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                      } transition-colors`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${
                        isActive
                          ? 'bg-white/20 text-white border-white/20'
                          : `${item.badgeColor || 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25'}`
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Real-time Storage & Sync Tools */}
          <div className="space-y-1 pt-2 border-t border-slate-800/60">
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Data & Settings
            </div>

            <button
              onClick={() => {
                onOpenProfileSettings('settings');
                handleClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 group-hover:rotate-45 transition-all" />
                <span>Settings & Targets</span>
              </div>
              <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors">
                Configure
              </span>
            </button>

            <button
              onClick={() => {
                onOpenDataVault();
                handleClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Data Vault</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </button>

            <button
              onClick={() => {
                onOpenDataRetrieval();
                handleClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>Universal Search</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </button>
          </div>

          {/* Subscription Plan Card */}
          {onOpenPlanModal && (
            <div className="mt-3 p-3 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-lg">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span className="capitalize">{user.planTier || 'Pro'} Plan</span>
                </span>
                <span className="text-[10px] font-black text-teal-400 px-1.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/30">
                  Trial Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight mb-2">
                First 3 Months Free &bull; All features unlocked
              </p>
              <button
                type="button"
                onClick={() => {
                  onOpenPlanModal();
                  handleClose();
                }}
                className="w-full py-1.5 px-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 hover:text-white font-bold text-[11px] border border-indigo-500/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Compare Plans (₹0 / ₹9 / ₹49)</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Left Corner: Interactive User Profile Card & Sign Out */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700/80 transition-all flex items-center justify-between gap-2.5 group">
            <button
              type="button"
              onClick={() => {
                onOpenProfileSettings('profile');
                handleClose();
              }}
              className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer flex-1"
              title="Click to view & edit Profile and Settings"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-indigo-500/50 group-hover:ring-indigo-400 transition-all shrink-0"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-950" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate leading-tight flex items-center gap-1">
                  <span>{user.role}</span>
                </p>
              </div>
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
              title="Sign Out of Omic Hub"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div
            onClick={() => onOpenProfileSettings('profile')}
            className="mt-2 px-1 flex items-center justify-between text-[10px] text-slate-500 hover:text-slate-400 cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Online &bull; Profile Pop-up
            </span>
            <span className="font-semibold text-slate-400">ATS: {atsScore}%</span>
          </div>
        </div>
      </aside>
    </>
  );
};
