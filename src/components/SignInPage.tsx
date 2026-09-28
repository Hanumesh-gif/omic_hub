import React, { useState } from 'react';
import {
  Dna,
  Building2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { UserProfile } from '../types';
import { useToast } from './Toast';
import { signInWithGoogle, syncUserProfile } from '../services/firebase';

interface SignInPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onLoginSuccess }) => {
  const { showToast } = useToast();

  // Portal Toggle: Minimalist toggle between [ Student Login ] and [ Recruiter Login ]
  const [portalType, setPortalType] = useState<'student' | 'recruiter'>('student');
  const [isSignUp, setIsSignUp] = useState(false);

  // Student Login Fields
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  // Recruiter Login Fields: STRICTLY 3 FIELDS (Company Name, Official Company Email, Password)
  const [companyName, setCompanyName] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [recruiterPassword, setRecruiterPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper to slugify names for auto-generated profile URL
  const generateSlug = (str: string) => {
    return (
      str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '') || 'talent_member'
    );
  };

  // Google Sign-In for Student
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const firebaseUser = await signInWithGoogle();
      const displayName = firebaseUser.displayName || 'Bioinformatics Scholar';
      const autoProfileUrl = `omichub.bio/talent/${generateSlug(displayName)}`;

      const authenticatedUser: UserProfile = {
        id: firebaseUser.uid,
        name: displayName,
        email: firebaseUser.email || '',
        avatar:
          firebaseUser.photoURL ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        role: 'Bioinformatics Graduate Researcher',
        targetRole: 'Computational Biologist & NGS Pipeline Scientist',
        experienceLevel: 'Graduate Student / Researcher',
        targetIndustry: 'Genomics & Computational Biology',
        location: 'Open to Remote / Relocation',
        atsScore: 88,
        totalApplications: 4,
        activeInterviews: 2,
        learningHours: 36,
        interviewReadiness: 90,
        isResumeUploaded: false,
        userType: 'student',
        omicHubProfileUrl: autoProfileUrl,
      };

