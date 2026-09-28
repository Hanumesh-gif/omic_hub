import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Settings,
  Shield,
  Briefcase,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  DollarSign,
  Laptop,
  Check,
  Save,
  RotateCcw,
  Volume2,
  VolumeX,
  Bell,
  Database,
  ExternalLink,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { UserProfile } from '../types';
import { useToast } from './Toast';
import { StorageService } from '../services/storage';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onOpenDataVault?: () => void;
  onOpenPlanModal?: () => void;
  initialTab?: 'profile' | 'settings';
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
];

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onOpenDataVault,
  onOpenPlanModal,
  initialTab = 'profile',
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(initialTab);

  // Form state initialized with user values
  const [formData, setFormData] = useState<UserProfile>(user);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showAvatarUrlInput, setShowAvatarUrlInput] = useState(false);

  useEffect(() => {
    setFormData(user);
  }, [user, isOpen]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please provide your name', 'error');
      return;
    }

    StorageService.saveUser(formData);
    onUpdateUser(formData);
    showToast('Profile and settings updated successfully!', 'success');
    onClose();
  };

  const handleSelectAvatar = (url: string) => {
    setFormData((prev) => ({ ...prev, avatar: url }));
  };

  const handleApplyCustomAvatar = () => {
    if (customAvatarUrl.trim()) {
      setFormData((prev) => ({ ...prev, avatar: customAvatarUrl.trim() }));
      setShowAvatarUrlInput(false);
      setCustomAvatarUrl('');
      showToast('Custom avatar applied!', 'success');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-inner">
              {activeTab === 'profile' ? <User className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {activeTab === 'profile' ? 'Profile Details' : 'Account & App Settings'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 font-bold border border-indigo-500/25">
                  Omic Hub
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {activeTab === 'profile'
                  ? 'Manage your professional identity, target career roles, and avatar'
                  : 'Configure ATS score targets, compensation, and automation preferences'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/30 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Information</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`pb-3 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences & Settings</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: Profile Information */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Profile Picture
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative">
                    <img
                      src={formData.avatar}
                      alt={formData.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full ring-2 ring-slate-950 text-white">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <p className="text-[11px] text-slate-400">
                      Choose from curated professional portraits or enter a custom image URL:
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {PRESET_AVATARS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectAvatar(url)}
                          className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            formData.avatar === url
                              ? 'border-indigo-500 scale-105 ring-2 ring-indigo-500/30'
                              : 'border-slate-700 hover:border-slate-500 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setShowAvatarUrlInput(!showAvatarUrlInput)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        Custom URL
                      </button>
                    </div>

                    {showAvatarUrlInput && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800">
                        <input
                          type="url"
                          placeholder="https://example.com/photo.jpg"
                          value={customAvatarUrl}
                          onChange={(e) => setCustomAvatarUrl(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCustomAvatar}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Resume & Verification Status Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Resume & Profile Verification
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      user.isResumeUploaded
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    {user.isResumeUploaded ? 'Active on Profile' : 'Pending Upload'}
                  </span>
                </div>

                {user.isResumeUploaded ? (
                  <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-white">
                          {user.uploadedResumeFileName || 'Master_Resume_2026.pdf'}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-400">
                        {user.atsScore}/100 ATS Score
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Your resume is parsed and active. Skills, credentials, and achievements are visible on your profile and synced with the Opportunities Hub.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-semibold">No Resume File Uploaded Yet</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Build or upload your resume in real time using the Dashboard studio. Your profile details, verified skills, and ATS audit will automatically show here once uploaded.
                    </p>
                  </div>
                )}
              </div>

              {/* Core Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Alex Morgan"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="alex.morgan@domain.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Current Title / Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Senior Full-Stack Engineer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Target Desired Role</label>
                  <input
                    type="text"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Lead Distributed Systems Engineer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Experience Level</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experienceLevel: e.target.value as UserProfile['experienceLevel'],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Entry">Entry (0-2 yrs)</option>
                    <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
                    <option value="Senior">Senior (6-8 yrs)</option>
                    <option value="Lead">Lead (8-10 yrs)</option>
                    <option value="Staff/Principal">Staff / Principal (10+ yrs)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="San Francisco, CA (or Remote)"
                  />
                </div>
              </div>

              {/* Bio / Executive Pitch */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Career Summary & Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Engineered high-scale microservices, led cloud migrations, and scaled distributed platforms to 10M+ users..."
                />
              </div>

              {/* Social Links */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Professional Links
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Linkedin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="url"
                      value={formData.linkedin || ''}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="linkedin.com/in/alex"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="relative">
                    <Github className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="url"
                      value={formData.github || ''}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      placeholder="github.com/alex"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="relative">
                    <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="url"
                      value={formData.portfolio || ''}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      placeholder="portfolio.dev"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Settings & Preferences */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Career Goal & ATS Target */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      ATS Benchmark Target Goal
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Sets the optimal threshold score for AI resume audit and bullet suggestions
                    </p>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    {formData.targetAtsGoal || 90}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[80, 85, 90, 95].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setFormData({ ...formData, targetAtsGoal: score })}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        (formData.targetAtsGoal || 90) === score
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {score}% Target
                    </button>
                  ))}
                </div>
              </div>

              {/* Compensation & Work Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold text-sm">₹</span>
                    <span>Target Compensation Range (INR)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.targetSalary || '₹24,00,000 - ₹36,00,000'}
                    onChange={(e) => setFormData({ ...formData, targetSalary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="₹24,00,000 - ₹36,00,000"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-sky-400" />
                    <span>Workplace Model</span>
                  </label>
                  <select
                    value={formData.workPreference || 'Remote'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workPreference: e.target.value as UserProfile['workPreference'],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Remote">100% Remote</option>
                    <option value="Hybrid">Hybrid (Flexible)</option>
                    <option value="Onsite">On-Site Office</option>
                    <option value="Any">Open to Any Model</option>
                  </select>
                </div>
              </div>

              {/* Subscription & Plan Status */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Subscription & Plan Status</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Student plan pricing with 3 months free trial benefits
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    3 Months Free Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-white capitalize">{user.planTier || 'Pro'} Plan</span>
                    <p className="text-[11px] text-slate-400">
                      {user.planTier === 'basic'
                        ? '₹0 Free Forever &bull; Core Builder'
                        : user.planTier === 'plus'
                        ? 'First 3 Months Free &bull; ₹9 / mo thereafter'
                        : 'First 3 Months Free &bull; ₹49 / mo thereafter (Recommended)'}
                    </p>
                  </div>
                  {onOpenPlanModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPlanModal();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Compare / Change Plan
                    </button>
                  )}
                </div>
              </div>

              {/* Real-time Persistence & Notifications Configuration */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  System & Storage Status
                </h3>

                <div className="flex items-center justify-between py-2 border-b border-slate-900">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <p className="text-xs font-semibold text-white">Continuous Real-Time Auto-Save</p>
                      <p className="text-[11px] text-slate-400">Resumes, job updates, and courses sync instantaneously</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-900">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <div>
                      <p className="text-xs font-semibold text-white">Multi-Tab Real-Time Sync Channel</p>
                      <p className="text-[11px] text-slate-400">Syncs background updates across all your browser tabs</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-xs font-semibold text-white">Data Vault & Backups</p>
                    <p className="text-[11px] text-slate-400">Inspect storage usage, revision snapshots, or export JSON</p>
                  </div>
                  {onOpenDataVault && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenDataVault();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors"
                    >
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Open Vault</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
