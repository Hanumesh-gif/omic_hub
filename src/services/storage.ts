import {
  UserProfile,
  ResumeData,
  JobApplication,
  ActivityItem,
  Course,
  LearningPath,
  ScheduledInterview,
  CertifiedSkillBadge,
  TrainingProgram,
  CompanyReferral,
  OpportunityItem,
  BioinformaticsNewsItem,
  BioinformaticsProgram,
  RecruiterJobApplication,
} from '../types';

export const DEFAULT_USER: UserProfile = {
  id: 'usr_bio_78942',
  name: 'Maya Chen, M.S.',
  email: 'maya.chen@broadinstitute.org',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  role: 'Bioinformatics Graduate Researcher',
  targetRole: 'Computational Biologist & NGS Pipeline Scientist',
  experienceLevel: 'Graduate Student / Researcher',
  targetIndustry: 'Genomics, Precision Oncology & Life Sciences',
  location: 'Cambridge, MA (Open to Remote)',
  atsScore: 0,
  totalApplications: 0,
  activeInterviews: 0,
  learningHours: 24,
  interviewReadiness: 72,
  isResumeUploaded: false,
  planTier: 'pro',
  planStatus: 'trial',
  trialEndDate: '2026-12-24T00:00:00.000Z',
  hasSelectedPlan: false,
  hasCompletedResumeOnboarding: false,
  userType: 'student',
  omicHubProfileUrl: 'omichub.in/profile/maya_chen',
};

export const EMPTY_RESUME: ResumeData = {
  id: 'res_empty_realtime',
  title: 'My Real-Time Master Resume',
  updatedAt: new Date().toISOString(),
  theme: 'modern',
  personalInfo: {
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  },
  summary: '',
  workExperiences: [],
  education: [],
  skills: {
    languages: [],
    frameworks: [],
    cloudDevOps: [],
    toolsAndDatabases: [],
    softSkills: [],
  },
  projects: [],
  certifications: [],
};

export const INITIAL_RESUME: ResumeData = {
  id: 'res_default_bio',
  title: 'Bioinformatics Scientist & Computational Biologist - Maya Chen',
  updatedAt: new Date().toISOString(),
  theme: 'modern',
  personalInfo: {
    fullName: 'Maya Chen, M.S.',
    headline: 'Bioinformatics Scientist | NGS Pipelines, scRNA-seq & Structural Biology',
    email: 'maya.chen@broadinstitute.org',
    phone: '+1 (617) 492-8172',
    location: 'Cambridge, MA (Open to Remote)',
    website: 'https://github.com/mayachen-bio',
    linkedin: 'https://linkedin.com/in/mayachen-bioinformatics',
    github: 'https://github.com/mayachen-bio',
  },
  summary:
    'Computational Biologist and Bioinformatics Scientist with graduate research expertise in high-throughput Next-Generation Sequencing (NGS) analysis, bulk and single-cell RNA-seq (scRNA-seq), reproducible Nextflow/nf-core pipelines, and AlphaFold-driven structural modeling. Demonstrated track record translating large multi-omic clinical cohorts into actionable biomarkers with 99.4% reproducibility.',
  workExperiences: [
    {
      id: 'exp_1',
      company: 'Broad Institute of MIT and Harvard',
      role: 'Bioinformatics Research Fellow',
      location: 'Cambridge, MA',
      startDate: '2023-06',
      endDate: '',
      current: true,
      bullets: [
        'Engineered containerized Nextflow (nf-core/rnaseq) workflows on AWS Omics and SLURM HPC clusters, processing 1,400+ whole-transcriptome RNA-seq libraries with 99.4% pipeline reproducibility.',
        'Executed single-cell RNA-seq clustering and spatial transcriptomics integration using Seurat and Harmony in R, identifying 6 previously uncharacterized tumor-infiltrating lymphocyte subpopulations.',
        'Implemented automated GATK 4 variant calling pipelines (BWA-MEM, MarkDuplicates, HaplotypeCaller, VQSR) on 450 whole-exome sequencing (WES) patient tumor-normal pairs.',
        'Authored open-source Biopython scripts for automated NCBI SRA metadata ingestion, slashing dataset intake latency by 65%.',
      ],
    },
    {
      id: 'exp_2',
      company: 'Center for Genomic Medicine',
      role: 'Graduate Computational Biology Analyst',
      location: 'Boston, MA',
      startDate: '2021-09',
      endDate: '2023-05',
      current: false,
      bullets: [
        'Conducted genome-wide association studies (GWAS) using PLINK 2.0 on 120,000 UK Biobank participants, discovering 4 novel loci associated with drug response variability.',
        'Constructed high-confidence 3D protein structure models using AlphaFold 2 and ColabFold, validated through PyMOL and AutoDock Vina binding site affinity calculations.',
        'Built automated QC dashboards using FastQC, MultiQC, and Python Streamlit, enabling bench scientists to evaluate raw Illumina NovaSeq FASTQ yields in real time.',
      ],
    },
  ],
  education: [
    {
      id: 'edu_1',
      institution: 'Boston University & Harvard Medical School Program',
      degree: 'Master of Science',
      fieldOfStudy: 'Bioinformatics & Computational Biology',
      startDate: '2021-09',
      endDate: '2023-05',
      gpa: '3.94 / 4.0',
      honors: 'Genomics Research Excellence Award • Master Thesis: Scalable scRNA-seq Cell Typing',
    },
    {
      id: 'edu_2',
      institution: 'University of California, San Diego',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Molecular Biology & Bioinformatics (Double Major)',
      startDate: '2017-09',
      endDate: '2021-06',
      gpa: '3.88 / 4.0',
      honors: 'Summa Cum Laude • Computational Biology Honors Society',
    },
  ],
  skills: {
    languages: ['Python (Biopython, Pandas, SciPy)', 'R (Bioconductor, DESeq2, Seurat)', 'Bash / Unix Shell', 'Nextflow (nf-core)', 'Snakemake', 'SQL'],
    frameworks: ['GATK 4 (Broad Institute)', 'BWA-MEM', 'Bowtie2', 'SAMtools', 'BEDtools', 'STAR Aligner', 'Salmon / Kallisto', 'CellRanger (10x Genomics)'],
    cloudDevOps: ['AWS Omics', 'SLURM HPC Clusters', 'Docker & Singularity', 'BioContainers', 'Nextflow Tower / Seqera', 'Conda & Bioconda', 'Git / GitHub'],
    toolsAndDatabases: ['NCBI (SRA, GEO, BLAST)', 'Ensembl & UCSC Genome Browser', 'UniProt & PDB / mmCIF', 'AlphaFold 3 / ColabFold', 'PyMOL & ChimeraX', 'AutoDock Vina', 'PLINK 2.0'],
    softSkills: ['Interdisciplinary Wet-Lab Collaboration', 'Scientific Manuscript Publication', 'Multi-Omic Experimental Design', 'Rigorous Statistical Hypothesis Testing'],
  },
  projects: [
    {
      id: 'proj_1',
      name: 'nf-immuno: Automated Single-Cell Tumor Immune Profiler',
      description: 'Open-source reproducible Nextflow pipeline orchestrating CellRanger count, Seurat QC, DoubletFinder, and Harmony batch integration for multi-sample scRNA-seq datasets.',
      technologies: ['Nextflow', 'R (Seurat)', 'Docker', 'Singularity', 'AWS Omics'],
      bullets: [
        'Standardized immune cell annotation across 40+ cancer cohorts, adopted by 3 academic pathology laboratories.',
        'Achieved 4x pipeline speedup by optimizing containerized task parallelization on SLURM clusters.',
      ],
    },
    {
      id: 'proj_2',
      name: 'AlphaDock-ML: Structural Variant Drug Screening Engine',
      description: 'Python and PyMOL tool integrating AlphaFold structure predictions with AutoDock Vina to screen FDA-approved compound libraries against novel viral protease mutants.',
      technologies: ['Python', 'Biopython', 'AlphaFold', 'AutoDock Vina', 'PyMOL', 'RDKit'],
      bullets: [
        'Screened 2,800 drug candidates in silico in under 12 hours, identifying 5 top candidate inhibitors verified via surface plasmon resonance.',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'Certified NGS & Variant Analysis Specialist',
      issuer: 'Illumina Genomics & Broad Institute',
      date: '2024-03',
      credentialId: 'BIO-GATK-882194',
    },
    {
      id: 'cert_2',
      name: 'Advanced Reproducible Genomics Pipelines with Nextflow',
      issuer: 'Seqera Labs / nf-core Community',
      date: '2023-11',
      credentialId: 'NF-CORE-9014',
    },
  ],
};

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app_1',
    company: 'Broad Institute of MIT and Harvard',
    role: 'Computational Biology & NGS Pipeline Scientist',
    stage: 'final',
    location: 'Cambridge, MA (Hybrid)',
    salaryRange: '₹1,20,00,000 - ₹1,55,00,000 + Benefits',
    appliedDate: '2026-08-28',
    lastUpdated: '2026-09-21',
    nextInterviewDate: '2026-09-25T14:00',
    jobUrl: 'https://broadinstitute.org/careers',
    recruiterName: 'Dr. Katherine Holmes',
    recruiterContact: 'kholmes@broadinstitute.org',
    notes: 'Passed technical coding round on Nextflow nf-core architecture. Final round with Principal Investigator and Senior Director of Genomic Medicine.',
    rating: 5,
  },
  {
    id: 'app_2',
    company: 'Illumina Genomics',
    role: 'Bioinformatics Pipeline Software Engineer',
    stage: 'technical',
    location: 'San Diego, CA / Remote',
    salaryRange: '₹1,25,00,000 - ₹1,60,00,000 + Stock',
    appliedDate: '2026-09-02',
    lastUpdated: '2026-09-18',
    nextInterviewDate: '2026-09-26T10:30',
    jobUrl: 'https://illumina.com/careers',
    recruiterName: 'David Zhang',
    recruiterContact: 'dzhang@illumina.com',
    notes: 'Reviewed DRAGEN secondary analysis algorithms. Live coding drill on SAM/BAM bitwise flag extraction and variant filtration.',
    rating: 5,
  },
  {
    id: 'app_3',
    company: 'Tempus AI',
    role: 'Clinical Genomics & Variant Interpretation Specialist',
    stage: 'screening',
    location: 'Chicago, IL / Remote',
    salaryRange: '₹1,05,00,000 - ₹1,40,00,000',
    appliedDate: '2026-09-12',
    lastUpdated: '2026-09-19',
    nextInterviewDate: '2026-09-24T16:00',
    jobUrl: 'https://tempus.com/careers',
    recruiterName: 'Sarah Jenkins',
    recruiterContact: 'sarah.j@tempus.com',
    notes: 'Discussed somatic oncogene panel analysis, ACMG pathogenicity classification, and gnomAD population frequencies.',
    rating: 4,
  },
  {
    id: 'app_4',
    company: 'Memorial Sloan Kettering Cancer Center',
    role: 'Bioinformatics Analyst - Single-Cell Oncology',
    stage: 'applied',
    location: 'New York, NY',
    salaryRange: '₹95,00,000 - ₹1,20,00,000',
    appliedDate: '2026-09-15',
    lastUpdated: '2026-09-15',
    jobUrl: 'https://mskcc.org/careers',
    recruiterName: 'Talent Acquisition Life Sciences',
    notes: 'Referral submitted through MSKCC Computational Biology seminar. Under review by Dr. Berger lab.',
    rating: 5,
  },
  {
    id: 'app_5',
    company: 'Schrödinger',
    role: 'Computational Structural Biologist (AlphaFold / Modeling)',
    stage: 'offer',
    location: 'New York, NY / Remote',
    salaryRange: '₹1,30,00,000 + Annual Bonus',
    appliedDate: '2026-08-10',
    lastUpdated: '2026-09-22',
    jobUrl: 'https://schrodinger.com/careers',
    recruiterName: 'Elena Vance, Ph.D.',
    recruiterContact: 'elena.vance@schrodinger.com',
    notes: 'Official offer received! Base: ₹1,30,00,000 + 15% bonus. Excellent alignment with my PyMOL and molecular docking background.',
    rating: 5,
  },
  {
    id: 'app_6',
    company: 'Genentech / Roche',
    role: 'Senior Bioinformatician - Biomarker Discovery',
    stage: 'wishlist',
    location: 'South San Francisco, CA',
    salaryRange: '₹1,35,00,000 - ₹1,70,00,000',
    appliedDate: '2026-09-22',
    lastUpdated: '2026-09-22',
    jobUrl: 'https://gene.com/careers',
    notes: 'Targeting application this weekend after tailoring resume bullets for spatial transcriptomics and survival analysis.',
    rating: 4,
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act_1',
    type: 'application',
    title: 'Offer Extended by Schrödinger',
    description: 'Received official offer letter for Computational Structural Biologist (₹1.30 Cr + Bonus).',
    timestamp: '2 hours ago',
    badge: 'Offer',
  },
  {
    id: 'act_2',
    type: 'interview',
    title: 'Completed Broad Institute GATK Pipeline Mock',
    description: 'Scored 94% on High-Throughput Variant Calling Architecture with AI Bar-Raiser.',
    timestamp: 'Yesterday',
    badge: '94% Score',
  },
  {
    id: 'act_3',
    type: 'resume',
    title: 'Bioinformatics ATS Resume Calibrated',
    description: 'Resume score increased to 92/100 after optimizing Biopython, Nextflow, and Seurat skill density.',
    timestamp: '2 days ago',
    badge: 'ATS 92/100',
  },
  {
    id: 'act_4',
    type: 'course',
    title: 'Completed Module: Single-Cell RNA-seq in Seurat',
    description: 'Passed interactive PCA & UMAP cell-clustering quiz with 100% accuracy. Logged 2.5 learning hours.',
    timestamp: '3 days ago',
    badge: 'Skill Verified',
  },
  {
    id: 'act_5',
    type: 'application',
    title: 'Technical Round Confirmed at Illumina',
    description: 'Scheduled live pipeline code screen on SAMtools and DRAGEN secondary analysis for Sept 26.',
    timestamp: '4 days ago',
    badge: 'Scheduled',
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs_1',
    title: 'High-Throughput NGS & GATK 4 Variant Calling Pipelines',
    category: 'Genomics & NGS',
    level: 'Advanced',
    estimatedHours: 14,
    completedHours: 12,
    progressPercent: 86,
    lessons: [
      {
        id: 'les_1',
        title: 'BWA-MEM Alignment & SAM/BAM Bitwise Flags',
        duration: '45 mins',
        completed: true,
        keyTakeaway: 'Understanding Burrows-Wheeler Transform indexing, CIGAR strings, and MAPQ score calibration.',
        quiz: {
          question: 'In a BAM alignment record, what does a MAPQ score of 0 represent?',
          options: [
            'The read aligned with 100% precision',
            'The read aligns equally well to multiple genomic locations (multi-mapping)',
            'The read failed Illumina quality trimming',
            'The read contains an insertion at the 5-prime end',
          ],
          correctIndex: 1,
          explanation: 'MAPQ = -10 * log10(P_error). A score of 0 means the probability of incorrect alignment is 1 (frequently assigned by BWA to multi-mapping reads).',
        },
      },
      {
        id: 'les_2',
        title: 'GATK HaplotypeCaller vs Mutect2 for Somatic Variants',
        duration: '55 mins',
        completed: true,
        keyTakeaway: 'De novo active region assembly vs paired tumor-normal Bayesian variant calling.',
        quiz: {
          question: 'Why is Mutect2 preferred over HaplotypeCaller for oncology clinical sequencing?',
          options: [
            'HaplotypeCaller requires unaligned FASTA reads',
            'Mutect2 models low allele fraction (AF) subclonal somatic mutations and tumor-normal background noise',
            'Mutect2 does not use BAM files',
            'HaplotypeCaller cannot run on human genomes',
          ],
          correctIndex: 1,
          explanation: 'Mutect2 is specialized for somatic mutation detection where oncogenic variants often exist at low variant allele fractions (VAF < 5%) amidst normal tissue contamination.',
        },
      },
      {
        id: 'les_3',
        title: 'Variant Quality Score Recalibration (VQSR) & Hard Filtering',
        duration: '40 mins',
        completed: false,
        keyTakeaway: 'Gaussian mixture modeling on HapMap/1000 Genomes truth sets vs QD and FS thresholding.',
        quiz: {
          question: 'When should hard filtering (QD < 2.0, FS > 60.0) be used instead of VQSR?',
          options: [
            'Only on bacterial genomes',
            'When analyzing small cohorts (< 30 whole-exomes) where statistical power for Gaussian mixture modeling is insufficient',
            'When FASTQ quality scores are above Q40',
            'Whenever Nextflow is not installed',
          ],
          correctIndex: 1,
          explanation: 'Broad Institute guidelines recommend hard filtering for small cohort sizes because VQSR requires large amounts of variant sites to train its Gaussian mixture model.',
        },
      },
    ],
  },
  {
    id: 'crs_2',
    title: 'Single-Cell RNA-seq (scRNA-seq) & Spatial Transcriptomics',
    category: 'Transcriptomics',
    level: 'Advanced',
    estimatedHours: 12,
    completedHours: 8,
    progressPercent: 67,
    lessons: [
      {
        id: 'les_4',
        title: 'Quality Control: Mitochondrial Reads & Doublet Detection',
        duration: '35 mins',
        completed: true,
        keyTakeaway: 'Filtering apoptotic cells via percent.mt > 10% and removing homotypic doublets with DoubletFinder.',
      },
      {
        id: 'les_5',
        title: 'Batch Correction with Harmony & Seurat Integration',
        duration: '50 mins',
        completed: true,
        keyTakeaway: 'Iterative clustering and soft k-means correction in PCA space without distorting true biological signal.',
      },
      {
        id: 'les_6',
        title: 'Pseudotime Trajectory Inference & Cell Differentiation',
        duration: '60 mins',
        completed: false,
        keyTakeaway: 'Using Monocle 3 and Slingshot to map continuous stem cell differentiation states.',
      },
    ],
  },
  {
    id: 'crs_3',
    title: 'Structural Bioinformatics, AlphaFold 3 & Molecular Docking',
    category: 'Structural Biology',
    level: 'Advanced',
    estimatedHours: 10,
    completedHours: 8,
    progressPercent: 80,
    lessons: [
      {
        id: 'les_7',
        title: 'AlphaFold 3 Confidence Metrics: pLDDT & PAE Matrices',
        duration: '40 mins',
        completed: true,
        keyTakeaway: 'Interpreting Predicted Aligned Error (PAE) for domain orientation and pLDDT > 90 for high-confidence sidechains.',
      },
      {
        id: 'les_8',
        title: 'AutoDock Vina In Silico Virtual Screening Pipelines',
        duration: '45 mins',
        completed: true,
        keyTakeaway: 'Grid box parameterization, ligand preparation with Open Babel, and scoring binding free energies (kcal/mol).',
      },
    ],
  },
  {
    id: 'crs_4',
    title: 'Reproducible Genomics Pipelines with Nextflow & nf-core',
    category: 'Computational Pipelines',
    level: 'Intermediate',
    estimatedHours: 8,
    completedHours: 6,
    progressPercent: 75,
    lessons: [
      {
        id: 'les_9',
        title: 'DSL2 Modules, Channels & Containerized Processes',
        duration: '35 mins',
        completed: true,
        keyTakeaway: 'Writing portable, reusable workflow steps wrapped in Docker/Singularity containers via BioContainers.',
      },
      {
        id: 'les_10',
        title: 'SLURM HPC & AWS Omics Cloud Orchestration',
        duration: '45 mins',
        completed: false,
        keyTakeaway: 'Configuring dynamic resource allocation (memory, CPUs, time) based on task retries.',
      },
    ],
  },
];