      await syncUserProfile(authenticatedUser);
      showToast(`Welcome to Omic Hub, ${authenticatedUser.name}!`, 'success');
      onLoginSuccess(authenticatedUser);
    } catch (err: any) {
      console.error('Google Auth error:', err);
      showToast(err?.message || 'Google Sign-in failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Student Form Submission
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameToValidate = isSignUp ? studentName.trim() : studentName.trim() || studentEmail.split('@')[0] || 'Bioinformatics Scholar';
    const emailToValidate = studentEmail.trim();
    const pwdToValidate = studentPassword.trim();

    if (isSignUp && !nameToValidate) {
      showToast('Please enter your full name.', 'error');
      return;
    }
    if (!emailToValidate || !emailToValidate.includes('@')) {
      showToast('Please provide a valid email address.', 'error');
      return;
    }
    if (!pwdToValidate || pwdToValidate.length < 4) {
      showToast('Password must be at least 4 characters.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const autoSlug = generateSlug(nameToValidate);
      const authenticatedUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: nameToValidate,
        email: emailToValidate,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        role: 'Bioinformatics Student & Researcher',
        targetRole: 'Bioinformatics Scientist & NGS Analyst',
        experienceLevel: 'Graduate Student / Researcher',
        targetIndustry: 'Genomics, Precision Oncology & Computational Biology',
        location: 'Bengaluru / Cambridge (Open to Remote)',
        atsScore: 82,
        totalApplications: 0,
        activeInterviews: 0,
        learningHours: 24,
        interviewReadiness: 78,
        isResumeUploaded: false,
        userType: 'student',
        omicHubProfileUrl: `omichub.bio/talent/${autoSlug}`,
      };

      showToast(`Welcome back, ${authenticatedUser.name}!`, 'success');
      onLoginSuccess(authenticatedUser);
    }, 450);
  };

  // Recruiter Form Submission: STRICTLY (Company Name, Official Company Email, Password)
  const handleRecruiterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const compName = companyName.trim();
    const offEmail = officialEmail.trim();
    const pwd = recruiterPassword.trim();

    if (!compName) {
      showToast('Please enter your Company / Institution Name.', 'error');
      return;
    }
    if (!offEmail || !offEmail.includes('@')) {
      showToast('Please enter a valid Official Company Email.', 'error');
      return;
    }
    if (!pwd || pwd.length < 4) {
      showToast('Password must be at least 4 characters.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const compSlug = generateSlug(compName);
      const recruiterUser: UserProfile = {
        id: `rec_${Date.now()}`,
        name: `${compName} Talent Acquisition`,
        email: offEmail,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        role: `Talent Partner (${compName})`,
        targetRole: 'Computational Biology Recruiter',
        experienceLevel: 'Senior',
        targetIndustry: 'Biotechnology & Life Sciences Hiring',
        location: 'Corporate Office',
        atsScore: 95,
        totalApplications: 0,
        activeInterviews: 0,
        learningHours: 0,
        interviewReadiness: 100,
        isResumeUploaded: false,
        userType: 'recruiter',
        companyName: compName,
        omicHubProfileUrl: `omichub.bio/company/${compSlug}`,
      };

      showToast(`Welcome to Omic Hub Recruiter Workspace, ${compName}!`, 'success');
      onLoginSuccess(recruiterUser);
    }, 450);
  };

  // Quick 1-Click Demo Logins
  const handleQuickStudentDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const demoStudent: UserProfile = {
        id: 'usr_demo_maya',
        name: 'Maya Chen, M.S.',
        email: 'maya.chen@broadinstitute.org',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        role: 'Bioinformatics Graduate Researcher',
        targetRole: 'Computational Biologist & NGS Pipeline Scientist',
        experienceLevel: 'Graduate Student / Researcher',
        targetIndustry: 'Genomics, Precision Oncology & Life Sciences',
        location: 'Cambridge, MA (Open to Remote)',
        atsScore: 92,
        totalApplications: 12,
        activeInterviews: 3,
        learningHours: 42,
        interviewReadiness: 94,
        isResumeUploaded: true,
        uploadedResumeFileName: 'Maya_Chen_Bioinformatics_Master_2026.pdf',
        userType: 'student',
        omicHubProfileUrl: 'omichub.bio/talent/maya_chen',
        hasSelectedPlan: true,
        hasCompletedResumeOnboarding: true,
      };
      showToast('Loaded demo student profile (Maya Chen)', 'success');
      onLoginSuccess(demoStudent);
    }, 300);
  };

  const handleQuickRecruiterDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const demoRecruiter: UserProfile = {
        id: 'rec_demo_illumina',
        name: 'Illumina Genomics Talent Team',
        email: 'recruiter@illumina.com',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        role: 'Hiring Lead (Illumina Genomics)',
        targetRole: 'Bioinformatics Recruiter',
        experienceLevel: 'Senior',
        targetIndustry: 'Genomics Instruments & Sequencing Informatics',
        location: 'San Diego, CA',
        atsScore: 98,
        totalApplications: 0,
        activeInterviews: 0,
        learningHours: 0,
        interviewReadiness: 100,
        isResumeUploaded: false,
        userType: 'recruiter',
        companyName: 'Illumina',
        omicHubProfileUrl: 'omichub.bio/company/illumina',
      };
      showToast('Loaded demo recruiter workspace (Illumina)', 'success');
      onLoginSuccess(demoRecruiter);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center font-sans selection:bg-teal-500 selection:text-slate-950">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* ============================================================== */}
        {/* 1. LEFT SIDE (BRANDING BANNER): Clean Dark Slate Banner         */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 bg-[#0a0f1d] border-b lg:border-b-0 lg:border-r border-slate-800/80 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Abstract DNA Graphics Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
            {/* Atmospheric gradients */}
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl translate-x-1/3" />

            {/* Stylized DNA Double-Helix SVG Geometry */}
            <svg
              className="absolute inset-0 w-full h-full text-slate-800/40"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="dnaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="dnaGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
                </linearGradient>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.12)" strokeWidth="1" />
                </pattern>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Sine Wave 1 (DNA Strand A) */}
              <path
                d="M -50,150 Q 80,60 210,150 T 470,150 T 730,150 T 990,150 T 1250,150"
                stroke="url(#dnaGrad1)"
                strokeWidth="2.5"
                fill="none"
              />
              {/* Sine Wave 2 (DNA Strand B) */}
              <path
                d="M -50,150 Q 80,240 210,150 T 470,150 T 730,150 T 990,150 T 1250,150"
                stroke="url(#dnaGrad2)"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Connecting Base-Pair Rungs across the helix */}
              {[20, 70, 120, 160, 210, 260, 310, 360, 410, 460, 510, 560, 610, 660, 710, 760, 810, 860].map(
                (x, idx) => {
                  const angle = (x / 260) * Math.PI;
                  const y1 = 150 + Math.sin(angle) * 70;
                  const y2 = 150 - Math.sin(angle) * 70;
                  return (
                    <g key={idx}>
                      <line
                        x1={x}
                        y1={y1}
                        x2={x}
                        y2={y2}
                        stroke="rgba(45, 212, 191, 0.25)"
                        strokeWidth="1.5"
                        strokeDasharray={idx % 2 === 0 ? '2 2' : 'none'}
                      />
                      <circle cx={x} cy={y1} r="3" fill="#14b8a6" fillOpacity="0.7" />
                      <circle cx={x} cy={y2} r="3" fill="#38bdf8" fillOpacity="0.7" />
                    </g>
                  );
                }
              )}

              {/* Lower Secondary Helix Accent */}
              <path
                d="M -20,580 Q 120,500 260,580 T 540,580 T 820,580 T 1100,580"
                stroke="url(#dnaGrad1)"
                strokeWidth="2"
                strokeDasharray="4 4"
                fill="none"
              />
              <path
                d="M -20,580 Q 120,660 260,580 T 540,580 T 820,580 T 1100,580"
                stroke="url(#dnaGrad2)"
                strokeWidth="2"
                strokeDasharray="4 4"
                fill="none"
              />
            </svg>
          </div>

          {/* Top Brand Mark */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/25 ring-1 ring-white/10">
                <Dna className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-white tracking-tight">Omic Hub</span>
                  <span className="text-[10px] font-bold text-teal-300 uppercase px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30">
                    Genomics Network
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">Precision Computational Biology</p>
              </div>
            </div>
          </div>

          {/* Center Brand Identity & Tagline */}
          <div className="relative z-10 my-10 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-teal-300 text-xs font-semibold backdrop-blur-sm shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Career Acceleration Platform for Computational Biology</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Accelerating the next generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-300 to-indigo-300">computational biologists</span>.
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed font-normal">
              Connecting bioinformatics scholars, genomics researchers, and computational scientists directly with verified biotech startups, pharma labs, and research institutions.
            </p>

            {/* Platform Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Verified Talent</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Candidates benchmarked on Nextflow, GATK, Python & BLAST.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold mb-1">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>Direct Hiring</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Fast candidate shortlisting and direct student feed distribution.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>Top Institutes</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Connecting students from IITs, IISc, Oxford, Broad Institute & more.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Fast Demo Login Shortcuts */}
          <div className="relative z-10 pt-6 border-t border-slate-800/80">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2.5">
              1-Click Fast Preview Credentials:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleQuickStudentDemo}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 text-left transition-all active:scale-98 cursor-pointer group flex items-center gap-3"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Maya Chen"
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-teal-500/40 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-teal-300 truncate">
                      Maya Chen, M.S.
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 font-bold shrink-0">
                      Student
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">NGS & Nextflow Researcher</p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleQuickRecruiterDemo}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 text-left transition-all active:scale-98 cursor-pointer group flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                      Illumina Talent
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold shrink-0">
                      Recruiter
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">Genomics Recruiter Workspace</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. RIGHT SIDE (FORM): Minimalist Toggle & Clean Authentication   */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 bg-slate-950 p-6 sm:p-12 lg:p-16 flex flex-col justify-center items-center">
          <div className="w-full max-w-md space-y-6">
            
            {/* Header Title */}
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-black text-white tracking-tight">
                {portalType === 'student' ? 'Sign In to Student Portal' : 'Recruiter Access Portal'}
              </h2>
              <p className="text-xs text-slate-400">
                {portalType === 'student'
                  ? 'Access your lab-ready resume, skill roadmaps, and jobs.'
                  : 'Manage candidate pipelines and publish roles directly to students.'}
              </p>
            </div>

            {/* MINIMALIST TOGGLE: [ Student Login ] and [ Recruiter Login ] */}
            <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPortalType('student')}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    portalType === 'student'
                      ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPortalType('recruiter')}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    portalType === 'recruiter'
                      ? 'bg-indigo-600 text-white shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Recruiter Login</span>
                </button>
              </div>
            </div>

            {/* ========================================================== */}
            {/* STUDENT LOGIN FORM                                         */}
            {/* ========================================================== */}
            {portalType === 'student' && (
              <div className="space-y-4">
                {/* Sign-In vs Sign-Up Segmented Sub-Toggle */}
                <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                      !isSignUp ? 'bg-slate-800 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                      isSignUp ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    New Student Account
                  </button>
                </div>

                {/* Google Sign-in */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase">
                    <span className="bg-slate-950 px-3 text-slate-500 font-mono">
                      or student email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleStudentSubmit} className="space-y-3.5">
                  {isSignUp && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="e.g. Maya Chen"
                          required={isSignUp}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Academic or Personal Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="scholar@university.edu"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{isSignUp ? 'Create Student Account' : 'Sign In as Student'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ========================================================== */}
            {/* RECRUITER LOGIN FORM                                       */}
            {/* STRICTLY 3 FIELDS: Company Name, Email, Password            */}
            {/* ========================================================== */}
            {portalType === 'recruiter' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Recruiter credentials provide direct access to post positions and review top-matched computational biology students.
                  </p>
                </div>

                <form onSubmit={handleRecruiterSubmit} className="space-y-3.5">
                  {/* FIELD 1: Company Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>Company Name</span>
                      <span className="text-[10px] text-indigo-400 font-mono">Required</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Illumina, Strand Life Sciences, Schrödinger"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* FIELD 2: Official Company Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>Official Company Email</span>
                      <span className="text-[10px] text-indigo-400 font-mono">Required</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={officialEmail}
                        onChange={(e) => setOfficialEmail(e.target.value)}
                        placeholder="recruiter@company.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* FIELD 3: Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>Password</span>
                      <span className="text-[10px] text-indigo-400 font-mono">Required</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={recruiterPassword}
                        onChange={(e) => setRecruiterPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/25 active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In to Recruiter Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Bottom Footer Note */}
            <div className="pt-2 text-center text-[11px] text-slate-500">
              <span>By signing in, you agree to Omic Hub's </span>
              <span className="text-slate-400 hover:underline cursor-pointer">Terms of Service</span>
              <span> & </span>
              <span className="text-slate-400 hover:underline cursor-pointer">Privacy Policy</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
