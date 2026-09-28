import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  ShieldCheck,
  ArrowRight,
  FileText,
  Clock,
  Briefcase,
  Mic,
  Database,
  Award,
  ChevronRight,
  HelpCircle,
  Dna,
  Lock,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { SubscriptionPlanTier, UserProfile } from '../types';
import confetti from 'canvas-confetti';
import { useToast } from './Toast';

interface PlanSelectionLandingPageProps {
  user: UserProfile;
  onSelectPlan: (plan: SubscriptionPlanTier) => void;
  isModal?: boolean;
  onCloseModal?: () => void;
}

export const PlanSelectionLandingPage: React.FC<PlanSelectionLandingPageProps> = ({
  user,
  onSelectPlan,
  isModal = false,
  onCloseModal,
}) => {
  const { showToast } = useToast();
  const [selectedTier, setSelectedTier] = useState<SubscriptionPlanTier>(user.planTier || 'pro');
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'resume' | 'ai' | 'tracker' | 'interview'>('all');

  const handleConfirmPlan = (tier: SubscriptionPlanTier) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    showToast(
      `Plan confirmed: ${tier.toUpperCase()} with 3 Months Free! Launching your compulsory resume setup...`,
      'success'
    );
    onSelectPlan(tier);
  };

  const featureMatrix = [
    // Resume & ATS
    {
      category: 'resume',
      feature: 'Master ATS Resume Builder',
      basic: 'Standard (1 Template)',
      plus: '3 Templates (Modern, Executive, Minimal)',
      pro: 'All Templates + Custom Styling',
      trialUnlocked: true,
    },
    {
      category: 'resume',
      feature: 'Personal Info, Education & Experience Wizard',
      basic: 'Included',
      plus: 'Included',
      pro: 'Included',
      trialUnlocked: true,
    },
    {
      category: 'resume',
      feature: 'High-Resolution PDF & Print Export',
      basic: 'Plaintext / TXT only',
      plus: 'Unlimited PDF & TXT',
      pro: 'Unlimited PDF & Custom Print',
      trialUnlocked: true,
    },
    {
      category: 'resume',
      feature: 'ATS Caliber Score Checker',
      basic: 'Basic Keyword Check',
      plus: 'Live Dynamic ATS Scorer',
      pro: 'Workday & Greenhouse Rubric',
      trialUnlocked: true,
    },

    // AI & Enhancements
    {
      category: 'ai',
      feature: 'STAR Method / Google XYZ Metric Enhancer',
      basic: 'Manual suggestions',
      plus: 'Automated AI Transformation',
      pro: 'Unlimited AI Transformations',
      trialUnlocked: true,
    },
    {
      category: 'ai',
      feature: 'Bioinformatics & Computational Bio Skill Optimizer',
      basic: 'Core skill list',
      plus: 'Dynamic keyword injection',
      pro: 'Deep domain ontology matching',
      trialUnlocked: true,
    },

    // Job Tracker & Career
    {
      category: 'tracker',
      feature: 'Interactive Kanban Job Tracker',
      basic: 'Up to 3 applications',
      plus: 'Unlimited applications',
      pro: 'Unlimited + Interview notes',
      trialUnlocked: true,
    },
    {
      category: 'tracker',
      feature: 'Curated Genomics & Biotech Opportunities',
      basic: 'Standard feed',
      plus: 'Curated jobs & workshops',
      pro: 'Priority matching + Direct Fast-Track',
      trialUnlocked: true,
    },
    {
      category: 'tracker',
      feature: 'Verified Skill Proficiency Badges',
      basic: 'Self-assessment only',
      plus: 'Verified Digital Badges',
      pro: 'Verified Master Skill Badges',
      trialUnlocked: true,
    },

    // Interview & Copilot
    {
      category: 'interview',
      feature: 'Gemini AI Mock Interview Simulator',
      basic: 'Sample questions only',
      plus: 'Standard interview drills',
      pro: 'Dynamic speech & live voice audio',
      trialUnlocked: true,
    },
    {
      category: 'interview',
      feature: 'Computational Biology Domain Question Banks',
      basic: 'Basic biology questions',
      plus: 'NGS & pipeline questions',
      pro: 'Full Broad/Illumina/AlphaFold bank',
      trialUnlocked: true,
    },
    {
      category: 'interview',
      feature: 'Data Vault & Snapshot Checkpoints',
      basic: 'Local browser storage',
      plus: 'Cloud sync & 5 revisions',
      pro: 'Unlimited snapshots & 1-click restore',
      trialUnlocked: true,
    },
  ];

  const filteredMatrix = activeCategoryTab === 'all'
    ? featureMatrix
    : featureMatrix.filter((item) => item.category === activeCategoryTab);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white ${isModal ? 'p-4 sm:p-6' : 'py-8 px-4 sm:px-6 lg:px-8'}`}>
      
      {/* Top Header / Modal Close Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Dna className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white">Omic Hub</span>
            <span className="text-[10px] text-teal-400 font-semibold ml-2 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20">
              Career Acceleration
            </span>
          </div>
        </div>

        {isModal && onCloseModal && (
          <button
            onClick={onCloseModal}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            Close / Back
          </button>
        )}
      </div>

      {/* Main Pitch Banner */}
      <div className="max-w-5xl mx-auto w-full text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-amber-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Special Student Welcome &bull; First 3 Months 100% Free on All Tiers!</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Select Your Career Plan.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-300 to-indigo-400">
            All Features Unlocked.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Get everything you need to engineer high-impact ATS resumes, track opportunities, and practice with AI interviewers.
          <strong className="text-emerald-400 font-semibold block sm:inline sm:ml-1">
            Enjoy full all-access privilege for your first 3 months with ₹0 billed today!
          </strong>
        </p>

        {/* Global Access Notice Pill */}
        <div className="p-3.5 max-w-3xl mx-auto rounded-2xl bg-slate-900/90 border border-teal-500/30 text-left flex items-start sm:items-center gap-3 shadow-lg shadow-teal-500/5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xs text-slate-300">
            <span className="font-bold text-white">Full Access Initial Guarantee: </span>
            Whichever plan you choose today, you immediately receive <strong className="text-teal-300">unlimited access to all features</strong> for your first 3 months. Features are divided below so you know what each tier includes after your free trial!
          </div>
        </div>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-14 items-stretch">
        
        {/* TIER 1: Basic Plan */}
        <div
          className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border ${
            selectedTier === 'basic'
              ? 'bg-slate-900/95 border-slate-600 shadow-xl ring-2 ring-slate-500/40'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Tier</span>
              <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Free Forever
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">Basic Plan</h3>
            <p className="text-xs text-slate-400 mb-6 min-h-[32px]">
              Foundational resume builder and basic opportunity tracker for getting started.
            </p>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-white">₹0</span>
                <span className="text-xs text-slate-400">/ forever</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                Zero fees &bull; 100% Free forever
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 text-xs mb-6">
              <p className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider">Features Included:</p>
              
              <div className="flex items-start gap-2.5 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Single Master Resume Builder with live preview</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Standard ATS keyword density checker</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Plaintext & TXT format export</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Track up to 3 active job applications</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Standard bioinformatics newsfeed</span>
              </div>
              <div className="flex items-start gap-2.5 text-teal-300 font-medium bg-teal-950/30 p-2 rounded-xl border border-teal-500/20">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>Free trial bonus: Unlocked access to everything for 3 months!</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleConfirmPlan('basic')}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedTier === 'basic'
                ? 'bg-slate-700 hover:bg-slate-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <span>Select Basic (Free Forever)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* TIER 2: Plus Plan */}
        <div
          className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border ${
            selectedTier === 'plus'
              ? 'bg-gradient-to-b from-slate-900 to-indigo-950/70 border-indigo-500 shadow-2xl ring-2 ring-indigo-500/50 shadow-indigo-500/20'
              : 'bg-slate-900/80 border-indigo-500/30 hover:border-indigo-500/60'
          }`}
        >
          {/* Popular Tag Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
            ⭐ Popular for Active Students
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 mt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Advanced Tier</span>
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                3 Months FREE
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">Plus Plan</h3>
            <p className="text-xs text-slate-400 mb-6 min-h-[32px]">
              Full ATS engineering, STAR metric AI enhancer, and unlimited job tracking.
            </p>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 mb-6">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-white">₹0</span>
                <span className="text-xs text-emerald-400 font-bold">First 3 Months Free</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-indigo-500/20 text-xs">
                <span className="text-slate-400">Thereafter:</span>
                <span className="text-indigo-300 font-bold text-sm">₹9 / month</span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3 text-xs mb-6">
              <p className="font-semibold text-indigo-300 text-[11px] uppercase tracking-wider">Everything in Basic, plus:</p>

              <div className="flex items-start gap-2.5 text-slate-200">
                <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>3 ATS Templates:</strong> Modern, Executive, Minimal</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-200">
                <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>AI Bullet Improver:</strong> STAR method & quantifiable metrics</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-200">
                <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Unlimited High-Res PDF</strong> print & download</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-200">
                <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Unlimited Job Tracker</strong> with full Kanban pipeline</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-200">
                <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Full Skill Paths & Self-Paced Courses</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-200">
                <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Multi-device Real-Time Cloud Auto-Save</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleConfirmPlan('plus')}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95"
          >
            <span>Start 3 Months Free (Then ₹9/mo)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* TIER 3: Pro Plan */}
        <div
          className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border ${
            selectedTier === 'pro'
              ? 'bg-gradient-to-b from-slate-900 to-amber-950/40 border-amber-500 shadow-2xl ring-2 ring-amber-500/50 shadow-amber-500/20'
              : 'bg-slate-900/80 border-amber-500/30 hover:border-amber-500/60'
          }`}
        >
          {/* Best Value Tag Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
            👑 Complete Career Fast-Track &bull; Recommended
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 mt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Ultimate Suite</span>
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                3 Months FREE
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">Pro Plan</h3>
            <p className="text-xs text-slate-400 mb-6 min-h-[32px]">
              End-to-end AI career copilot with mock interviews, Workday ATS calibration & referrals.
            </p>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 mb-6">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-white">₹0</span>
                <span className="text-xs text-emerald-400 font-bold">First 3 Months Free</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-500/20 text-xs">
                <span className="text-slate-400">Thereafter:</span>
                <span className="text-amber-300 font-bold text-sm">₹49 / month</span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3 text-xs mb-6">
              <p className="font-semibold text-amber-300 text-[11px] uppercase tracking-wider">Everything in Plus, plus:</p>

              <div className="flex items-start gap-2.5 text-slate-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Gemini AI Mock Interviewer</strong> with dynamic voice audio</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Genomics & NGS Question Banks</strong> (Broad / Illumina rubric)</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Workday & Greenhouse</strong> Caliber Real-Time ATS Audit</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Fast-Track Lab Referrals:</strong> Schrödinger, Illumina, MSKCC</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Data Vault & Revisions:</strong> 1-click snapshots & rollback</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Priority 24/7</strong> Career Mentorship & Fast Support</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleConfirmPlan('pro')}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-95"
          >
            <span>Activate 3 Months Free (Then ₹49/mo)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Feature Breakdown & Division Section */}
      <div className="max-w-6xl mx-auto w-full rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-2xl mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <span>Features Divided According to Plan</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Transparent tier comparison. During your initial 3 months, every feature is completely open to test and use!
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setActiveCategoryTab('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeCategoryTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Features
            </button>
            <button
              onClick={() => setActiveCategoryTab('resume')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeCategoryTab === 'resume'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Resume & ATS
            </button>
            <button
              onClick={() => setActiveCategoryTab('ai')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeCategoryTab === 'ai'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              AI Optimization
            </button>
            <button
              onClick={() => setActiveCategoryTab('tracker')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeCategoryTab === 'tracker'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Job Tracker
            </button>
            <button
              onClick={() => setActiveCategoryTab('interview')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeCategoryTab === 'interview'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Mock Interview
            </button>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-bold">Platform Capability</th>
                <th className="py-3 px-4 font-bold text-slate-300">Basic (₹0)</th>
                <th className="py-3 px-4 font-bold text-indigo-400">Plus (₹9/mo after 3 mo)</th>
                <th className="py-3 px-4 font-bold text-amber-400">Pro (₹49/mo after 3 mo)</th>
                <th className="py-3 px-4 font-bold text-teal-400 text-right">3-Month Trial Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{row.feature}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{row.basic}</td>
                  <td className="py-3 px-4 text-indigo-200 font-medium">{row.plus}</td>
                  <td className="py-3 px-4 text-amber-200 font-semibold">{row.pro}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      Full Access
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compulsory Next Step Callout */}
      <div className="max-w-4xl mx-auto w-full p-6 rounded-3xl bg-gradient-to-r from-teal-950/60 via-slate-900 to-indigo-950/60 border border-teal-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Compulsory Onboarding Step 2</span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white">
            Next: Configure Your Master ATS Resume
          </h4>
          <p className="text-xs text-slate-300 max-w-lg">
            Right after selecting your plan, you will land directly into the Resume Builder to calibrate your personal info, educational background, research experience, and key skills.
          </p>
        </div>

        <button
          onClick={() => handleConfirmPlan(selectedTier)}
          className="shrink-0 px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Continue to Resume Builder</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Safety & Cancellation Guarantees */}
      <div className="max-w-4xl mx-auto text-center text-xs text-slate-500 space-y-1">
        <p>No credit card required for 3 months free trial &bull; Change or cancel plans anytime from Settings &bull; Encrypted & Private</p>
        <p>Omic Hub &copy; 2026 &bull; Bioinformatics Career Intelligence Platform</p>
      </div>

    </div>
  );
};