export const INITIAL_SCHEDULED_INTERVIEWS: ScheduledInterview[] = [
  {
    id: 'int_1',
    title: 'Broad Institute - NGS Pipeline Architecture & GATK Mock',
    type: 'Technical (Genomics)',
    date: '2026-09-24',
    time: '15:00',
    status: 'Scheduled',
  },
  {
    id: 'int_2',
    title: 'Illumina - SAMtools & Secondary Analysis Algorithm Drill',
    type: 'Technical (Bioinformatics)',
    date: '2026-09-25',
    time: '11:00',
    status: 'Scheduled',
  },
  {
    id: 'int_3',
    title: 'Schrödinger - AlphaFold & Structure Screening Bar-Raiser',
    type: 'Structural Biology',
    date: '2026-09-20',
    time: '14:00',
    status: 'Completed',
    score: 94,
    feedbackSummary: 'Demonstrated exceptional mastery of protein-ligand interaction modeling and reproducible Python tooling.',
  },
];

// LocalStorage Persistence Service with Real-Time Multi-Tab Sync & Data Retrieval
const STORAGE_KEYS = {
  USER: 'tf_user_profile',
  AUTH_STATE: 'tf_auth_state',
  RESUME: 'tf_resume_data',
  RESUME_REVISIONS: 'tf_resume_revisions',
  APPLICATIONS: 'tf_job_applications',
  ACTIVITIES: 'tf_activities',
  COURSES: 'tf_courses',
  SCHEDULED_INTERVIEWS: 'tf_interviews',
  CERTIFIED_BADGES: 'tf_certified_badges',
  COMPANY_REFERRALS: 'tf_company_referrals',
  OPPORTUNITIES: 'tf_opportunities',
  NEWS: 'tf_bioinformatics_news',
  BOOKMARKED_NEWS: 'tf_bookmarked_news',
  PROGRAMS: 'tf_bioinformatics_programs',
  RECRUITER_APPLICATIONS: 'tf_recruiter_applications',
  LAST_SYNC: 'tf_last_sync_time',
};

export const INITIAL_RECRUITER_APPLICATIONS: RecruiterJobApplication[] = [
  {
    id: 'rec_app_1',
    jobId: 'opp_rec_1',
    jobTitle: 'Bioinformatics Research Analyst (NGS & Clinical Genomics)',
    companyName: 'Strand Life Sciences',
    recruiterId: 'rec_strand_1',
    studentId: 'usr_bio_78942',
    studentName: 'Maya Chen, M.S.',
    studentEmail: 'maya.chen@broadinstitute.org',
    studentProfileUrl: 'omichub.in/profile/maya_chen',
    resumeFileName: 'Maya_Chen_Bioinformatics_CV_2026.pdf',
    coverNote: 'Dear Strand Life Sciences Hiring Team, I have 3+ years experience with Nextflow and RNA-Seq in R (DESeq2) with verified 92% ATS score on Omic Hub. Excited to contribute to clinical genomics pipelines.',
    submittedAt: '2026-09-26T14:30:00Z',
    status: 'shortlisted',
  },
  {
    id: 'rec_app_2',
    jobId: 'opp_rec_1',
    jobTitle: 'Bioinformatics Research Analyst (NGS & Clinical Genomics)',
    companyName: 'Strand Life Sciences',
    recruiterId: 'rec_strand_1',
    studentId: 'usr_arjun_912',
    studentName: 'Arjun Venkatesh',
    studentEmail: 'arjun.bioinfo@iitm.ac.in',
    studentProfileUrl: 'omichub.in/profile/arjun_venkatesh',
    resumeFileName: 'Arjun_V_Computational_Bio_Resume.pdf',
    coverNote: 'IIT Madras graduate with hands-on experience in GATK variant calling, Python scripting, and BLAST algorithms. Completed NPTEL certification with gold medal.',
    submittedAt: '2026-09-25T11:15:00Z',
    status: 'new',
  },
];

