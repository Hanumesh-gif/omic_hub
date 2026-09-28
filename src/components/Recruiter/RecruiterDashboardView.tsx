import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Building2,
  Users,
  PlusCircle,
  ExternalLink,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  DollarSign,
  FileText,
  Mail,
  UserCheck,
  Eye,
  Filter,
  Sparkles,
  ShieldCheck,
  Trash2,
  Share2,
  Upload,
  Check,
  Award,
  BookOpen,
  Search,
  X,
  Copy,
} from 'lucide-react';
import { UserProfile, OpportunityItem, CandidateStudent } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../Toast';
import confetti from 'canvas-confetti';

interface RecruiterDashboardViewProps {
  user: UserProfile;
  onLogout?: () => void;
}

// Curated pool of verified computational biology candidates from top universities & research labs
const SEED_CANDIDATE_STUDENTS: CandidateStudent[] = [
  {
    id: 'cand_maya_chen',
    name: 'Maya Chen, M.S.',
    email: 'maya.chen@broadinstitute.org',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    headline: 'Bioinformatics Graduate Researcher & NGS Pipeline Specialist',
    education: 'M.S. Bioinformatics, Boston University & Harvard Medical School Program (GPA 3.94)',
    location: 'Cambridge, MA (Open to Remote / Relocation)',
    omicHubProfileUrl: 'omichub.bio/talent/maya_chen',
    atsScore: 94,
    skills: ['Python', 'Biopython', 'RNA-Seq', 'Nextflow', 'GATK', 'BWA-MEM', 'BLAST', 'Linux', 'Bash', 'Seurat', 'R'],
    verifiedBadges: [
      { badgeName: 'Omic Hub Verified', score: 98, assessmentType: 'NGS & Nextflow Workflows' },
      { badgeName: 'Broad Institute Fellow', score: 95, assessmentType: 'Somatic Variant Calling' },
    ],
    bioSummary:
      'Graduate computational biology researcher with hands-on expertise building containerized Nextflow pipelines (nf-core/rnaseq), analyzing bulk and single-cell RNA-seq datasets, and executing automated GATK variant calling on clinical cohorts.',
    githubUrl: 'https://github.com/mayachen-bio',
    resumeFileName: 'Maya_Chen_Bioinformatics_CV_2026.pdf',
    publicationsCount: 2,
    shortlisted: false,
    invited: false,
  },
  {
    id: 'cand_aarav_patel',
    name: 'Aarav Patel',
    email: 'aarav.patel@iitd.ac.in',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    headline: 'Computational Biologist & Sequence Alignment Engineer',
    education: 'M.Tech Bioinformatics & Computational Biology, IIT Delhi (GPA 3.91)',
    location: 'New Delhi / Bengaluru, India (Open to Remote)',
    omicHubProfileUrl: 'omichub.bio/talent/aarav_patel',
    atsScore: 92,
    skills: ['Python', 'Biopython', 'BLAST', 'Linux', 'Docker', 'Nextflow', 'RNA-Seq', 'Snakemake', 'C++', 'Bash'],
    verifiedBadges: [
      { badgeName: 'Omic Hub Verified', score: 96, assessmentType: 'BLAST & Sequence Alignment' },
      { badgeName: 'IIT Delhi Researcher', score: 94, assessmentType: 'Algorithmic Sequence Analysis' },
    ],
    bioSummary:
      'Engineered high-throughput sequence alignment tools with Biopython and BLAST+. Deployed parallel Nextflow workflows across university SLURM clusters for large-scale microbial metagenomic annotation.',
    githubUrl: 'https://github.com/aaravpatel-bio',
    resumeFileName: 'Aarav_Patel_Genomics_Resume.pdf',
    publicationsCount: 1,
    shortlisted: false,
    invited: false,
  },
  {
    id: 'cand_julian_ross',
    name: 'Dr. Julian Ross',
    email: 'julian.ross@schrodinger.bio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    headline: 'Computational Structural Biologist & Molecular Modeler',
    education: 'Ph.D. Structural Bioinformatics, UC San Diego',
    location: 'San Diego, CA (Remote / Hybrid)',
    omicHubProfileUrl: 'omichub.bio/talent/julian_ross',
    atsScore: 96,
    skills: ['Python', 'Biopython', 'AlphaFold 3', 'PyMOL', 'AutoDock Vina', 'RDKit', 'GROMACS', 'Linux', 'BLAST'],
    verifiedBadges: [
      { badgeName: 'Omic Hub Verified', score: 97, assessmentType: 'Protein Structure & Docking' },
      { badgeName: 'AlphaFold Certified', score: 98, assessmentType: 'De Novo Macromolecular Modeling' },
    ],
    bioSummary:
      'Specialized in macromolecular docking, AlphaFold 3 protein complex prediction, and ligand virtual screening using PyMOL, AutoDock Vina, and custom Python Biopython automation scripts.',
    githubUrl: 'https://github.com/drjulianross',
    resumeFileName: 'Julian_Ross_Structural_CV.pdf',
    publicationsCount: 4,
    shortlisted: false,
    invited: false,
  },
  {
    id: 'cand_priya_sharma',
    name: 'Priya Sharma',
    email: 'priya.sharma@genomics.ox.ac.uk',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    headline: 'Clinical Transcriptomics & Statistical Genetics Fellow',
    education: 'M.S. Genomic Medicine, University of Oxford (GPA 3.89)',
    location: 'Oxford, UK / London (Hybrid / Remote)',
    omicHubProfileUrl: 'omichub.bio/talent/priya_sharma',
    atsScore: 91,
    skills: ['R', 'Python', 'Bioconductor', 'DESeq2', 'Seurat', 'RNA-Seq', 'Linux', 'Bash', 'GWAS', 'PLINK'],
    verifiedBadges: [
      { badgeName: 'Omic Hub Verified', score: 95, assessmentType: 'Bulk & Single-Cell Transcriptomics' },
      { badgeName: 'Oxford Genomics Honor', score: 93, assessmentType: 'Clinical Cohort Statistics' },
    ],
    bioSummary:
      'Translational computational biologist skilled in differential expression pipelines (DESeq2, edgeR), single-cell cluster resolution with Seurat, and biomarker discovery from patient RNA-Seq biopsies.',
    githubUrl: 'https://github.com/priyasharma-genomics',
    resumeFileName: 'Priya_Sharma_Oxford_CV.pdf',
    publicationsCount: 3,
    shortlisted: false,
    invited: false,
  },
  {
    id: 'cand_ananya_iyer',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@iisc.ac.in',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=200&auto=format&fit=crop&q=80',
    headline: 'Microbial Genomics & Metagenomic NGS Analyst',
    education: 'M.Sc. Computational Biology, IISc Bengaluru (GPA 3.95)',
    location: 'Bengaluru, India (Open to Remote / Hybrid)',
    omicHubProfileUrl: 'omichub.bio/talent/ananya_iyer',
    atsScore: 93,
    skills: ['Python', 'Biopython', 'BLAST', 'QIIME 2', 'Kraken 2', 'Linux', 'Nextflow', 'RNA-Seq', 'R'],
    verifiedBadges: [
      { badgeName: 'Omic Hub Verified', score: 96, assessmentType: 'Metagenomics & Taxonomic Profiling' },
      { badgeName: 'IISc Research Scholar', score: 94, assessmentType: 'Microbial Genome Assembly' },
    ],
    bioSummary:
      'Researched shotgun metagenomic profiling and de novo genome assembly using Kraken 2, QIIME 2, BLAST, and custom Python Biopython parsers on Indian clinical microbiome cohorts.',
    githubUrl: 'https://github.com/ananyaiyer-bio',
    resumeFileName: 'Ananya_Iyer_IISc_Resume.pdf',
    publicationsCount: 2,
    shortlisted: false,
    invited: false,
  },
  {
    id: 'cand_rohan_deshmukh',
    name: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@iitb.ac.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    headline: 'AI Drug Discovery & Cheminformatics Specialist',
    education: 'Dual Degree B.Tech + M.Tech Biotechnology, IIT Bombay (GPA 3.88)',
    location: 'Mumbai / Pune, India (Open to Remote)',
    omicHubProfileUrl: 'omichub.bio/talent/rohan_deshmukh',
    atsScore: 90,
    skills: ['Python', 'Biopython', 'RDKit', 'PyMOL', 'Linux', 'BLAST', 'Machine Learning', 'AutoDock Vina'],
    verifiedBadges: [
      { badgeName: 'Omic Hub Verified', score: 94, assessmentType: 'Cheminformatics & Virtual Screening' },
      { badgeName: 'IIT Bombay Tech Star', score: 92, assessmentType: 'Machine Learning in Life Sciences' },
    ],
    bioSummary:
      'Developed deep learning scoring functions for ligand-protein binding affinity using RDKit, PyMOL, and Biopython. Experienced in virtual screening libraries containing 500k+ small molecules.',
    githubUrl: 'https://github.com/rohandeshmukh-bio',
    resumeFileName: 'Rohan_Deshmukh_Cheminformatics.pdf',
    publicationsCount: 1,
    shortlisted: false,
    invited: false,
  },
  {
    id: 'cand_kavita_sundaram',
    name: 'Kavita Sundaram',
    email: 'kavita.s@igib.res.in',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    headline: 'Clinical Variant Curation & Rare Disease Genomics Analyst',
    education: 'M.Sc. Bioinformatics, Jamia Millia Islamia & CSIR-IGIB (GPA 3.86)',
    location: 'New Delhi, India (Hybrid / Remote)',
    omicHubProfileUrl: 'omichub.bio/talent/kavita_sundaram',
    atsScore: 89,
    skills: ['Python', 'Linux', 'BLAST', 'GATK', 'ClinVar', 'VCFtools', 'RNA-Seq', 'Bash', 'Biopython'],
    verifiedBadges: [
      { badgeName: 'Omic Hub Verified', score: 93, assessmentType: 'Clinical Variant Interpretation (ACMG)' },
    ],
    bioSummary:
      'Curated pathogenic variants for rare inherited disorders according to ACMG guidelines. Automated clinical report generation using Python, VCFtools, and ClinVar API integrations.',
    githubUrl: 'https://github.com/kavitasundaram',
    resumeFileName: 'Kavita_Sundaram_Genomics.pdf',
    publicationsCount: 1,
    shortlisted: false,
    invited: false,
  },
  {
    id: 'cand_devendra_kulkarni',
    name: 'Devendra Kulkarni',
    email: 'devendra.k@pilani.bits-pilani.ac.in',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    headline: 'Cloud Bioinformatics DevOps & Scalable Genomics Architect',
    education: 'M.S. Computer Science & Computational Biology, BITS Pilani (GPA 3.85)',
    location: 'Hyderabad / Bengaluru, India (Remote)',
    omicHubProfileUrl: 'omichub.bio/talent/devendra_kulkarni',
    atsScore: 92,
    skills: ['Nextflow', 'Docker', 'Kubernetes', 'AWS Omics', 'Linux', 'Python', 'Bash', 'SLURM', 'Biopython'],
    verifiedBadges: [
      { badgeName: 'Omic Hub Verified', score: 97, assessmentType: 'Cloud Genomics & Containerization' },
    ],
    bioSummary:
      'Cloud infrastructure engineer specializing in deploying scalable Nextflow nf-core pipelines on AWS HealthOmics and SLURM clusters. Proficient in Linux automation and Docker container security.',
    githubUrl: 'https://github.com/devendrakulkarni',
    resumeFileName: 'Devendra_Kulkarni_DevOps.pdf',
    publicationsCount: 0,
    shortlisted: false,
    invited: false,
  },
];

