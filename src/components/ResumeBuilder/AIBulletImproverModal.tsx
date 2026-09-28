import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, X, AlertCircle, RefreshCw } from 'lucide-react';
import { improveResumeBullet, ResumeImproveResponse } from '../../services/api';
import { useToast } from '../Toast';

interface AIBulletImproverModalProps {
  initialText: string;
  section: string;
  role: string;
  onApply: (improvedText: string) => void;
  onClose: () => void;
}

export const AIBulletImproverModal: React.FC<AIBulletImproverModalProps> = ({
  initialText,
  section,
  role,
  onApply,
  onClose,
}) => {
  const { showToast } = useToast();
  const [currentText, setCurrentText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeImproveResponse | null>(null);

  const handleAnalyze = async () => {
    if (!currentText.trim()) return;
    setLoading(true);
    try {
      const data = await improveResumeBullet(currentText, section, role);
      setResult(data);
      showToast('AI suggestions generated successfully!', 'success');
    } catch (err) {
      showToast('Failed to optimize bullet. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Trigger on initial open if text is provided
  React.useEffect(() => {
    if (initialText.trim()) {
      handleAnalyze();
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Content & Bullet Optimizer</h3>
              <p className="text-xs text-slate-400">
                Rewriting using the Google XYZ Formula: Accomplished [X], as measured by [Y], by doing [Z]
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

        {/* Scrollable Body */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Current Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Original Phrasing:
            </label>
            <textarea
              rows={3}
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="e.g. Worked on the API and reduced latency..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading || !currentText.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Re-analyze with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-4 pt-2">
              {/* Score & Diagnostics */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <span className="text-2xl font-black text-indigo-400">{result.score}</span>
                    <span className="text-[10px] text-slate-400 block -mt-1">/ 100</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Impact Assessment</p>
                    <p className="text-[11px] text-slate-400">
                      {result.score >= 85
                        ? 'High-yield metric phrasing'
                        : 'Needs stronger numerical evidence & active verbs'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
                  {result.recommendedKeywords.slice(0, 3).map((kw, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                      +{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Re-writes */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-200">
                  Select an AI-Enhanced Option:
                </label>
                {result.improvedVersions.map((opt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        {opt.style}
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">{opt.text}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onApply(opt.text);
                        showToast('Applied AI-enhanced phrasing!', 'success');
                        onClose();
                      }}
                      className="self-end sm:self-center shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Use this</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Quick Tips */}
              {result.quickTips.length > 0 && (
                <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                  <div className="space-y-1">
                    {result.quickTips.map((tip, i) => (
                      <p key={i}>&bull; {tip}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