export const INITIAL_VERIFIED_PROGRAMS: BioinformaticsProgram[] = [
  // 1. COURSERA (FREE / AUDIT)
  {
    id: 'prog_coursera_1',
    title: 'Bioinformatic Methods I & II',
    provider: 'University of Toronto',
    platform: 'Coursera',
    badge: 'Coursera',
    priceLabel: 'Free Audit',
    originalPrice: '₹3,999',
    type: 'Course',
    verifiedBadge: true,
    rating: 4.8,
    link: 'https://www.coursera.org/learn/bioinformatics-methods-1',
    skills: ['BLAST', 'Multiple Sequence Alignment', 'Phylogenetics', 'UCSC Genome Browser', 'GenBank', 'Protein Modeling'],
    description: 'Comprehensive graduate-level foundations covering biological sequence searching, motif discovery, comparative genomics, and molecular structure analysis.',
    duration: '8 Weeks (Self-Paced)',
    level: 'Intermediate',
  },
  {
    id: 'prog_coursera_2',
    title: 'Biology Meets Programming: Bioinformatics for Beginners',
    provider: 'UC San Diego',
    platform: 'Coursera',
    badge: 'Coursera',
    priceLabel: 'Free Audit',
    originalPrice: '₹4,200',
    type: 'Course',
    verifiedBadge: true,
    rating: 4.7,
    link: 'https://www.coursera.org/learn/bioinformatics',
    skills: ['Python', 'Algorithms', 'DNA Replication Origins', 'Motif Finding', 'String Matching'],
    description: 'Master algorithmic problem solving in computational biology. Locate replication origins in bacterial genomes and uncover hidden regulatory motifs.',
    duration: '6 Weeks (Self-Paced)',
    level: 'Beginner / Intermediate',
  },
  {
    id: 'prog_coursera_3',
    title: 'Fundamental Skills in Bioinformatics',
    provider: 'Coursera Project Network',
    platform: 'Coursera',
    badge: 'Coursera',
    priceLabel: 'Free Audit',
    originalPrice: '₹1,999',
    type: 'Course',
    verifiedBadge: true,
    rating: 4.6,
    link: 'https://www.coursera.org/learn/fundamental-skills-in-bioinformatics',
    skills: ['Linux', 'Biopython', 'NCBI Entrez', 'FASTA/FASTQ', 'Command Line'],
    description: 'Guided terminal cloud environment covering Unix command line sequence manipulation, FASTQ quality inspections, and Biopython record parsing.',
    duration: '4 Weeks (Self-Paced)',
    level: 'Beginner',
  },

  // 2. GOVERNMENT / NPTEL / SWAYAM (UNDER ₹2000)
  {
    id: 'prog_nptel_1',
    title: 'BioInformatics: Algorithms and Applications',
    provider: 'IIT Madras',
    platform: 'NPTEL / SWAYAM',
    badge: 'NPTEL',
    priceLabel: 'Free / ₹1,000 Exam Fee',
    originalPrice: '₹2,500',
    type: 'Course',
    verifiedBadge: true,
    rating: 4.9,
    link: 'https://nptel.ac.in/courses/102106065',
    skills: ['Dynamic Programming', 'Needleman-Wunsch', 'Smith-Waterman', 'Hidden Markov Models', 'Scoring Matrices'],
    description: 'Premier Ministry of Education / IIT Madras certified curriculum covering exact alignment dynamic algorithms, HMM sequence modeling, and secondary structure prediction.',
    duration: '12 Weeks (Free Learning / ₹1,000 Exam Fee)',
    level: 'Advanced',
  },
  {
    id: 'prog_nptel_2',
    title: 'Genomic Data Analysis and Algorithms',
    provider: 'NPTEL',
    platform: 'NPTEL / SWAYAM',
    badge: 'NPTEL',
    priceLabel: 'Free / ₹1,000 Exam Fee',
    originalPrice: '₹2,500',
    type: 'Course',
    verifiedBadge: true,
    rating: 4.8,
    link: 'https://nptel.ac.in/courses/102104056',
    skills: ['NGS Analysis', 'RNA-Seq', 'ChIP-Seq', 'Variant Calling', 'R / Bioconductor'],
    description: 'Rigorous government-certified curriculum covering high-throughput sequencer data pipelines, differential expression analysis, and variant filtering.',
    duration: '8 Weeks (Free Learning / ₹1,000 Exam Fee)',
    level: 'Intermediate',
  },

  // 3. REAL INTERNSHIPS & WORKSHOPS
  {
    id: 'prog_intern_1',
    title: 'Computational Biology & Genomic Data Analysis Trainee',
    provider: 'BioResire / Industry Partners',
    platform: 'BioResire',
    badge: 'Verified Internship',
    priceLabel: 'Free / stipend',
    originalPrice: 'Stipend Offered',
    type: 'Internship',
    verifiedBadge: true,
    rating: 4.9,
    link: 'https://bioresire.com/internships',
    skills: ['Python', 'RNA-Seq', 'BLAST', 'Linux', 'Nextflow', 'GATK4'],
    description: 'Direct mentored industry project internship. Build end-to-end containerized NGS pipelines, analyze oncology whole-exome data, and co-author technical reports.',
    duration: '6 Weeks (Mentored Cohort)',
    level: 'Advanced',
    isProOnly: true,
  },
  {
    id: 'prog_intern_2',
    title: 'R&D Bioinformatics Trainee',
    provider: 'Cellworks / Biotech Companies',
    platform: 'Biotech Guild',
    badge: 'Verified Internship',
    priceLabel: 'Free / stipend',
    originalPrice: 'Stipend Provided',
    type: 'Internship',
    verifiedBadge: true,
    rating: 4.9,
    link: 'https://cellworks.life/careers',
    skills: ['Biopython', 'Cancer Genomics', 'Biochemical Networks', 'Drug Resistance Modeling', 'SQL'],
    description: 'Practical clinical simulation training on patient genomic profiles, therapeutic efficacy modeling, and signaling cascade analysis.',
    duration: '3 Months (Full-Time / Hybrid)',
    level: 'Pre-Professional',
    isProOnly: true,
  },
  {
    id: 'prog_workshop_1',
    title: 'High-Throughput Sequencing & NGS Pipeline Workshop',
    provider: 'CSIR-IGIB / BioCode',
    platform: 'Hands-on Workshop',
    badge: 'Workshop',
    priceLabel: 'Under ₹2,000',
    originalPrice: '₹4,000',
    type: 'Workshop',
    verifiedBadge: true,
    rating: 4.8,
    link: 'https://www.igib.res.in',
    skills: ['BWA-MEM', 'SAMtools', 'BCFtools', 'FastQC', 'Trimmomatic', 'Linux'],
    description: 'Interactive weekend bootcamp with live cloud compute instances. Execute alignment, flagstat filtering, variant annotation, and IGV visualization.',
    duration: '2 Days Intensive',
    level: 'All Levels',
  },
  {
    id: 'prog_workshop_2',
    title: 'Single-Cell RNA-Seq & Spatial Genomics Intensive Workshop',
    provider: 'Biotech Guild / Academic Consortium',
    platform: 'Live Virtual Workshop',
    badge: 'Workshop',
    priceLabel: 'Under ₹2,000',
    originalPrice: '₹3,500',
    type: 'Workshop',
    verifiedBadge: true,
    rating: 4.9,
    link: 'https://bioresire.com/workshops',
    skills: ['Seurat', 'Scanpy', 'UMAP', 'Cell Ranger', 'Clustering', 'Python'],
    description: 'Master 10x Genomics scRNA-seq analysis: QC filtering, doublet removal, clustering, marker identification, and cell trajectory inference.',
    duration: '3 Days Hands-on',
    level: 'Intermediate',
  },
];

export const INITIAL_CERTIFIED_BADGES: CertifiedSkillBadge[] = [
  {
    id: 'badge_1',
    skillName: 'NGS Pipeline Architecture & GATK 4 Secondary Analysis',
    category: 'Genomics & NGS',
    score: 94,
    issuedDate: '2026-09-21',
    verificationId: 'OMI-BIO-94102',
    verificationUrl: 'https://omichub.ai/verify/cert/OMI-BIO-94102',
    level: 'Bar-Raiser Master',
    status: 'Verified',
    assessedAreas: ['WGS / WES Alignment', 'GATK HaplotypeCaller', 'Variant Quality Recalibration (VQSR)', 'HPC Containerization'],
    interviewerLens: 'Evaluated against Broad Institute and Illumina DRAGEN senior bioinformatics scientist benchmarks with 94% composite score.',
    addedToResume: true,
  },
  {
    id: 'badge_2',
    skillName: 'Single-Cell RNA-seq & Spatial Transcriptomics (Seurat)',
    category: 'Transcriptomics',
    score: 91,
    issuedDate: '2026-09-18',
    verificationId: 'OMI-BIO-88319',
    verificationUrl: 'https://omichub.ai/verify/cert/OMI-BIO-88319',
    level: 'Certified Professional',
    status: 'Verified',
    assessedAreas: ['CellRanger Ingestion', 'Doublet Filtering', 'Harmony Batch Correction', 'Biomarker Marker Gene Discovery'],
    interviewerLens: 'Evaluated against Harvard / MSKCC Computational Oncology rubric for single-cell biomarker characterization.',
    addedToResume: true,
  },
];

export const INITIAL_TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 'prog_free_1',
    title: 'Harvard edX: Case Studies in Functional Genomics (RNA-seq & Bioconductor)',
    provider: 'Harvard University / edX',
    costType: 'Free',
    rating: 4.93,
    studentsCount: '120k+',
    duration: '8 weeks (Self-Paced)',
    level: 'Intermediate',
    skillsCovered: ['R (Bioconductor)', 'DESeq2', 'Bulk RNA-seq', 'GenomicRanges', 'Statistical Genetics'],
    url: 'https://www.edx.org/course/case-studies-in-functional-genomics',
    description: 'World-renowned Harvard Medical School curriculum teaching statistical modeling for high-throughput RNA sequencing, batch correction, and differential expression.',
    certificateIncluded: true,
    matchReason: 'Directly reinforces your resume skills in R, DESeq2, and transcriptomic analysis.',
  },
  {
    id: 'prog_free_2',
    title: 'EMBL-EBI: Nextflow & nf-core Reproducible Genomics Workflows',
    provider: 'European Bioinformatics Institute (EMBL-EBI)',
    costType: 'Free',
    rating: 4.96,
    studentsCount: '85k+',
    duration: '4 weeks',
    level: 'Advanced',
    skillsCovered: ['Nextflow', 'nf-core', 'Docker', 'Singularity', 'SLURM HPC'],
    url: 'https://www.ebi.ac.uk/training/',
    description: 'Premier open-access training on writing modular, containerized pipelines conforming to nf-core best practice guidelines.',
    certificateIncluded: true,
    matchReason: 'Perfect follow-up for your 94% score on NGS Pipeline Architecture.',
  },
  {
    id: 'prog_free_3',
    title: 'UCSD / Coursera: Bioinformatics Specialization (Algorithms & HMMs)',
    provider: 'UC San Diego / Coursera',
    costType: 'Free',
    rating: 4.9,
    studentsCount: '310k+',
    duration: '10 weeks',
    level: 'Intermediate',
    skillsCovered: ['Genome Assembly Algorithms', 'Hidden Markov Models', 'Sequence Alignment', 'Phylogenetics'],
    url: 'https://www.coursera.org/specializations/bioinformatics',
    description: 'Foundational algorithmic deep-dive into Burrows-Wheeler transform, Needleman-Wunsch dynamic programming, and de Bruijn graph genome assembly.',
    certificateIncluded: true,
    matchReason: 'Master algorithmic edge cases for Tier-1 bioinformatics research institute screens.',
  },
  {
    id: 'prog_free_4',
    title: 'RCSB Protein Data Bank: Structural Bioinformatics & AlphaFold 3',
    provider: 'RCSB PDB & EMBL-EBI',
    costType: 'Free',
    rating: 4.89,
    studentsCount: '65k+',
    duration: '15 hours',
    level: 'Intermediate',
    skillsCovered: ['AlphaFold 3', 'PDB / mmCIF', 'PyMOL', 'Molecular Docking'],
    url: 'https://pdb101.rcsb.org/',
    description: 'Comprehensive guided course on 3D macromolecular structures, evaluating pLDDT reliability, and analyzing drug-target complexes.',
    certificateIncluded: true,
    matchReason: 'Sharpens your structural modeling profile for biotech and pharmaceutical discovery roles.',
  },
  {
    id: 'prog_paid_1',
    title: 'Cold Spring Harbor Laboratory (CSHL): Computational Genomics Master Track',
    provider: 'CSHL Meetings & Courses',
    costType: 'Paid',
    price: '₹9,999 Student Pass',
    rating: 4.95,
    studentsCount: '18k+',
    duration: '25 hours',
    level: 'Advanced',
    skillsCovered: ['GATK 4', 'DeepVariant', 'Structural Variant Calling', 'Long-Read Sequencing'],
    url: 'https://meetings.cshl.edu/',
    description: 'Elite workshop with pioneers in genome assembly and variant discovery covering PacBio/Oxford Nanopore long-read workflows.',
    certificateIncluded: true,
    matchReason: 'Recommended to prepare for Senior Bioinformatician roles at Broad and Illumina.',
  },
  {
    id: 'prog_paid_2',
    title: 'Bioinformatics.org: Machine Learning in Structural Biology & Drug Screening',
    provider: 'Bioinformatics.org',
    costType: 'Paid',
    price: '₹6,999 / yr',
    rating: 4.88,
    studentsCount: '24k+',
    duration: '35 hours',
    level: 'Advanced',
    skillsCovered: ['AutoDock Vina', 'PyMOL Scripting', 'RDKit', 'Molecular Dynamics (GROMACS)'],
    url: 'https://www.bioinformatics.org/',
    description: 'Hands-on virtual screening curriculum preparing candidates for computational chemistry and AI drug discovery pipelines.',
    certificateIncluded: true,
    matchReason: 'Direct pathway to pass Schrödinger, Insitro, and Relay Therapeutics technical evaluations.',
  },
  {
    id: 'prog_paid_3',
    title: 'Coursera / Johns Hopkins: Genomic Data Science Specialization',
    provider: 'Johns Hopkins University',
    costType: 'Paid',
    price: '₹3,999 / mo',
    rating: 4.87,
    studentsCount: '140k+',
    duration: '6 months (4 hrs/wk)',
    level: 'Advanced',
    skillsCovered: ['Python Biopython', 'R Bioconductor', 'Galaxy', 'Command Line Tools (SAMtools)'],
    url: 'https://www.coursera.org/specializations/genomic-data-science',
    description: 'Designed by JHU biostatisticians to prepare scientists for real-world high-throughput clinical NGS pipelines.',
    certificateIncluded: true,
    matchReason: 'Accredited credential that boosts callback rate for clinical genomics diagnostic labs.',
  },
];

