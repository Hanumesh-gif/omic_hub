export type SubscriptionPlanTier = 'basic' | 'plus' | 'pro';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  targetRole: string;
  experienceLevel: 'Entry' | 'Graduate Student' | 'Graduate Student / Researcher' | 'Postdoctoral Fellow' | 'M.S. Candidate' | 'Mid-Level' | 'Senior' | 'Lead' | 'Staff/Principal';
  targetIndustry: string;
  location: string;
  atsScore: number;
  totalApplications: number;
  activeInterviews: number;
  learningHours: number;
  interviewReadiness: number;
  bio?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  targetSalary?: string;
  workPreference?: 'Remote' | 'Hybrid' | 'Onsite' | 'Any';
  soundEnabled?: boolean;
  targetAtsGoal?: number;
  isResumeUploaded?: boolean;
  uploadedResumeFileName?: string;
  uploadedAt?: string;
  completedSkillsCount?: number;
  planTier?: SubscriptionPlanTier;
  planStatus?: 'trial' | 'active' | 'free';
  trialEndDate?: string;
  hasSelectedPlan?: boolean;
  hasCompletedResumeOnboarding?: boolean;
  userType?: 'student' | 'recruiter';
  omicHubProfileUrl?: string;
  companyName?: string;
  targetSkills?: string[];
  jobDescriptionText?: string;
  jobDescriptionFileName?: string;
}

export type OpportunityType = 'job' | 'internship' | 'workshop';

export interface OpportunityItem {
  id: string;
  type: OpportunityType;
  title: string;
  organization: string;
  logo: string;
  location: string;
  costType: 'Free' | 'Paid';
  priceOrCompensation: string;
  numericValue: number;
  rangeTier: 'free' | 'under_5k' | '5k_to_25k' | '25k_to_100k' | '100k_to_15L' | '15L_plus';
  durationOrSchedule: string;
  startDateOrDeadline: string;
  skills: string[];
  description: string;
  matchScore?: number;
  featured?: boolean;
  registrationUrl?: string;
  perks?: string[];
  instructorOrHost?: string;
  spotsLeft?: number;
  // Recruiter Posting Extensions
  isRecruiterPosted?: boolean;
  postedByRecruiterId?: string;
  postedByRecruiterName?: string;
  recruiterEmail?: string;
  applicationType?: 'external' | 'in_app';
  externalApplyUrl?: string;
  createdAt?: string;
}

export interface RecruiterJobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  recruiterId?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentProfileUrl?: string;
  resumeFileName?: string;
  coverNote: string;
  submittedAt: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
}

export interface CandidateStudent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  headline: string;
  education: string;
  location: string;
  omicHubProfileUrl: string;
  atsScore: number;
  skills: string[];
  verifiedBadges: {
    badgeName: string;
    score: number;
    assessmentType: string;
  }[];
  bioSummary?: string;
  githubUrl?: string;
  resumeFileName?: string;
  publicationsCount?: number;
  invited?: boolean;
  shortlisted?: boolean;
}

export interface BioinformaticsNewsItem {
  id: string;
  category: 'Breakthrough' | 'Job Trends' | 'AI & AlphaFold' | 'Tools & Cloud' | 'Clinical Genomics';
  title: string;
  source: string;
  publishedDate: string;
  summary: string;
  studentCareerTakeaway: string;
  keySkills: string[];
  impactScore: number; // 1-100
  trendBadge?: string;
  url?: string;
  readTime: string;
  featured?: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'resume' | 'application' | 'interview' | 'course' | 'ai_scan';
  title: string;
  description: string;
  timestamp: string;
  badge?: string;
  iconName?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  coursework?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface ResumeData {
  id: string;
  title: string;
  updatedAt: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    headline: string;
    photoUrl?: string;
    omicHubProfileUrl?: string;
  };
  summary: string;
  workExperiences: WorkExperience[];
  education: EducationItem[];
  skills: {
    languages: string[];
    frameworks: string[];
    cloudDevOps: string[];
    toolsAndDatabases: string[];
    softSkills: string[];
  };
  projects: ProjectItem[];
  certifications: CertificationItem[];
  theme: 'modern' | 'executive' | 'minimal';
}

