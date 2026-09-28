import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Download,
  Upload,
  RefreshCw,
  X,
  Sliders,
  Dna,
  Layers,
  Wand2,
  Check,
  Eye,
} from 'lucide-react';
import { generateGeminiImage } from '../services/api';
import { useToast } from './Toast';

interface ScientificImageStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_PROMPTS = [
  'AlphaFold 3 predicted protein-ligand binding complex in ribbon representation with active site residues highlighted in cyan',
  'Nextflow DSL2 automated RNA-seq workflow diagram with FASTQ quality control, STAR alignment, and DESeq2 differential analysis nodes',
  'Single-cell RNA-seq UMAP 2D clustering plot showing 12 distinct immune cell subsets with vibrant distinct color clusters',
  'CRISPR Cas9 ribonucleoprotein complex bound to target genomic DNA with guide RNA strand',
  'High-throughput Illumina NovaSeq whole genome sequencing flow cell architecture diagram',
  'Certified Bioinformatics Specialist gold laboratory badge emblem with DNA double helix',
];

export const ScientificImageStudio: React.FC<ScientificImageStudioProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0]);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3'>('1:1');
  const [base64InputImage, setBase64InputImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      showToast('Image size exceeds 4MB. Please choose a smaller diagram.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64InputImage(reader.result as string);
      showToast('Reference diagram loaded for editing!', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    showToast(
      base64InputImage
        ? 'Editing diagram with Gemini 3.1 Flash Image...'
        : 'Generating scientific visualization with Gemini 3.1 Flash Image...',
      'info'
    );

    try {
      const res = await generateGeminiImage(
        prompt.trim(),
        base64InputImage || undefined,
        aspectRatio
      );
      if (res.imageUrl) {
        setGeneratedImage(res.imageUrl);
        showToast('Scientific visualization generated successfully!', 'success');
      } else {
        showToast('Unable to generate image. Please try adjusting your prompt.', 'error');
      }
    } catch {
      showToast('Failed to connect to image generation service.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `omic_hub_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Visual downloaded to device!', 'success');
  };

  const handleUseAsEditInput = () => {
    if (generatedImage) {
      setBase64InputImage(generatedImage);
      setPrompt('Add detailed annotations and increase contrast for publication figure.');
      showToast('Current image loaded as base for iterative editing!', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>Scientific Visualization Studio</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  gemini-3.1-flash-image
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Generate and edit genomic diagrams, workflow flowcharts, protein models, and laboratory emblems
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls Column */}
          <div className="space-y-4">
            {/* Prompt input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Visualization Prompt
              </label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your scientific diagram or edit instructions..."
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            {/* Quick Inspiration Pills */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 block">
                Bioinformatics Inspiration Templates:
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {SAMPLE_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(p)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-left truncate max-w-full transition-colors cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio & Options */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['1:1', '16:9', '4:3'] as const).map((ar) => (
                    <button
                      key={ar}
                      type="button"
                      onClick={() => setAspectRatio(ar)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        aspectRatio === ar
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Base Image for Editing (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    id="edit-image-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="edit-image-upload"
                    className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{base64InputImage ? 'Replace Base' : 'Upload Diagram'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Base Image Preview if uploaded */}
            {base64InputImage && (
              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={base64InputImage}
                    alt="Reference base"
                    className="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0"
                  />
                  <div className="text-xs truncate">
                    <p className="font-bold text-slate-200 truncate">Base diagram active</p>
                    <p className="text-[10px] text-slate-400">Model will apply edits to this image</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBase64InputImage(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Action button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Visual...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{base64InputImage ? 'Apply Edits to Image' : 'Generate Visual Diagram'}</span>
                </>
              )}
            </button>
          </div>

          {/* Canvas / Image Output Column */}
          <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-950 border border-slate-800/80 min-h-[320px]">
            {isGenerating ? (
              <div className="text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
                  <Dna className="w-7 h-7 animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Rendering with Gemini 3.1 Flash Image...</p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Synthesizing molecular structure & annotations with high-precision generative diffusion
                  </p>
                </div>
              </div>
            ) : generatedImage ? (
              <div className="w-full h-full flex flex-col items-center justify-between space-y-4">
                <div className="relative group w-full max-h-[380px] rounded-2xl overflow-hidden border border-slate-700/80 flex items-center justify-center bg-slate-900">
                  <img
                    src={generatedImage}
                    alt="Generated scientific visualization"
                    className="max-h-[380px] w-auto object-contain rounded-2xl"
                  />
                </div>

                <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleUseAsEditInput}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Iterate / Edit This</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 p-6">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-400">Canvas Ready</p>
                <p className="text-[11px] text-slate-500 max-w-xs">
                  Enter a prompt above and click generate to create high-resolution scientific figures or emblems.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