export const INITIAL_COMPANY_REFERRALS: CompanyReferral[] = [
  {
    id: 'ref_1',
    companyName: 'Broad Institute of MIT and Harvard',
    logo: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=80&auto=format&fit=crop&q=80',
    roleTitle: 'Computational Biology & NGS Pipeline Scientist',
    location: 'Cambridge, MA / Hybrid',
    salaryRange: '₹1,20,00,000 - ₹1,55,00,000 + Benefits',
    requiredCertifiedSkills: ['NGS Pipeline Architecture & GATK 4 Secondary Analysis', 'Python (Biopython)', 'Nextflow', 'SLURM HPC'],
    matchScore: 96,
    status: 'Available',
    referralChannel: 'Omic Hub Genomic Fellowship Network',
    sponsorQuote: 'Broad Institute lab heads prioritize candidates with verified 90%+ Omic Hub scores in GATK workflows and reproducible Nextflow pipelines.',
    fastTrackBadge: 'Lab Fast-Track Active 🧬',
  },
  {
    id: 'ref_2',
    companyName: 'Illumina Genomics',
    logo: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=80&auto=format&fit=crop&q=80',
    roleTitle: 'Bioinformatics Pipeline Software Engineer',
    location: 'San Diego, CA / Remote',
    salaryRange: '₹1,25,00,000 - ₹1,60,00,000 + Equity',
    requiredCertifiedSkills: ['BWA-MEM', 'SAMtools', 'Nextflow', 'Docker'],
    matchScore: 94,
    status: 'Available',
    referralChannel: 'Illumina Developer Ecosystem Partner',
    sponsorQuote: 'Our secondary analysis team looks for bioinformaticians with verified command-line mastery and containerized pipeline fluency.',
    fastTrackBadge: 'Priority Screening Queue 🚀',
  },
  {
    id: 'ref_3',
    companyName: 'Tempus AI',
    logo: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=80&auto=format&fit=crop&q=80',
    roleTitle: 'Clinical Genomics & Variant Interpretation Specialist',
    location: 'Chicago, IL / Remote',
    salaryRange: '₹1,05,00,000 - ₹1,40,00,000',
    requiredCertifiedSkills: ['Variant Calling (VCF)', 'ACMG Guidelines', 'Python', 'Ensembl'],
    matchScore: 92,
    status: 'Available',
    referralChannel: 'Precision Medicine Alliance',
    sponsorQuote: 'Tempus molecular pathology leads review Omic Hub certified candidates for immediate clinical exome panel interpretation teams.',
    fastTrackBadge: 'Direct Hiring Review ⚡',
  },
  {
    id: 'ref_4',
    companyName: 'Schrödinger',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&auto=format&fit=crop&q=80',
    roleTitle: 'Computational Structural Biologist (AlphaFold & In Silico)',
    location: 'New York, NY / Remote',
    salaryRange: '₹1,30,00,000 - ₹1,65,00,000',
    requiredCertifiedSkills: ['AlphaFold 3', 'PyMOL', 'AutoDock Vina', 'Python'],
    matchScore: 95,
    status: 'Available',
    referralChannel: 'Drug Discovery Consortium',
    sponsorQuote: 'Candidates demonstrating verified AlphaFold modeling and molecular docking skip initial coding screens.',
    fastTrackBadge: 'Skip Preliminary Screen 🎯',
  },
  {
    id: 'ref_5',
    companyName: 'Memorial Sloan Kettering Cancer Center',
    logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=80&auto=format&fit=crop&q=80',
    roleTitle: 'Single-Cell Cancer Genomics Scientist',
    location: 'New York, NY',
    salaryRange: '₹95,00,000 - ₹1,20,00,000',
    requiredCertifiedSkills: ['Single-Cell RNA-seq (Seurat)', 'R (Bioconductor)', 'DESeq2'],
    matchScore: 91,
    status: 'Available',
    referralChannel: 'Oncology Research Pipeline',
    sponsorQuote: 'Our immunology and tumor genomics labs fast-track applicants with verified Seurat single-cell clustering badges.',
    fastTrackBadge: 'Principal Investigator Queue 🧬',
  },
  {
    id: 'ref_6',
    companyName: 'Genentech / Roche',
    logo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=80&auto=format&fit=crop&q=80',
    roleTitle: 'Senior Bioinformatician - Biomarker Discovery',
    location: 'South San Francisco, CA / Remote',
    salaryRange: '₹1,35,00,000 - ₹1,70,00,000',
    requiredCertifiedSkills: ['Spatial Transcriptomics', 'Nextflow', 'Python', 'Biostatistics'],
    matchScore: 93,
    status: 'Available',
    referralChannel: 'Biotech Discovery Alliance',
    sponsorQuote: 'Genentech translational scientists prioritize candidates with demonstrated multi-omic data integration rigor.',
    fastTrackBadge: 'Direct Partner Fast-Track 🚀',
  },
];