export type ApplicationStage =
  | 'wishlist'
  | 'applied'
  | 'screening'
  | 'technical'
  | 'final'
  | 'offer'
  | 'rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  stage: ApplicationStage;
  location: string;
  salaryRange: string;
  appliedDate: string;
  lastUpdated: string;
  nextInterviewDate?: string;
  jobUrl?: string;
  recruiterName?: string;
  recruiterContact?: string;
  notes?: string;
  rating?: number;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  keyTakeaway: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export type ProgramPriceLabel = 'Free Audit' | 'Free / ₹1,000 Exam Fee' | 'Free / stipend' | '₹1,000' | 'Under ₹2,000' | string;
export type ProgramType = 'Course' | 'Internship' | 'Workshop';

export interface BioinformaticsProgram {
  id: string;
  title: string;
  provider: string;
  platform: string;
  badge: string;
  priceLabel: ProgramPriceLabel;
  originalPrice?: string;
  type: ProgramType;
  verifiedBadge: boolean;
  rating: number;
  link: string;
  skills: string[];
  description?: string;
  duration?: string;
  level?: string;
  isProOnly?: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: 'Genomics & NGS' | 'Transcriptomics' | 'Structural Biology' | 'Computational Pipelines' | 'Genomic Pipelines' | 'Single-Cell & Spatial' | 'Structural AI' | 'Biostatistics' | 'System Design' | 'AI & ML' | 'Full-Stack' | 'Interview Mastery' | 'Leadership';
  level: 'Intermediate' | 'Advanced' | 'Mastery';
  estimatedHours: number;
  completedHours: number;
  progressPercent: number;
  lessons: CourseLesson[];
  certificateUrl?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  targetRole: string;
  estimatedWeeks: number;
  currentWeek: number;
  overallProgress: number;
  courses: Course[];
}

export interface MockInterviewQuestion {
  id: string;
  category: string;
  question: string;
  context: string;
  keyEvaluationPoints: string[];
  recommendedFramework: string;
  sampleOpening: string;
  candidateAnswer?: string;
  evaluation?: {
    overallScore: number;
    starBreakdown: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
    metrics: {
      clarityAndStructure: number;
      technicalDepth: number;
      quantifiedOutcomes: number;
      confidenceAndTone: number;
    };
    strengths: string[];
    constructiveCriticism: string[];
    modelAnswerUpgrade: string;
  };
}

export interface ScheduledInterview {
  id: string;
  title: string;
  type: 'Technical (Genomics)' | 'Technical (Bioinformatics)' | 'Structural Biology' | 'Genomics Pipelines' | 'Computational Biology' | 'Variant Calling' | 'Behavioral' | 'System Design' | 'Frontend' | 'Leadership';
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Canceled';
  score?: number;
  feedbackSummary?: string;
}

export interface ResumeAnalysisResult {
  overallScore: number;
  atsCompatibility: number;
  quantifiableImpactScore: number;
  brevityAndStyleScore: number;
  skillsAlignmentScore: number;
  summaryCritique: string;
  criticalImprovements: string[];
  topMatchingSkills: string[];
  missingHighValueSkills: string[];
  industryRecommendations: string[];
  bulletTransformations: {
    original: string;
    enhanced: string;
    reason: string;
  }[];
}

export interface CertifiedSkillBadge {
  id: string;
  skillName: string;
  category: string;
  score: number; // e.g. 92
  issuedDate: string;
  verificationId: string; // e.g. "OMI-CERT-83921"
  verificationUrl: string;
  level: 'Certified Professional' | 'Master Specialist' | 'Executive Lead' | 'Bar-Raiser Master';
  status: 'Verified';
  assessedAreas: string[];
  interviewerLens: string;
  addedToResume?: boolean;
}

export interface TrainingProgram {
  id: string;
  title: string;
  provider: string;
  costType: 'Free' | 'Paid';
  price?: string;
  rating: number;
  studentsCount: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsCovered: string[];
  url: string;
  description: string;
  certificateIncluded: boolean;
  matchReason?: string;
}

export interface CompanyReferral {
  id: string;
  companyName: string;
  logo: string;
  roleTitle: string;
  location: string;
  salaryRange: string;
  requiredCertifiedSkills: string[];
  matchScore: number;
  status: 'Available' | 'Referred' | 'Interview Scheduled';
  referralChannel: string;
  sponsorQuote: string;
  applicationId?: string;
  appliedDate?: string;
  fastTrackBadge: string;
}
