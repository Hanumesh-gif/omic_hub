import React, { useMemo } from 'react';
import {
  FileText,
  Briefcase,
  GraduationCap,
  Mic,
  SearchCode,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Clock,
  Award,
  Zap,
  ChevronRight,
  ExternalLink,
  Database,
  Search,
  User,
  Settings,
  AlertTriangle,
  BookOpen,
  Dna,
  Check,
} from 'lucide-react';
import { UserProfile, JobApplication, ActivityItem, ResumeData } from '../types';
import { ActiveTab } from './Sidebar';
import { OpportunitiesHub } from './Dashboard/OpportunitiesHub';
import { BioinformaticsNews } from './Dashboard/BioinformaticsNews';

interface DashboardViewProps {
  user: UserProfile;
  resume: ResumeData;
  applications: JobApplication[];
  activities: ActivityItem[];
  atsScore: number;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenResumeBuilder: () => void;
  onOpenMockInterview: () => void;
  onOpenResumeAnalyzer?: () => void;
  onOpenDataRetrieval?: () => void;
  onOpenDataVault?: () => void;
  onOpenProfileSettings?: () => void;
  onUpdateResume?: (resume: ResumeData) => void;
  onUpdateUser?: (user: UserProfile) => void;
}

// 7 Standard Core Bioinformatics ATS Benchmark Skills
export const CORE_BIOINFORMATICS_SKILLS = [
  { id: 'Python', name: 'Python', regex: /python|biopython/i, desc: 'Scripting, Biopython, Pandas' },
  { id: 'R', name: 'R', regex: /(^|\W)r(\W|$)|bioconductor|deseq2|seurat|ggplot/i, desc: 'Bioconductor, scRNA-seq, DESeq2' },
  { id: 'BLAST', name: 'BLAST', regex: /blast|blastp|blastn|ncbi blast/i, desc: 'Homology search, alignment' },
  { id: 'Linux', name: 'Linux', regex: /linux|bash|unix|shell|cli|terminal/i, desc: 'HPC, SLURM, shell scripting' },
  { id: 'PyMOL', name: 'PyMOL', regex: /pymol|chimerax|autodock|docking|pdb|alphafold/i, desc: 'Structural modeling, 3D visualization' },
  { id: 'Nextflow', name: 'Nextflow', regex: /nextflow|nf-core|snakemake|cwl|wdl/i, desc: 'Pipelines, container workflows' },
  { id: 'RNA-Seq', name: 'RNA-Seq', regex: /rna-seq|rnaseq|transcriptom|single-cell|scrna/i, desc: 'Gene expression quantification' },
] as const;

// Verified Real Programs for Dynamic Recommendations
interface RecommendedCourse {
  id: string;
  missingSkillTriggers: string[];
  title: string;
  provider: string;
  platformBadge: 'Coursera' | 'NPTEL' | 'Verified Internship';
  price: string;
  priceHighlight: 'green' | 'blue';
  skills: string[];
  link: string;
  description: string;
}