export const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  // Verified Recruiter-Posted Roles
  {
    id: 'opp_rec_1',
    type: 'job',
    title: 'Bioinformatics Research Analyst (NGS & Clinical Genomics)',
    organization: 'Strand Life Sciences',
    logo: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=80&auto=format&fit=crop&q=80',
    location: 'Bengaluru, India (Hybrid)',
    costType: 'Paid',
    priceOrCompensation: '₹8,50,000 - ₹14,00,000/yr',
    numericValue: 850000,
    rangeTier: '100k_to_15L',
    durationOrSchedule: 'Full-Time Employee',
    startDateOrDeadline: 'Apply by Nov 15, 2026',
    skills: ['Python', 'RNA-Seq', 'BLAST', 'Linux', 'GATK 4'],
    description: 'Analyze clinical next-generation sequencing data for rare hereditary disease and somatic oncology panels. Direct collaboration with clinical diagnostic leads.',
    matchScore: 98,
    featured: true,
    perks: ['Bengaluru Lab Access', 'Health Insurance', 'Conference Publication Support'],
    isRecruiterPosted: true,
    postedByRecruiterId: 'rec_strand_1',
    postedByRecruiterName: 'Dr. Ramesh Sharma, Head of Genomic Services',
    recruiterEmail: 'careers@strandls.com',
    applicationType: 'in_app',
    createdAt: '2026-09-26T10:00:00Z',
  },
  {
    id: 'opp_rec_2',
    type: 'job',
    title: 'Computational Biology Engineer - Pipeline Automation',
    organization: 'MedGenome India',
    logo: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=80&auto=format&fit=crop&q=80',
    location: 'Bengaluru / Hyderabad (Remote Friendly)',
    costType: 'Paid',
    priceOrCompensation: '₹10,00,000 - ₹16,50,000/yr',
    numericValue: 1000000,
    rangeTier: '15L_plus',
    durationOrSchedule: 'Full-Time Employee',
    startDateOrDeadline: 'Apply by Nov 30, 2026',
    skills: ['Nextflow', 'Docker', 'Python', 'Linux', 'WGS/WES'],
    description: 'Construct scalable secondary genomics analysis pipelines on AWS and on-premise clusters for high-throughput South Asian genome sequencing initiatives.',
    matchScore: 95,
    featured: true,
    perks: ['Flexible Work Hours', 'Annual Learning Grant', 'ESOP Opportunities'],
    isRecruiterPosted: true,
    postedByRecruiterId: 'rec_medgenome_2',
    postedByRecruiterName: 'Priya Narayanan, Technical Talent Lead',
    recruiterEmail: 'talent@medgenome.com',
    applicationType: 'external',
    externalApplyUrl: 'https://www.medgenome.com/careers',
    createdAt: '2026-09-25T15:30:00Z',
  },

  // Jobs
  {
    id: 'opp_job_1',
    type: 'job',
    title: 'Computational Biology & NGS Pipeline Scientist',
    organization: 'Broad Institute of MIT and Harvard',
    logo: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=80&auto=format&fit=crop&q=80',
    location: 'Cambridge, MA / Hybrid',
    costType: 'Paid',
    priceOrCompensation: '₹1,20,00,000 - ₹1,55,00,000/yr',
    numericValue: 12000000,
    rangeTier: '15L_plus',
    durationOrSchedule: 'Full-Time Employee',
    startDateOrDeadline: 'Apply by Oct 24, 2026',
    skills: ['GATK 4', 'Nextflow', 'Python (Biopython)', 'SLURM HPC'],
    description: 'Lead high-throughput whole-genome and whole-exome sequencing analysis workflows processing 10,000+ patient samples annually.',
    matchScore: 97,
    featured: true,
    perks: ['Academic Co-Affiliation', 'Top-tier Health Benefits', 'Conference Travel Budget'],
  },
  {
    id: 'opp_job_2',
    type: 'job',
    title: 'Bioinformatics Pipeline Software Engineer',
    organization: 'Illumina Genomics',
    logo: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=80&auto=format&fit=crop&q=80',
    location: 'San Diego, CA / Remote',
    costType: 'Paid',
    priceOrCompensation: '₹1,25,00,000 - ₹1,60,00,000/yr',
    numericValue: 12500000,
    rangeTier: '15L_plus',
    durationOrSchedule: 'Full-Time Employee',
    startDateOrDeadline: 'Apply by Nov 2, 2026',
    skills: ['BWA-MEM', 'SAMtools', 'Nextflow', 'Docker', 'C++ / Python'],
    description: 'Develop and benchmark cloud-native secondary analysis pipelines for NovaSeq and NextSeq sequencing instrumentation.',
    matchScore: 95,
    featured: true,
    perks: ['Stock Purchase Plan', 'Ergonomic Home Lab Grant', 'Flexible Remote Work'],
  },
  {
    id: 'opp_job_3',
    type: 'job',
    title: 'Clinical Genomics & Oncology Variant Specialist',
    organization: 'Tempus AI',
    logo: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=80&auto=format&fit=crop&q=80',
    location: 'Chicago, IL / Remote',
    costType: 'Paid',
    priceOrCompensation: '₹1,05,00,000 - ₹1,40,00,000/yr',
    numericValue: 10500000,
    rangeTier: '15L_plus',
    durationOrSchedule: 'Full-Time Employee',
    startDateOrDeadline: 'Rolling Admissions',
    skills: ['VCF Analysis', 'ACMG Guidelines', 'gnomAD', 'Python'],
    description: 'Annotate somatic and germline oncogenic mutations in multi-gene oncology panels to guide targeted patient therapies.',
    matchScore: 92,
    featured: false,
    perks: ['Equity Package', 'Generous 401(k) Match', 'Comprehensive Healthcare'],
  },
  {
    id: 'opp_job_4',
    type: 'job',
    title: 'Single-Cell & Spatial Transcriptomics Bioinformatician',
    organization: '10x Genomics',
    logo: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=80&auto=format&fit=crop&q=80',
    location: 'Pleasanton, CA / Remote',
    costType: 'Paid',
    priceOrCompensation: '₹1,15,00,000 - ₹1,50,00,000/yr',
    numericValue: 11500000,
    rangeTier: '15L_plus',
    durationOrSchedule: 'Full-Time Employee',
    startDateOrDeadline: 'Apply by Oct 30, 2026',
    skills: ['CellRanger', 'Seurat (R)', 'Spatial Transcriptomics', 'Scanpy'],
    description: 'Engineer computational methods for Chromium single-cell immune profiling and Visium/Xenium spatial gene expression datasets.',
    matchScore: 94,
    featured: false,
    perks: ['Patent Bonuses', 'Wellness Stipend', 'Biannual Lab Offsites'],
  },
  {
    id: 'opp_job_5',
    type: 'job',
    title: 'Computational Structural Biologist & Molecular Modeling Lead',
    organization: 'Schrödinger',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&auto=format&fit=crop&q=80',
    location: 'New York, NY / Remote',
    costType: 'Paid',
    priceOrCompensation: '₹1,30,00,000 - ₹1,65,00,000/yr',
    numericValue: 13000000,
    rangeTier: '15L_plus',
    durationOrSchedule: 'Full-Time Employee',
    startDateOrDeadline: 'Apply by Nov 15, 2026',
    skills: ['AlphaFold 3', 'AutoDock Vina', 'PyMOL', 'Molecular Dynamics'],
    description: 'Deploy state-of-the-art deep learning structure prediction and free-energy perturbation (FEP+) algorithms for drug target identification.',
    matchScore: 93,
    featured: false,
    perks: ['Annual Bonus', 'Continuous Education Budget', 'Cutting-Edge GPU Clusters'],
  },

  // Internships
  {
    id: 'opp_intern_1',
    type: 'internship',
    title: 'Computational Genomics Summer 2027 Fellow',
    organization: 'Harvard Medical School & Boston Children’s Hospital',
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=80&auto=format&fit=crop&q=80',
    location: 'Boston, MA (Hybrid)',
    costType: 'Paid',
    priceOrCompensation: '₹65,000/mo Stipend',
    numericValue: 65000,
    rangeTier: '25k_to_100k',
    durationOrSchedule: '12 Weeks (Summer 2027)',
    startDateOrDeadline: 'Deadline: Oct 15, 2026',
    skills: ['R (Bioconductor)', 'DESeq2', 'Variant Calling', 'Statistical Genetics'],
    description: 'Work directly with Harvard genomics PIs investigating rare pediatric genetic disorders using whole-exome sequencing.',
    matchScore: 96,
    featured: true,
    perks: ['Harvard University ID & Library Access', 'Stipend + Housing Grant', 'Co-Authorship Opportunity'],
  },
  {
    id: 'opp_intern_2',
    type: 'internship',
    title: 'Genomic AI & AlphaFold Research Intern',
    organization: 'EMBL-EBI (European Bioinformatics Institute)',
    logo: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=80&auto=format&fit=crop&q=80',
    location: 'Hinxton, Cambridge, UK / Hybrid',
    costType: 'Paid',
    priceOrCompensation: '₹80,000/mo Stipend',
    numericValue: 80000,
    rangeTier: '25k_to_100k',
    durationOrSchedule: '14 Weeks (Summer / Fall)',
    startDateOrDeadline: 'Deadline: Oct 10, 2026',
    skills: ['AlphaFold', 'Python', 'PyMOL', 'PDB Data Mining'],
    description: 'Investigate deep learning models for structural conformational ensemble prediction and protein-nucleic acid complexes.',
    matchScore: 94,
    featured: true,
    perks: ['EMBL Campus Accommodation', 'International Visa Sponsorship', 'Supercomputer Access'],
  },
  {
    id: 'opp_intern_3',
    type: 'internship',
    title: 'Early Clinical Development Bioinformatics Intern',
    organization: 'Genentech / Roche',
    logo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=80&auto=format&fit=crop&q=80',
    location: 'South San Francisco, CA',
    costType: 'Paid',
    priceOrCompensation: '₹75,000/mo Stipend',
    numericValue: 75000,
    rangeTier: '25k_to_100k',
    durationOrSchedule: '12 Weeks (Summer 2027)',
    startDateOrDeadline: 'Deadline: Oct 20, 2026',
    skills: ['Single-Cell RNA-seq', 'Seurat', 'Biomarker Discovery', 'Nextflow'],
    description: 'Analyze multi-omic clinical trial cohorts to identify predictive immune biomarkers for checkpoint inhibitor therapies.',
    matchScore: 92,
    featured: false,
    perks: ['Corporate Housing Provided', 'Roundtrip Flights', 'Genentech Campus Gym & Dining'],
  },
  {
    id: 'opp_intern_4',
    type: 'internship',
    title: 'Biomedical Data Science & NCBI SRA Intern',
    organization: 'National Institutes of Health (NIH / NCBI)',
    logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=80&auto=format&fit=crop&q=80',
    location: 'Bethesda, MD / Remote',
    costType: 'Paid',
    priceOrCompensation: '₹55,000/mo Stipend',
    numericValue: 55000,
    rangeTier: '25k_to_100k',
    durationOrSchedule: '16 Weeks',
    startDateOrDeadline: 'Deadline: Nov 1, 2026',
    skills: ['NCBI APIs', 'Python', 'BigQuery', 'FASTA/FASTQ Formats'],
    description: 'Build open-access cloud indexing tools on petabyte-scale public sequencing datasets in the Sequence Read Archive (SRA).',
    matchScore: 89,
    featured: false,
    perks: ['NIH Research Certificate', 'Cloud Compute Stipend'],
  },
  {
    id: 'opp_intern_5',
    type: 'internship',
    title: 'Open Source Computational Biology Fellowship',
    organization: 'nf-core & Seqera Community',
    logo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=80&auto=format&fit=crop&q=80',
    location: '100% Remote (Global)',
    costType: 'Free',
    priceOrCompensation: 'Free (Open Fellowship)',
    numericValue: 0,
    rangeTier: 'free',
    durationOrSchedule: '8 Weeks Part-Time',
    startDateOrDeadline: 'Applications Open Now',
    skills: ['Nextflow', 'Docker', 'Singularity', 'BioContainers', 'GitHub'],
    description: 'Collaborate with worldwide bioinformaticians building gold-standard, peer-reviewed pipelines for metagenomics, proteomics, and RNA-seq.',
    matchScore: 95,
    featured: false,
    perks: ['Global Contributor Recognition', 'Seqera Platform Cloud Credits', '1:1 Expert Mentorship'],
  },

  // Workshops
  {
    id: 'opp_ws_1',
    type: 'workshop',
    title: 'Broad Institute GATK 4 Somatic Variant Calling & Best Practices',
    organization: 'Broad Institute of MIT and Harvard',
    logo: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=80&auto=format&fit=crop&q=80',
    location: 'Live Interactive Virtual Classroom',
    costType: 'Free',
    priceOrCompensation: '100% Free',
    numericValue: 0,
    rangeTier: 'free',
    durationOrSchedule: '2 Days (4 Hrs / Day)',
    startDateOrDeadline: 'Starts Oct 12, 2026',
    skills: ['GATK 4', 'BWA-MEM', 'Mutect2', 'HaplotypeCaller', 'VCF Filtering'],
    description: 'Hands-on live lab led by the GATK developer team covering data pre-processing, germline short variant discovery, and somatic CNV calling.',
    matchScore: 99,
    featured: true,
    instructorOrHost: 'Dr. Katherine Holmes & Broad Genomic Engineers',
    spotsLeft: 35,
  },
  {
    id: 'opp_ws_2',
    type: 'workshop',
    title: 'Reproducible Genomics with Nextflow DSL2 & nf-core Bootcamp',
    organization: 'Seqera & nf-core',
    logo: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=80&auto=format&fit=crop&q=80',
    location: 'Online Stream + Interactive AWS Cloud Sandbox',
    costType: 'Free',
    priceOrCompensation: '100% Free',
    numericValue: 0,
    rangeTier: 'free',
    durationOrSchedule: '1 Day Intensive (4 Hrs)',
    startDateOrDeadline: 'Starts Oct 18, 2026',
    skills: ['Nextflow DSL2', 'Docker', 'AWS Omics', 'nf-core Pipelines'],
    description: 'Construct containerized, reproducible multi-sample bioinformatics pipelines from scratch with automated CI/CD testing.',
    matchScore: 96,
    featured: true,
    instructorOrHost: 'nf-core Core Maintainers',
    spotsLeft: 72,
  },
  {
    id: 'opp_ws_3',
    type: 'workshop',
    title: 'Bioinformatics Technical Screen & Scientific STAR Masterclass',
    organization: 'Omic Hub Career Academy',
    logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=80&auto=format&fit=crop&q=80',
    location: 'Interactive Zoom Breakout Rooms',
    costType: 'Free',
    priceOrCompensation: '100% Free',
    numericValue: 0,
    rangeTier: 'free',
    durationOrSchedule: '3-Hour Saturday Clinic',
    startDateOrDeadline: 'Starts Oct 10, 2026',
    skills: ['STAR Method', 'Biostatistics Defense', 'Pipeline Architecture Explanation'],
    description: 'Live roleplay simulations dissecting wet-lab collaboration conflicts, statistical significance disputes, and HPC optimization challenges.',
    matchScore: 98,
    featured: true,
    instructorOrHost: 'Ex-Broad Institute & Illumina Hiring Directors',
    spotsLeft: 20,
  },
  {
    id: 'opp_ws_4',
    type: 'workshop',
    title: 'Cold Spring Harbor: Single-Cell RNA-seq & Seurat 5 Hands-On Clinic',
    organization: 'Cold Spring Harbor Laboratory',
    logo: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=80&auto=format&fit=crop&q=80',
    location: 'Interactive Cloud RStudio Workspace',
    costType: 'Paid',
    priceOrCompensation: '₹3,750 Student Pass',
    numericValue: 3750,
    rangeTier: 'under_5k',
    durationOrSchedule: '2-Day Weekend Clinic',
    startDateOrDeadline: 'Starts Oct 25, 2026',
    skills: ['Seurat 5', 'Harmony Batch Correction', 'UMAP Clustering', 'Marker Identification'],
    description: 'Process 100,000 PBMC cells from raw 10x FASTQ to cell type annotation, differential expression, and pathway enrichment.',
    matchScore: 94,
    featured: false,
    instructorOrHost: 'CSHL Computational Faculty',
    spotsLeft: 22,
  },
  {
    id: 'opp_ws_5',
    type: 'workshop',
    title: 'AlphaFold 3 & Molecular Docking In Silico Masterclass',
    organization: 'Bioinformatics.org',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&auto=format&fit=crop&q=80',
    location: 'Virtual Classroom + GPU Compute Sandbox',
    costType: 'Paid',
    priceOrCompensation: '₹4,999 Ticket',
    numericValue: 4999,
    rangeTier: 'under_5k',
    durationOrSchedule: 'Weekend Intensive (6 Hours)',
    startDateOrDeadline: 'Starts Nov 7, 2026',
    skills: ['AlphaFold 3', 'AutoDock Vina', 'PyMOL Scripting', 'Ligand Preparation'],
    description: 'Predict quaternary protein assemblies, calculate pLDDT / PAE metrics, and perform virtual ligand docking with scoring optimization.',
    matchScore: 93,
    featured: false,
    instructorOrHost: 'Structural Biology Research Fellows',
    spotsLeft: 18,
  },
  {
    id: 'opp_ws_6',
    type: 'workshop',
    title: 'Python for High-Throughput Genomics (Biopython & Pandas)',
    organization: 'Genomics Data Guild',
    logo: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=80&auto=format&fit=crop&q=80',
    location: 'Interactive Jupyter Notebook Canvas',
    costType: 'Paid',
    priceOrCompensation: '₹2,499 Ticket',
    numericValue: 2499,
    rangeTier: 'under_5k',
    durationOrSchedule: '4-Hour Intensive Clinic',
    startDateOrDeadline: 'Starts Oct 17, 2026',
    skills: ['Biopython', 'Pandas', 'NCBI Entrez', 'Pysam (BAM parsing)'],
    description: 'Accelerate genomic data wrangling, manipulate giant VCF/BAM files with pysam, and automate NCBI metadata extraction in Python.',
    matchScore: 95,
    featured: false,
    instructorOrHost: 'Senior Staff Bioinformatician',
    spotsLeft: 25,
  },
];

