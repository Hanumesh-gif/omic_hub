import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  PlayCircle,
  HelpCircle,
  RotateCcw,
  Wand2,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Star,
  Search,
  Filter,
  DollarSign,
  Tag,
  Briefcase,
  Layers,
  Lock,
  ArrowUpRight,
  Flame,
  Check,
} from 'lucide-react';
import {
  Course,
  CourseLesson,
  BioinformaticsProgram,
  SubscriptionPlanTier,
} from '../../types';
import { StorageService } from '../../services/storage';
import { getSkillRecommendations } from '../../services/api';
import { useToast } from '../Toast';
import confetti from 'canvas-confetti';

interface SkillPathsViewProps {
  courses: Course[];
  onSaveCourses: (courses: Course[]) => void;
  userRole: string;
  targetRole: string;
  userPlan?: SubscriptionPlanTier;
  onTriggerUpgrade?: (feature: string, requiredTier?: SubscriptionPlanTier) => void;
}

export const COURSE_FILTER_CHIPS = [
  'All',
  'Free Coursera',
  'NPTEL / SWAYAM (< ₹1000)',
  'Real Internships',
  'Under ₹2,000',
] as const;

export type CourseFilterChip = (typeof COURSE_FILTER_CHIPS)[number];

export const SkillPathsView: React.FC<SkillPathsViewProps> = ({
  courses,
  onSaveCourses,
  userRole,
  targetRole,
  userPlan = 'pro',
  onTriggerUpgrade,
}) => {
  const { showToast } = useToast();

  // Primary Tab: 'listings' (Verified Programs & Listings) vs 'modules' (Interactive Modules & AI Path)
  const [activeTabMode, setActiveTabMode] = useState<'listings' | 'modules'>('listings');

  // Programs state loaded from StorageService
  const [programs] = useState<BioinformaticsProgram[]>(() => {
    return StorageService.getPrograms();
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilterChip, setActiveFilterChip] = useState<CourseFilterChip>('All');
  const [selectedSkillTag, setSelectedSkillTag] = useState<string | null>(null);

  // Lesson interactive state for 'modules' view
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0] || null);
  const [activeLesson, setActiveLesson] = useState<CourseLesson>(
    courses[0]?.lessons?.[0] || null
  );
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // AI Pathway Custom Generator
  const [customRoleInput, setCustomRoleInput] = useState(userRole);
  const [customTargetInput, setCustomTargetInput] = useState(targetRole);
  const [generatingPath, setGeneratingPath] = useState(false);
  const [customPlan, setCustomPlan] = useState<any | null>(null);

  // Filtered Programs logic matching the strict requirements
  const filteredPrograms = useMemo(() => {
    return programs.filter((prog) => {
      // 1. Text Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = prog.title.toLowerCase().includes(q);
        const matchesProvider = prog.provider.toLowerCase().includes(q);
        const matchesPlatform = prog.platform.toLowerCase().includes(q);
        const matchesBadge = prog.badge.toLowerCase().includes(q);
        const matchesSkills = prog.skills.some((s) => s.toLowerCase().includes(q));
        const matchesDesc = prog.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesProvider && !matchesPlatform && !matchesBadge && !matchesSkills && !matchesDesc) {
          return false;
        }
      }

      // 2. Skill Tag Filter
      if (selectedSkillTag && !prog.skills.includes(selectedSkillTag)) {
        return false;
      }

      // 3. Exact Filter Chips (All, Free Coursera, NPTEL / SWAYAM (< ₹1000), Real Internships, Under ₹2,000)
      if (activeFilterChip === 'Free Coursera') {
        const isCoursera =
          prog.badge === 'Coursera' ||
          prog.platform.toLowerCase().includes('coursera') ||
          prog.provider.toLowerCase().includes('toronto') ||
          prog.provider.toLowerCase().includes('san diego');
        const isFree = prog.priceLabel.toLowerCase().includes('free');
        return isCoursera && isFree;
      }

      if (activeFilterChip === 'NPTEL / SWAYAM (< ₹1000)') {
        const isNptel =
          prog.badge === 'NPTEL' ||
          prog.platform.toLowerCase().includes('nptel') ||
          prog.platform.toLowerCase().includes('swayam') ||
          prog.provider.toLowerCase().includes('iit');
        return isNptel;
      }

      if (activeFilterChip === 'Real Internships') {
        return (
          prog.type === 'Internship' ||
          prog.badge === 'Verified Internship' ||
          prog.badge.toLowerCase().includes('internship')
        );
      }

      if (activeFilterChip === 'Under ₹2,000') {
        const label = prog.priceLabel.toLowerCase();
        return (
          label.includes('free') ||
          label.includes('1,000') ||
          label.includes('under') ||
          label.includes('stipend')
        );
      }

      return true; // 'All'
    });
  }, [programs, searchQuery, activeFilterChip, selectedSkillTag]);

  // Handle program action click ("Enroll / Apply")
  const handleProgramAction = (prog: BioinformaticsProgram) => {
    // Feature gate check: Direct internship applications require Pro Tier
    if (prog.type === 'Internship' && userPlan !== 'pro') {
      if (onTriggerUpgrade) {
        onTriggerUpgrade('Direct Internship Applications', 'pro');
      } else {
        showToast('Direct internship applications require Pro Tier (₹49).', 'info');
      }
      return;
    }

    // Record activity in storage
    StorageService.addActivity({
      type: 'course',
      title: `Applied/Enrolled: ${prog.title}`,
      description: `Accessed verified program from ${prog.provider} (${prog.badge || prog.platform}). Price: ${prog.priceLabel}.`,
      badge: prog.priceLabel,
    });

    showToast(`Opening official portal: ${prog.platform}`, 'info');
    window.open(prog.link, '_blank', 'noopener,noreferrer');
  };

  // Mark lesson completed
  const handleToggleLesson = (courseId: string, lessonId: string) => {
    const updatedCourses = courses.map((crs) => {
      if (crs.id !== courseId) return crs;
      const updatedLessons = crs.lessons.map((l) =>
        l.id === lessonId ? { ...l, completed: !l.completed } : l
      );
      const completedCount = updatedLessons.filter((l) => l.completed).length;
      const progressPercent = Math.round((completedCount / updatedLessons.length) * 100);
      const completedHours = Math.round((progressPercent / 100) * crs.estimatedHours);

      return {
        ...crs,
        lessons: updatedLessons,
        progressPercent,
        completedHours,
      };
    });

    onSaveCourses(updatedCourses);
    const updatedSelected = updatedCourses.find((c) => c.id === courseId);
    if (updatedSelected) {
      setSelectedCourse(updatedSelected);
      const nextActive = updatedSelected.lessons.find((l) => l.id === lessonId);
      if (nextActive) setActiveLesson(nextActive);
    }

    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    showToast('Lesson completion updated! Learning hours credited.', 'success');
  };

  // Submit quiz answer
  const handleSubmitQuiz = (lesson: CourseLesson) => {
    if (selectedQuizOption === null) {
      showToast('Please select an option first.', 'error');
      return;
    }
    setQuizSubmitted(true);
    if (selectedQuizOption === lesson.quiz?.correctIndex) {
      confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } });
      showToast('Correct! Great technical mastery.', 'success');
      if (!lesson.completed && selectedCourse) {
        handleToggleLesson(selectedCourse.id, lesson.id);
      }
    } else {
      showToast('Review the technical explanation below.', 'info');
    }
  };

  // Generate AI Pathway
  const handleGenerateCustomPath = async () => {
    setGeneratingPath(true);
    try {
      const data = await getSkillRecommendations(customRoleInput, customTargetInput, [
        'Nextflow DSL2',
        'GATK 4 Somatic Pipelines',
        'Python (Biopython & pysam)',
        'Single-Cell RNA-seq (Seurat)',
        'AlphaFold 3 & Molecular Docking',
      ]);
      setCustomPlan(data);
      showToast('Custom 4-Phase Career Pathway Generated!', 'success');
    } catch {
      showToast('Failed to generate pathway.', 'error');
    } finally {
      setGeneratingPath(false);
    }
  };

  // Overall stats
  const totalCompletedHours = courses.reduce((acc, c) => acc + c.completedHours, 0);
  const totalEstimatedHours = courses.reduce((acc, c) => acc + c.estimatedHours, 0);
  const overallSkillProgress = totalEstimatedHours
    ? Math.round((totalCompletedHours / totalEstimatedHours) * 100)
    : 0;

  return (
    <div className="space-y-8 pb-20 text-slate-100">
      
      {/* Top Hero Banner & Mode Switcher */}
      <div className="rounded-3xl bg-[#0b0f19] border border-[#1e293b] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Neon Purple Highlights */}
        <div className="absolute top-0 right-1/4 w-96 h-36 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Verified Bioinformatics Directory</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Courses & Internships
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Curated, verified bioinformatics programs from top global institutions and biotechnology partners. Free Coursera audits, government NPTEL courses, and industry trainee opportunities.
            </p>

            {/* Quick Metrics Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-[#1e293b] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <strong className="text-white">Real Verified</strong> Listings
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Free Audit Coursera
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-950/40 border border-sky-500/30 text-sky-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                NPTEL / SWAYAM (&lt; ₹1,000)
              </span>
            </div>
          </div>

          {/* Mode Tabs Switcher */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 border border-[#1e293b]">
              <button
                type="button"
                onClick={() => setActiveTabMode('listings')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTabMode === 'listings'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Verified Programs ({programs.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTabMode('modules')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTabMode === 'modules'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Interactive Modules & AI Path</span>
              </button>
            </div>

            {/* Quick Progress Badge */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-[#1e293b] text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-slate-400">Mastery Progress</span>
              </div>
              <span className="font-extrabold text-amber-400">{overallSkillProgress}% ({totalCompletedHours}h logged)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: VERIFIED PROGRAMS & LISTINGS (3-COLUMN RESPONSIVE) */}
      {/* ======================================================== */}
      {activeTabMode === 'listings' && (
        <div className="space-y-6">
          
          {/* Horizontal Filter Bar at the Top with Interactive Filter Chips */}
          <div className="rounded-3xl bg-[#0b0f19] border border-[#1e293b] p-5 sm:p-6 shadow-xl space-y-4">
            
            {/* Search Bar + Active Count */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, provider, or skills (e.g., Python, BLAST, RNA-Seq)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-[#1e293b] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Showing</span>
                <span className="font-bold text-white px-2 py-0.5 rounded-full bg-slate-900 border border-[#1e293b]">
                  {filteredPrograms.length} of {programs.length} listings
                </span>
                {(activeFilterChip !== 'All' || selectedSkillTag || searchQuery) && (
                  <button
                    onClick={() => {
                      setActiveFilterChip('All');
                      setSelectedSkillTag(null);
                      setSearchQuery('');
                    }}
                    className="text-purple-400 hover:text-purple-300 underline font-semibold ml-2 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Exact Horizontal Filter Bar Chips: ["All", "Free Coursera", "NPTEL / SWAYAM (< ₹1000)", "Real Internships", "Under ₹2,000"] */}
            <div className="pt-3 border-t border-[#1e293b] flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold shrink-0">
                <Filter className="w-3.5 h-3.5 text-purple-400" />
                <span>Filter Chips:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {COURSE_FILTER_CHIPS.map((chip) => {
                  const isSelected = activeFilterChip === chip;
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setActiveFilterChip(chip)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30 scale-105 font-extrabold'
                          : 'bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border-[#1e293b]'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Skill Tags Bar */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#1e293b]/60">
              <span className="text-[11px] text-slate-500 font-semibold mr-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-indigo-400" />
                Skills:
              </span>
              {['Python', 'RNA-Seq', 'BLAST', 'Linux', 'GATK4', 'Nextflow', 'Algorithms'].map((skill) => {
                const isSelected = selectedSkillTag === skill;
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => setSelectedSkillTag(isSelected ? null : skill)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-300 border-[#1e293b]'
                    }`}
                  >
                    #{skill}
                  </button>
                );
              })}
              {selectedSkillTag && (
                <button
                  onClick={() => setSelectedSkillTag(null)}
                  className="text-[10px] text-slate-500 hover:text-slate-300 underline ml-1"
                >
                  Clear skill
                </button>
              )}
            </div>
          </div>

          {/* Responsive 3-Column Grid of Dark Glassmorphism Cards (#0b0f19 background, subtle border glow #1e293b, neon purple accent) */}
          {filteredPrograms.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#0b0f19] border border-[#1e293b] text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-[#1e293b] flex items-center justify-center mx-auto text-slate-500">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No Programs Match Your Filter</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No programs currently match the active filter chip. Click "All" to view all verified programs.
              </p>
              <button
                onClick={() => {
                  setActiveFilterChip('All');
                  setSelectedSkillTag(null);
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-purple-600/30"
              >
                Reset to All Listings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((prog) => {
                const isFree =
                  prog.priceLabel.toLowerCase().includes('free') ||
                  prog.priceLabel.toLowerCase().includes('stipend');
                const isUnder2000 = !isFree;
                const isInternship = prog.type === 'Internship';

                return (
                  <div
                    key={prog.id}
                    className="group relative rounded-3xl bg-[#0b0f19] border border-[#1e293b] hover:border-purple-500/60 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/20 hover:-translate-y-1 backdrop-blur-xl"
                  >
                    {/* Top Neon Purple Glow Line on Hover */}
                    <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div>
                      {/* Top Badge: Platform/Provider Logo + Badge Label */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Platform Logo Placeholder Icon */}
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-md shrink-0 border ${
                              prog.badge === 'Coursera' || prog.platform.toLowerCase().includes('coursera')
                                ? 'bg-blue-950/70 border-blue-500/40 text-blue-400'
                                : prog.badge === 'NPTEL' || prog.platform.toLowerCase().includes('nptel')
                                ? 'bg-amber-950/70 border-amber-500/40 text-amber-400'
                                : isInternship
                                ? 'bg-purple-950/70 border-purple-500/40 text-purple-400'
                                : 'bg-teal-950/70 border-teal-500/40 text-teal-400'
                            }`}
                          >
                            {prog.badge === 'Coursera' || prog.platform.toLowerCase().includes('coursera') ? (
                              <span>C</span>
                            ) : prog.badge === 'NPTEL' || prog.platform.toLowerCase().includes('nptel') ? (
                              <span>IIT</span>
                            ) : isInternship ? (
                              <Briefcase className="w-5 h-5 text-purple-400" />
                            ) : (
                              <GraduationCap className="w-5 h-5 text-teal-400" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white leading-tight truncate">
                              {prog.provider}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                              <span className="text-purple-300 font-bold px-1.5 py-0.2 rounded bg-purple-500/15 border border-purple-500/30">
                                {prog.badge || prog.platform}
                              </span>
                              <span>&bull;</span>
                              <span className="text-slate-400">{prog.type}</span>
                            </p>
                          </div>
                        </div>

                        {/* Verified Certification Badge */}
                        {prog.verifiedBadge && (
                          <div
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 shrink-0"
                            title="Officially Verified Program"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>

                      {/* Title in Bold Typography */}
                      <h3 className="font-extrabold text-white text-base sm:text-lg leading-snug mb-3 group-hover:text-purple-200 transition-colors">
                        {prog.title}
                      </h3>

                      {/* Highlighted Pricing Label (Bright green for Free, blue for under ₹2,000) */}
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/90 border border-[#1e293b] mb-4">
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`text-xs sm:text-sm font-black px-2.5 py-1 rounded-xl border ${
                              isFree
                                ? 'text-emerald-400 bg-emerald-950/70 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                                : 'text-sky-300 bg-sky-950/70 border-sky-500/50 shadow-sm shadow-sky-500/20'
                            }`}
                          >
                            {prog.priceLabel}
                          </span>

                          {prog.originalPrice && (
                            <span className="text-xs text-slate-500 line-through">
                              {prog.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{prog.rating}</span>
                        </div>
                      </div>

                      {/* Brief Description */}
                      {prog.description && (
                        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                          {prog.description}
                        </p>
                      )}

                      {/* Array of Skill Tags (e.g., "Python", "RNA-Seq", "BLAST", "Linux") */}
                      <div className="space-y-1.5 mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Technical Skills:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {prog.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-900 border border-[#1e293b] text-purple-200 group-hover:border-purple-500/30 transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Area: "Enroll / Apply" Button linking directly to the real course page */}
                    <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{prog.duration || 'Self-Paced'}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleProgramAction(prog)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          isInternship
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95'
                            : isFree
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
                            : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md active:scale-95'
                        }`}
                      >
                        <span>{isInternship ? 'Apply for Internship' : isFree ? 'Enroll / Audit Free' : 'Enroll / Apply'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: INTERACTIVE MODULES & QUIZZES & AI ROADMAP */}
      {/* ======================================================== */}
      {activeTabMode === 'modules' && (
        <div className="space-y-8">
          {/* Main Grid: Courses List (Left) & Active Lesson Viewer (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Courses Selector (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Targeted Interactive Courses ({courses.length})</span>
              </h2>

              <div className="space-y-3">
                {courses.map((course) => {
                  const isSelected = selectedCourse?.id === course.id;
                  return (
                    <div
                      key={course.id}
                      onClick={() => {
                        setSelectedCourse(course);
                        setActiveLesson(course.lessons[0]);
                        setSelectedQuizOption(null);
                        setQuizSubmitted(false);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0b0f19] border-purple-500/80 shadow-lg shadow-purple-500/10'
                          : 'bg-[#0b0f19]/60 border-[#1e293b] hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                          {course.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {course.level} &bull; {course.estimatedHours}h
                        </span>
                      </div>

                      <h3 className="font-bold text-white text-sm leading-snug">
                        {course.title}
                      </h3>

                      {/* Progress Bar */}
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>{course.lessons.filter((l) => l.completed).length}/{course.lessons.length} lessons</span>
                          <span className="font-bold text-purple-300">{course.progressPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                            style={{ width: `${course.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Lesson & Interactive Quiz (8 cols) */}
            <div className="lg:col-span-8">
              {selectedCourse && activeLesson && (
                <div className="rounded-3xl bg-[#0b0f19] border border-[#1e293b] p-6 sm:p-8 shadow-xl space-y-6">
                  
                  {/* Lesson Header */}
                  <div className="border-b border-[#1e293b] pb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                        {selectedCourse.title}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {activeLesson.duration}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {activeLesson.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 mt-2 bg-slate-950/60 p-3.5 rounded-2xl border border-[#1e293b]">
                      <strong className="text-purple-300">Technical Key Takeaway: </strong>
                      {activeLesson.keyTakeaway}
                    </p>
                  </div>

                  {/* Lessons List Navigation for this course */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Course Lessons
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {selectedCourse.lessons.map((les, idx) => {
                        const isCurrent = les.id === activeLesson.id;
                        return (
                          <button
                            key={les.id}
                            type="button"
                            onClick={() => {
                              setActiveLesson(les);
                              setSelectedQuizOption(null);
                              setQuizSubmitted(false);
                            }}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 cursor-pointer ${
                              isCurrent
                                ? 'bg-purple-950/40 border-purple-500/50 text-white font-bold'
                                : 'bg-slate-950/60 border-[#1e293b] text-slate-400 hover:text-white'
                            }`}
                          >
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-[#1e293b] font-bold shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="truncate flex-1">{les.title}</span>
                            {les.completed && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interactive Technical Mastery Quiz */}
                  {activeLesson.quiz && (
                    <div className="rounded-2xl bg-slate-950 border border-purple-500/20 p-5 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                        <HelpCircle className="w-4 h-4 text-purple-400" />
                        <span>Interactive Domain Knowledge Check</span>
                      </div>

                      <p className="text-sm font-semibold text-white">
                        {activeLesson.quiz.question}
                      </p>

                      {/* Options */}
                      <div className="space-y-2">
                        {activeLesson.quiz.options.map((opt, oIdx) => {
                          const isPicked = selectedQuizOption === oIdx;
                          const isCorrect = oIdx === activeLesson.quiz?.correctIndex;

                          let btnStyle = 'bg-slate-900/80 border-[#1e293b] text-slate-300 hover:border-slate-700';
                          if (isPicked && !quizSubmitted) {
                            btnStyle = 'bg-purple-950/40 border-purple-500 text-purple-200';
                          } else if (quizSubmitted) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                            } else if (isPicked && !isCorrect) {
                              btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => {
                                if (!quizSubmitted) setSelectedQuizOption(oIdx);
                              }}
                              disabled={quizSubmitted}
                              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Submit / Retake Controls */}
                      <div className="flex items-center justify-between pt-2">
                        {!quizSubmitted ? (
                          <button
                            type="button"
                            onClick={() => handleSubmitQuiz(activeLesson)}
                            disabled={selectedQuizOption === null}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <div className="w-full space-y-3">
                            <div className="p-3 rounded-xl bg-slate-900 border border-[#1e293b] text-xs text-slate-300">
                              <strong className="text-purple-300 block mb-1">Detailed Explanation:</strong>
                              {activeLesson.quiz.explanation}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setQuizSubmitted(false);
                                setSelectedQuizOption(null);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-[#1e293b] text-xs cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Retake Quiz</span>
                            </button>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleToggleLesson(selectedCourse.id, activeLesson.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            activeLesson.completed
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{activeLesson.completed ? 'Lesson Completed' : 'Mark Lesson Complete'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* AI Custom Career Pathway Generator */}
          <div className="rounded-3xl bg-[#0b0f19] border border-[#1e293b] p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Wand2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    AI Career Pathway & Skill Matrix Generator
                  </h3>
                  <p className="text-xs text-slate-400">
                    Map out personalized milestones transitioning from your current academic profile to target industry roles.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateCustomPath}
                disabled={generatingPath}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>{generatingPath ? 'Synthesizing Roadmap...' : 'Generate 4-Phase Roadmap'}</span>
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Current Academic / Research Role
                </label>
                <input
                  type="text"
                  value={customRoleInput}
                  onChange={(e) => setCustomRoleInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Target Career / Industry Role
                </label>
                <input
                  type="text"
                  value={customTargetInput}
                  onChange={(e) => setCustomTargetInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Render Custom Plan Result */}
            {customPlan && (
              <div className="pt-4 border-t border-[#1e293b] space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    {customPlan.recommendedRoleTitle || 'Personalized Computational Biology Blueprint'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Est. Timeline: {customPlan.estimatedTimeToTarget || '12 Weeks'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {customPlan.milestones?.map((m: any, mIdx: number) => (
                    <div
                      key={mIdx}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-[#1e293b] space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-purple-400 font-bold">Phase {m.phase || mIdx + 1}</span>
                        <span className="text-[10px] text-slate-500">{m.durationWeeks || 3} Weeks</span>
                      </div>
                      <h4 className="font-bold text-white text-xs">{m.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
