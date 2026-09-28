import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  ArrowRight,
  Code2,
  Briefcase,
  Layers,
  Zap,
} from 'lucide-react';
import { ResumeData, UserProfile } from '../types';
import { StorageService } from '../services/storage';
import { useToast } from './Toast';
import confetti from 'canvas-confetti';

interface ResumeUploadStudioProps {
  user: UserProfile;
  resume: ResumeData;
  onUpdateResume: (resume: ResumeData) => void;
  onUpdateUser: (user: UserProfile) => void;
  onOpenFullBuilder?: () => void;
}

export const ResumeUploadStudio: React.FC<ResumeUploadStudioProps> = ({
  user,
  resume,
  onUpdateResume,
  onUpdateUser,
  onOpenFullBuilder,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeMode, setActiveMode] = useState<'upload' | 'paste' | 'live_quick'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Quick Live Builder form state
  const [quickName, setQuickName] = useState(user.name || '');
  const [quickTitle, setQuickTitle] = useState(user.role || '');
  const [quickSkills, setQuickSkills] = useState('React, TypeScript, Node.js, AWS, PostgreSQL, System Design');
  const [quickSummary, setQuickSummary] = useState('');

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processUploadedFile(file);
  };

  const processUploadedFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const textContent = (event.target?.result as string) || '';
        // If file is JSON, parse directly
        if (file.name.endsWith('.json')) {
          try {
            const parsedJson = JSON.parse(textContent);
            if (parsedJson.personalInfo) {
              const res = StorageService.parseAndUploadResume(file.name, textContent, parsedJson);
              onUpdateResume(res.resume);
              onUpdateUser(res.user);
              confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
              showToast(`Uploaded and activated resume: ${file.name}`, 'success');
              setIsProcessing(false);
              return;
            }
          } catch {
            // fallback to text parse
          }
        }

        // Parse text or binary string representation
        const res = StorageService.parseAndUploadResume(file.name, textContent);
        onUpdateResume(res.resume);
        onUpdateUser(res.user);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        showToast(`Resume uploaded & parsed successfully! Profile active with ${res.user.atsScore} ATS score.`, 'success');
      } catch (err) {
        showToast('Failed to parse uploaded file. Please try text paste or quick builder.', 'error');
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.onerror = () => {
      showToast('Error reading file. Please retry.', 'error');
      setIsProcessing(false);
    };

    // Read as text
    reader.readAsText(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Handle Paste & Parse
  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteText.trim() || pasteText.length < 20) {
      showToast('Please paste a substantial portion of your resume or bio.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const res = StorageService.parseAndUploadResume('Pasted_Resume_RealTime.txt', pasteText);
      onUpdateResume(res.resume);
      onUpdateUser(res.user);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      showToast(`Pasted resume extracted! ATS score calculated at ${res.user.atsScore}/100.`, 'success');
      setPasteText('');
    } catch {
      showToast('Could not parse text. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Quick Live Builder Submit
  const handleQuickBuildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickTitle.trim()) {
      showToast('Please provide your name and target title.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const rawText = `${quickName}\n${quickTitle}\n\nSkills:\n${quickSkills}\n\nSummary:\n${quickSummary || 'Experienced software professional.'}`;
      const res = StorageService.parseAndUploadResume('RealTime_Built_Resume.pdf', rawText, {
        personalInfo: {
          fullName: quickName,
          headline: quickTitle,
          email: user.email || 'developer@omichub.dev',
          phone: '+1 (555) 492-8172',
          location: user.location || 'San Francisco, CA',
          website: 'https://github.com',
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
        },
        summary: quickSummary || `Dynamic ${quickTitle} with specialized proficiency in ${quickSkills}. Dedicated to architecting robust systems and elegant user experiences.`,
      });

      onUpdateResume(res.resume);
      onUpdateUser(res.user);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      showToast('Real-time resume built and synced to profile!', 'success');
    } catch {
      showToast('Error building profile.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Load Demo Profile
  const handleLoadDemo = () => {
    const res = StorageService.loadDemoResume();
    onUpdateResume(res.resume);
    onUpdateUser(res.user);
    confetti({ particleCount: 45, spread: 50, origin: { y: 0.6 } });
    showToast('Loaded demo Staff Full-Stack Engineer profile & verified credentials!', 'info');
  };

  // Clear Resume / Reset to Empty State
  const handleClear = () => {
    const res = StorageService.clearUploadedResume();
    onUpdateResume(res.resume);
    onUpdateUser(res.user);
    showToast('Resume cleared. Your profile is in real-time builder mode.', 'info');
  };

  const isUploaded = Boolean(user.isResumeUploaded);

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isUploaded ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Real-Time Resume & Profile Engine
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isUploaded
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
              }`}
            >
              {isUploaded ? 'Resume Active on Profile' : 'No Resume Uploaded Yet'}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
            {isUploaded
              ? `Profile Active: ${user.uploadedResumeFileName || 'Master Resume'}`
              : 'Build or Upload Your Resume in Real-Time'}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
            {isUploaded
              ? 'Your resume skills, ATS score, and credentials are live on your profile. Upload an updated version or edit in real-time below.'
              : 'Upload your resume or build it live below. Once uploaded, your real extracted skills, ATS score, and matched opportunities will automatically show on your profile!'}
          </p>
        </div>

        {/* Action Toggle buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {isUploaded ? (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Profile</span>
            </button>
          ) : (
            <button
              onClick={handleLoadDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-400 hover:text-indigo-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Demo Sample</span>
            </button>
          )}

          {onOpenFullBuilder && (
            <button
              onClick={onOpenFullBuilder}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Open Full Builder</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode Selector Tabs (Upload File vs Paste Text vs Quick Live Builder) */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs w-fit">
        <button
          onClick={() => setActiveMode('upload')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeMode === 'upload'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File (PDF / DOCX / TXT)</span>
        </button>
        <button
          onClick={() => setActiveMode('paste')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeMode === 'paste'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Paste Text / Bio</span>
        </button>
        <button
          onClick={() => setActiveMode('live_quick')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeMode === 'live_quick'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Live Creator</span>
        </button>
      </div>

      {/* MODE 1: FILE UPLOAD (DRAG & DROP) */}
      {activeMode === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-indigo-400 bg-indigo-500/10'
              : 'border-slate-800 hover:border-indigo-500/50 bg-slate-950/60 hover:bg-slate-950'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt,.json,.md"
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center mb-3">
            {isProcessing ? (
              <RefreshCw className="w-7 h-7 animate-spin" />
            ) : (
              <Upload className="w-7 h-7" />
            )}
          </div>

          <h3 className="text-sm sm:text-base font-extrabold text-white">
            {isProcessing
              ? 'Extracting Skills & Calibrating ATS...'
              : 'Drop your resume file here, or click to browse'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Supports PDF, DOCX, TXT, or JSON. Our real-time engine extracts contact info, experience, and technical skills instantly into your profile.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-slate-500">
            <span>&bull; Instant Real-Time Parsing</span>
            <span>&bull; ATS Keyword Extraction</span>
            <span>&bull; Auto-Sync to Profile</span>
          </div>
        </div>
      )}

      {/* MODE 2: PASTE RAW TEXT */}
      {activeMode === 'paste' && (
        <form onSubmit={handlePasteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Paste Resume Content, LinkedIn Summary, or Work History:
            </label>
            <textarea
              rows={6}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={`Alex Morgan\nSenior Full-Stack Engineer\n\nSkills: React 19, TypeScript, Go, AWS, Kubernetes, PostgreSQL\n\nExperience:\n- Senior Engineer at Apex Cloud (2023-Present): Architected multi-tenant telemetry dashboards supporting 35k req/sec...\n- Software Engineer at ScaleLabs (2020-2023)...`}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Our real-time parser will automatically categorize your skills and calculate your initial ATS match score.
            </span>
            <button
              type="submit"
              disabled={isProcessing || !pasteText.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Parse & Activate Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* MODE 3: QUICK LIVE CREATOR */}
      {activeMode === 'live_quick' && (
        <form onSubmit={handleQuickBuildSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Full Name:
              </label>
              <input
                type="text"
                required
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                placeholder="e.g. Jordan Rivera"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Professional Headline / Target Role:
              </label>
              <input
                type="text"
                required
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Architect | React & TypeScript"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Key Technical Skills (comma separated):
            </label>
            <input
              type="text"
              required
              value={quickSkills}
              onChange={(e) => setQuickSkills(e.target.value)}
              placeholder="e.g. React 19, TypeScript, Next.js, Node.js, GraphQL, AWS, Docker"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Professional Summary / Bio:
            </label>
            <textarea
              rows={3}
              value={quickSummary}
              onChange={(e) => setQuickSummary(e.target.value)}
              placeholder="Brief summary of your career experience, technical focus, and achievements..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Create & Activate Real-Time Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Real-Time Status Notification Pill */}
      {isUploaded && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">
              Active File: <strong className="text-white">{user.uploadedResumeFileName || 'Master Resume'}</strong> &bull; ATS Score:{' '}
              <strong className="text-emerald-400 font-bold">{user.atsScore}/100</strong> &bull; Synced Across App
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            Skills extracted: {resume.skills?.languages?.length || 0} Languages,{' '}
            {resume.skills?.frameworks?.length || 0} Frameworks
          </span>
        </div>
      )}
    </div>
  );
};
