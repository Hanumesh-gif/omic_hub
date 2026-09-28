import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Copy,
  Check,
  ExternalLink,
  X,
  FileText,
  Briefcase,
  Mic,
  GraduationCap,
  Sparkles,
  Command,
  ArrowRight,
  User,
  Zap,
} from 'lucide-react';
import { StorageService, SearchResultItem } from '../services/storage';
import { useToast } from './Toast';
import { ActiveTab } from './Navbar';

interface DataRetrievalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const DataRetrievalModal: React.FC<DataRetrievalModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setFilter('all');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open handled by parent
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allResults = query ? StorageService.searchAllData(query) : [];
  const filteredResults = allResults.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'resume' && item.category === 'Resume Bullet') return true;
    if (filter === 'jobs' && item.category === 'Job Application') return true;
    if (filter === 'interview' && item.category === 'Interview STAR') return true;
    if (filter === 'skills' && item.category === 'Skill Course') return true;
    return true;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied content to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleJump = (tab: ActiveTab) => {
    onNavigateTab(tab);
    onClose();
  };

  // Quick preset data items when query is empty
  const currentResume = StorageService.getResume();
  const currentUser = StorageService.getUser();
  const applications = StorageService.getApplications();

  const quickPicks = [
    {
      title: 'Contact Header Card',
      desc: `${currentUser.name} • ${currentResume.personalInfo.email} • ${currentResume.personalInfo.phone}`,
      content: `${currentResume.personalInfo.fullName}\nEmail: ${currentResume.personalInfo.email}\nPhone: ${currentResume.personalInfo.phone}\nLocation: ${currentResume.personalInfo.location}\nLinkedIn: ${currentResume.personalInfo.linkedin || ''}\nGitHub: ${currentResume.personalInfo.github || ''}`,
      icon: <User className="w-4 h-4 text-sky-400" />,
      tab: 'builder' as ActiveTab,
    },
    {
      title: 'Professional Summary',
      desc: currentResume.summary ? `${currentResume.summary.slice(0, 90)}...` : 'Not set',
      content: currentResume.summary,
      icon: <FileText className="w-4 h-4 text-indigo-400" />,
      tab: 'builder' as ActiveTab,
    },
    {
      title: 'Active Job Pipeline Snapshot',
      desc: `${applications.length} applications tracked (${applications.filter(a => a.stage === 'offer').length} Offers)`,
      content: applications.map(a => `${a.company} - ${a.role} [Stage: ${a.stage.toUpperCase()}]`).join('\n'),
      icon: <Briefcase className="w-4 h-4 text-emerald-400" />,
      tab: 'tracker' as ActiveTab,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search instantly: e.g. 'React', 'Stripe', 'Redis', 'latency', 'manager'..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-slate-300 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800/80 bg-slate-950/30 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-500 text-[11px] font-medium mr-1">Filter:</span>
          {[
            { id: 'all', label: 'All Records' },
            { id: 'resume', label: 'Resume & Bullets' },
            { id: 'jobs', label: 'Job Applications' },
            { id: 'interview', label: 'Interviews' },
            { id: 'skills', label: 'Skills & Courses' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filter === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {query.trim().length === 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Instant Data Retrieval Shortcuts
                </span>
                <span className="text-[11px] text-slate-500">Always saved & accessible</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {quickPicks.map((pick, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                        {pick.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {pick.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 font-mono">
                          {pick.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopy(`quick_${idx}`, pick.content)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                        title="Copy to Clipboard"
                      >
                        {copiedId === `quick_${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleJump(pick.tab)}
                        className="p-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-white transition-colors"
                        title="Jump to Section"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <p className="text-xs text-slate-300">
                  <span className="font-semibold text-white">Live Data Guarantee:</span> All modifications are automatically persisted to local storage in real time and available immediately.
                </p>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No matching career records found</p>
              <p className="text-xs text-slate-500">
                Try searching for specific technologies (e.g. "TypeScript"), companies (e.g. "Linear"), or roles.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-slate-400 px-1">
                Found {filteredResults.length} matching item{filteredResults.length !== 1 ? 's' : ''}
              </div>

              {filteredResults.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 space-y-2 transition-all group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopy(item.id, item.fullContent)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleJump(item.sourceTab)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Open in View"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
                    {item.snippet}
                  </p>

                  {item.metadata && (
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <span>{item.metadata}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-500 px-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-time local data indexing active</span>
          </div>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
