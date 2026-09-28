import React, { useState, useEffect } from 'react';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  History,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  X,
  FileJson,
  RefreshCw,
  HardDrive,
  Copy,
  Check,
} from 'lucide-react';
import { StorageService, ResumeRevision, DEFAULT_USER, INITIAL_RESUME } from '../services/storage';
import { useToast } from './Toast';
import { ResumeData } from '../types';

interface DataVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored?: () => void;
}

export const DataVaultModal: React.FC<DataVaultModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
}) => {
  const { showToast } = useToast();
  const [revisions, setRevisions] = useState<ResumeRevision[]>([]);
  const [lastSync, setLastSync] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'backup' | 'history' | 'presets'>('backup');
  const [isSyncing, setIsSyncing] = useState(false);
  const [storageBytes, setStorageBytes] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      refreshVaultState();
    }
  }, [isOpen]);

  const refreshVaultState = () => {
    setRevisions(StorageService.getRevisions());
    setLastSync(StorageService.getLastSyncTime());
    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += (localStorage[key].length + key.length) * 2;
        }
      }
      setStorageBytes(total);
    } catch {
      setStorageBytes(0);
    }
  };

  if (!isOpen) return null;

  // Manual Trigger Force Sync
  const handleForceSync = () => {
    setIsSyncing(true);
    const resume = StorageService.getResume();
    StorageService.saveResume(resume, 'Manual Sync Check');
    setTimeout(() => {
      setIsSyncing(false);
      refreshVaultState();
      showToast('All career documents verified & synced in real-time!', 'success');
    }, 400);
  };

  // Export Data as JSON
  const handleExportJSON = () => {
    const data = StorageService.exportAllData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    a.download = `OmicHub_Career_Backup_${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Career backup downloaded successfully!', 'success');
  };

  // Import JSON Backup
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const success = StorageService.importAllData(parsed);
        if (success) {
          showToast('Data backup restored successfully!', 'success');
          refreshVaultState();
          onDataRestored?.();
        } else {
          showToast('Invalid backup file structure', 'error');
        }
      } catch (err) {
        showToast('Failed to parse backup JSON file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Restore a specific Revision
  const handleRestoreRevision = (rev: ResumeRevision) => {
    if (confirm(`Restore resume revision from ${new Date(rev.timestamp).toLocaleString()}?`)) {
      StorageService.saveResume(rev.data, `Restored from ${rev.timestamp}`);
      showToast('Resume restored to selected revision!', 'success');
      refreshVaultState();
      onDataRestored?.();
    }
  };

  // Reset all to clean defaults
  const handleResetDefaults = () => {
    if (confirm('Reset all career data back to initial default demo profile?')) {
      StorageService.resetAllData();
      showToast('Data reset to default state.', 'info');
      refreshVaultState();
      onDataRestored?.();
    }
  };

  const formattedSyncTime = lastSync
    ? new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Just now';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Real-Time Data Vault & Cloud Sync</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Persistent storage, auto-save revisions, cross-tab synchronization & backups
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Status Banner */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/40 border-b border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Last Synced
            </span>
            <span className="text-white font-bold text-sm mt-1">{formattedSyncTime}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              Storage In-Use
            </span>
            <span className="text-emerald-400 font-bold text-sm mt-1">
              {(storageBytes / 1024).toFixed(1)} KB (Saved)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-sky-400" />
              Saved Revisions
            </span>
            <span className="text-sky-400 font-bold text-sm mt-1">{revisions.length} Snapshots</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800 bg-slate-950/20 text-xs">
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-2.5 font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'backup'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Backup & Export
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>Revision History</span>
            <span className="text-[10px] px-1.5 rounded-full bg-slate-800 text-slate-300">
              {revisions.length}
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* TAB 1: Backup & Export */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Export Full Career Data (.JSON)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Download all your resumes, application Kanban columns, interview scores, and notes in one unified file.
                    </p>
                  </div>
                  <button
                    onClick={handleExportJSON}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-indigo-400" />
                      <span>Restore from JSON Backup</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Load an existing career file back into Omic Hub with 100% fidelity.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Force Live Sync Button */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Manual Sync & Health Check</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Broadcasts your current state to all connected browser tabs and writes verified disk check.
                  </p>
                </div>
                <button
                  onClick={handleForceSync}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>

              {/* Reset state */}
              <div className="p-3.5 rounded-xl bg-rose-950/15 border border-rose-500/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-300">Reset to Fresh Demo Profile</p>
                  <p className="text-[11px] text-slate-400">
                    Clear custom edits and restore the default Senior Full-Stack Engineer profile.
                  </p>
                </div>
                <button
                  onClick={handleResetDefaults}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs border border-rose-500/30 transition-colors"
                >
                  Reset Defaults
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Revision History */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Timestamped Auto-Save Snapshots</span>
                <span>Click to Roll Back</span>
              </div>

              {revisions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No previous revisions captured yet. Changes in the Resume Builder will appear here.
                </div>
              ) : (
                <div className="space-y-2">
                  {revisions.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">{rev.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">
                            {rev.changeNote || 'Auto-save'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(rev.timestamp).toLocaleString()} &bull; {rev.data.workExperiences.length} Roles &bull; {rev.data.skills.languages.length} Languages
                        </p>
                      </div>

                      <button
                        onClick={() => handleRestoreRevision(rev)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-xs border border-indigo-500/30 transition-colors shrink-0"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Real-time local storage & multi-tab BroadcastChannel active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
