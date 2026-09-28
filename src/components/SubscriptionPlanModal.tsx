import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  QrCode,
  Smartphone,
  CreditCard,
  Lock,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Building,
} from 'lucide-react';
import { SubscriptionPlanTier, UserProfile } from '../types';
import confetti from 'canvas-confetti';
import { useToast } from './Toast';

export interface SubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (tier: SubscriptionPlanTier) => void;
  user: UserProfile;
  initialSelectedTier?: SubscriptionPlanTier;
  triggeredByFeature?: string;
}

export const SubscriptionPlanModal: React.FC<SubscriptionPlanModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  user,
  initialSelectedTier = 'pro',
  triggeredByFeature,
}) => {
  const { showToast } = useToast();
  const [selectedTier, setSelectedTier] = useState<SubscriptionPlanTier>(initialSelectedTier);
  
  // Checkout / Razorpay UPI Gateway UI state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<SubscriptionPlanTier>('pro');
  const [paymentMethod, setPaymentMethod] = useState<'upi_qr' | 'upi_vpa' | 'card'>('upi_qr');
  const [vpaId, setVpaId] = useState('student@okhdfcbank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleOpenCheckout = (tier: SubscriptionPlanTier) => {
    if (tier === 'basic') {
      onUpgrade('basic');
      showToast('Switched to Free Tier (₹0).', 'info');
      onClose();
      return;
    }
    setCheckoutTier(tier);
    setIsCheckoutOpen(true);
    setPaymentSuccess(false);
    setIsProcessingPayment(false);
  };

  const handleSimulatePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      showToast(
        `Payment verified via UPI Gateway! Successfully activated ${checkoutTier.toUpperCase()} Plan.`,
        'success'
      );
      setTimeout(() => {
        onUpgrade(checkoutTier);
        setIsCheckoutOpen(false);
        onClose();
      }, 1400);
    }, 1500);
  };

  const checkoutPrice = checkoutTier === 'plus' ? '9' : '49';
  const checkoutPlanName = checkoutTier === 'plus' ? 'Basic Plus (3 Months Trial)' : 'Pro Career Accelerator';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Dark Glassmorphism Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-5xl bg-[#0b0f19] border border-slate-800 rounded-3xl shadow-2xl shadow-purple-950/40 backdrop-blur-2xl overflow-hidden z-10 my-8 flex flex-col text-slate-100">
        
        {/* Neon Purple Gradient Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-400" />

        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors border border-slate-800 cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Transparent Bioinformatics Career Plans</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {triggeredByFeature
                  ? `Upgrade to Access ${triggeredByFeature}`
                  : 'Choose Your Career Acceleration Plan'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                Unlock full AI resume audits, live computational biology mock interviews, and advanced bioinformatics pipelines data vault.
              </p>
            </div>

            {/* Launch Trial Badge */}
            <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-left shrink-0 sm:max-w-xs">
              <div className="flex items-center gap-1.5 text-teal-300 font-bold text-xs">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span>Special Welcome Offer</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                First 3 Months Free on Trial Activation. ₹0 charged today!
              </p>
            </div>
          </div>
        </div>

        {/* 3 Clear Cards Grid */}
        <div className="p-6 sm:p-8 pt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 1: Free (₹0) */}
          <div
            className={`relative rounded-3xl p-6 flex flex-col justify-between border transition-all duration-300 bg-[#0b0f19] ${
              selectedTier === 'basic'
                ? 'border-slate-600 shadow-lg ring-1 ring-slate-600'
                : 'border-slate-800/90 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Access</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Free Forever
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">Free Tier</h3>
              <p className="text-xs text-slate-400 mb-5 min-h-[32px]">
                Basic Resume & Course Directory for students getting started.
              </p>

              {/* Price */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">₹0</span>
                  <span className="text-xs text-slate-400">/ forever</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-semibold mt-1">
                  100% Free &bull; No card required
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-2.5 text-xs text-slate-300 mb-6">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Basic Master Resume Builder (Standard format)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Full Course Directory (Free Coursera & NPTEL)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Plaintext & standard PDF export</span>
                </div>
                <div className="flex items-start gap-2 text-slate-500">
                  <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>AI Resume Audit & ATS Scorer</span>
                </div>
                <div className="flex items-start gap-2 text-slate-500">
                  <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>Live AI Mock Interview Simulator</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCheckout('basic')}
              className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
            >
              {user.planTier === 'basic' ? 'Current Active Plan' : 'Continue with Free (₹0)'}
            </button>
          </div>

          {/* CARD 2: Basic Plus (₹9 for 3 months trial) */}
          <div
            className={`relative rounded-3xl p-6 flex flex-col justify-between border transition-all duration-300 bg-[#0b0f19] ${
              selectedTier === 'plus'
                ? 'border-indigo-500 shadow-xl ring-2 ring-indigo-500/40 shadow-indigo-500/10'
                : 'border-indigo-500/30 hover:border-indigo-500/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Career Builder</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  3 Mo Free Trial
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">Basic Plus</h3>
              <p className="text-xs text-slate-400 mb-5 min-h-[32px]">
                Full ATS Resume Audit & direct job links with STAR metric enhancements.
              </p>

              {/* Price */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 mb-5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-white">₹0</span>
                  <span className="text-xs text-emerald-400 font-bold">First 3 Months Free</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                  <span>Then:</span>
                  <span className="text-indigo-300 font-bold">₹9 / month</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2.5 text-xs text-slate-200 mb-6">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Full ATS Resume Audit</strong> & keyword optimizer</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>STAR Method Rewrites</strong> for Google XYZ metrics</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Direct Job Links</strong> & opportunity tracker</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>3 ATS Templates (Modern, Executive, Minimal)</span>
                </div>
                <div className="flex items-start gap-2 text-slate-500">
                  <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>Live AI Mock Interview Simulator</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCheckout('plus')}
              className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Select Basic Plus (₹9)
            </button>
          </div>

          {/* CARD 3: Pro (₹49) */}
          <div
            className={`relative rounded-3xl p-6 flex flex-col justify-between border transition-all duration-300 bg-[#0b0f19] ${
              selectedTier === 'pro'
                ? 'border-purple-500 shadow-2xl ring-2 ring-purple-500/50 shadow-purple-500/20'
                : 'border-purple-500/30 hover:border-purple-500/60'
            }`}
          >
            {/* Top Recommended Pill */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-500 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
              👑 Recommended
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Ultimate Suite</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  3 Mo Free Trial
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">Pro Tier</h3>
              <p className="text-xs text-slate-400 mb-5 min-h-[32px]">
                AI Mock Interview, Data Vault, and priority application tracking.
              </p>

              {/* Price */}
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 mb-5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-white">₹0</span>
                  <span className="text-xs text-emerald-400 font-bold">First 3 Months Free</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                  <span>Then:</span>
                  <span className="text-purple-300 font-bold">₹49 / month</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2.5 text-xs text-slate-200 mb-6">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>AI Mock Interviewer</strong> with live voice & STAR scoring</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Data Vault:</strong> Multi-revision snapshots & cloud restore</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Direct Internship Applications</strong> & priority referral</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Full ATS Engine</strong> with Workday & Greenhouse rubrics</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Curated Broad/Illumina Computational Biology questions</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCheckout('pro')}
              className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white shadow-xl shadow-purple-600/30 transition-all hover:scale-102 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Crown className="w-4 h-4 text-amber-200" />
              <span>Upgrade Now (₹49)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 px-6 sm:px-8 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Instant activation &bull; Cancel anytime with 1-click &bull; Powered by UPI / Razorpay</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Omic Hub Verified Billing
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RAZORPAY / UPI CHECKOUT GATEWAY PLACEHOLDER MODAL */}
      {/* ======================================================== */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl"
            onClick={() => !isProcessingPayment && setIsCheckoutOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-20 flex flex-col text-slate-100">
            {/* Razorpay Brand Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-4 px-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm tracking-tight">Razorpay</span>
                    <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.2 rounded">TEST GATEWAY</span>
                  </div>
                  <p className="text-[11px] text-blue-200">Omic Hub Career Intelligence</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-blue-200 uppercase block">Amount</span>
                <span className="text-lg font-black text-white">₹{checkoutPrice}.00</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Order Info */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Subscription Plan</span>
                  <span className="font-bold text-white">{checkoutPlanName}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block text-[11px]">3 Months Free</span>
                  <span className="text-slate-400 text-[10px]">Then ₹{checkoutPrice}/mo</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_qr')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    paymentMethod === 'upi_qr'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>UPI QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_vpa')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    paymentMethod === 'upi_vpa'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI ID / VPA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card / NetBank</span>
                </button>
              </div>

              {/* Method Body 1: UPI QR Code */}
              {paymentMethod === 'upi_qr' && (
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-3">
                  <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-2xl shadow-md flex flex-col items-center justify-center">
                    {/* Simulated Authentic SVG UPI QR Code */}
                    <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="0" y="0" width="30" height="30" rx="3" fill="#0f172a" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="9" y="9" width="12" height="12" fill="#0f172a" />

                      <rect x="70" y="0" width="30" height="30" rx="3" fill="#0f172a" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="79" y="9" width="12" height="12" fill="#0f172a" />

                      <rect x="0" y="70" width="30" height="30" rx="3" fill="#0f172a" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="9" y="79" width="12" height="12" fill="#0f172a" />

                      {/* Random Grid dots simulating QR */}
                      <rect x="36" y="8" width="6" height="6" />
                      <rect x="48" y="8" width="8" height="6" />
                      <rect x="40" y="20" width="10" height="6" />
                      <rect x="10" y="40" width="8" height="8" />
                      <rect x="25" y="45" width="12" height="6" />
                      <rect x="45" y="38" width="14" height="14" />
                      <rect x="65" y="42" width="8" height="6" />
                      <rect x="80" y="40" width="10" height="10" />
                      <rect x="40" y="60" width="12" height="8" />
                      <rect x="60" y="62" width="10" height="8" />
                      <rect x="78" y="68" width="14" height="6" />
                      <rect x="42" y="80" width="8" height="10" />
                      <rect x="58" y="78" width="14" height="12" />
                      <rect x="82" y="82" width="8" height="8" />
                    </svg>
                  </div>
                  <p className="text-xs text-slate-300 font-semibold">
                    Scan with Google Pay, PhonePe, Paytm, or any BHIM UPI app
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Payment request generated &bull; Reference: OMC-UPI-{Date.now().toString().slice(-6)}
                  </p>
                </div>
              )}

              {/* Method Body 2: UPI ID / VPA */}
              {paymentMethod === 'upi_vpa' && (
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <label className="block text-xs font-semibold text-slate-300">
                    Enter Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={vpaId}
                      onChange={(e) => setVpaId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    A collect request of ₹{checkoutPrice} will be sent to your UPI app.
                  </p>
                </div>
              )}

              {/* Method Body 3: Cards */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      readOnly
                      value="4111 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 1111 (Test Card)"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Expiry</label>
                      <input
                        type="text"
                        readOnly
                        value="12/28"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">CVV</label>
                      <input
                        type="text"
                        readOnly
                        value="888"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Processing or Success State */}
              {paymentSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                  <p className="text-sm font-bold text-white">Payment Verified by Razorpay!</p>
                  <p className="text-xs text-emerald-300">Activating your plan and unlocking features...</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying with UPI Switch...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{checkoutPrice} via UPI / Razorpay (Instant Upgrade)</span>
                    </>
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>PCI-DSS Level 1 Compliant &bull; 256-bit Encryption &bull; Razorpay Certified</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