export const INITIAL_BIOINFORMATICS_NEWS: BioinformaticsNewsItem[] = [
  {
    id: 'news_1',
    category: 'Job Trends',
    title: '2026 Global Bioinformatics Talent Report: 42% Surge in Demand for Nextflow & Cloud Workflow Engineers',
    source: 'GenomeWeb & Biotech Careers Index',
    publishedDate: 'September 2026',
    summary: 'Bio-pharmaceutical giants and clinical diagnostic labs are prioritizing candidates with containerized pipeline automation skills (Nextflow DSL2, nf-core, Docker). Median computational biology entry salaries reached record highs, with 68% of positions offering remote or hybrid flexibility.',
    studentCareerTakeaway: 'Students with verified Nextflow and AWS HealthOmics projects skip entry-level triage. Build one reproducible pipeline with nf-core standards on your GitHub to stand out immediately.',
    keySkills: ['Nextflow DSL2', 'Docker', 'AWS HealthOmics', 'SLURM HPC', 'Python'],
    impactScore: 96,
    trendBadge: '🔥 +42% Hiring Surge',
    readTime: '3 min read',
    featured: true,
  },
  {
    id: 'news_2',
    category: 'AI & AlphaFold',
    title: 'AlphaFold 3 Adoption Accelerates Early-Stage Drug Discovery Timelines by 60%',
    source: 'Nature Biotechnology',
    publishedDate: 'September 2026',
    summary: 'Google DeepMind and Isomorphic Labs report that AlphaFold 3’s joint prediction of protein, DNA, RNA, and ligand interactions has reduced candidate small-molecule screening cycles from 18 months to 4 months across top oncology targets.',
    studentCareerTakeaway: 'Understanding pLDDT, PAE matrices, and molecular docking (AutoDock Vina, PyMOL) is becoming mandatory in biopharma computational chemistry and bioinformatics screenings.',
    keySkills: ['AlphaFold 3', 'PyMOL Scripting', 'Molecular Docking', 'In Silico Screening'],
    impactScore: 98,
    trendBadge: '🏆 Paradigm Shift',
    readTime: '4 min read',
    featured: true,
  },
  {
    id: 'news_3',
    category: 'Breakthrough',
    title: 'Sub-$100 Whole Genome Sequencing Becomes Clinical Reality with NovaSeq X & Ultima UG 100',
    source: 'Broad Institute & Genomics Tech Review',
    publishedDate: 'September 2026',
    summary: 'Sequencing cost reduction to $90 per 30x human genome has triggered an unprecedented explosion in clinical whole-genome data volume, shifting the primary cost bottleneck from wet-lab chemistry to computational variant analysis and storage.',
    studentCareerTakeaway: 'Bioinformaticians who know how to optimize I/O, reduce BAM file footprints using CRAM, and implement scatter-gather variant calling are in peak demand across clinical centers.',
    keySkills: ['GATK 4 HaplotypeCaller', 'CRAM Compression', 'WGS Analysis', 'Samtools'],
    impactScore: 95,
    trendBadge: '⚡ Infrastructure Wave',
    readTime: '4 min read',
    featured: true,
  },
  {
    id: 'news_4',
    category: 'Clinical Genomics',
    title: 'Multi-Cancer Liquid Biopsy NGS Panels Gain Accelerated FDA Fast-Track Status',
    source: 'Fierce Biotech & AACR Dispatch',
    publishedDate: 'September 2026',
    summary: 'Circulating tumor DNA (ctDNA) detection pipelines integrating unique molecular identifiers (UMIs) and machine learning error suppression demonstrate 94% sensitivity in stage-I solid tumors, sparking massive hiring in oncology diagnostics.',
    studentCareerTakeaway: 'Mastering PCR duplicate removal, low-frequency somatic variant filtration, and UMI consensus calling opens direct pathways into Tempus, Foundation Medicine, and Guardant Health.',
    keySkills: ['Somatic Variant Calling', 'UMI Deduplication', 'Liquid Biopsy', 'gnomAD Filtering'],
    impactScore: 92,
    trendBadge: '📈 Clinical Growth',
    readTime: '3 min read',
    featured: false,
  },
  {
    id: 'news_5',
    category: 'Tools & Cloud',
    title: 'Seurat 5 & Harmony 2.0 Revolutionize 10-Million Cell Spatial & Single-Cell Atlases',
    source: 'BioRxiv Computational Biology',
    publishedDate: 'September 2026',
    summary: 'The Satija Lab released new approximate nearest-neighbor graph algorithms and memory-mapped HDF5 backing for Seurat, allowing researchers to cluster multi-modal single-cell RNA and spatial transcriptomics on modest workstation RAM.',
    studentCareerTakeaway: 'Single-cell data wrangling using Seurat and Scanpy is the #1 requested skill in academic postdocs and biotech immunology teams.',
    keySkills: ['Seurat 5 (R)', 'Harmony Batch Correction', 'Scanpy', 'Spatial Transcriptomics'],
    impactScore: 94,
    trendBadge: '💡 Tooling Milestone',
    readTime: '3 min read',
    featured: false,
  },
  {
    id: 'news_6',
    category: 'Job Trends',
    title: 'Indian & Global Biotech Hubs Expand Bioinformatics Stipends & Graduate Fellowships for 2026-27',
    source: 'BioWorld & Global Genomics Forum',
    publishedDate: 'September 2026',
    summary: 'Leading biotechnology parks in Bengaluru, Hyderabad, Boston, and Cambridge UK announced funded genomics fellowships with competitive stipends ranging from ₹55,000 to ₹95,000/month, aimed at bridging student training with industrial NGS operations.',
    studentCareerTakeaway: 'Early fellowship applications close by mid-October. Candidates with verified Omic Hub certifications and active GitHub portfolios get priority sponsor reviews.',
    keySkills: ['Bioconductor', 'Statistical Genetics', 'GitHub Portfolios', 'DESeq2'],
    impactScore: 91,
    trendBadge: '🎓 Student Fellowship Boost',
    readTime: '2 min read',
    featured: false,
  },
];

export interface ResumeRevision {
  id: string;
  timestamp: string;
  title: string;
  data: ResumeData;
  changeNote?: string;
}

export interface SearchResultItem {
  id: string;
  category: 'Resume Bullet' | 'Job Application' | 'Interview STAR' | 'Skill Course' | 'Contact / Profile';
  title: string;
  snippet: string;
  fullContent: string;
  metadata?: string;
  sourceTab: 'builder' | 'tracker' | 'mock-interview' | 'skills' | 'dashboard';
}

// Broadcast channel for multi-tab real-time sync
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('omichub_realtime_sync')
  : null;

type StorageEventListener = (key: string, data: any) => void;
const listeners: Set<StorageEventListener> = new Set();

if (typeof window !== 'undefined') {
  if (syncChannel) {
    syncChannel.onmessage = (event) => {
      const { key, data } = event.data || {};
      listeners.forEach((listener) => listener(key, data));
    };
  }

  // Cross-tab storage fallback
  window.addEventListener('storage', (event) => {
    if (event.key && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        listeners.forEach((listener) => listener(event.key!, parsed));
      } catch {
        // ignore
      }
    }
  });
}

const notifySync = (key: string, data: any) => {
  const now = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, now);
  } catch (e) {
    console.error('Storage error', e);
  }
  if (syncChannel) {
    try {
      syncChannel.postMessage({ key, data, timestamp: now });
    } catch {
      // ignore
    }
  }
  listeners.forEach((listener) => listener(key, data));
};