export const RecruiterDashboardView: React.FC<RecruiterDashboardViewProps> = ({
  user,
  onLogout,
}) => {
  const { showToast } = useToast();
  const companyName = user.companyName || user.name || 'Biotech Innovation Lab';

  // Strict 2-Tab Navigation:
  // Tab 1: Post a New Job / Internship
  // Tab 2: Top Matched Students (Candidate Pipeline)
  const [activeTab, setActiveTab] = useState<'post-job' | 'candidates'>('post-job');

  // Candidate student pool state
  const [candidates, setCandidates] = useState<CandidateStudent[]>(() => {
    try {
      const stored = localStorage.getItem('omichub_recruiter_candidates');
      return stored ? JSON.parse(stored) : SEED_CANDIDATE_STUDENTS;
    } catch {
      return SEED_CANDIDATE_STUDENTS;
    }
  });

  // Posted jobs from storage
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(() =>
    StorageService.getOpportunities()
  );

  // Selected Candidate for Profile & Resume Modal
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateStudent | null>(null);

  // Search & Filter in Candidate Pipeline
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');
  const [candidateFilterTab, setCandidateFilterTab] = useState<'all' | 'shortlisted' | 'invited'>('all');

  // Active Job for matching filter
  const [matchingJobTitle, setMatchingJobTitle] = useState<string>('Junior NGS Bioinformatics Analyst');

  // ==============================================================
  // TAB 1: FORM FIELDS
  // 1. Role Title
  // 2. Work Type (Remote/On-site/Hybrid)
  // 3. Stipend/Salary
  // 4. Required Skills Tags (e.g. Python, Biopython, BLAST, Linux, RNA-Seq)
  // 5. Job Description (JD) paste/upload
  // ==============================================================
  const [roleTitle, setRoleTitle] = useState('Junior NGS Bioinformatics Analyst');
  const [workType, setWorkType] = useState<'Remote' | 'On-site' | 'Hybrid'>('Remote');
  const [stipendSalary, setStipendSalary] = useState('₹8,00,000 - ₹14,00,000/yr');
  const [skillsTags, setSkillsTags] = useState<string[]>([
    'Python',
    'Biopython',
    'BLAST',
    'Linux',
    'RNA-Seq',
  ]);
  const [skillInput, setSkillInput] = useState('');
  const [jobDescription, setJobDescription] = useState(
    'Seeking an enthusiastic Computational Biologist / Bioinformatics Scientist to design, validate, and execute reproducible NGS data analysis pipelines (bulk & single-cell RNA-seq, variant calling). Must have proficiency with Python, Biopython, Linux command line, and BLAST sequence homology search. Experience with Nextflow or containerized workflows is a strong plus.'
  );
  const [jdFileName, setJdFileName] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Persist candidate status changes to local storage
  const saveCandidateState = (updatedList: CandidateStudent[]) => {
    setCandidates(updatedList);
    try {
      localStorage.setItem('omichub_recruiter_candidates', JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }
  };

  // Sync opportunities with storage
  useEffect(() => {
    const unsub = StorageService.subscribe(() => {
      setOpportunities(StorageService.getOpportunities());
    });
    return () => unsub();
  }, []);

  // Quick preset skill adder
  const handleAddSkillTag = (skillName: string) => {
    const trimmed = skillName.trim();
    if (trimmed && !skillsTags.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkillsTags((prev) => [...prev, trimmed]);
    }
  };

  const handleRemoveSkillTag = (tagToRemove: string) => {
    setSkillsTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (skillInput.trim()) {
        handleAddSkillTag(skillInput.trim());
        setSkillInput('');
      }
    }
  };

  // Handle JD File Upload
  const handleJdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setJdFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      if (text) {
        setJobDescription(text);
        showToast(`Loaded Job Description from file: ${file.name}`, 'info');
      }
    };
    reader.readAsText(file);
  };

  // Handle Tab 1: Publish Listing to Student Feed
  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleTitle.trim()) {
      showToast('Validation Error: Role Title is required.', 'error');
      return;
    }
    if (!stipendSalary.trim()) {
      showToast('Validation Error: Stipend / Salary is required.', 'error');
      return;
    }
    if (skillsTags.length === 0) {
      showToast('Validation Error: Please specify at least one required skill tag.', 'error');
      return;
    }
    if (!jobDescription.trim()) {
      showToast('Validation Error: Job Description cannot be empty.', 'error');
      return;
    }

    setIsPublishing(true);

    // Save recruiter job to global storage so it appears immediately on student feed
    const newOpportunity = StorageService.addRecruiterJob({
      title: roleTitle.trim(),
      organization: companyName,
      location: workType === 'Remote' ? 'Remote' : workType === 'Hybrid' ? 'Hybrid (India/Global)' : 'On-site',
      skills: skillsTags,
      priceOrCompensation: stipendSalary.trim(),
      numericValue: stipendSalary.includes('15') ? 1500000 : 800000,
      rangeTier: stipendSalary.includes('15') ? '15L_plus' : '100k_to_15L',
      durationOrSchedule: `${workType} • Full-Time / Trainee`,
      startDateOrDeadline: 'Immediate Direct Placement',
      description: jobDescription.trim(),
      postedByRecruiterId: user.id,
      postedByRecruiterName: user.name || `${companyName} Hiring Team`,
      recruiterEmail: user.email,
      applicationType: 'in_app',
      matchScore: 98,
    });

    setOpportunities(StorageService.getOpportunities());
    setMatchingJobTitle(newOpportunity.title);
    setIsPublishing(false);

    confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
    showToast(
      `"${newOpportunity.title}" published! Listing is now active on the student feed. Switched to Candidate Pipeline.`,
      'success'
    );

    // Automatically transition to Tab 2: Top Matched Students
    setActiveTab('candidates');
  };

  // ==============================================================
  // TAB 2: CANDIDATE MATCHING ENGINE
  // Match candidate skills against active JD & skill tags
  // ==============================================================
  const calculateCandidateMatch = (student: CandidateStudent) => {
    const jdLower = (jobDescription + ' ' + roleTitle).toLowerCase();
    const activeSkillsLower = skillsTags.map((s) => s.toLowerCase());

    // Exact skill matches
    const matchedSkills: string[] = [];
    student.skills.forEach((sk) => {
      const skLower = sk.toLowerCase();
      // Match against tag list or JD text
      if (activeSkillsLower.includes(skLower) || jdLower.includes(skLower)) {
        matchedSkills.push(sk);
      }
    });

    // Score calculation
    const baseSkillScore = activeSkillsLower.length > 0
      ? (matchedSkills.length / Math.max(activeSkillsLower.length, 3)) * 60
      : 50;

    const assessmentBonus = (student.verifiedBadges[0]?.score || 90) * 0.3;
    const atsContribution = (student.atsScore || 85) * 0.1;

    const rawPercentage = Math.round(baseSkillScore + assessmentBonus + atsContribution);
    const finalPercentage = Math.min(99, Math.max(68, rawPercentage));

    return {
      percentage: finalPercentage,
      matchedSkills,
    };
  };

  // Process & rank candidates
  const processedCandidates = candidates
    .map((cand) => {
      const { percentage, matchedSkills } = calculateCandidateMatch(cand);
      return {
        ...cand,
        matchPercentage: percentage,
        matchedSkills,
      };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Filter candidates by search & shortlist tabs
  const filteredCandidates = processedCandidates.filter((cand) => {
    if (candidateFilterTab === 'shortlisted' && !cand.shortlisted) return false;
    if (candidateFilterTab === 'invited' && !cand.invited) return false;

    if (candidateSearchQuery.trim()) {
      const q = candidateSearchQuery.toLowerCase();
      const matchName = cand.name.toLowerCase().includes(q);
      const matchSkills = cand.skills.some((s) => s.toLowerCase().includes(q));
      const matchEdu = cand.education.toLowerCase().includes(q);
      return matchName || matchSkills || matchEdu;
    }
    return true;
  });

  // Toggle Invite to Apply / Shortlist
  const handleToggleInviteShortlist = (studentId: string) => {
    const updated = candidates.map((cand) => {
      if (cand.id === studentId) {
        const nextState = !cand.shortlisted;
        return {
          ...cand,
          shortlisted: nextState,
          invited: nextState,
        };
      }
      return cand;
    });

    saveCandidateState(updated);
    const target = updated.find((c) => c.id === studentId);
    if (target?.shortlisted) {
      showToast(`Invited & Shortlisted ${target.name} for "${roleTitle}"!`, 'success');
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } else {
      showToast(`Removed ${target?.name} from shortlist.`, 'info');
    }
  };

  const handleCopyProfileLink = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast(`Profile link copied: ${url}`, 'success');
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Recruiter Workspace Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0b1120] border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Official Recruiter Workspace &bull; Direct Talent Node</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {companyName} <span className="text-slate-400 font-normal">Talent Hub</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Publish computational biology roles directly to student feeds and automatically process top-matched candidates verified through Omic Hub skill benchmarks.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1 font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{companyName}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>{user.email}</span>
              </span>
              <span>&bull;</span>
              <span className="text-teal-400">
                {user.omicHubProfileUrl || `omichub.bio/company/${companyName.toLowerCase().replace(/\s+/g, '_')}`}
              </span>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block font-medium">Verified Candidates</span>
              <span className="text-xl font-black text-teal-400">{candidates.length}</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block font-medium">Shortlisted</span>
              <span className="text-xl font-black text-indigo-400">
                {candidates.filter((c) => c.shortlisted).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2-TAB SEGMENTED NAVIGATION:                                     */}
      {/* TAB 1: Post a New Job / Internship                             */}
      {/* TAB 2: Top Matched Students (Candidate Pipeline)               */}
      {/* ============================================================== */}
      <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('post-job')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'post-job'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-indigo-300" />
            <span>TAB 1: Post a New Job / Internship</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('candidates')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'candidates'
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4 text-slate-950" />
            <span>TAB 2: Top Matched Students (Candidate Pipeline)</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                activeTab === 'candidates' ? 'bg-slate-950 text-teal-300' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {candidates.length}
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: POST A NEW JOB / INTERNSHIP                             */}
      {/* Strictly Form Fields: Role Title, Work Type, Stipend/Salary,   */}
      {/* Required Skills Tags, and JD paste/upload                      */}
      {/* Action Button: "Publish Listing to Student Feed"               */}
      {/* ============================================================== */}
      {activeTab === 'post-job' && (
        <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="mb-6 pb-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <span>Post a New Job / Internship</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Fill out the required listing details. Once published, this position appears instantly on the student feed and automatically ranks candidate matches.
              </p>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
              Direct Student Broadcast
            </span>
          </div>

          <form onSubmit={handlePublishListing} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* FIELD 1: Role Title */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center justify-between">
                  <span>Role Title <span className="text-rose-400">*</span></span>
                  <span className="text-[10px] text-slate-400">e.g. Junior NGS Analyst</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Junior NGS Bioinformatics Analyst / Trainee"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* FIELD 2: Work Type (Remote / On-site / Hybrid) */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  Work Type <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Remote', 'On-site', 'Hybrid'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setWorkType(type)}
                      className={`py-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        workType === type
                          ? 'bg-indigo-600 text-white shadow-md border border-indigo-400/40'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* FIELD 3: Stipend / Salary */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center justify-between">
                  <span>Stipend / Salary <span className="text-rose-400">*</span></span>
                  <span className="text-[10px] text-slate-400">Annual or Monthly</span>
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={stipendSalary}
                    onChange={(e) => setStipendSalary(e.target.value)}
                    placeholder="e.g. ₹8,00,000 - ₹14,00,000/yr or ₹35,000/mo"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Company Identity (Auto-filled) */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  Hiring Organization / Division
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={companyName}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-300 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* FIELD 4: Required Skills Tags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Required Skills Tags <span className="text-rose-400">*</span></span>
                </label>
                <span className="text-[11px] text-slate-400">
                  Press Enter or comma to add tags
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-indigo-500 transition-colors">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {skillsTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-semibold"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillTag(tag)}
                        className="hover:text-rose-400 transition-colors cursor-pointer ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleKeyDownSkill}
                    placeholder="Type skill & press Enter (e.g. Nextflow)..."
                    className="flex-1 min-w-[200px] py-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                  />
                </div>

                {/* Suggested Quick Tags */}
                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">
                    Quick Add:
                  </span>
                  {[
                    'Python',
                    'Biopython',
                    'BLAST',
                    'Linux',
                    'RNA-Seq',
                    'Nextflow',
                    'PyMOL',
                    'R',
                    'GATK',
                    'Seurat',
                    'Docker',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAddSkillTag(preset)}
                      className={`text-[10px] px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        skillsTags.includes(preset)
                          ? 'bg-slate-800 text-slate-500 cursor-default'
                          : 'bg-slate-950 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FIELD 5: Job Description (JD) Paste / Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Job Description (JD) Paste / Upload <span className="text-rose-400">*</span></span>
                </label>

                {/* File Upload Trigger */}
                <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-indigo-300 hover:text-white cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{jdFileName ? `Attached: ${jdFileName}` : 'Upload JD File (.txt, .md, .doc)'}</span>
                  <input
                    type="file"
                    accept=".txt,.md,.doc,.docx,.json"
                    onChange={handleJdFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <textarea
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste Job Description (JD) requirements, qualifications, and role responsibilities here..."
                required
                className="w-full p-4 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono leading-relaxed"
              />
            </div>

            {/* ACTION BUTTON: "Publish Listing to Student Feed" */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Listing will be tagged with "Posted by Verified Recruiter"</span>
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/25 transition-all hover:scale-102 active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {isPublishing ? (
                  <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>Publish Listing to Student Feed</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: TOP MATCHED STUDENTS (CANDIDATE PIPELINE)               */}
      {/* Process uploaded Job Description & display ranked list         */}
      {/* Display: Name & Profile Link, Skill Match Score %,             */}
      {/* Matching Skill Badges (e.g. Python ✓), Omic Hub Verified Badge */}
      {/* Action Buttons: [ View Profile & Resume ] | [ Invite/Shortlist]*/}
      {/* ============================================================== */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          
          {/* Candidate Pipeline Control Bar */}
          <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-400" />
                    <span>Top Matched Students (Candidate Pipeline)</span>
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                    Live JD Algorithm Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Ranking candidates against: <strong className="text-slate-200">"{roleTitle}"</strong> with required skills: <span className="font-mono text-teal-300">{skillsTags.join(', ')}</span>
                </p>
              </div>

              {/* Sub-Filters: All, Shortlisted, Invited */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCandidateFilterTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    candidateFilterTab === 'all'
                      ? 'bg-teal-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Matches ({processedCandidates.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCandidateFilterTab('shortlisted')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    candidateFilterTab === 'shortlisted'
                      ? 'bg-indigo-600 text-white font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Shortlisted ({candidates.filter((c) => c.shortlisted).length})</span>
                </button>
              </div>
            </div>

            {/* Search Input Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={candidateSearchQuery}
                onChange={(e) => setCandidateSearchQuery(e.target.value)}
                placeholder="Search candidates by name, university (IIT, Oxford), or specific skill (e.g. Nextflow, PyMOL)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              {candidateSearchQuery && (
                <button
                  type="button"
                  onClick={() => setCandidateSearchQuery('')}
                  className="absolute right-3.5 top-2.5 text-slate-500 hover:text-slate-300 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* CANDIDATE CARDS LIST */}
          <div className="grid grid-cols-1 gap-4">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => {
                const isShortlisted = candidate.shortlisted;

                return (
                  <div
                    key={candidate.id}
                    className={`rounded-3xl bg-[#0f172a] border transition-all p-5 sm:p-6 shadow-xl relative overflow-hidden group ${
                      isShortlisted
                        ? 'border-indigo-500/60 bg-gradient-to-r from-[#0f172a] to-indigo-950/20'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      
                      {/* Left: Avatar & Candidate Info */}
                      <div className="flex items-start gap-4">
                        <img
                          src={candidate.avatar}
                          alt={candidate.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-teal-500/50 transition-all shrink-0"
                        />
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-white group-hover:text-teal-300 transition-colors">
                              {candidate.name}
                            </h3>

                            {/* "Omic Hub Verified" Badge (showing student cleared Omic Hub assessments) */}
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[11px] font-bold">
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                              <span>Omic Hub Verified ({candidate.verifiedBadges[0]?.score || 95}%)</span>
                            </span>

                            {isShortlisted && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold">
                                <Check className="w-3 h-3 text-indigo-400" />
                                <span>Shortlisted / Invited</span>
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-300 font-medium">
                            {candidate.headline}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1 text-slate-400">
                              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                              <span>{candidate.education}</span>
                            </span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <MapPin className="w-3.5 h-3.5 text-slate-500" />
                              <span>{candidate.location}</span>
                            </span>
                          </div>

                          {/* Auto-Generated Omic Hub Profile Link */}
                          <div className="pt-1 flex items-center gap-2">
                            <span className="text-[11px] font-mono text-teal-400 hover:underline flex items-center gap-1 cursor-pointer">
                              <span>https://{candidate.omicHubProfileUrl}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyProfileLink(`https://${candidate.omicHubProfileUrl}`)}
                              className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                              title="Copy Profile URL"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Center / Right: Match Score & Action Buttons */}
                      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-end xl:items-center gap-4 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800">
                        
                        {/* Skill Match Score Percentage */}
                        <div className="text-left sm:text-right lg:text-right">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30">
                            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                            <span className="text-sm font-black text-teal-300 font-mono">
                              {candidate.matchPercentage}% JD Skill Match
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Calculated from active JD criteria
                          </p>
                        </div>

                        {/* Action Buttons: [ View Profile & Resume ] | [ Invite to Apply / Shortlist ] */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCandidate(candidate)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5 text-sky-400" />
                            <span>View Profile & Resume</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleInviteShortlist(candidate.id)}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
                              isShortlisted
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-black'
                            }`}
                          >
                            {isShortlisted ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Shortlisted ✓</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5 text-slate-950" />
                                <span>Invite to Apply / Shortlist</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Skill Badges matching the JD (e.g., Python ✓, RNA-Seq ✓) */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 mr-1">
                        JD Matching Skills:
                      </span>
                      {candidate.matchedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-500/15 border border-teal-500/35 text-teal-300 text-xs font-mono font-bold"
                        >
                          <span>{sk}</span>
                          <Check className="w-3 h-3 text-teal-400" />
                        </span>
                      ))}

                      {/* Other candidate skills */}
                      {candidate.skills
                        .filter((sk) => !candidate.matchedSkills.includes(sk))
                        .slice(0, 3)
                        .map((otherSkill) => (
                          <span
                            key={otherSkill}
                            className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono"
                          >
                            {otherSkill}
                          </span>
                        ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center rounded-3xl bg-[#0f172a] border border-slate-800 space-y-3">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No candidates match the current filter</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search query or reset to view all verified candidates.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCandidateSearchQuery('');
                    setCandidateFilterTab('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold cursor-pointer transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CANDIDATE PROFILE & RESUME MODAL                               */}
      {/* Triggered by: [ View Profile & Resume ]                         */}
      {/* ============================================================== */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f172a] border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/40 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{selectedCandidate.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
                      Omic Hub Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{selectedCandidate.headline}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedCandidate.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile URL Banner */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Public Profile Link:</span>
              <div className="flex items-center gap-2 text-teal-300">
                <span>https://{selectedCandidate.omicHubProfileUrl}</span>
                <button
                  type="button"
                  onClick={() => handleCopyProfileLink(`https://${selectedCandidate.omicHubProfileUrl}`)}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Verified Bio Summary */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Candidate Bio & Research Summary
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 leading-relaxed">
                {selectedCandidate.bioSummary}
              </p>
            </div>

            {/* Education & Verified Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Education & Degree
                </span>
                <p className="text-xs text-white font-semibold">{selectedCandidate.education}</p>
                <p className="text-[11px] text-slate-400">Location: {selectedCandidate.location}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Verified Technical Assessments
                </span>
                {selectedCandidate.verifiedBadges.map((badge, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{badge.assessmentType}</span>
                    <span className="font-mono font-bold text-teal-400">{badge.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Skills Inventory */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Technical Competencies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map((skill) => {
                  const isMatching = skillsTags.some((t) => t.toLowerCase() === skill.toLowerCase());
                  return (
                    <span
                      key={skill}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1 ${
                        isMatching
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                          : 'bg-slate-900 text-slate-300 border border-slate-800'
                      }`}
                    >
                      <span>{skill}</span>
                      {isMatching && <Check className="w-3 h-3 text-teal-400" />}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Master Resume Attachment */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-xs font-bold text-white">
                    {selectedCandidate.resumeFileName || 'Candidate_Bioinformatics_Master_CV.pdf'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    ATS Calibrated Resume &bull; Verified Credentials
                  </p>
                </div>
              </div>

              <span className="text-xs text-indigo-400 font-mono font-bold">
                ATS Score: {selectedCandidate.atsScore}/100
              </span>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  handleToggleInviteShortlist(selectedCandidate.id);
                  setSelectedCandidate(null);
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg cursor-pointer transition-all ${
                  selectedCandidate.shortlisted
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                }`}
              >
                {selectedCandidate.shortlisted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Shortlisted ✓</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>Invite Candidate to Apply / Shortlist</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
