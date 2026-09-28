import React from 'react';
import {
  Crown,
  Sparkles,
  Check,
  X,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Flame,
} from 'lucide-react';
import { SubscriptionPlanTier, UserProfile } from '../types';
import confetti from 'canvas-confetti';
import { useToast } from './Toast';

export interface FeatureGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (tier: SubscriptionPlanTier) => void;
  user: UserProfile;
  featureName?: string;
  requiredTier?: SubscriptionPlanTier;
  featureDescription?: string;
}

export const FeatureGateModal: React.FC<FeatureGateModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  user,
  featureName = 'Pro Career Accelerator',
  requiredTier = 'pro',
  featureDescription,
}) => {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSelectUpgrade = (tier: SubscriptionPlanTier) => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
    showToast(
      `Upgraded to ${tier === 'pro' ? 'Pro Tier (₹49)' : 'Basic Plus (₹9)'}! All associated features unlocked.`,
      'success'
    );
    onUpgrade(tier);
    onClose();
  };

  const comparisonRows = [
    {
      feature: 'Master Resume Builder (Standard Templates)',
      free: 'Included',
      plus: 'Included',
      pro: 'Included',
      highlight: false,
    },
    {
      feature: 'Free Coursera & NPTEL Course Listings',
      free: 'Included',
      plus: 'Included',
      pro: 'Included',
      highlight: false,
    },
    {
      feature: 'Full AI Resume Audit & ATS Scoring',
      free: false,
      plus: true,
      pro: true,
      highlight: featureName.toLowerCase().includes('audit') || featureName.toLowerCase().includes('ats'),
    },
    {
      feature: 'Live Mock Interview AI Simulator',
      free: false,
      plus: false,
      pro: true,
      highlight: featureName.toLowerCase().includes('interview'),
    },
    {
      feature: 'Direct Internship & Workshop Applications',
      free: false,
      plus: false,
      pro: true,
      highlight: featureName.toLowerCase().includes('internship') || featureName.toLowerCase().includes('apply'),
    },
    {
      feature: 'Advanced Bioinformatics Pipelines Data Vault',
      free: false,
      plus: false,
      pro: true,
      highlight: featureName.toLowerCase().includes('vault') || featureName.toLowerCase().includes('data'),
    },
    {
      feature: 'Workday & Greenhouse Scoring Rubrics',
      free: false,
      plus: 'Standard',
      pro: 'Full Depth',
      highlight: false,
    },
    {
      feature: 'Priority Mentorship & Verified Skill Badges',
      free: false,
      plus: false,
      pro: true,
      highlight: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Sleek Glassmorphism Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-4xl bg-slate-900/90 border border-slate-700/80 rounded-3xl shadow-2xl shadow-indigo-950/60 backdrop-blur-2xl overflow-hidden z-10 my-8 flex flex-col text-slate-100">
        
        {/* Glow Accent Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-indigo-500 to-amber-400" />
        
        {/* Header Bar */}
        <div className="p-6 sm:p-8 pb-4 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors border border-slate-700/50"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-indigo-500/20 to-teal-500/20 border border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/10">
              <Crown className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Feature Gate
                </span>
                <span className="text-xs text-slate-400">
                  Current: <strong className="text-white capitalize">{user.planTier || 'Free Tier'}</strong>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Unlock {featureName}
              </h2>
            </div>
          </div>

          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {featureDescription ||
              `The ${featureName} feature requires an active subscription tier. Upgrade your account today to unlock real-time intelligence, live AI simulators, and direct career acceleration.`}
          </p>

          {/* Welcome Promo Ribbon */}
          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-teal-950/60 via-indigo-950/50 to-slate-900 border border-teal-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-teal-200">
              <Sparkles className="w-4 h-4 text-teal-300 shrink-0" />
              <span>
                <strong>Welcome Offer:</strong> First 3 months 100% free on trial activation! Or upgrade immediately for uninterrupted access.
              </span>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-extrabold text-teal-400 bg-teal-500/15 px-2.5 py-1 rounded-full border border-teal-500/30 shrink-0">
              Special ₹0 Trial
            </span>
          </div>
        </div>

        {/* Sleek Comparison Table */}
        <div className="px-6 sm:px-8 py-2 overflow-x-auto">
          <div className="min-w-[600px] rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="py-3 px-4 text-slate-400 font-semibold w-2/5">Capabilities & Tooling</th>
                  <th className="py-3 px-3 text-slate-300 font-bold text-center w-1/5">
                    Free Tier
                    <span className="block text-[10px] text-slate-500 font-normal">₹0 / forever</span>
                  </th>
                  <th className="py-3 px-3 text-indigo-300 font-bold text-center w-1/5 bg-indigo-950/20">
                    Basic Plus
                    <span className="block text-[10px] text-indigo-400/80 font-normal">₹9 (3 Mo Free)</span>
                  </th>
                  <th className="py-3 px-3 text-amber-300 font-black text-center w-1/5 bg-amber-500/10 border-x border-amber-500/30">
                    👑 Pro Tier
                    <span className="block text-[10px] text-amber-400 font-semibold">₹49 (3 Mo Free)</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      row.highlight
                        ? 'bg-amber-500/10'
                        : idx % 2 === 0
                        ? 'bg-slate-900/20'
                        : 'bg-transparent'
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-200 font-medium">
                      {row.feature}
                      {row.highlight && (
                        <span className="ml-2 text-[10px] text-amber-300 font-bold uppercase bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40">
                          Selected
                        </span>
                      )}
                    </td>

                    {/* Free Column */}
                    <td className="py-3 px-3 text-center">
                      {row.free === true ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : row.free === false ? (
                        <X className="w-4 h-4 text-slate-600 mx-auto" />
                      ) : (
                        <span className="text-slate-400 font-medium">{row.free}</span>
                      )}
                    </td>

                    {/* Basic Plus Column */}
                    <td className="py-3 px-3 text-center bg-indigo-950/10">
                      {row.plus === true ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : row.plus === false ? (
                        <X className="w-4 h-4 text-slate-600 mx-auto" />
                      ) : (
                        <span className="text-indigo-300 font-semibold">{row.plus}</span>
                      )}
                    </td>

                    {/* Pro Tier Column */}
                    <td className="py-3 px-3 text-center bg-amber-500/5 border-x border-amber-500/20 font-bold">
                      {row.pro === true ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-amber-300">{row.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons & Footer */}
        <div className="p-6 sm:p-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 mt-2 bg-slate-950/40">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <span className="text-slate-300 font-medium">Instant 1-click activation.</span> No credit card required for 3-month free trial.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {requiredTier === 'basic' || requiredTier === 'plus' ? (
              <button
                type="button"
                onClick={() => handleSelectUpgrade('plus')}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 font-bold text-xs transition-all cursor-pointer"
              >
                Choose Basic Plus (₹9)
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => handleSelectUpgrade('pro')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-extrabold text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-102 active:scale-95 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-200" />
              <span>Upgrade to Pro for ₹49</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
