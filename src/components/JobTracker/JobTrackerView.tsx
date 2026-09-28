import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Calendar,
  DollarSign,
  MapPin,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  TrendingUp,
  Award,
  Search,
  Filter,
  X,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { JobApplication, ApplicationStage } from '../../types';
import { useToast } from '../Toast';
import confetti from 'canvas-confetti';

interface JobTrackerViewProps {
  applications: JobApplication[];
  onSaveApplications: (apps: JobApplication[]) => void;
  onScheduleInterview: (app: JobApplication) => void;
}

const STAGES: { id: ApplicationStage; label: string; color: string; badgeClass: string }[] = [
  { id: 'wishlist', label: 'Wishlist', color: '#94a3b8', badgeClass: 'bg-slate-800 text-slate-300' },
  { id: 'applied', label: 'Applied', color: '#38bdf8', badgeClass: 'bg-sky-500/20 text-sky-300 border border-sky-500/30' },
  { id: 'screening', label: 'Recruiter Screening', color: '#818cf8', badgeClass: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
  { id: 'technical', label: 'Technical / Sys Design', color: '#fbbf24', badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
  { id: 'final', label: 'Final Round', color: '#a855f7', badgeClass: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
  { id: 'offer', label: 'Offer Received', color: '#34d399', badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
];

export const JobTrackerView: React.FC<JobTrackerViewProps> = ({
  applications,
  onSaveApplications,
  onScheduleInterview,
}) => {
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

  // Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [stage, setStage] = useState<ApplicationStage>('applied');
  const [salaryRange, setSalaryRange] = useState('₹18,00,000 - ₹28,00,000');
  const [location, setLocation] = useState('Remote (US)');
  const [jobUrl, setJobUrl] = useState('');
  const [nextInterviewDate, setNextInterviewDate] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterContact, setRecruiterContact] = useState('');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingApp(null);
    setCompany('');
    setRole('');
    setStage('applied');
    setSalaryRange('₹18,00,000 - ₹28,00,000');
    setLocation('San Francisco, CA / Remote');
    setJobUrl('');
    setNextInterviewDate('');
    setRecruiterName('');
    setRecruiterContact('');
    setNotes('');
    setModalOpen(true);
  };

  const openEditModal = (app: JobApplication) => {
    setEditingApp(app);
    setCompany(app.company);
    setRole(app.role);
    setStage(app.stage);
    setSalaryRange(app.salaryRange || '');
    setLocation(app.location || '');
    setJobUrl(app.jobUrl || '');
    setNextInterviewDate(app.nextInterviewDate || '');
    setRecruiterName(app.recruiterName || '');
    setRecruiterContact(app.recruiterContact || '');
    setNotes(app.notes || '');
    setModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) {
      showToast('Please provide both company name and role.', 'error');
      return;
    }

    if (editingApp) {
      const updatedList = applications.map((item) =>
        item.id === editingApp.id
          ? {
              ...item,
              company,
              role,
              stage,
              salaryRange,
              location,
              jobUrl,
              nextInterviewDate: nextInterviewDate || undefined,
              recruiterName,
              recruiterContact,
              notes,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : item
      );
      onSaveApplications(updatedList);
      showToast(`Updated application for ${company}`, 'success');

      if (stage === 'offer' && editingApp.stage !== 'offer') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      const newApp: JobApplication = {
        id: `app_${Date.now()}`,
        company,
        role,
        stage,
        salaryRange,
        location,
        jobUrl,
        appliedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        nextInterviewDate: nextInterviewDate || undefined,
        recruiterName,
        recruiterContact,
        notes,
      };
      onSaveApplications([newApp, ...applications]);
      showToast(`Added ${company} application to pipeline`, 'success');
      if (stage === 'offer') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, compName: string) => {
    const filtered = applications.filter((a) => a.id !== id);
    onSaveApplications(filtered);
    showToast(`Removed ${compName} from pipeline`, 'info');
  };

  const handleMoveStage = (appId: string, newStage: ApplicationStage) => {
    const updated = applications.map((app) =>
      app.id === appId
        ? {
            ...app,
            stage: newStage,
            lastUpdated: new Date().toISOString().split('T')[0],
          }
        : app
    );
    onSaveApplications(updated);

    if (newStage === 'offer') {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      showToast('🎉 Congratulations on receiving an Offer!', 'success');
    } else {
      showToast(`Moved stage to ${newStage.toUpperCase()}`, 'info');
    }
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.location && app.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = selectedStageFilter === 'all' || app.stage === selectedStageFilter;
    return matchesSearch && matchesStage;
  });

  // Pipeline metrics
  const totalOffers = applications.filter((a) => a.stage === 'offer').length;
  const activeInterviews = applications.filter((a) =>
    ['screening', 'technical', 'final'].includes(a.stage)
  ).length;

  const handleExportCSV = () => {
    const headers = ['Company', 'Role', 'Stage', 'Salary Range', 'Location', 'Applied Date', 'Recruiter', 'Notes'];
    const rows = applications.map((a) => [
      `"${a.company.replace(/"/g, '""')}"`,
      `"${a.role.replace(/"/g, '""')}"`,
      `"${a.stage.toUpperCase()}"`,
      `"${(a.salaryRange || '').replace(/"/g, '""')}"`,
      `"${(a.location || '').replace(/"/g, '""')}"`,
      `"${a.appliedDate}"`,
      `"${(a.recruiterName || '').replace(/"/g, '""')}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Job_Pipeline_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Job pipeline exported to CSV!', 'success');
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-emerald-400" />
              <span>Job Applications & Interview Tracker</span>
            </h1>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Auto-Saved Real-Time
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your entire career pipeline across stages, recruiter contacts, and interview dates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
            title="Download applications as CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          {/* View mode toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              List View
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Pipeline
          </span>
          <span className="text-2xl font-black text-white mt-1 block">
            {applications.length} Roles
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Interviews
          </span>
          <span className="text-2xl font-black text-sky-400 mt-1 block">
            {activeInterviews} Ongoing
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Offers Extended
          </span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">
            {totalOffers} Offer{totalOffers !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Interview Conversion
          </span>
          <span className="text-2xl font-black text-indigo-400 mt-1 block">
            {applications.length ? Math.round((activeInterviews / applications.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, title, or location..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 shrink-0">Stage Filter:</span>
          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Stages</option>
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {STAGES.map((column) => {
            const columnApps = filteredApps.filter((a) => a.stage === column.id);
            return (
              <div
                key={column.id}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col max-h-[750px] shadow-lg"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <h3 className="text-xs font-bold text-white tracking-wide truncate">
                      {column.label}
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {columnApps.length}
                  </span>
                </div>

                {/* Column Cards Container */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1 min-h-[140px]">
                  {columnApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-md group space-y-2.5 text-xs"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-extrabold text-white text-sm group-hover:text-indigo-400 transition-colors">
                            {app.company}
                          </h4>
                          <p className="text-[11px] text-slate-300 font-medium leading-snug">
                            {app.role}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditModal(app)}
                            className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(app.id, app.company)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Details Strip */}
                      <div className="space-y-1 text-[11px] text-slate-400">
                        {app.salaryRange && (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <DollarSign className="w-3 h-3 shrink-0" />
                            <span>{app.salaryRange}</span>
                          </div>
                        )}
                        {app.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{app.location}</span>
                          </div>
                        )}
                        {app.nextInterviewDate && (
                          <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 font-semibold">
                            <Calendar className="w-3 h-3 shrink-0" />
                            <span>
                              {new Date(app.nextInterviewDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quick Move Stage Selector */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Move:</span>
                        <select
                          value={app.stage}
                          onChange={(e) => handleMoveStage(app.id, e.target.value as ApplicationStage)}
                          className="p-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-200 focus:outline-none"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {columnApps.length === 0 && (
                    <div className="h-28 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-600 text-xs">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST TABLE VIEW */}
      {viewMode === 'list' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Company & Role</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4">Compensation</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Next Interview</th>
                  <th className="py-3.5 px-4">Recruiter</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredApps.map((app) => {
                  const stageObj = STAGES.find((s) => s.id === app.stage);
                  return (
                    <tr key={app.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">
                        <div className="font-bold">{app.company}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{app.role}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${stageObj?.badgeClass}`}>
                          {stageObj?.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-medium">
                        {app.salaryRange || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {app.location || 'Remote'}
                      </td>
                      <td className="py-3 px-4">
                        {app.nextInterviewDate ? (
                          <span className="font-semibold text-indigo-400">
                            {new Date(app.nextInterviewDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {app.recruiterName || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(app)}
                            className="p-1 rounded text-slate-400 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(app.id, app.company)}
                            className="p-1 rounded text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Application Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <h3 className="text-base font-bold text-white">
                {editingApp ? `Edit ${editingApp.company} Application` : 'Add New Job Application'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 py-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Stripe, Netflix"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Role *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Staff Full-Stack Engineer"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Pipeline Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as ApplicationStage)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    placeholder="₹18,00,000 - ₹28,00,000"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="San Francisco, CA / Remote"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Next Interview Date</label>
                  <input
                    type="datetime-local"
                    value={nextInterviewDate}
                    onChange={(e) => setNextInterviewDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Recruiter Name</label>
                  <input
                    type="text"
                    value={recruiterName}
                    onChange={(e) => setRecruiterName(e.target.value)}
                    placeholder="Elena Rostova"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Recruiter Email/Contact</label>
                  <input
                    type="text"
                    value={recruiterContact}
                    onChange={(e) => setRecruiterContact(e.target.value)}
                    placeholder="recruiter@company.com"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Job Listing Link</label>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://company.com/careers/job-id"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Notes & Follow-ups</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Discussed architecture focus, follow up on Tuesday..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
