import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import { SignInPage } from './components/SignInPage';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { ResumeBuilderView } from './components/ResumeBuilder/ResumeBuilderView';
import { ResumeAnalyzerView } from './components/ResumeAnalyzer/ResumeAnalyzerView';
import { JobTrackerView } from './components/JobTracker/JobTrackerView';
import { SkillPathsView } from './components/SkillPaths/SkillPathsView';
import { MockInterviewView } from './components/MockInterview/MockInterviewView';
import { DataRetrievalModal } from './components/DataRetrievalModal';
import { DataVaultModal } from './components/DataVaultModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { PlanSelectionLandingPage } from './components/PlanSelectionLandingPage';
import { FeatureGateModal } from './components/FeatureGateModal';
import { SubscriptionPlanModal } from './components/SubscriptionPlanModal';
import { RecruiterDashboardView } from './components/Recruiter/RecruiterDashboardView';
import {
  StorageService,
  DEFAULT_USER,
} from './services/storage';
import { UserProfile, ResumeData, JobApplication, Course, ScheduledInterview, ActivityItem, SubscriptionPlanTier } from './types';
import { Search, Database, Sparkles, Crown, ArrowRight, Building2, LogOut } from 'lucide-react';

function MainApp() {
  const { showToast } = useToast();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return StorageService.isAuthenticated();
  });
  const [user, setUser] = useState<UserProfile>(() => {
    return StorageService.getUser();
  });

  // App Navigation State & Mobile Drawer State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Modals for Real-Time Vault, Data Retrieval, Profile & Settings, Plan Selection, and Feature Gate
  const [isDataRetrievalOpen, setIsDataRetrievalOpen] = useState(false);
  const [isDataVaultOpen, setIsDataVaultOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isFeatureGateOpen, setIsFeatureGateOpen] = useState(false);
  const [gatedFeatureInfo, setGatedFeatureInfo] = useState<{
    name: string;
    requiredTier: SubscriptionPlanTier;
    description?: string;
    targetTab?: ActiveTab;
  }>({
    name: 'Pro Career Accelerator',
    requiredTier: 'pro',
  });
  const [profileSettingsTab, setProfileSettingsTab] = useState<'profile' | 'settings'>('profile');

  // Core Data States
  const [resume, setResume] = useState<ResumeData>(() => StorageService.getResume());
  const [applications, setApplications] = useState<JobApplication[]>(() =>
    StorageService.getApplications()
  );
  const [activities, setActivities] = useState<ActivityItem[]>(() =>
    StorageService.getActivities()
  );
  const [courses, setCourses] = useState<Course[]>(() => StorageService.getCourses());
  const [scheduledInterviews, setScheduledInterviews] = useState<ScheduledInterview[]>(() =>
    StorageService.getScheduledInterviews()
  );

  // Real-time synchronization across browser tabs and background storage events
  useEffect(() => {
    const unsubscribe = StorageService.subscribe((key) => {
      setUser(StorageService.getUser());
      setResume(StorageService.getResume());
      setApplications(StorageService.getApplications());
      setActivities(StorageService.getActivities());
      setCourses(StorageService.getCourses());
      setScheduledInterviews(StorageService.getScheduledInterviews());
    });
    return () => unsubscribe();
  }, []);

  // Global Keyboard Shortcut for on-demand data search (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsDataRetrievalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Synchronize Auth on Login
  const handleLoginSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setIsAuthenticated(true);
    StorageService.saveUser(authenticatedUser);
    StorageService.setAuthenticated(true);

    if (authenticatedUser.hasSelectedPlan) {
      setActiveTab('dashboard');
    }

    StorageService.addActivity({
      type: 'resume',
      title: 'Signed In to Omic Hub',
      description: `Authenticated as ${authenticatedUser.name} (${authenticatedUser.role})`,
      badge: 'Session Active',
    });
    setActivities(StorageService.getActivities());
  };

  // Handle Plan Selection from Post-Sign-In Landing Page or Modal
  const handleSelectPlan = (tier: SubscriptionPlanTier) => {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 90);

    const updatedUser: UserProfile = {
      ...user,
      planTier: tier,
      planStatus: 'trial',
      trialEndDate: trialEnd.toISOString(),
      hasSelectedPlan: true,
      hasCompletedResumeOnboarding: false,
    };

    setUser(updatedUser);
    StorageService.saveUser(updatedUser);

    // Compulsory flow: Direct to Resume Building page
    setActiveTab('builder');

    StorageService.addActivity({
      type: 'resume',
      title: `Activated ${tier.toUpperCase()} Plan (3 Months Free Trial)`,
      description: `Welcome offer active! Full access granted across all features. Commencing compulsory Master Resume setup.`,
      badge: '3-Month Free Trial',
    });
    setActivities(StorageService.getActivities());

    showToast(
      `Plan confirmed: ${tier.toUpperCase()} (3 Months Free)! Welcome to your compulsory Master Resume setup.`,
      'success'
    );
  };

  // Trigger Clean Subscription Plans modal whenever a user clicks Mock Interview or Full ATS Resume Scan
  const handleTriggerUpgrade = (
    featureName: string,
    requiredTier: SubscriptionPlanTier = 'pro',
    description?: string,
    targetTab?: ActiveTab
  ) => {
    setGatedFeatureInfo({
      name: featureName,
      requiredTier,
      description,
      targetTab,
    });
    setIsPlanModalOpen(true);
  };

  // Callback when user upgrades from FeatureGateModal
  const handleUpgradeFromGate = (tier: SubscriptionPlanTier) => {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 90);

    const updatedUser: UserProfile = {
      ...user,
      planTier: tier,
      planStatus: 'trial',
      trialEndDate: trialEnd.toISOString(),
      hasSelectedPlan: true,
    };

    setUser(updatedUser);
    StorageService.saveUser(updatedUser);

    StorageService.addActivity({
      type: 'resume',
      title: `Upgraded to ${tier.toUpperCase()}`,
      description: `Unlocked ${gatedFeatureInfo.name} and all corresponding tier tools.`,
      badge: `${tier.toUpperCase()} Active`,
    });
    setActivities(StorageService.getActivities());

    if (gatedFeatureInfo.targetTab) {
      setActiveTab(gatedFeatureInfo.targetTab);
    }
  };

  // Gate Data Vault to Pro tier
  const handleOpenDataVault = () => {
    if (user.planTier !== 'pro') {
      handleTriggerUpgrade(
        'Advanced Bioinformatics Pipelines Data Vault',
        'pro',
        'The Advanced Pipelines Data Vault offers multi-revision automated snapshots, 1-click cloud rollbacks, and tamper-proof JSON checkpoints for your bioinformatics career records.'
      );
      return;
    }
    setIsDataVaultOpen(true);
  };

  // Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    StorageService.setAuthenticated(false);
    showToast('Signed out of Omic Hub', 'info');
  };

  // Refresh all state after a restore from backup
  const handleRefreshAllData = () => {
    setUser(StorageService.getUser());
    setResume(StorageService.getResume());
    setApplications(StorageService.getApplications());
    setActivities(StorageService.getActivities());
    setCourses(StorageService.getCourses());
    setScheduledInterviews(StorageService.getScheduledInterviews());
  };

  // Resume Save Handler
  const handleSaveResume = (updated: ResumeData) => {
    setResume(updated);
    StorageService.saveResume(updated);
  };

  // Applications Save Handler
  const handleSaveApplications = (updated: JobApplication[]) => {
    setApplications(updated);
    StorageService.saveApplications(updated);
    setUser((prev) => {
      const nextUser = { ...prev, totalApplications: updated.length };
      StorageService.saveUser(nextUser);
      return nextUser;
    });
  };

  // Courses Save Handler
  const handleSaveCourses = (updated: Course[]) => {
    setCourses(updated);
    StorageService.saveCourses(updated);
    const totalHours = updated.reduce((acc, c) => acc + c.completedHours, 0);
    setUser((prev) => {
      const nextUser = { ...prev, learningHours: totalHours };
      StorageService.saveUser(nextUser);
      return nextUser;
    });
  };

  // Scheduled Interviews Save Handler
  const handleSaveInterviews = (updated: ScheduledInterview[]) => {
    setScheduledInterviews(updated);
    StorageService.saveScheduledInterviews(updated);
  };

  // Apply enhanced bullet from analyzer directly to active resume
  const handleApplyBulletToResume = (enhancedBullet: string) => {
    if (!resume.workExperiences.length) return;
    const copy = { ...resume };
    copy.workExperiences[0].bullets.unshift(enhancedBullet);
    handleSaveResume(copy);
    StorageService.addActivity({
      type: 'resume',
      title: 'Applied AI Enhanced Bullet',
      description: `Updated primary experience role with high-yield XYZ metric bullet.`,
      badge: 'Score Boost',
    });
    setActivities(StorageService.getActivities());
  };

  // Profile & Settings Pop-up Handlers
  const handleOpenProfileSettings = (tab: 'profile' | 'settings' = 'profile') => {
    setProfileSettingsTab(tab);
    setIsProfileSettingsOpen(true);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  // If not authenticated, render the SignInPage
  if (!isAuthenticated) {
    return <SignInPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Post-Sign-In Dedicated Landing Page: Options for Basic, Plus, and Pro with First 3 Months Free
  // (Recruiters proceed directly to their specialized recruiter talent hub)
  if (user.userType !== 'recruiter' && !user.hasSelectedPlan) {
    return (
      <PlanSelectionLandingPage
        user={user}
        onSelectPlan={handleSelectPlan}
      />
    );
  }

  // Step 3 for first-time students: Compulsory Master Resume Builder Onboarding
  if (user.userType !== 'recruiter' && !user.hasCompletedResumeOnboarding) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Omic Hub</span>
                <span className="text-[10px] font-black text-teal-300 uppercase px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30">
                  Step 2 of 2: Master Resume Setup
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Mandatory first-time calibration &bull; Real-time auto-saving
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const nextUser = { ...user, hasCompletedResumeOnboarding: true };
              setUser(nextUser);
              StorageService.saveUser(nextUser);
              showToast('Master resume calibrated! Welcome to your dashboard.', 'success');
              setActiveTab('dashboard');
            }}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>Finish Setup & Launch Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <ResumeBuilderView
            initialResume={resume}
            onSave={handleSaveResume}
            onBackToDashboard={() => {
              const nextUser = { ...user, hasCompletedResumeOnboarding: true };
              setUser(nextUser);
              StorageService.saveUser(nextUser);
              setActiveTab('dashboard');
            }}
            isOnboarding={true}
            onFinishOnboarding={() => {
              const nextUser = { ...user, hasCompletedResumeOnboarding: true };
              setUser(nextUser);
              StorageService.saveUser(nextUser);
              showToast('Master resume calibrated! Welcome to your dashboard.', 'success');
              setActiveTab('dashboard');
            }}
            userPlan={user.planTier}
          />
        </main>
      </div>
    );
  }

  // STRICT ACCESS CONTROL FOR RECRUITERS:
  // Ensure recruiters CANNOT access or view the Student Portal, student courses, or student tools upon logging in.
  if (user.userType === 'recruiter') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
        {/* Dedicated Recruiter Header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-teal-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight">Omic Hub</span>
                <span className="text-[10px] font-bold text-indigo-300 uppercase px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30">
                  Recruiter Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {user.companyName || user.name} &bull; Verified Computational Biology Hiring Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-white">{user.companyName || user.name}</span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-slate-400 text-[11px]">{user.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/15 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer"
              title="Sign out of Recruiter Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Recruiter Workspace: Strictly RecruiterDashboardView */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <RecruiterDashboardView
            user={user}
            onLogout={handleLogout}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-indigo-500 selection:text-white">
      {/* Left-Side Corner Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        atsScore={user.atsScore}
        totalApplications={applications.length}
        onOpenDataRetrieval={() => setIsDataRetrievalOpen(true)}
        onOpenDataVault={handleOpenDataVault}
        onOpenProfileSettings={handleOpenProfileSettings}
        onOpenPlanModal={() => setIsPlanModalOpen(true)}
        onTriggerUpgrade={(feat, tier) =>
          handleTriggerUpgrade(
            feat,
            tier || 'pro',
            undefined,
            feat.includes('Audit') ? 'analyzer' : feat.includes('Interview') ? 'mock-interview' : undefined
          )
        }
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        isOpen={mobileSidebarOpen}
        setIsOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area (Full width with collapsible drawer) */}
      <div className="flex-1 min-w-0 flex flex-col transition-all">
        {/* Top Header Bar */}
        <TopHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onLogout={handleLogout}
          atsScore={user.atsScore}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          onOpenDataRetrieval={() => setIsDataRetrievalOpen(true)}
          onOpenDataVault={handleOpenDataVault}
          onOpenProfileSettings={handleOpenProfileSettings}
          onOpenPlanModal={() => setIsPlanModalOpen(true)}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              user={user}
              resume={resume}
              applications={applications}
              activities={activities}
              atsScore={user.atsScore}
              setActiveTab={setActiveTab}
              onOpenResumeBuilder={() => setActiveTab('builder')}
              onOpenMockInterview={() => {
                if (user.planTier !== 'pro') {
                  handleTriggerUpgrade('Live AI Mock Interview Simulator', 'pro', undefined, 'mock-interview');
                  return;
                }
                setActiveTab('mock-interview');
              }}
              onOpenResumeAnalyzer={() => {
                if (user.planTier === 'basic') {
                  handleTriggerUpgrade('AI Resume Audit & ATS Scoring', 'plus', undefined, 'analyzer');
                  return;
                }
                setActiveTab('analyzer');
              }}
              onOpenDataRetrieval={() => setIsDataRetrievalOpen(true)}
              onOpenDataVault={handleOpenDataVault}
              onOpenProfileSettings={() => handleOpenProfileSettings('profile')}
              onUpdateResume={handleSaveResume}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {activeTab === 'builder' && (
            <ResumeBuilderView
              initialResume={resume}
              onSave={handleSaveResume}
              onBackToDashboard={() => {
                if (!user.hasCompletedResumeOnboarding) {
                  const nextUser = { ...user, hasCompletedResumeOnboarding: true };
                  setUser(nextUser);
                  StorageService.saveUser(nextUser);
                }
                setActiveTab('dashboard');
              }}
              isOnboarding={!user.hasCompletedResumeOnboarding}
              onFinishOnboarding={() => {
                const nextUser = { ...user, hasCompletedResumeOnboarding: true };
                setUser(nextUser);
                StorageService.saveUser(nextUser);
                showToast('Master resume calibrated! Welcome to your dashboard.', 'success');
                setActiveTab('dashboard');
              }}
              userPlan={user.planTier}
            />
          )}

          {activeTab === 'analyzer' && (
            user.planTier === 'basic' ? (
              <div className="rounded-3xl bg-[#0b0f19] border border-indigo-500/30 p-8 sm:p-12 text-center space-y-6 max-w-3xl mx-auto shadow-2xl animate-in fade-in">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 shadow-lg shadow-indigo-500/20">
                  <Sparkles className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
                    Feature Locked &bull; Requires Basic Plus or Pro
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    AI Resume Audit & ATS Scoring
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                    Calibrate your bioinformatics resume against real ATS parsing algorithms, optimize keyword density for Nextflow/Python/GATK, and generate quantified STAR metrics.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 max-w-md mx-auto flex items-center justify-between">
                  <div className="text-left">
                    <span className="font-bold text-white block">Special 3-Month Trial</span>
                    <span className="text-[11px] text-teal-400">Unlock today with ₹0 charged!</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    ₹9 / ₹49
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => handleTriggerUpgrade('AI Resume Audit & ATS Scoring', 'pro', undefined, 'analyzer')}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-102 cursor-pointer"
                  >
                    Upgrade to Pro for ₹49
                  </button>
                  <button
                    onClick={() => handleUpgradeFromGate('plus')}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 font-bold text-xs transition-all cursor-pointer"
                  >
                    Unlock on Basic Plus (₹9)
                  </button>
                </div>
              </div>
            ) : (
              <ResumeAnalyzerView
                currentResume={resume}
                onApplyBulletToResume={handleApplyBulletToResume}
                onOpenBuilder={() => setActiveTab('builder')}
              />
            )
          )}

          {activeTab === 'tracker' && (
            <JobTrackerView
              applications={applications}
              onSaveApplications={handleSaveApplications}
              onScheduleInterview={(app) => {
                if (user.planTier !== 'pro') {
                  handleTriggerUpgrade('Live AI Mock Interview Simulator', 'pro', undefined, 'mock-interview');
                  return;
                }
                setActiveTab('mock-interview');
              }}
            />
          )}

          {activeTab === 'skills' && (
            <SkillPathsView
              courses={courses}
              onSaveCourses={handleSaveCourses}
              userRole={user.role}
              targetRole={user.targetRole}
              userPlan={user.planTier}
              onTriggerUpgrade={(feat, tier) => handleTriggerUpgrade(feat, tier || 'pro')}
            />
          )}

          {activeTab === 'mock-interview' && (
            user.planTier !== 'pro' ? (
              <div className="rounded-3xl bg-[#0b0f19] border border-amber-500/30 p-8 sm:p-12 text-center space-y-6 max-w-3xl mx-auto shadow-2xl animate-in fade-in">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-500/20">
                  <Crown className="w-8 h-8 text-amber-400" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                    Pro Tier Exclusive Feature
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Live AI Mock Interview Simulator
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                    Engage in dynamic, voice-enabled technical coding drills and computational biology behavioral interviews benchmarked against Broad Institute, Illumina, and Schrödinger hiring standards.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 max-w-md mx-auto flex items-center justify-between">
                  <div className="text-left">
                    <span className="font-bold text-white block">Includes Live Voice & Evaluation</span>
                    <span className="text-[11px] text-teal-400">STAR rubric analysis with score breakdown</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    Pro Tier (₹49)
                  </span>
                </div>
                <button
                  onClick={() => handleTriggerUpgrade('Live AI Mock Interview Simulator', 'pro', undefined, 'mock-interview')}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-extrabold text-sm shadow-xl shadow-amber-500/30 transition-all hover:scale-102 cursor-pointer"
                >
                  Upgrade to Pro for ₹49
                </button>
              </div>
            ) : (
              <MockInterviewView
                scheduledInterviews={scheduledInterviews}
                onSaveInterviews={handleSaveInterviews}
                targetRole={user.targetRole}
                resume={resume}
                onUpdateResume={handleSaveResume}
              />
            )
          )}
        </main>

        {/* Modern Footer */}
        <footer className="no-print border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-medium text-slate-400 flex items-center gap-2">
              <span>Omic Hub &bull; Career Acceleration & Resume Intelligence Platform</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Real-Time Auto-Save Active
              </span>
            </p>
            <div className="flex items-center gap-4 text-slate-500">
              <span>ATS Engine v3.8</span>
              <span>&bull;</span>
              <span>STAR Method Calibration</span>
              <span>&bull;</span>
              <span>Workday & Greenhouse Optimized</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Real-Time Data Retrieval Quick Button */}
      <aside aria-label="Quick Actions" className="fixed bottom-6 right-6 z-40 flex items-center gap-2 no-print">
        <button
          onClick={() => setIsDataRetrievalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-indigo-400/30"
          title="Quick Retrieve Any Saved Data (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Retrieve Data</span>
        </button>

        <button
          onClick={handleOpenDataVault}
          className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Data Vault & Backups"
        >
          <Database className="w-4 h-4 text-emerald-400" />
        </button>
      </aside>

      {/* Data Retrieval Modal (Command Palette Search) */}
      <DataRetrievalModal
        isOpen={isDataRetrievalOpen}
        onClose={() => setIsDataRetrievalOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Data Vault & Backup Modal */}
      <DataVaultModal
        isOpen={isDataVaultOpen}
        onClose={() => setIsDataVaultOpen(false)}
        onDataRestored={handleRefreshAllData}
      />

      {/* Profile & Settings Pop-up Modal */}
      <ProfileSettingsModal
        isOpen={isProfileSettingsOpen}
        onClose={() => setIsProfileSettingsOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        onOpenDataVault={handleOpenDataVault}
        onOpenPlanModal={() => setIsPlanModalOpen(true)}
        initialTab={profileSettingsTab}
      />

      {/* Clean Modal Dialog for Subscription Plans with Razorpay / UPI Gateway */}
      <SubscriptionPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onUpgrade={(tier) => {
          handleUpgradeFromGate(tier);
          setIsPlanModalOpen(false);
        }}
        user={user}
        initialSelectedTier={gatedFeatureInfo.requiredTier || 'pro'}
        triggeredByFeature={gatedFeatureInfo.name}
      />

      {/* Sleek Glassmorphism Feature Gate Modal */}
      <FeatureGateModal
        isOpen={isFeatureGateOpen}
        onClose={() => setIsFeatureGateOpen(false)}
        onUpgrade={handleUpgradeFromGate}
        user={user}
        featureName={gatedFeatureInfo.name}
        requiredTier={gatedFeatureInfo.requiredTier}
        featureDescription={gatedFeatureInfo.description}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