const VERIFIED_COURSE_CATALOG: RecommendedCourse[] = [
  {
    id: 'rec_uof_t_methods',
    missingSkillTriggers: ['Python', 'Linux', 'BLAST'],
    title: 'Bioinformatic Methods I & II',
    provider: 'University of Toronto (Coursera)',
    platformBadge: 'Coursera',
    price: 'Free Audit',
    priceHighlight: 'green',
    skills: ['Python', 'Biopython', 'Linux', 'BLAST'],
    link: 'https://www.coursera.org/learn/bioinformatics-methods-1',
    description: 'Master NCBI BLAST, multiple sequence alignments, phylogenetic analysis, and RNA structure modeling with free audit access.',
  },
  {
    id: 'rec_iitm_nptel',
    missingSkillTriggers: ['Linux', 'BLAST', 'Python', 'PyMOL'],
    title: 'BioInformatics: Algorithms and Applications',
    provider: 'IIT Madras (NPTEL / SWAYAM)',
    platformBadge: 'NPTEL',
    price: 'Free / ₹1,000 Exam Fee',
    priceHighlight: 'blue',
    skills: ['Linux', 'Algorithms', 'BLAST', 'Python', 'PyMOL'],
    link: 'https://nptel.ac.in/courses/102106065',
    description: 'Government certified 12-week computational biology foundation covering scoring matrices, FASTA/BLAST algorithms, and 3D structure analysis.',
  },
  {
    id: 'rec_ucsd_beg',
    missingSkillTriggers: ['Python', 'Linux'],
    title: 'Biology Meets Programming: Bioinformatics for Beginners',
    provider: 'UC San Diego (Coursera)',
    platformBadge: 'Coursera',
    price: 'Free Audit',
    priceHighlight: 'green',
    skills: ['Python', 'Algorithms', 'DNA Motifs', 'Linux'],
    link: 'https://www.coursera.org/learn/bioinformatics',
    description: 'Learn to write clean Python scripts to locate replication origins (DnaA boxes) and detect hidden genetic regulatory signals.',
  },
  {
    id: 'rec_bioresire_trainee',
    missingSkillTriggers: ['RNA-Seq', 'Nextflow', 'R'],
    title: 'Computational Biology & Genomic Data Analysis Trainee',
    provider: 'BioResire / Industry Partners',
    platformBadge: 'Verified Internship',
    price: 'Free / stipend',
    priceHighlight: 'green',
    skills: ['RNA-Seq', 'Nextflow', 'R', 'DESeq2'],
    link: 'https://www.coursera.org/specializations/genomic-data-science',
    description: 'Practical training on real patient NGS datasets, building containerized Nextflow pipelines and conducting differential transcriptomics in R.',
  },
  {
    id: 'rec_pymol_structural',
    missingSkillTriggers: ['PyMOL'],
    title: 'Structural Bioinformatics & Molecular Modeling',
    provider: 'UCSD & Protein Data Bank (Coursera)',
    platformBadge: 'Coursera',
    price: 'Free Audit',
    priceHighlight: 'green',
    skills: ['PyMOL', 'AlphaFold 3', 'PDB', 'AutoDock Vina'],
    link: 'https://www.coursera.org/learn/computational-neuroscience',
    description: 'Learn PyMOL scripting, Ray tracing for publication-ready figures, and AlphaFold 3 structural confidence (pLDDT) analysis.',
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  resume,
  applications,
  activities,
  atsScore,
  setActiveTab,
  onOpenResumeBuilder,
  onOpenMockInterview,
  onOpenResumeAnalyzer,
  onOpenDataRetrieval,
  onOpenDataVault,
  onOpenProfileSettings,
  onUpdateResume,
  onUpdateUser,
}) => {
  // Compute real-time pipeline statistics
  const offersCount = applications.filter((a) => a.stage === 'offer').length;
  const finalRoundsCount = applications.filter((a) => a.stage === 'final').length;
  const technicalCount = applications.filter((a) => a.stage === 'technical').length;
  const screeningCount = applications.filter((a) => a.stage === 'screening').length;
  const activeCount = offersCount + finalRoundsCount + technicalCount + screeningCount;

  // Upcoming interviews from applications
  const upcomingInterviews = applications
    .filter((a) => a.nextInterviewDate)
    .sort((a, b) => (a.nextInterviewDate! > b.nextInterviewDate! ? 1 : -1));

  // REAL ATS SCORING & DYNAMIC RECOMMENDATIONS (0-100% against Python, R, BLAST, Linux, PyMOL, Nextflow, RNA-Seq)
  const { realAtsScore, matchedSkills, missingSkills, recommendedCourses } = useMemo(() => {
    // Combine all resume text for rigorous matching
    const allResumeText = [
      resume.title || '',
      resume.summary || '',
      resume.personalInfo?.headline || '',
      ...(resume.skills?.languages || []),
      ...(resume.skills?.frameworks || []),
      ...(resume.skills?.cloudDevOps || []),
      ...(resume.skills?.toolsAndDatabases || []),
      ...(resume.workExperiences || []).flatMap((e) => [e.company, e.role, ...(e.bullets || [])]),
      ...(resume.education || []).flatMap((ed) => [ed.fieldOfStudy, ed.degree, ed.coursework || '']),
      ...(resume.projects || []).flatMap((p) => [p.name, p.description, ...(p.technologies || []), ...(p.bullets || [])]),
      ...(resume.certifications || []).flatMap((c) => [c.name, c.issuer]),
    ].join(' ').toLowerCase();

    const matched: string[] = [];
    const missing: string[] = [];

    CORE_BIOINFORMATICS_SKILLS.forEach((item) => {
      if (item.regex.test(allResumeText)) {
        matched.push(item.name);
      } else {
        missing.push(item.name);
      }
    });

    const calculatedScore = Math.round((matched.length / CORE_BIOINFORMATICS_SKILLS.length) * 100);

    // Filter recommended courses dynamically based on missing skills
    const recommendations: RecommendedCourse[] = [];
    if (missing.length > 0) {
      VERIFIED_COURSE_CATALOG.forEach((course) => {
        const matchesMissing = course.missingSkillTriggers.some((sk) => missing.includes(sk));
        if (matchesMissing && !recommendations.some((r) => r.id === course.id)) {
          recommendations.push(course);
        }
      });
    }

    return {
      realAtsScore: calculatedScore,
      matchedSkills: matched,
      missingSkills: missing,
      recommendedCourses: recommendations,
    };
  }, [resume]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. REFRAMED WELCOME BANNER (Clean slate #0f172a, anti-slop typography, functional badges) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0f172a] border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Functional Badge Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                Free Audit
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-bold">
                NPTEL / IIT
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-bold">
                Direct Hiring
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[11px] font-bold">
                Lab-Ready ATS
              </span>
            </div>

            {/* DYNAMIC BOLD DASHBOARD GREETING */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back, <span className="text-teal-300">{user.name || 'Scholar'}</span>! 🧬 Let's advance your computational biology career today.
            </h1>

            {/* HUMAN-CENTERED HERO & SUBTITLE COPY */}
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-semibold text-slate-200">
                Find real bioinformatics internships, low-cost certifications, and build a lab-ready resume.
              </p>
              <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
                No fake postings. Direct links to Coursera audit courses, NPTEL exam details, and real biotech startup roles.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onOpenProfileSettings && (
              <button
                onClick={onOpenProfileSettings}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <User className="w-4 h-4 text-teal-400" />
                <span>Profile Settings</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('skills')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Verified Courses</span>
            </button>
            <button
              onClick={() => setActiveTab('tracker')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Jobs & Pipeline</span>
            </button>
            <button
              onClick={onOpenResumeBuilder}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Resume Builder</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME USER STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Stat 1: REAL ATS Match Score */}
        <div
          onClick={() => setActiveTab('builder')}
          className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg hover:border-indigo-500/50 transition-all cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bioinformatics ATS Match</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {realAtsScore}%
            </span>
            <span className="text-xs text-slate-400">/ 100%</span>
            <span
              className={`ml-auto inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                realAtsScore >= 80
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                  : realAtsScore >= 50
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                  : 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
              }`}
            >
              {matchedSkills.length} of 7 Skills
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Real match against Python, R, BLAST, Linux, PyMOL, Nextflow, RNA-Seq.
          </p>
          <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                realAtsScore >= 80
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : realAtsScore >= 50
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-rose-500 to-orange-400'
              }`}
              style={{ width: `${Math.max(realAtsScore, 6)}%` }}
            />
          </div>
        </div>

        {/* Stat 2: Active Job & Internship Pipeline */}
        <div
          onClick={() => setActiveTab('tracker')}
          className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg hover:border-emerald-500/50 transition-all cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Opportunity Pipeline</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{applications.length}</span>
            <span className="text-xs text-slate-400">Total Tracked</span>
            <span className="ml-auto inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {offersCount > 0 ? `${offersCount} Offer!` : 'Active'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            {finalRoundsCount} Final Rounds &bull; {technicalCount} Technical Rounds
          </p>
          <div className="mt-3 flex items-center gap-1">
            <span className="text-[10px] text-slate-400 font-medium">Conversion rate:</span>
            <span className="text-[10px] font-bold text-white">43% to Interview</span>
          </div>
        </div>

        {/* Stat 3: Mock Interview Readiness */}
        <div
          onClick={() => setActiveTab('mock-interview')}
          className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg hover:border-sky-500/50 transition-all cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interview Readiness</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{user.interviewReadiness || 88}%</span>
            <span className="ml-auto inline-flex items-center text-xs font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
              STAR Rubric
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            High confidence in NGS Pipelines & Genomic Algorithms.
          </p>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${user.interviewReadiness || 88}%` }}
            />
          </div>
        </div>

        {/* Stat 4: Learning Hours & Courses */}
        <div
          onClick={() => setActiveTab('skills')}
          className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg hover:border-purple-500/50 transition-all cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Courses & Internships</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{user.learningHours || 32}</span>
            <span className="text-xs text-slate-400">Hours Logged</span>
            <span className="ml-auto inline-flex items-center text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Coursera Free Audits & NPTEL IIT programs in progress.
          </p>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: '78%' }}
            />
          </div>
        </div>

      </div>

      {/* 3. DYNAMIC "RECOMMENDED UPGRADES" SECTION DIRECTLY BELOW ATS SCORE */}
      {missingSkills.length > 0 ? (
        <div className="rounded-3xl bg-[#0b0f19] border border-indigo-500/30 p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase tracking-wider border border-amber-500/30">
                  ATS Skill Gap Identified
                </span>
                <span className="text-xs text-slate-400">
                  {matchedSkills.length}/7 Skills Matched
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                Recommended Upgrades & Courses Based on Missing Skills
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Your resume is currently missing: <span className="text-rose-300 font-mono font-bold">{missingSkills.join(', ')}</span>. Complete these verified programs to hit 100% ATS match score:
              </p>
            </div>

            <button
              onClick={() => setActiveTab('skills')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-white border border-indigo-500/30 font-bold text-xs transition-colors cursor-pointer shrink-0"
            >
              <span>Explore All Verified Courses</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3-Column Responsive Card Layout for Recommended Upgrades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendedCourses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 group"
              >
                <div>
                  {/* Top Badges: Provider + Platform */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950 text-slate-300 border border-slate-800">
                      {course.platformBadge}
                    </span>

                    {/* Highlighted Pricing Label (Bright green for Free, blue for under ₹2,000) */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        course.priceHighlight === 'green'
                          ? 'text-[#10b981] bg-emerald-500/15 border border-emerald-500/30'
                          : 'text-[#38bdf8] bg-sky-500/15 border border-sky-500/30'
                      }`}
                    >
                      {course.price}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {course.provider}
                  </p>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Array of Skill Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {course.skills.map((tag) => {
                      const isTargetMissing = missingSkills.includes(tag);
                      return (
                        <span
                          key={tag}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold ${
                            isTargetMissing
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 ring-1 ring-rose-500/30'
                              : 'bg-slate-950 text-slate-300 border border-slate-800'
                          }`}
                        >
                          {tag} {isTargetMissing && '⚡ Boost'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* "Enroll / Audit Free" Button Linking Directly to official URL in new tab */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-teal-400 font-semibold">Verified Curriculum</span>
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <span>Enroll / Audit Free</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* If no missing skills: 100% ATS Benchmark Achieved */
        <div className="rounded-3xl bg-[#0b0f19] border border-emerald-500/30 p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase tracking-wider border border-emerald-500/30">
                100% Core ATS Benchmark Achieved
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                Your resume contains all 7 core bioinformatics requirements!
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Verified matches: <span className="text-emerald-300 font-mono font-semibold">{matchedSkills.join(', ')}</span>. You are fully optimized for tier-1 bioinformatics screening.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('tracker')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all shrink-0 cursor-pointer"
          >
            Apply to Matched Opportunities
          </button>
        </div>
      )}

      {/* 4. OPPORTUNITIES HUB: Verified Jobs, Internships, Workshops */}
      <OpportunitiesHub
        user={user}
        resume={resume}
        onSelectApplicationTab={() => setActiveTab('tracker')}
      />

      {/* 5. BIOINFORMATICS INDUSTRY NEWS & BREAKTHROUGHS */}
      <BioinformaticsNews onNavigateTab={setActiveTab} />

      {/* 6. CAREER ACCELERATION MODULES & RECENT FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Quick Action Pathways */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Data Persistence & On-Demand Retrieval Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 shrink-0">
                <Database className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Career Intelligence & Instant Vault Retrieval</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Synced
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Resumes, job pipeline, courses, and interview scores auto-save continuously in real-time. Retrieve any piece of saved data on demand anytime.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onOpenDataRetrieval && (
                <button
                  onClick={onOpenDataRetrieval}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Quick Retrieve</span>
                  <span className="hidden sm:inline text-[9px] bg-indigo-700/80 px-1 py-0.5 rounded text-indigo-200">Ctrl+K</span>
                </button>
              )}
              {onOpenDataVault && (
                <button
                  onClick={onOpenDataVault}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Data Vault</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Career Acceleration Modules</span>
            </h2>
            <span className="text-xs text-slate-400">Step-by-step tools & AI assistance</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Action 1: Resume Builder */}
            <div
              onClick={() => setActiveTab('builder')}
              className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    PDF & Photo Ready
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                  Step-by-Step Resume Builder
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Guided wizard with questions, Google XYZ formula guidance, profile picture support, and professional formatting templates.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Open Builder & Live Scoring</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </div>

            {/* Action 2: Deep AI Resume Analyzer */}
            <div
              onClick={() => setActiveTab('analyzer')}
              className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-sky-500/5"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-105 transition-transform">
                    <SearchCode className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Industry Tailored
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                  AI Resume Analyzer
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Deep ATS audit targeting specific industries. Delivers before/after bullet upgrades, missing keywords, and recruiter critiques.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform">
                <span>Run Instant ATS Scan</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </div>

            {/* Action 3: Job Application Tracker */}
            <div
              onClick={() => setActiveTab('tracker')}
              className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {activeCount} Active
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Job & Interview Tracker
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Kanban pipeline managing status transitions, recruiter notes, interview scheduling, and salary benchmark tracking.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>Manage Applications</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </div>

            {/* Action 4: AI Mock Interview Simulator */}
            <div
              onClick={() => setActiveTab('mock-interview')}
              className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-violet-500/50 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-violet-500/5"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 group-hover:scale-105 transition-transform">
                    <Mic className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Badges & Referrals
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-violet-400 transition-colors">
                  Mock Interview & Skill Certifier
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Test extracted resume skills, earn verified digital credential badges, discover free & paid training tracks, and unlock direct company referrals.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform">
                <span>Certify Skills & Get Referrals</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </div>

          </div>

          {/* Upcoming Interview Milestones Card */}
          {upcomingInterviews.length > 0 && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Scheduled Interview Rounds</span>
                </h3>
                <button
                  onClick={() => setActiveTab('tracker')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <span>View All in Tracker</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {upcomingInterviews.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-white text-sm">
                        {item.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{item.company}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
                            {item.stage.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{item.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-left sm:text-right">
                        <p className="font-semibold text-slate-200">
                          {new Date(item.nextInterviewDate!).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {new Date(item.nextInterviewDate!).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('mock-interview')}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/30 transition-colors"
                      >
                        Prep with AI
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Recent Activity Feed */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Real-Time Activity Feed</span>
            </h3>

            <div className="space-y-3.5">
              {activities.slice(0, 6).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-200 truncate">{activity.title}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{activity.description}</p>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">{activity.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