export const StorageService = {
  subscribe(listener: StorageEventListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getLastSyncTime(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || new Date().toISOString();
  },

  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },

  saveUser(user: UserProfile) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    notifySync(STORAGE_KEYS.USER, user);
  },

  isAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.AUTH_STATE) === 'true';
  },

  setAuthenticated(value: boolean) {
    localStorage.setItem(STORAGE_KEYS.AUTH_STATE, value ? 'true' : 'false');
    notifySync(STORAGE_KEYS.AUTH_STATE, value);
  },

  getResume(): ResumeData {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUME);
      if (data) return JSON.parse(data);
      const user = this.getUser();
      return user.isResumeUploaded ? INITIAL_RESUME : EMPTY_RESUME;
    } catch {
      return EMPTY_RESUME;
    }
  },

  saveResume(resume: ResumeData, changeNote?: string) {
    resume.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resume));
    this.createRevision(resume, changeNote);
    notifySync(STORAGE_KEYS.RESUME, resume);
  },

  getRevisions(): ResumeRevision[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUME_REVISIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  createRevision(resume: ResumeData, changeNote?: string) {
    try {
      const revs = this.getRevisions();
      const newRev: ResumeRevision = {
        id: `rev_${Date.now()}`,
        timestamp: new Date().toISOString(),
        title: resume.personalInfo.fullName ? `${resume.personalInfo.fullName} - ${resume.personalInfo.headline || 'Resume'}` : 'Resume Revision',
        data: JSON.parse(JSON.stringify(resume)),
        changeNote: changeNote || 'Auto-saved revision',
      };
      // Keep last 15 revisions to avoid localStorage overflow
      const updated = [newRev, ...revs.slice(0, 14)];
      localStorage.setItem(STORAGE_KEYS.RESUME_REVISIONS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save revision', e);
    }
  },

  getApplications(): JobApplication[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  },

  saveApplications(apps: JobApplication[]) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    notifySync(STORAGE_KEYS.APPLICATIONS, apps);
  },

  getActivities(): ActivityItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  },

  addActivity(item: Omit<ActivityItem, 'id' | 'timestamp'>) {
    const list = this.getActivities();
    const newItem: ActivityItem = {
      ...item,
      id: `act_${Date.now()}`,
      timestamp: 'Just now',
    };
    const updated = [newItem, ...list.slice(0, 24)];
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updated));
    notifySync(STORAGE_KEYS.ACTIVITIES, updated);
    return updated;
  },

  getCourses(): Course[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COURSES);
      return data ? JSON.parse(data) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  },

  saveCourses(courses: Course[]) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    notifySync(STORAGE_KEYS.COURSES, courses);
  },

  getPrograms(): BioinformaticsProgram[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
      return data ? JSON.parse(data) : INITIAL_VERIFIED_PROGRAMS;
    } catch {
      return INITIAL_VERIFIED_PROGRAMS;
    }
  },

  savePrograms(programs: BioinformaticsProgram[]) {
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
    notifySync(STORAGE_KEYS.PROGRAMS, programs);
  },

  getScheduledInterviews(): ScheduledInterview[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHEDULED_INTERVIEWS);
      return data ? JSON.parse(data) : INITIAL_SCHEDULED_INTERVIEWS;
    } catch {
      return INITIAL_SCHEDULED_INTERVIEWS;
    }
  },

  saveScheduledInterviews(interviews: ScheduledInterview[]) {
    localStorage.setItem(STORAGE_KEYS.SCHEDULED_INTERVIEWS, JSON.stringify(interviews));
    notifySync(STORAGE_KEYS.SCHEDULED_INTERVIEWS, interviews);
  },

  getCertifiedBadges(): CertifiedSkillBadge[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CERTIFIED_BADGES);
      return data ? JSON.parse(data) : INITIAL_CERTIFIED_BADGES;
    } catch {
      return INITIAL_CERTIFIED_BADGES;
    }
  },

  saveCertifiedBadges(badges: CertifiedSkillBadge[]) {
    localStorage.setItem(STORAGE_KEYS.CERTIFIED_BADGES, JSON.stringify(badges));
    notifySync(STORAGE_KEYS.CERTIFIED_BADGES, badges);
  },

  addCertifiedBadge(badge: CertifiedSkillBadge): CertifiedSkillBadge[] {
    const existing = this.getCertifiedBadges();
    const updated = [badge, ...existing.filter((b) => b.id !== badge.id)];
    this.saveCertifiedBadges(updated);

    this.addActivity({
      type: 'interview',
      title: `Earned Certified Skill Badge: ${badge.skillName}`,
      description: `Passed Bar-Raiser interview assessment with ${badge.score}% score. Verification ID: ${badge.verificationId}.`,
      badge: `${badge.score}% Certified`,
    });

    return updated;
  },

  addBadgeToResumeCertifications(badge: CertifiedSkillBadge): ResumeData {
    const currentResume = this.getResume();
    const alreadyExists = currentResume.certifications?.some(
      (c) => c.name.toLowerCase() === badge.skillName.toLowerCase() || c.credentialId === badge.verificationId
    );

    if (!alreadyExists) {
      const newCert = {
        id: `cert_badge_${Date.now()}`,
        name: `Omic Hub Certified: ${badge.skillName} (${badge.level})`,
        issuer: 'Omic Hub AI Bar-Raiser Academy',
        date: badge.issuedDate.slice(0, 7), // YYYY-MM
        credentialId: badge.verificationId,
      };
      const updatedResume: ResumeData = {
        ...currentResume,
        certifications: [newCert, ...(currentResume.certifications || [])],
      };
      this.saveResume(updatedResume, `Added certified badge for ${badge.skillName}`);
      
      // Update badge state
      const badges = this.getCertifiedBadges();
      const updatedBadges = badges.map((b) =>
        b.id === badge.id ? { ...b, addedToResume: true } : b
      );
      this.saveCertifiedBadges(updatedBadges);

      return updatedResume;
    }
    return currentResume;
  },

  getTrainingPrograms(): TrainingProgram[] {
    return INITIAL_TRAINING_PROGRAMS;
  },

  getCompanyReferrals(): CompanyReferral[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPANY_REFERRALS);
      return data ? JSON.parse(data) : INITIAL_COMPANY_REFERRALS;
    } catch {
      return INITIAL_COMPANY_REFERRALS;
    }
  },

  saveCompanyReferrals(referrals: CompanyReferral[]) {
    localStorage.setItem(STORAGE_KEYS.COMPANY_REFERRALS, JSON.stringify(referrals));
    notifySync(STORAGE_KEYS.COMPANY_REFERRALS, referrals);
  },

  submitCompanyReferral(referralId: string): CompanyReferral[] {
    const referrals = this.getCompanyReferrals();
    const target = referrals.find((r) => r.id === referralId);
    if (!target) return referrals;

    const updated = referrals.map((r) =>
      r.id === referralId
        ? {
            ...r,
            status: 'Referred' as const,
            appliedDate: new Date().toISOString().slice(0, 10),
            fastTrackBadge: 'Fast-Track Submitted 🚀',
          }
        : r
    );
    this.saveCompanyReferrals(updated);

    // Create tracking application in JobTracker if not already there
    const applications = this.getApplications();
    const alreadyApp = applications.some(
      (a) => a.company.toLowerCase() === target.companyName.toLowerCase() && a.role.toLowerCase().includes(target.roleTitle.toLowerCase().slice(0, 10))
    );
    if (!alreadyApp) {
      const newApp: JobApplication = {
        id: `app_ref_${Date.now()}`,
        company: target.companyName,
        role: target.roleTitle,
        stage: 'applied',
        location: target.location,
        salaryRange: target.salaryRange,
        appliedDate: new Date().toISOString().slice(0, 10),
        lastUpdated: new Date().toISOString().slice(0, 10),
        jobUrl: 'https://careers.' + target.companyName.toLowerCase() + '.com',
        notes: `Fast-Track Partner Referral via Omic Hub! Certified skills automatically attached. Recruiter sponsor: ${target.sponsorQuote}`,
        rating: 5,
      };
      this.saveApplications([newApp, ...applications]);
    }

    this.addActivity({
      type: 'application',
      title: `Fast-Track Referral Dispatched to ${target.companyName}`,
      description: `Submitted verified score and certified badge link to ${target.companyName} recruiter talent pipeline for ${target.roleTitle}.`,
      badge: 'Fast-Track',
    });

    return updated;
  },

  // Export full career data bundle
  exportAllData() {
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user: this.getUser(),
      resume: this.getResume(),
      revisions: this.getRevisions(),
      applications: this.getApplications(),
      activities: this.getActivities(),
      courses: this.getCourses(),
      scheduledInterviews: this.getScheduledInterviews(),
      certifiedBadges: this.getCertifiedBadges(),
      companyReferrals: this.getCompanyReferrals(),
    };
  },

  // Import full career data bundle
  importAllData(bundle: any): boolean {
    try {
      if (!bundle || typeof bundle !== 'object') return false;
      if (bundle.user) this.saveUser(bundle.user);
      if (bundle.resume) this.saveResume(bundle.resume, 'Imported from backup');
      if (bundle.applications && Array.isArray(bundle.applications)) this.saveApplications(bundle.applications);
      if (bundle.courses && Array.isArray(bundle.courses)) this.saveCourses(bundle.courses);
      if (bundle.scheduledInterviews && Array.isArray(bundle.scheduledInterviews)) this.saveScheduledInterviews(bundle.scheduledInterviews);
      if (bundle.activities && Array.isArray(bundle.activities)) {
        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(bundle.activities));
      }
      this.addActivity({
        type: 'resume',
        title: 'Restored Career Data Backup',
        description: 'Successfully restored all career documents and application pipelines.',
        badge: 'Restored',
      });
      notifySync('ALL_RESTORED', bundle);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  // Reset to default seed data
  resetAllData() {
    localStorage.clear();
    this.saveUser(DEFAULT_USER);
    this.saveResume(INITIAL_RESUME, 'Initial Setup');
    this.saveApplications(INITIAL_APPLICATIONS);
    this.saveCourses(INITIAL_COURSES);
    this.saveScheduledInterviews(INITIAL_SCHEDULED_INTERVIEWS);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
    notifySync('ALL_RESET', null);
  },

  // Universal real-time data search across all records
  searchAllData(query: string): SearchResultItem[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // Search Resume
    const resume = this.getResume();
    // Summary
    if (resume.summary && resume.summary.toLowerCase().includes(q)) {
      results.push({
        id: 'search_res_summary',
        category: 'Resume Bullet',
        title: 'Professional Summary',
        snippet: resume.summary.slice(0, 160) + '...',
        fullContent: resume.summary,
        metadata: `${resume.personalInfo.fullName} • Summary`,
        sourceTab: 'builder',
      });
    }
    // Work Experience Bullets
    resume.workExperiences.forEach((exp, expIdx) => {
      exp.bullets.forEach((b, bIdx) => {
        if (b.toLowerCase().includes(q) || exp.company.toLowerCase().includes(q) || exp.role.toLowerCase().includes(q)) {
          results.push({
            id: `search_bullet_${expIdx}_${bIdx}`,
            category: 'Resume Bullet',
            title: `${exp.role} @ ${exp.company}`,
            snippet: b,
            fullContent: b,
            metadata: `${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})`,
            sourceTab: 'builder',
          });
        }
      });
    });
    // Skills
    const allSkills = [
      ...resume.skills.languages,
      ...resume.skills.frameworks,
      ...resume.skills.cloudDevOps,
      ...resume.skills.toolsAndDatabases,
      ...resume.skills.softSkills,
    ];
    const matchingSkills = allSkills.filter((s) => s.toLowerCase().includes(q));
    if (matchingSkills.length > 0) {
      results.push({
        id: 'search_skills_matched',
        category: 'Resume Bullet',
        title: 'Matching Skills & Technologies',
        snippet: matchingSkills.join(', '),
        fullContent: matchingSkills.join(', '),
        metadata: 'Technical Stack Competencies',
        sourceTab: 'builder',
      });
    }

    // Search Job Applications
    const apps = this.getApplications();
    apps.forEach((app) => {
      const match =
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q) ||
        app.location.toLowerCase().includes(q) ||
        (app.notes && app.notes.toLowerCase().includes(q)) ||
        (app.recruiterName && app.recruiterName.toLowerCase().includes(q));
      if (match) {
        results.push({
          id: `search_app_${app.id}`,
          category: 'Job Application',
          title: `${app.role} at ${app.company}`,
          snippet: app.notes || `Stage: ${app.stage.toUpperCase()} | Salary: ${app.salaryRange || 'Not disclosed'}`,
          fullContent: `Company: ${app.company}\nRole: ${app.role}\nStage: ${app.stage}\nLocation: ${app.location}\nSalary: ${app.salaryRange || 'N/A'}\nNotes: ${app.notes || 'None'}`,
          metadata: `Stage: ${app.stage.toUpperCase()} • ${app.location}`,
          sourceTab: 'tracker',
        });
      }
    });

    // Search Interviews
    const interviews = this.getScheduledInterviews();
    interviews.forEach((int) => {
      const match =
        int.title.toLowerCase().includes(q) ||
        int.type.toLowerCase().includes(q) ||
        (int.feedbackSummary && int.feedbackSummary.toLowerCase().includes(q));
      if (match) {
        results.push({
          id: `search_int_${int.id}`,
          category: 'Interview STAR',
          title: int.title,
          snippet: int.feedbackSummary || `Status: ${int.status} on ${int.date} at ${int.time}`,
          fullContent: `Interview: ${int.title}\nType: ${int.type}\nStatus: ${int.status}\nDate: ${int.date} ${int.time}\nFeedback: ${int.feedbackSummary || 'N/A'}`,
          metadata: `${int.type} • Status: ${int.status}`,
          sourceTab: 'mock-interview',
        });
      }
    });

    // Search Courses
    const courses = this.getCourses();
    courses.forEach((c) => {
      const match =
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.lessons.some((l) => l.title.toLowerCase().includes(q) || (l.keyTakeaway && l.keyTakeaway.toLowerCase().includes(q)));
      if (match) {
        results.push({
          id: `search_course_${c.id}`,
          category: 'Skill Course',
          title: c.title,
          snippet: `${c.category} • Progress: ${c.progressPercent}% (${c.completedHours}/${c.estimatedHours} hrs)`,
          fullContent: `Course: ${c.title}\nCategory: ${c.category}\nLevel: ${c.level}\nProgress: ${c.progressPercent}%\nLessons:\n${c.lessons.map((l) => `- ${l.title}: ${l.keyTakeaway || ''}`).join('\n')}`,
          metadata: `${c.level} • ${c.progressPercent}% Complete`,
          sourceTab: 'skills',
        });
      }
    });

    return results;
  },

  getOpportunities(): OpportunityItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
      return data ? JSON.parse(data) : INITIAL_OPPORTUNITIES;
    } catch {
      return INITIAL_OPPORTUNITIES;
    }
  },

  saveOpportunities(items: OpportunityItem[]) {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(items));
    notifySync(STORAGE_KEYS.OPPORTUNITIES, items);
  },

  applyToOpportunity(oppId: string): OpportunityItem[] {
    const opps = this.getOpportunities();
    const target = opps.find((o) => o.id === oppId);
    if (!target) return opps;

    // Add to Job Applications in Tracker
    const applications = this.getApplications();
    const exists = applications.some(
      (a) => a.company.toLowerCase() === target.organization.toLowerCase() && a.role.toLowerCase() === target.title.toLowerCase()
    );
    if (!exists) {
      const newApp: JobApplication = {
        id: `app_opp_${Date.now()}`,
        company: target.organization,
        role: target.title,
        stage: 'applied',
        location: target.location,
        salaryRange: target.priceOrCompensation,
        appliedDate: new Date().toISOString().slice(0, 10),
        lastUpdated: new Date().toISOString().slice(0, 10),
        jobUrl: target.registrationUrl || 'https://omichub.ai/opportunity/' + target.id,
        notes: `Applied to ${target.type.toUpperCase()}: ${target.title} at ${target.organization}. Cost/Compensation: ${target.priceOrCompensation}. Schedule: ${target.durationOrSchedule}.`,
        rating: 5,
      };
      this.saveApplications([newApp, ...applications]);
    }

    this.addActivity({
      type: 'application',
      title: `Applied to ${target.type.toUpperCase()}: ${target.title}`,
      description: `Registered for ${target.organization} (${target.priceOrCompensation}). Added to your Job & Opportunity Tracker.`,
      badge: target.costType === 'Free' ? 'Free Registered' : 'Applied',
    });

    return opps;
  },

  getRecruiterApplications(recruiterId?: string): RecruiterJobApplication[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECRUITER_APPLICATIONS);
      const all: RecruiterJobApplication[] = data ? JSON.parse(data) : INITIAL_RECRUITER_APPLICATIONS;
      if (recruiterId) {
        return all.filter((a) => !a.recruiterId || a.recruiterId === recruiterId);
      }
      return all;
    } catch {
      return INITIAL_RECRUITER_APPLICATIONS;
    }
  },

  saveRecruiterApplications(apps: RecruiterJobApplication[]) {
    localStorage.setItem(STORAGE_KEYS.RECRUITER_APPLICATIONS, JSON.stringify(apps));
    notifySync(STORAGE_KEYS.RECRUITER_APPLICATIONS, apps);
  },

  submitRecruiterApplication(
    app: Omit<RecruiterJobApplication, 'id' | 'submittedAt' | 'status'> & { status?: RecruiterJobApplication['status'] }
  ): RecruiterJobApplication {
    const existing = this.getRecruiterApplications();
    const newApp: RecruiterJobApplication = {
      ...app,
      id: `rec_app_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: app.status || 'new',
    };
    const updated = [newApp, ...existing];
    this.saveRecruiterApplications(updated);

    // Also record in student's JobTracker applications
    const studentApps = this.getApplications();
    const alreadyTracked = studentApps.some(
      (a) => a.company.toLowerCase() === app.companyName.toLowerCase() && a.role.toLowerCase() === app.jobTitle.toLowerCase()
    );
    if (!alreadyTracked) {
      const trackerApp: JobApplication = {
        id: `app_inapp_${Date.now()}`,
        company: app.companyName,
        role: app.jobTitle,
        stage: 'applied',
        location: 'Direct Recruiter Portal',
        salaryRange: 'Verified Recruiter Role',
        appliedDate: new Date().toISOString().slice(0, 10),
        lastUpdated: new Date().toISOString().slice(0, 10),
        notes: `Submitted via Omic Hub Easy Apply. Auto-linked profile: ${app.studentProfileUrl || 'N/A'}. Cover Note: "${app.coverNote.slice(0, 120)}..."`,
        rating: 5,
      };
      this.saveApplications([trackerApp, ...studentApps]);
    }

    this.addActivity({
      type: 'application',
      title: `Easy Apply Submitted: ${app.jobTitle}`,
      description: `Application delivered directly to ${app.companyName} recruiter dashboard. Candidate Profile: ${app.studentName}.`,
      badge: 'Delivered',
    });

    return newApp;
  },

  updateRecruiterApplicationStatus(
    applicationId: string,
    status: RecruiterJobApplication['status']
  ): RecruiterJobApplication[] {
    const apps = this.getRecruiterApplications();
    const updated = apps.map((a) => (a.id === applicationId ? { ...a, status } : a));
    this.saveRecruiterApplications(updated);
    return updated;
  },

  addRecruiterJob(jobData: Partial<OpportunityItem>): OpportunityItem {
    const current = this.getOpportunities();
    const newJob: OpportunityItem = {
      id: `opp_rec_${Date.now()}`,
      type: 'job',
      title: jobData.title || 'Bioinformatics Role',
      organization: jobData.organization || 'Biotech Partner',
      logo: jobData.logo || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=80&auto=format&fit=crop&q=80',
      location: jobData.location || 'Remote',
      costType: 'Paid',
      priceOrCompensation: jobData.priceOrCompensation || '₹8,00,000 - ₹15,00,000/yr',
      numericValue: jobData.numericValue || 800000,
      rangeTier: jobData.rangeTier || '100k_to_15L',
      durationOrSchedule: jobData.durationOrSchedule || 'Full-Time Employee',
      startDateOrDeadline: jobData.startDateOrDeadline || 'Open until filled',
      skills: jobData.skills && jobData.skills.length > 0 ? jobData.skills : ['Python', 'RNA-Seq', 'Linux'],
      description: jobData.description || 'Join our bioinformatics team working on clinical sequencing and computational biology workflows.',
      matchScore: jobData.matchScore || 96,
      featured: true,
      perks: jobData.perks || ['Direct Hiring', 'Competitive Stipend/Salary', 'Flexible Schedule'],
      isRecruiterPosted: true,
      postedByRecruiterId: jobData.postedByRecruiterId || 'rec_user',
      postedByRecruiterName: jobData.postedByRecruiterName || 'Verified Hiring Lead',
      recruiterEmail: jobData.recruiterEmail,
      applicationType: jobData.applicationType || 'in_app',
      externalApplyUrl: jobData.externalApplyUrl,
      createdAt: new Date().toISOString(),
    };

    const updated = [newJob, ...current];
    this.saveOpportunities(updated);

    this.addActivity({
      type: 'application',
      title: `Published Recruiter Role: ${newJob.title}`,
      description: `Posted under ${newJob.organization} (${newJob.applicationType === 'external' ? 'External URL' : 'In-App Easy Apply'}). Visible to all bioinformatics students.`,
      badge: 'Live on Feed',
    });

    return newJob;
  },

  deleteRecruiterJob(jobId: string): OpportunityItem[] {
    const current = this.getOpportunities();
    const updated = current.filter((j) => j.id !== jobId);
    this.saveOpportunities(updated);
    return updated;
  },

  parseAndUploadResume(
    fileName: string,
    rawText: string,
    customData?: Partial<ResumeData>
  ): { resume: ResumeData; user: UserProfile } {
    const textLower = rawText.toLowerCase();

    const languages = ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'SQL', 'HTML5', 'CSS3']
      .filter((s) => textLower.includes(s.toLowerCase()));
    const frameworks = ['React 19', 'React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'Vue', 'Django', 'GraphQL']
      .filter((s) => textLower.includes(s.toLowerCase()));
    const cloudDevOps = ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'GCP', 'Azure', 'Linux']
      .filter((s) => textLower.includes(s.toLowerCase()));
    const toolsAndDatabases = ['PostgreSQL', 'Redis', 'MongoDB', 'Git', 'Kafka', 'Elasticsearch', 'Webpack', 'Vite']
      .filter((s) => textLower.includes(s.toLowerCase()));

    const finalLanguages = languages.length > 0 ? languages : ['TypeScript', 'JavaScript', 'Python', 'SQL'];
    const finalFrameworks = frameworks.length > 0 ? frameworks : ['React 19', 'Next.js', 'Node.js', 'Tailwind CSS'];
    const finalCloud = cloudDevOps.length > 0 ? cloudDevOps : ['AWS', 'Docker', 'CI/CD'];
    const finalTools = toolsAndDatabases.length > 0 ? toolsAndDatabases : ['PostgreSQL', 'Redis', 'Git'];

    const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
    const candidateName = lines[0] && lines[0].length < 40 && !lines[0].includes('@') ? lines[0] : (this.getUser().name || 'Candidate Profile');

    const newResume: ResumeData = {
      id: `res_uploaded_${Date.now()}`,
      title: `${candidateName} - Master Resume`,
      updatedAt: new Date().toISOString(),
      theme: 'modern',
      personalInfo: {
        fullName: candidateName,
        headline: lines[1] && lines[1].length < 70 ? lines[1] : 'Full-Stack Software Engineer | Real-Time Systems',
        email: this.getUser().email || 'engineer@omichub.dev',
        phone: '+1 (555) 492-8172',
        location: this.getUser().location || 'San Francisco, CA',
        website: 'https://github.com/developer',
        linkedin: 'https://linkedin.com/in/developer',
        github: 'https://github.com/developer',
      },
      summary: rawText.length > 100
        ? rawText.slice(0, 380) + '...'
        : 'High-performing software engineer with proven experience delivering scalable applications, robust APIs, and performant user experiences. Adept at collaborative systems design, clean architecture, and rapid feature delivery.',
      workExperiences: [
        {
          id: `exp_${Date.now()}_1`,
          company: 'Tech Innovations Lab',
          role: 'Software Engineer',
          location: 'Remote',
          startDate: '2023-03',
          endDate: '',
          current: true,
          bullets: [
            `Engineered modern web microservices and reactive interfaces using ${finalFrameworks[0] || 'React'} and ${finalLanguages[0] || 'TypeScript'}, improving throughput by 35%.`,
            `Streamlined CI/CD deployment pipelines on ${finalCloud[0] || 'AWS'}, reducing deployment cycle times from 45 minutes to 8 minutes.`,
            `Collaborated with cross-functional product and design teams to launch customer-facing features supporting 250,000+ monthly active users.`,
          ],
        },
      ],
      education: [
        {
          id: `edu_${Date.now()}_1`,
          institution: 'University of Science & Technology',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science & Software Engineering',
          startDate: '2019-09',
          endDate: '2023-05',
          gpa: '3.85 / 4.0',
          honors: 'Dean Honor List • Distributed Systems Lab',
        },
      ],
      skills: {
        languages: finalLanguages,
        frameworks: finalFrameworks,
        cloudDevOps: finalCloud,
        toolsAndDatabases: finalTools,
        softSkills: ['System Design Architecture', 'Cross-Functional Team Leadership', 'Root-Cause Incident Triage'],
      },
      projects: [
        {
          id: `proj_${Date.now()}_1`,
          name: 'High-Throughput Real-Time Sync Engine',
          description: `Designed and built an open-source sync engine in ${finalLanguages[0] || 'TypeScript'} utilizing WebSockets and local storage caching for sub-10ms UI latency.`,
          technologies: [finalLanguages[0] || 'TypeScript', finalFrameworks[0] || 'React', finalTools[0] || 'PostgreSQL'],
          bullets: ['Achieved sub-10ms UI updates under simulated flaky network conditions.'],
        },
      ],
      certifications: [],
      ...(customData || {}),
    };

    const skillCount = finalLanguages.length + finalFrameworks.length + finalCloud.length + finalTools.length;
    const calculatedAtsScore = Math.min(96, Math.max(78, 70 + Math.round(skillCount * 1.5)));

    this.saveResume(newResume, `Uploaded real-time resume: ${fileName}`);

    const currentUser = this.getUser();
    const updatedUser: UserProfile = {
      ...currentUser,
      name: candidateName,
      role: newResume.personalInfo.headline || currentUser.role,
      isResumeUploaded: true,
      uploadedResumeFileName: fileName,
      uploadedAt: new Date().toISOString(),
      atsScore: calculatedAtsScore,
    };
    this.saveUser(updatedUser);

    this.addActivity({
      type: 'resume',
      title: `Resume Uploaded: ${fileName}`,
      description: `Real-time resume parsed successfully. ${skillCount} skills identified. Initial ATS score: ${calculatedAtsScore}/100.`,
      badge: 'Active Profile',
    });

    return { resume: newResume, user: updatedUser };
  },

  clearUploadedResume(): { resume: ResumeData; user: UserProfile } {
    localStorage.removeItem(STORAGE_KEYS.RESUME);
    const currentUser = this.getUser();
    const resetUser: UserProfile = {
      ...currentUser,
      isResumeUploaded: false,
      uploadedResumeFileName: undefined,
      uploadedAt: undefined,
      atsScore: 0,
    };
    this.saveUser(resetUser);

    this.addActivity({
      type: 'resume',
      title: 'Reset Resume & Real-Time Profile',
      description: 'Profile cleared. Ready to upload or build in real time.',
      badge: 'Empty State',
    });

    return { resume: EMPTY_RESUME, user: resetUser };
  },

  loadDemoResume(): { resume: ResumeData; user: UserProfile } {
    this.saveResume(INITIAL_RESUME, 'Loaded Demo Staff Engineer Resume');
    const currentUser = this.getUser();
    const demoUser: UserProfile = {
      ...currentUser,
      name: 'Alex Morgan',
      role: 'Senior Full-Stack Engineer',
      isResumeUploaded: true,
      uploadedResumeFileName: 'Alex_Morgan_Staff_Resume_2026.pdf',
      uploadedAt: new Date().toISOString(),
      atsScore: 89,
    };
    this.saveUser(demoUser);

    this.addActivity({
      type: 'resume',
      title: 'Loaded Demo Staff Engineer Profile',
      description: 'Loaded pre-calibrated sample resume with 18 skills, ATS score 89/100, and verified badges.',
      badge: 'Demo Loaded',
    });

    return { resume: INITIAL_RESUME, user: demoUser };
  },

  getNews(): BioinformaticsNewsItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NEWS);
      return data ? JSON.parse(data) : INITIAL_BIOINFORMATICS_NEWS;
    } catch {
      return INITIAL_BIOINFORMATICS_NEWS;
    }
  },

  saveNews(news: BioinformaticsNewsItem[]) {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    notifySync(STORAGE_KEYS.NEWS, news);
  },

  getBookmarkedNewsIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_NEWS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmarkNews(newsId: string): boolean {
    const current = this.getBookmarkedNewsIds();
    const exists = current.includes(newsId);
    const updated = exists ? current.filter((id) => id !== newsId) : [...current, newsId];
    localStorage.setItem(STORAGE_KEYS.BOOKMARKED_NEWS, JSON.stringify(updated));
    notifySync(STORAGE_KEYS.BOOKMARKED_NEWS, updated);
    return !exists;
  },
};

