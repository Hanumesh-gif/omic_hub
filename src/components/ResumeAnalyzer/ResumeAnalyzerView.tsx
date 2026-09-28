import React, { useState } from 'react';
import {
  SearchCode,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  TrendingUp,
  Briefcase,
  Layers,
  FileCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { ResumeData, ResumeAnalysisResult } from '../../types';
import { analyzeFullResume } from '../../services/api';
import { useToast } from '../Toast';
import confetti from 'canvas-confetti';

interface ResumeAnalyzerViewProps {
  currentResume: ResumeData;
  onApplyBulletToResume: (enhancedBullet: string) => void;
  onOpenBuilder: () => void;
}

const ROLES_LIST = [
  'Senior Full-Stack Engineer',
  'Staff Systems & Cloud Architect',
  'Lead Product Manager',
  'Machine Learning / AI Engineer',
  'Engineering Manager / Director',
  'DevOps & Infrastructure Lead',
  'Senior Frontend Platform Engineer',
  'Data Platform Engineer',
];

const INDUSTRIES_LIST = [
  'Enterprise SaaS & Cloud Infrastructure',
  'FinTech & High-Frequency Trading',
  'AI & Autonomous Systems',
  'HealthTech & Biomedical',
  'Consumer Tech & Mobile Apps',
  'Cybersecurity & Network Defense',
];

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({
  currentResume,
  onApplyBulletToResume,
  onOpenBuilder,
}) => {
  const { showToast } = useToast();
  const [targetRole, setTargetRole] = useState(ROLES_LIST[0]);
  const [industry, setIndustry] = useState(INDUSTRIES_LIST[0]);
  const [resumeText, setResumeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Initialize with formatted text from current resume
  const handleLoadCurrentResume = () => {
    const text = `${currentResume.personalInfo.fullName}
${currentResume.personalInfo.headline}
Contact: ${currentResume.personalInfo.email} | ${currentResume.personalInfo.phone} | ${currentResume.personalInfo.location}

SUMMARY:
${currentResume.summary}

EXPERIENCE:
${currentResume.workExperiences
  .map(
    (e) => `${e.role} at ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate})
${e.bullets.map((b) => `• ${b}`).join('\n')}`
  )
  .join('\n\n')}

SKILLS:
Languages: ${currentResume.skills.languages.join(', ')}
Frameworks: ${currentResume.skills.frameworks.join(', ')}
Cloud & Infrastructure: ${currentResume.skills.cloudDevOps.join(', ')}
Databases: ${currentResume.skills.toolsAndDatabases.join(', ')}
`;
    setResumeText(text);
    showToast('Loaded active resume into analyzer', 'info');
  };

  const handleRunAnalysis = async () => {
    if (!resumeText.trim()) {
      showToast('Please paste or import your resume text first.', 'error');
      return;
    }

    setAnalyzing(true);
    try {
      const data = await analyzeFullResume(resumeText, targetRole, industry);
      setAnalysisResult(data);
      if (data.overallScore >= 80) {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      }
      showToast('Deep AI ATS analysis complete!', 'success');
    } catch (err) {
      showToast('Failed to complete analysis. Please try again.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  // Pre-load on mount
  React.useEffect(() => {
    if (currentResume && (currentResume.personalInfo.fullName || currentResume.summary || currentResume.workExperiences.length > 0)) {
      handleLoadCurrentResume();
    }
  }, [currentResume]);

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>ATS Deep Audit & Industry Benchmarks</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI-Powered Resume Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Scan your resume against modern ATS filters (Workday, Greenhouse, Lever). Get real-time score breakdowns, industry-specific recommendations, and instant before/after bullet upgrades.
            </p>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="self-start md:self-center inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-600/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Scanning with Gemini...</span>
              </>
            ) : (
              <>
                <SearchCode className="w-4 h-4" />
                <span>Run Real-Time ATS Audit</span>
              </>
            )}
          </button>
        </div>

        {/* Configuration Bar: Role & Industry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Role Benchmark:</span>
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {ROLES_LIST.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Target Industry Domain:</span>
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {INDUSTRIES_LIST.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Analysis Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Text Area (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Resume Content to Analyze:</span>
            <button
              onClick={handleLoadCurrentResume}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Reload Active Resume
            </button>
          </div>

          <textarea
            rows={18}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your raw resume text here, or edit the loaded content..."
            className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed focus:outline-none focus:border-indigo-500 shadow-inner"
          />

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{resumeText.split(/\s+/).filter(Boolean).length} words</span>
            <span>ATS Format: Clean Plaintext</span>
          </div>
        </div>

        {/* Right Column: Deep Analysis Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {analysisResult ? (
            <div className="space-y-6">
              
              {/* Scorecard Hero */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/25">
                      {analysisResult.overallScore}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">Overall ATS Score</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {analysisResult.overallScore >= 85 ? 'Top 5% Candidate' : 'Competitive Candidate'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Benchmark: {targetRole} ({industry})
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onOpenBuilder}
                    className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold text-xs border border-indigo-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <span>Edit in Builder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 4 Dimension Progress Gauges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      ATS Format
                    </span>
                    <span className="text-lg font-extrabold text-white">
                      {analysisResult.atsCompatibility}%
                    </span>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${analysisResult.atsCompatibility}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      XYZ Impact
                    </span>
                    <span className="text-lg font-extrabold text-white">
                      {analysisResult.quantifiableImpactScore}%
                    </span>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: `${analysisResult.quantifiableImpactScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Brevity & Style
                    </span>
                    <span className="text-lg font-extrabold text-white">
                      {analysisResult.brevityAndStyleScore}%
                    </span>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-sky-400 h-full rounded-full"
                        style={{ width: `${analysisResult.brevityAndStyleScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Skills Match
                    </span>
                    <span className="text-lg font-extrabold text-white">
                      {analysisResult.skillsAlignmentScore}%
                    </span>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${analysisResult.skillsAlignmentScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Recruiter Summary Critique */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    Executive Recruiter Critique:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {analysisResult.summaryCritique}
                  </p>
                </div>
              </div>

              {/* Critical Improvements Checklist */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Prioritized Action Checklist</span>
                </h3>
                <div className="space-y-2">
                  {analysisResult.criticalImprovements.map((fix, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                    >
                      <span className="text-amber-400 font-bold mt-0.5">#{idx + 1}</span>
                      <p className="leading-relaxed">{fix}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keyword Alignment (Matching vs Missing High-Value Keywords) */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-indigo-400" />
                  <span>Keyword Intelligence & Industry Gap Analysis</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-2">
                      Verified Matching Strengths:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.topMatchingSkills.map((sk, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{sk}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-slate-400 font-semibold block mb-2">
                      Missing High-Value Keywords (Target Industry Expected):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.missingHighValueSkills.map((sk, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            navigator.clipboard.writeText(sk);
                            showToast(`Copied keyword "${sk}" to clipboard`, 'info');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-medium transition-colors cursor-pointer"
                        >
                          <span>+{sk}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Industry-Specific Recommendations */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Targeted {industry} Recommendations</span>
                </h3>
                <div className="space-y-2">
                  {analysisResult.industryRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="text-sky-400 font-bold">&bull;</span>
                      <p className="leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Before vs AI Enhanced After Bullet Transformations */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Before vs. AI Enhanced Transformations</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">Google XYZ Impact</span>
                </div>

                <div className="space-y-4">
                  {analysisResult.bulletTransformations.map((trans, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                    >
                      {/* Original */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                          Original (Low Yield Phrasing):
                        </span>
                        <p className="text-xs text-slate-400 italic line-through">
                          "{trans.original}"
                        </p>
                      </div>

                      {/* Enhanced */}
                      <div className="space-y-1 pt-1 border-t border-slate-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          AI Enhanced (Google XYZ Metric Formulation):
                        </span>
                        <p className="text-xs text-slate-100 font-semibold leading-relaxed">
                          "{trans.enhanced}"
                        </p>
                      </div>

                      {/* Reason & Action Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                        <p className="text-[11px] text-slate-400 italic">
                          Why: {trans.reason}
                        </p>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(trans.enhanced);
                              setCopiedIdx(i);
                              setTimeout(() => setCopiedIdx(null), 2000);
                              showToast('Copied enhanced bullet to clipboard!', 'success');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium transition-colors"
                          >
                            {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedIdx === i ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onApplyBulletToResume(trans.enhanced);
                              showToast('Applied enhanced bullet to active resume!', 'success');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-colors"
                          >
                            <span>Apply to Resume</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 mx-auto flex items-center justify-center">
                <SearchCode className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Ready for Real-Time ATS Audit</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Click <span className="font-semibold text-white">"Run Real-Time ATS Audit"</span> above to analyze this resume against top industry standards.
                </p>
              </div>
              <button
                onClick={handleRunAnalysis}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                <span>Start ATS Evaluation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
