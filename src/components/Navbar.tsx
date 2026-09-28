import React, { useState } from 'react';
import {
  FileText,
  Briefcase,
  GraduationCap,
  Mic,
  LayoutDashboard,
  SearchCode,
  LogOut,
  ChevronDown,
  Sparkles,
  User as UserIcon,
  Bell,
  CheckCircle2,
  Database,
  Search,
  Command,
} from 'lucide-react';
import { UserProfile } from '../types';

export type ActiveTab = 'dashboard' | 'builder' | 'analyzer' | 'tracker' | 'skills' | 'mock-interview';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile;
  onLogout: () => void;
  atsScore: number;
  totalApplications: number;
  onOpenDataRetrieval?: () => void;
  onOpenDataVault?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  atsScore,
  totalApplications,
  onOpenDataRetrieval,
  onOpenDataVault,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'builder',
      label: 'Resume Builder',
      icon: <FileText className="w-4 h-4" />,
      badge: `${atsScore}% ATS`,
    },
    {
      id: 'analyzer',
      label: 'AI Analyzer',
      icon: <SearchCode className="w-4 h-4" />,
    },
    {
      id: 'tracker',
      label: 'Job Tracker',
      icon: <Briefcase className="w-4 h-4" />,
      badge: `${totalApplications}`,
    },
    {
      id: 'skills',
      label: 'Courses',
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      id: 'mock-interview',
      label: 'Mock Interview',
      icon: <Mic className="w-4 h-4" />,
      badge: 'Live AI',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  Omic Hub <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">AI</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-medium -mt-0.5">
                  Career Acceleration Hub
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Data Retrieval Button */}
            {onOpenDataRetrieval && (
              <button
                type="button"
                onClick={onOpenDataRetrieval}
                className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs cursor-pointer group"
                title="Quick Retrieve Any Saved Career Data (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-medium text-slate-300">Quick Find Data...</span>
                <span className="flex items-center gap-0.5 text-[9px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  <Command className="w-2.5 h-2.5" />K
                </span>
              </button>
            )}

            {/* Real-time Sync Status Pill */}
            {onOpenDataVault && (
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
            )}

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
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

            {/* User Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1 pl-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 transition-all cursor-pointer"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/50"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-400 leading-none mt-1 truncate max-w-[120px]">
                    {user.role}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] px-2 py-1 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">ATS Rating</span>
                      <span className="text-emerald-400 font-bold">{atsScore}/100</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>Career Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('builder');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Edit Active Resume</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
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

        {/* Mobile Subnav Strip */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
