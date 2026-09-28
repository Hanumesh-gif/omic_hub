import React, { useState, useMemo } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Plus,
  Play,
  RotateCcw,
  Zap,
  Share2,
  ExternalLink,
  BookOpen,
  Building2,
  Send,
  ShieldCheck,
  FileText,
  DollarSign,
  Search,
  Filter,
  Layers,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Copy,
  Tag,
} from 'lucide-react';
import {
  MockInterviewQuestion,
  ScheduledInterview,
  ResumeData,
  CertifiedSkillBadge,
  TrainingProgram,
  CompanyReferral,
} from '../../types';
import { generateMockQuestions, evaluateMockResponse } from '../../services/api';
import { StorageService } from '../../services/storage';
import { useToast } from '../Toast';
import confetti from 'canvas-confetti';
import { BadgeCertificateModal } from './BadgeCertificateModal';
import { CompanyReferralModal } from './CompanyReferralModal';

interface MockInterviewViewProps {
  scheduledInterviews: ScheduledInterview[];
  onSaveInterviews: (interviews: ScheduledInterview[]) => void;
  targetRole: string;
  resume: ResumeData;
  onUpdateResume?: (resume: ResumeData) => void;
}

export const MockInterviewView: React.FC<MockInterviewViewProps> = ({
  scheduledInterviews,
  onSaveInterviews,
  targetRole,
  resume,
  onUpdateResume,
}) => {
  const { showToast } = useToast();

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'simulator' | 'badges' | 'training' | 'referrals' | 'schedule' | 'analytics'
  >('simulator');

  // Simulator config
  const [roleInput, setRoleInput] = useState(targetRole || 'Bioinformatics Scientist & Computational Biologist');
  const [interviewType, setInterviewType] = useState('NGS Pipeline Architecture & Scalability');
  const [seniority, setSeniority] = useState('Graduate / Research Fellow');
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<MockInterviewQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Resume Skills Testing state
  const [testedSkill, setTestedSkill] = useState<string>('Nextflow DSL2');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [isCustomSkillActive, setIsCustomSkillActive] = useState(false);

  // Candidate Answer State
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<any | null>(null);

  // Badges & Credential State
  const [certifiedBadges, setCertifiedBadges] = useState<CertifiedSkillBadge[]>(() =>
    StorageService.getCertifiedBadges()
  );
  const [latestAwardedBadge, setLatestAwardedBadge] = useState<CertifiedSkillBadge | null>(null);
  const [viewingBadgeModal, setViewingBadgeModal] = useState<CertifiedSkillBadge | null>(null);

  // Training Programs State
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>(() =>
    StorageService.getTrainingPrograms()
  );
  const [trainingFilter, setTrainingFilter] = useState<'all' | 'Free' | 'Paid'>('all');
  const [trainingSearchQuery, setTrainingSearchQuery] = useState('');

  // Company Referrals State
  const [companyReferrals, setCompanyReferrals] = useState<CompanyReferral[]>(() =>
    StorageService.getCompanyReferrals()
  );
  const [referralModalTarget, setReferralModalTarget] = useState<CompanyReferral | null>(null);

  // Scheduling Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [schedTitle, setSchedTitle] = useState('Broad Institute NGS Technical Screen');
  const [schedType, setSchedType] = useState<'Genomics Pipelines' | 'Computational Biology' | 'Variant Calling' | 'Behavioral' | 'System Design' | 'Frontend' | 'Leadership'>(
    'Genomics Pipelines'
  );
  const [schedDate, setSchedDate] = useState('2026-09-25');
  const [schedTime, setSchedTime] = useState('14:00');

  // Extract all resume skills categorized
  const resumeSkillCategories = useMemo(() => {
    return [
      { name: 'Genomic Languages & Scripting', items: resume.skills?.languages || [] },
      { name: 'NGS & Bioinformatic Frameworks', items: resume.skills?.frameworks || [] },
      { name: 'HPC, Cloud & Containerization', items: resume.skills?.cloudDevOps || [] },
      { name: 'Databases & Biological Formats', items: resume.skills?.toolsAndDatabases || [] },
      { name: 'Scientific Leadership & Methods', items: resume.skills?.softSkills || [] },
    ];
  }, [resume.skills]);

  // Flat list of resume skills for quick selection
  const flatResumeSkills = useMemo(() => {
    const set = new Set<string>();
    resumeSkillCategories.forEach((cat) => cat.items.forEach((item) => set.add(item)));
    return Array.from(set);
  }, [resumeSkillCategories]);

  // Load Questions (with testedSkill)
  const handleGenerateQuestions = async (skillToTest = testedSkill) => {
    setLoadingQuestions(true);
    setCurrentEvaluation(null);
    setCandidateAnswer('');
    try {
      const data = await generateMockQuestions(roleInput, interviewType, seniority, skillToTest);
      setQuestions(data.questions);
      setCurrentQIndex(0);
      showToast(`Generated certification drill questions for "${skillToTest}"!`, 'success');
    } catch (err) {
      showToast('Failed to generate questions. Please retry.', 'error');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Select skill from resume
  const handleSelectResumeSkill = (skill: string) => {
    setTestedSkill(skill);
    setIsCustomSkillActive(false);
    handleGenerateQuestions(skill);
  };

  const handleApplyCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillInput.trim()) return;
    setTestedSkill(customSkillInput.trim());
    setIsCustomSkillActive(true);
    handleGenerateQuestions(customSkillInput.trim());
    setCustomSkillInput('');
  };

  // Evaluate candidate answer
  const handleEvaluateAnswer = async () => {
    if (!candidateAnswer.trim() || candidateAnswer.length < 15) {
      showToast('Please provide a complete answer before evaluating.', 'error');
      return;
    }

    const currentQuestion = questions[currentQIndex]?.question || 'Technical Problem';
    setEvaluating(true);
    try {
      const evalData = await evaluateMockResponse(
        currentQuestion,
        candidateAnswer,
        roleInput,
        interviewType,
        testedSkill
      );
      setCurrentEvaluation(evalData);

      // Check for certified skill passing threshold (score >= 80)
      if (evalData.overallScore >= 80) {
        confetti({ particleCount: 65, spread: 75, origin: { y: 0.6 } });

        const randomCode = Math.floor(10000 + Math.random() * 90000);
        const newBadge: CertifiedSkillBadge = {
          id: `badge_${Date.now()}`,
          skillName: testedSkill,
          category: questions[currentQIndex]?.category || 'Core Engineering Architecture',
          score: evalData.overallScore,
          issuedDate: new Date().toISOString().slice(0, 10),
          verificationId: `OMI-CERT-${randomCode}`,
          verificationUrl: `https://omichub.ai/verify/cert/OMI-CERT-${randomCode}`,
          level:
            evalData.overallScore >= 92
              ? 'Certified Professional'
              : evalData.overallScore >= 85
              ? 'Certified Professional'
              : 'Certified Professional',
          status: 'Verified',
          assessedAreas:
            questions[currentQIndex]?.keyEvaluationPoints || [
              'Production Architecture',
              'Performance Benchmarking',
              'Trade-off Analysis',
            ],
          interviewerLens:
            questions[currentQIndex]?.context ||
            `Assessed against Tier-1 computational biology standards with a composite score of ${evalData.overallScore}%.`,
          addedToResume: false,
        };

        const updatedBadges = StorageService.addCertifiedBadge(newBadge);
        setCertifiedBadges(updatedBadges);
        setLatestAwardedBadge(newBadge);

        showToast(
          `Technical Certification Passed! Earned "${newBadge.skillName}" Certified Badge (${evalData.overallScore}%).`,
          'success'
        );
      } else {
        showToast('Technical evaluation generated. Review constructive feedback to upskill!', 'info');
      }
    } catch (err) {
      showToast('Failed to evaluate response.', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  // Add badge to resume
  const handleAddBadgeToResume = (badge: CertifiedSkillBadge) => {
    const updatedResume = StorageService.addBadgeToResumeCertifications(badge);
    if (onUpdateResume) {
      onUpdateResume(updatedResume);
    }
    setCertifiedBadges(StorageService.getCertifiedBadges());
    if (latestAwardedBadge && latestAwardedBadge.id === badge.id) {
      setLatestAwardedBadge({ ...latestAwardedBadge, addedToResume: true });
    }
  };

  // Submit Company Referral
  const handleSubmitReferral = (referralId: string) => {
    const updated = StorageService.submitCompanyReferral(referralId);
    setCompanyReferrals(updated);
  };

  // Speech Recognition integration
  const toggleSpeech = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Voice transcription not supported by this browser. Please type response.', 'info');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      showToast('Voice recording stopped', 'info');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        showToast('Listening... Speak your answer clearly.', 'info');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setCandidateAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  // Add scheduled interview
  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newInterview: ScheduledInterview = {
      id: `int_${Date.now()}`,
      title: schedTitle,
      type: schedType,
      date: schedDate,
      time: schedTime,
      status: 'Scheduled',
    };
    onSaveInterviews([newInterview, ...scheduledInterviews]);
    setScheduleModalOpen(false);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    showToast(`Scheduled "${schedTitle}" for ${schedDate}!`, 'success');
  };

  // Filtered Training Programs
  const filteredTrainingPrograms = useMemo(() => {
    return trainingPrograms.filter((prog) => {
      const matchesFilter = trainingFilter === 'all' || prog.costType === trainingFilter;
      const q = trainingSearchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        prog.title.toLowerCase().includes(q) ||
        prog.provider.toLowerCase().includes(q) ||
        prog.skillsCovered.some((s) => s.toLowerCase().includes(q));
      return matchesFilter && matchesSearch;
    });
  }, [trainingPrograms, trainingFilter, trainingSearchQuery]);

  // Load questions on initial mount
  React.useEffect(() => {
    if (questions.length === 0) {
      handleGenerateQuestions('Nextflow DSL2');
    }
  }, []);

  const activeQ = questions[currentQIndex];

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Resume Skill Certification & Fast-Track Referral Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Mock Interview Simulator & Skill Certifier
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Test skills from your resume with realistic technical questions, earn verified digital credential badges, unlock curated free & paid training tracks, and get fast-tracked for partner company referrals.
            </p>
          </div>

          {/* Subnav Pill Tabs */}
          <div className="flex flex-wrap items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs self-start md:self-center gap-1">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Simulator
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'badges'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Badges ({certifiedBadges.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'training'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Training (Free & Paid)</span>
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'referrals'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Company Referrals</span>
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Radar
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: LIVE SIMULATOR & SKILL CERTIFIER */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          
          {/* RESUME SKILLS SYNCED SELECTOR BAR */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs sm:text-sm font-extrabold text-white">
                  Resume Skills Available for Certification Testing:
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                  {flatResumeSkills.length} Synced
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Score <strong className="text-emerald-400 font-bold">80%+</strong> to earn verified badge & unlock company referrals
              </span>
            </div>

            {/* Quick Skill Selector Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {flatResumeSkills.slice(0, 14).map((skill, i) => {
                const isSelected = testedSkill.toLowerCase() === skill.toLowerCase();
                const isCertified = certifiedBadges.some(
                  (b) => b.skillName.toLowerCase() === skill.toLowerCase()
                );

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectResumeSkill(skill)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md scale-105'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{skill}</span>
                    {isCertified ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-amber-400/70 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Skill Drill Input */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="font-semibold text-slate-300">Currently Testing Skill:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  {testedSkill}
                </span>
              </div>

              <form onSubmit={handleApplyCustomSkill} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Or test custom skill (e.g., Redis, Kafka)..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 w-56"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Test Skill
                </button>
              </form>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Interview Role:</label>
              <input
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Interview Lens:</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="NGS Pipeline Architecture & Scalability">NGS Pipeline & HPC Scale</option>
                <option value="Somatic & Germline Variant Interpretation">Variant Calling & QC</option>
                <option value="Single-Cell & Spatial Transcriptomics">Single-Cell (scRNA-seq)</option>
                <option value="Behavioral (Scientific STAR) & Wet-Lab Collaboration">Scientific STAR & Wet-Lab</option>
                <option value="Structural Biology & AlphaFold Modeling">AlphaFold & Structural AI</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Seniority Calibration:</label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="Undergraduate / Intern">Undergraduate / Intern</option>
                <option value="Graduate / Research Fellow">Graduate / Research Fellow</option>
                <option value="Senior Scientist / Bioinformatician">Senior Scientist</option>
                <option value="Principal Investigator / Director">PI / Director</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => handleGenerateQuestions(testedSkill)}
                disabled={loadingQuestions}
                className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                {loadingQuestions ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{loadingQuestions ? 'Generating...' : `Drill "${testedSkill}"`}</span>
              </button>
            </div>
          </div>

          {/* LATEST EARNED BADGE CELEBRATION BANNER */}
          {latestAwardedBadge && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border-2 border-indigo-500/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-500 p-0.5 shadow-lg shadow-indigo-600/30 shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-400 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      Certified Credential Earned
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      Score: {latestAwardedBadge.score}/100
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-white">
                    {latestAwardedBadge.skillName} ({latestAwardedBadge.level})
                  </h4>
                  <p className="text-[11px] text-slate-300 font-mono">
                    ID: {latestAwardedBadge.verificationId} &bull; Link: {latestAwardedBadge.verificationUrl}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setViewingBadgeModal(latestAwardedBadge)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition-all cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>View Official Certificate</span>
                </button>

                <button
                  onClick={() => handleAddBadgeToResume(latestAwardedBadge)}
                  disabled={latestAwardedBadge.addedToResume}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    latestAwardedBadge.addedToResume
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 cursor-pointer'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{latestAwardedBadge.addedToResume ? 'In Resume' : 'Add to Resume'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('referrals')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Company Referrals</span>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Question Card */}
          {activeQ ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interviewer Prompt & Answer Form (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Question Box */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {activeQ.category} &bull; Question {currentQIndex + 1} of {questions.length}
                    </span>
                    <span className="text-xs text-slate-400">
                      Framework: <strong className="text-white">{activeQ.recommendedFramework}</strong>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                    "{activeQ.question}"
                  </h3>

                  {/* Context & Evaluation Criteria */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <p className="text-slate-300">
                      <strong className="text-indigo-400">Interviewer Lens:</strong> {activeQ.context}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeQ.keyEvaluationPoints.map((pt, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                        >
                          &bull; {pt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Candidate Answer Box */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Your Response:</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({candidateAnswer.split(/\s+/).filter(Boolean).length} words)
                      </span>
                    </label>

                    {/* Voice Dictation Button */}
                    <button
                      type="button"
                      onClick={toggleSpeech}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isRecording
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isRecording ? (
                        <MicOff className="w-3.5 h-3.5" />
                      ) : (
                        <Mic className="w-3.5 h-3.5 text-sky-400" />
                      )}
                      <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={8}
                    value={candidateAnswer}
                    onChange={(e) => setCandidateAnswer(e.target.value)}
                    placeholder={`Structure using STAR:\nSituation: In my genomics lab while scaling ${testedSkill}...\nTask: My primary objective was...\nAction: I engineered a distributed Nextflow DSL2 pipeline...\nResult: We reduced sequencing pipeline latency by 45% and saved ₹9,50,000 in HPC cloud compute...`}
                    className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
                  />

                  {/* Evaluation Button & Question Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={currentQIndex === 0}
                        onClick={() => {
                          setCurrentQIndex((i) => Math.max(0, i - 1));
                          setCurrentEvaluation(null);
                          setCandidateAnswer('');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs disabled:opacity-40 cursor-pointer"
                      >
                        Previous Q
                      </button>
                      <button
                        type="button"
                        disabled={currentQIndex >= questions.length - 1}
                        onClick={() => {
                          setCurrentQIndex((i) => Math.min(questions.length - 1, i + 1));
                          setCurrentEvaluation(null);
                          setCandidateAnswer('');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs disabled:opacity-40 cursor-pointer"
                      >
                        Next Q
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleEvaluateAnswer}
                      disabled={evaluating || !candidateAnswer.trim()}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {evaluating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Evaluating & Certifying Response...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Evaluate & Verify Skill</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Live Feedback, Badge Trigger & Upskill Paths (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {currentEvaluation ? (
                  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6 animate-in fade-in">
                    
                    {/* Overall Score Badge */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Performance Rating & Certification
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-3xl font-black text-white">
                            {currentEvaluation.overallScore}
                          </span>
                          <span className="text-xs text-slate-400">/ 100</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            currentEvaluation.overallScore >= 85
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          {currentEvaluation.overallScore >= 85 ? 'Strong Hire' : 'Lean Hire'}
                        </span>
                        {currentEvaluation.overallScore >= 80 && (
                          <span className="block text-[10px] text-indigo-400 font-bold mt-1">
                            Credential Verified 🏆
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 4 Dimension Metrics */}
                    {currentEvaluation.metrics && (
                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between text-slate-400 mb-1">
                            <span>Clarity & Structure</span>
                            <span className="text-white font-semibold">
                              {currentEvaluation.metrics.clarityAndStructure}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${currentEvaluation.metrics.clarityAndStructure}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-400 mb-1">
                            <span>Technical Depth ({testedSkill})</span>
                            <span className="text-white font-semibold">
                              {currentEvaluation.metrics.technicalDepth}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sky-400 rounded-full"
                              style={{ width: `${currentEvaluation.metrics.technicalDepth}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-400 mb-1">
                            <span>Quantified Results & Impact</span>
                            <span className="text-white font-semibold">
                              {currentEvaluation.metrics.quantifiedOutcomes}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 rounded-full"
                              style={{ width: `${currentEvaluation.metrics.quantifiedOutcomes}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Next Step Cards: Training & Referral */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Recommended Next Steps for {testedSkill}:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setTrainingSearchQuery(testedSkill);
                            setActiveTab('training');
                          }}
                          className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] mb-0.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Training Programs</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            Explore free & paid courses for {testedSkill}
                          </p>
                        </button>

                        <button
                          onClick={() => setActiveTab('referrals')}
                          className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5 text-sky-400 font-bold text-[11px] mb-0.5">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Company Referrals</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            Refer verified score to Stripe, Vercel & more
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* STAR Breakdown */}
                    {currentEvaluation.starBreakdown && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                        <span className="font-bold text-indigo-400 uppercase tracking-wider block">
                          STAR Method Breakdown:
                        </span>
                        <p className="text-slate-300">
                          <strong className="text-white">Situation:</strong>{' '}
                          {currentEvaluation.starBreakdown.situation}
                        </p>
                        <p className="text-slate-300">
                          <strong className="text-white">Task:</strong>{' '}
                          {currentEvaluation.starBreakdown.task}
                        </p>
                        <p className="text-slate-300">
                          <strong className="text-white">Action:</strong>{' '}
                          {currentEvaluation.starBreakdown.action}
                        </p>
                        <p className="text-slate-300">
                          <strong className="text-white">Result:</strong>{' '}
                          {currentEvaluation.starBreakdown.result}
                        </p>
                      </div>
                    )}

                    {/* Strengths & Improvement */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-emerald-400 block mb-1">Key Strengths:</span>
                        <ul className="space-y-1 list-disc list-inside text-slate-300">
                          {currentEvaluation.strengths?.map((str: string, i: number) => (
                            <li key={i}>{str}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-bold text-amber-400 block mb-1">Constructive Upgrades:</span>
                        <ul className="space-y-1 list-disc list-inside text-slate-300">
                          {currentEvaluation.constructiveCriticism?.map((crit: string, i: number) => (
                            <li key={i}>{crit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Model Answer Upgrade */}
                    {currentEvaluation.modelAnswerUpgrade && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/25 space-y-2 text-xs">
                        <span className="font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          <span>Exemplary Model Response:</span>
                        </span>
                        <p className="text-slate-200 leading-relaxed font-sans italic">
                          "{currentEvaluation.modelAnswerUpgrade}"
                        </p>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="p-10 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center">
                      <Mic className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Live Evaluator Waiting</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Select a resume skill from above, speak or type your answer, then click{' '}
                      <strong className="text-white">"Evaluate & Verify Skill"</strong> to certify your badge and unlock direct referrals.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">Loading certification drill bank...</div>
          )}

        </div>
      )}

      {/* TAB 2: CERTIFIED BADGES & CREDENTIALS GALLERY */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Omic Hub Certified Skill Badges & Credentials</span>
              </h2>
              <p className="text-xs text-slate-400">
                Verifiable credentials earned by passing domain-authentic mock interview evaluations.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('simulator')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer self-start sm:self-center"
            >
              <Sparkles className="w-4 h-4" />
              <span>Test Another Resume Skill</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifiedBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border border-slate-800 hover:border-indigo-500/40 shadow-xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                          {badge.category}
                        </span>
                        <h3 className="font-extrabold text-white text-base leading-snug">
                          {badge.skillName}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                        {badge.score}% Score
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {badge.interviewerLens}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {badge.assessedAreas?.map((area, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                      >
                        &bull; {area}
                      </span>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Credential ID:</span>
                      <strong className="text-slate-200 font-mono">{badge.verificationId}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Verification Link:</span>
                      <a
                        href={badge.verificationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 underline truncate max-w-[200px]"
                      >
                        {badge.verificationUrl}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => setViewingBadgeModal(badge)}
                    className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Digital Certificate</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddBadgeToResume(badge)}
                      disabled={badge.addedToResume}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        badge.addedToResume
                          ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                      }`}
                    >
                      <FileText className="w-3 h-3" />
                      <span>{badge.addedToResume ? 'Added to Resume' : 'Add to Resume'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TRAINING PROGRAMS (FREE & PAID) */}
      {activeTab === 'training' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                  <span>Curated Training Programs & Skill Upskilling</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Top-rated Free and Paid courses curated by engineering leads to help you level up your certified skills.
                </p>
              </div>

              {/* Free vs Paid Filter */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <button
                  onClick={() => setTrainingFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    trainingFilter === 'all'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({trainingPrograms.length})
                </button>
                <button
                  onClick={() => setTrainingFilter('Free')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    trainingFilter === 'Free'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Free Only
                </button>
                <button
                  onClick={() => setTrainingFilter('Paid')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    trainingFilter === 'Paid'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pro / Paid
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={trainingSearchQuery}
                onChange={(e) => setTrainingSearchQuery(e.target.value)}
                placeholder="Search programs by skill, topic, or provider (e.g., React, System Design, MIT, AWS)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTrainingPrograms.map((prog) => (
              <div
                key={prog.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 shadow-xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                      {prog.provider}
                    </span>
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        prog.costType === 'Free'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {prog.costType === 'Free' ? '100% Free' : prog.price || 'Paid Pro'}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white leading-snug">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {prog.description}
                  </p>

                  {/* Recommendation Reason */}
                  {prog.matchReason && (
                    <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{prog.matchReason}</span>
                    </div>
                  )}

                  {/* Skill Badges Covered */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prog.skillsCovered.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Meta Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <div>
                      <span className="text-slate-500 block">Rating:</span>
                      <strong className="text-amber-400 font-bold">★ {prog.rating}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Duration:</span>
                      <strong className="text-slate-200">{prog.duration}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Students:</span>
                      <strong className="text-slate-200">{prog.studentsCount}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {prog.certificateIncluded ? 'Certificate Included' : 'Audit Free'}
                  </span>

                  <a
                    href={prog.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    <span>Enroll Program</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PARTNER COMPANY REFERRALS ("COMPANY WILL TELL US AND JUST REFER TO THAT") */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct Talent Partner Pipeline</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-sky-400" />
                  <span>Partner Companies Seeking Certified Candidates</span>
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl">
                  These verified partner companies actively monitor Omic Hub credentials. Candidates who pass mock interview certifications receive fast-track referrals that bypass standard recruiter filters.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 self-start sm:self-center">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-300">
                  <strong className="text-white">{certifiedBadges.length}</strong> Badges Ready to Attach
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyReferrals.map((comp) => (
              <div
                key={comp.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 shadow-xl transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <img
                      src={comp.logo}
                      alt={comp.companyName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
                    />
                    <div className="text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 block mb-1">
                        {comp.matchScore}% Match
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {comp.fastTrackBadge}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-white text-base">{comp.companyName}</h3>
                    <p className="text-xs font-semibold text-slate-300">{comp.roleTitle}</p>
                  </div>

                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      <span>{comp.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{comp.salaryRange}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 italic">
                    "{comp.sponsorQuote}"
                  </div>

                  {/* Required Certified Skills */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Required Certified Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {comp.requiredCertifiedSkills.map((sk, i) => {
                        const hasCert = certifiedBadges.some((b) =>
                          b.skillName.toLowerCase().includes(sk.toLowerCase())
                        );

                        return (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded ${
                              hasCert
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-950 text-slate-400 border border-slate-800'
                            }`}
                          >
                            <span>{sk}</span>
                            {hasCert && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold ${
                      comp.status === 'Referred' ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {comp.status === 'Referred' ? 'Referral Active' : 'Fast-Track Open'}
                  </span>

                  <button
                    onClick={() => setReferralModalTarget(comp)}
                    disabled={comp.status === 'Referred'}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      comp.status === 'Referred'
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white shadow-md cursor-pointer active:scale-95'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{comp.status === 'Referred' ? 'Referred 🚀' : 'Submit Referral'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INTERVIEW CALENDAR */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Automated Mock Interview Calendar</span>
              </h2>
              <p className="text-xs text-slate-400">
                Schedule future mock simulation drills with AI personas and track your practice cadence.
              </p>
            </div>
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledInterviews.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                      {item.type}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        item.status === 'Completed' ? 'text-emerald-400' : 'text-sky-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm leading-snug">{item.title}</h3>

                  <div className="mt-3 space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {item.date} at {item.time}
                      </span>
                    </div>
                    {item.score && (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <Award className="w-3.5 h-3.5" />
                        <span>Score: {item.score}/100</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500">Technical Assessment</span>
                  <button
                    onClick={() => {
                      setActiveTab('simulator');
                      showToast(`Loaded ${item.title} into simulator`, 'info');
                    }}
                    className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    <span>Launch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PERFORMANCE ANALYTICS RADAR */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Overall Interview Readiness
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">92</span>
                <span className="text-sm text-slate-400">/ 100</span>
                <span className="ml-auto text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Tier-1 Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Candidate excels at STAR methodology structuring, trade-off analysis, and high-scale architecture defense.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Certified Badges Earned
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-amber-400">{certifiedBadges.length}</span>
                <span className="text-sm text-slate-400">Credentials</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Passed technical evaluations across key NGS pipeline architecture and variant calling skills.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Projected Offer Conversion
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-emerald-400">92%</span>
                <span className="text-sm text-slate-400">Probability</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Based on verified credentials against Broad Institute, Illumina, and Genentech hiring benchmarks.
              </p>
            </div>
          </div>

          {/* STAR Competency Breakdown Bars */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>STAR Method Competency Distribution</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Situation & Scope Setting</span>
                  <span className="text-emerald-400">92%</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Task & Individual Ownership Delineation</span>
                  <span className="text-sky-400">88%</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Technical Action & Decision Matrix</span>
                  <span className="text-indigo-400">94%</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Quantified Business Outcome & Retrospective</span>
                  <span className="text-amber-400">85%</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-xs space-y-4">
            <h3 className="text-base font-bold text-white">Schedule Mock Interview Drill</h3>

            <form onSubmit={handleAddSchedule} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Session Title</label>
                <input
                  type="text"
                  required
                  value={schedTitle}
                  onChange={(e) => setSchedTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Interview Focus</label>
                <select
                  value={schedType}
                  onChange={(e) => setSchedType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value="Genomics Pipelines">Genomics Pipelines</option>
                  <option value="Variant Calling">Variant Calling & QC</option>
                  <option value="Computational Biology">Computational Biology</option>
                  <option value="Behavioral">Behavioral (Scientific STAR)</option>
                  <option value="Leadership">Lab & Research Leadership</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    required
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Time</label>
                  <input
                    type="time"
                    required
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Badge Certificate Modal */}
      <BadgeCertificateModal
        badge={viewingBadgeModal}
        isOpen={Boolean(viewingBadgeModal)}
        onClose={() => setViewingBadgeModal(null)}
        onAddToResume={handleAddBadgeToResume}
        onOpenReferral={(skillName) => {
          setActiveTab('referrals');
        }}
      />

      {/* Company Referral Modal */}
      <CompanyReferralModal
        referral={referralModalTarget}
        isOpen={Boolean(referralModalTarget)}
        onClose={() => setReferralModalTarget(null)}
        badges={certifiedBadges}
        resume={resume}
        onSubmitReferral={handleSubmitReferral}
      />
    </div>
  );
};
