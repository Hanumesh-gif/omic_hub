import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Sparkles,
  Send,
  X,
  Award,
  ShieldCheck,
  FileText,
  DollarSign,
  MapPin,
  Clock,
  Briefcase,
} from 'lucide-react';
import { CompanyReferral, CertifiedSkillBadge, ResumeData } from '../../types';
import { useToast } from '../Toast';
import confetti from 'canvas-confetti';

interface CompanyReferralModalProps {
  referral: CompanyReferral | null;
  isOpen: boolean;
  onClose: () => void;
  badges: CertifiedSkillBadge[];
  resume: ResumeData;
  onSubmitReferral: (referralId: string) => void;
}

export const CompanyReferralModal: React.FC<CompanyReferralModalProps> = ({
  referral,
  isOpen,
  onClose,
  badges,
  resume,
  onSubmitReferral,
}) => {
  const { showToast } = useToast();
  const [candidatePitch, setCandidatePitch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !referral) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      onSubmitReferral(referral.id);
      setSubmitting(false);
      onClose();
      confetti({ particleCount: 55, spread: 70, origin: { y: 0.6 } });
      showToast(`Fast-Track Referral submitted directly to ${referral.companyName}!`, 'success');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-200 my-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Company Header */}
        <div className="flex items-start gap-4">
          <img
            src={referral.logo}
            alt={referral.companyName}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {referral.referralChannel}
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {referral.matchScore}% Match
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {referral.companyName}
            </h2>
            <p className="text-sm font-semibold text-slate-300">
              {referral.roleTitle}
            </p>
          </div>
        </div>

        {/* Key Role Highlights */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span>{referral.location}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>{referral.salaryRange}</span>
          </div>
        </div>

        {/* Sponsor Partner Endorsement */}
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Talent Partner Referral Sponsor:</span>
          </div>
          <p className="text-slate-300 italic leading-relaxed">
            "{referral.sponsorQuote}"
          </p>
        </div>

        {/* Attached Verification Credentials */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Automatically Attached Verified Assets:
          </label>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white">{resume.personalInfo.fullName}'s Master Resume</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                ATS-Optimized
              </span>
            </div>

            {badges.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-white">
                    {badges.length} Verified Technical Skill Badges
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Credential
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Candidate Pitch / Note */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Direct Note to {referral.companyName} Talent Team (Optional)
            </label>
            <textarea
              rows={3}
              value={candidatePitch}
              onChange={(e) => setCandidatePitch(e.target.value)}
              placeholder={`Highlight your relevant system experience: e.g. "I built Nextflow variant calling pipelines processing high-coverage WGS and scored 94% on Omic Hub's technical assessment for ${referral.requiredCertifiedSkills.slice(0, 2).join(' & ')}."`}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || referral.status === 'Referred'}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>
                {referral.status === 'Referred'
                  ? 'Referral Dispatched'
                  : submitting
                  ? 'Dispatching Referral...'
                  : `Submit Fast-Track Referral to ${referral.companyName}`}
              </span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
