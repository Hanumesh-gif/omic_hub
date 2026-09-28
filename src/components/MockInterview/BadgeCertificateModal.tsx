import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Copy,
  ExternalLink,
  Download,
  Share2,
  X,
  FileText,
  ShieldCheck,
  Send,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { CertifiedSkillBadge } from '../../types';
import { useToast } from '../Toast';
import confetti from 'canvas-confetti';

interface BadgeCertificateModalProps {
  badge: CertifiedSkillBadge | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToResume: (badge: CertifiedSkillBadge) => void;
  onOpenReferral?: (skillName: string) => void;
}

export const BadgeCertificateModal: React.FC<BadgeCertificateModalProps> = ({
  badge,
  isOpen,
  onClose,
  onAddToResume,
  onOpenReferral,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !badge) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(badge.verificationUrl);
    setCopied(true);
    showToast('Verification link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddToResumeClick = () => {
    onAddToResume(badge);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    showToast(`Added "${badge.skillName}" certified badge to resume!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-200 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Display Card */}
        <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950 border-2 border-indigo-500/40 shadow-inner space-y-6 overflow-hidden">
          
          {/* Watermark Pattern */}
          <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
            <Award className="w-64 h-64 text-indigo-400" />
          </div>

          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 p-0.5 shadow-lg shadow-indigo-600/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Award className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400 block">
                  Omic Hub Computational Biology Academy
                </span>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Verified Skill Credential
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Credential</span>
              </span>
            </div>
          </div>

          {/* Recipient & Skill Body */}
          <div className="space-y-4 text-center sm:text-left">
            <div>
              <p className="text-xs text-slate-400 font-medium">This certifies that</p>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Alex Morgan
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                has successfully passed rigorous technical evaluations in:
              </p>
            </div>

            {/* Certified Skill Pill & Score */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  {badge.category}
                </span>
                <h4 className="text-base font-extrabold text-white">
                  {badge.skillName}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Credential Level: <strong className="text-indigo-300">{badge.level}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 self-start sm:self-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Score</span>
                  <div className="text-2xl font-black text-emerald-400">{badge.score}%</div>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Rating</span>
                  <span className="text-xs font-bold text-sky-300">Top 5%</span>
                </div>
              </div>
            </div>

            {/* Assessed Competencies */}
            {badge.assessedAreas && badge.assessedAreas.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Assessed Technical Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {badge.assessedAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium"
                    >
                      &bull; {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rubric Evaluation Lens */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
              <span className="text-indigo-400 font-semibold">Evaluation Rubric:</span> {badge.interviewerLens}
            </div>

            {/* Verification Metadata Footer */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-400 border-t border-slate-800/80">
              <div>
                <span className="text-slate-500 block">Credential ID:</span>
                <strong className="text-slate-300 font-mono">{badge.verificationId}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Issued Date:</span>
                <strong className="text-slate-300">{badge.issuedDate}</strong>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-500 block">Status:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active & Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Link Bar */}
        <div className="mt-6 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="truncate text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Shareable Public Verification URL
            </span>
            <span className="text-indigo-300 font-mono select-all truncate block">
              {badge.verificationUrl}
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToResumeClick}
              disabled={badge.addedToResume}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                badge.addedToResume
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-95'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{badge.addedToResume ? 'Added to Resume' : 'Add Badge to Resume'}</span>
            </button>

            {onOpenReferral && (
              <button
                onClick={() => {
                  onClose();
                  onOpenReferral(badge.skillName);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white text-xs font-bold transition-all border border-slate-700 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Fast-Track Referrals</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
