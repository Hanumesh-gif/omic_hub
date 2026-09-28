import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Copy,
  Check,
  Dna,
  Zap,
  ChevronDown,
  X,
  Code2,
  Trash2,
  GraduationCap,
  Sliders,
} from 'lucide-react';
import { sendGeminiChatMessage, transcribeUserAudio, synthesizeVoiceAudio } from '../services/api';
import { saveChatMessageToFirestore, auth } from '../services/firebase';
import { useToast } from './Toast';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  model?: string;
  timestamp: string;
}

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

const BIO_ROLES = [
  {
    id: 'pi_mentor',
    name: 'Principal Investigator & Career Mentor',
    desc: 'Expert guidance on academic grants, genomics publications, and laboratory trajectory.',
    system:
      'You are a distinguished Bioinformatics Principal Investigator and Senior Mentor. Provide rigorous, encouraging, and actionable scientific advice on computational biology careers, lab leadership, and publication strategies.',
  },
  {
    id: 'pipeline_architect',
    name: 'Nextflow & GATK Pipeline Architect',
    desc: 'Deep technical advice on DSL2, containerization, SLURM HPC, and reproducible variant calling.',
    system:
      'You are a Staff Bioinformatics Infrastructure Architect specializing in Nextflow DSL2, containerization (Singularity/Docker), and Broad GATK 4 best practices. Answer with concrete code snippets, configuration directives, and HPC optimization strategies.',
  },
  {
    id: 'structural_ai',
    name: 'AlphaFold 3 & Structural Modeler',
    desc: 'Biophysical modeling, protein-ligand complexes, PyMOL scripts, and molecular docking.',
    system:
      'You are a Computational Structural Biologist and AI Drug Discovery specialist. Assist with AlphaFold 3 predictions, confidence scores (pLDDT, PAE), docking with AutoDock Vina, and PyMOL visualization commands.',
  },
  {
    id: 'single_cell',
    name: 'Single-Cell & Spatial Biostatistician',
    desc: 'Seurat 5, Scanpy, UMAP clustering, batch correction, and differential expression.',
    system:
      'You are an expert Biostatistician in Single-Cell RNA-seq (Seurat, Scanpy) and spatial transcriptomics. Provide statistical explanations, quality control thresholds, and R/Python code for clustering and pathway enrichment.',
  },
  {
    id: 'tech_interviewer',
    name: 'Senior Genomics Technical Interviewer',
    desc: 'Rigorous mock technical screens, STAR framework coaching, and algorithms drills.',
    system:
      'You are an experienced Bioinformatics Hiring Manager and Technical Interviewer. Conduct domain-authentic mock technical questions, critique answers using the STAR method, and point out missing metric validations.',
  },
];

const AVAILABLE_MODELS = [
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    tag: 'Recommended • Fast & Grounded',
    desc: 'Best for general computational biology queries, workflows, and Q&A',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    tag: 'Ultra Fast',
    desc: 'Optimized for rapid responses and instant code syntax checks',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro Preview',
    tag: 'Deep Reasoning',
    desc: 'Reserved for complex multi-omic math, biostatistics, and architecture proofs',
  },
];

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({ isOpen, onClose, userId }) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hello! I am your **Omic Hub Gemini Bioinformatics Assistant**. I can help you architect Nextflow DSL2 pipelines, troubleshoot GATK 4 variant calling, interpret AlphaFold 3 structures, refine resume bullet points, or conduct mock interview drills.\n\nHow can I accelerate your computational biology journey today?",
      model: 'gemini-3.5-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedRole, setSelectedRole] = useState(BIO_ROLES[0]);
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // Send message handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsSending(true);

    // Save to Firestore if authenticated
    const currentUid = userId || auth.currentUser?.uid;
    if (currentUid) {
      saveChatMessageToFirestore(currentUid, {
        id: userMsg.id,
        role: userMsg.role,
        model: selectedModel,
        text: userMsg.text,
        timestamp: userMsg.timestamp,
      }).catch(() => {});
    }

    try {
      const payloadMessages = newHistory.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await sendGeminiChatMessage(
        payloadMessages,
        selectedModel,
        selectedRole.name,
        selectedRole.system
      );

      const botMsg: ChatMessage = {
        id: `msg_${Date.now()}_a`,
        role: 'assistant',
        text: res.text,
        model: res.model || selectedModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (currentUid) {
        saveChatMessageToFirestore(currentUid, {
          id: botMsg.id,
          role: botMsg.role,
          model: botMsg.model || selectedModel,
          text: botMsg.text,
          timestamp: botMsg.timestamp,
        }).catch(() => {});
      }
    } catch (err) {
      showToast('Failed to reach Gemini assistant. Please retry.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  // Audio recording for transcription via gemini-3.5-transcribe
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            showToast('Transcribing audio with gemini-3.5-transcribe...', 'info');
            try {
              const transcribedText = await transcribeUserAudio(
                base64Audio,
                'audio/webm',
                'Transcribe the bioinformatics user question accurately.'
              );
              if (transcribedText) {
                setInputText((prev) => (prev ? `${prev} ${transcribedText}` : transcribedText));
                showToast('Voice transcribed successfully!', 'success');
              }
            } catch (error) {
              showToast('Audio transcription failed.', 'error');
            }
          };
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        showToast('Listening... Speak your bioinformatics question.', 'info');
      } catch (err) {
        showToast('Microphone access denied or unavailable.', 'error');
      }
    }
  };

  // Audio Voice Readout via gemini-3.8-flash-lite-tts
  const handleVoiceSpeak = async (message: ChatMessage) => {
    if (isPlayingAudio === message.id) {
      audioPlayerRef.current?.pause();
      setIsPlayingAudio(null);
      return;
    }

    showToast('Synthesizing speech with gemini-3.8-flash-lite-tts...', 'info');
    setIsPlayingAudio(message.id);

    try {
      const audioPcmBase64 = await synthesizeVoiceAudio(message.text.slice(0, 500), 'Zephyr');
      if (audioPcmBase64) {
        // Play PCM using AudioContext (24kHz)
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 24000,
        });
        const binaryStr = atob(audioPcmBase64);
        const len = binaryStr.length;
        const bytes = new Int16Array(len / 2);
        for (let i = 0; i < len; i += 2) {
          bytes[i / 2] = binaryStr.charCodeAt(i) | (binaryStr.charCodeAt(i + 1) << 8);
        }
        const audioBuffer = audioCtx.createBuffer(1, bytes.length, 24000);
        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < bytes.length; i++) {
          channelData[i] = bytes[i] / 32768.0;
        }
        const sourceNode = audioCtx.createBufferSource();
        sourceNode.buffer = audioBuffer;
        sourceNode.connect(audioCtx.destination);
        sourceNode.onended = () => {
          setIsPlayingAudio(null);
        };
        sourceNode.start();
      } else {
        // Fallback browser speech
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(message.text.replace(/[*_#`]/g, ''));
          utterance.rate = 1.05;
          utterance.onend = () => setIsPlayingAudio(null);
          utterance.onerror = () => setIsPlayingAudio(null);
          window.speechSynthesis.speak(utterance);
        } else {
          setIsPlayingAudio(null);
        }
      }
    } catch {
      setIsPlayingAudio(null);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Clear chat history?')) {
      setMessages([messages[0]]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end sm:p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full h-full sm:h-[92vh] sm:max-w-2xl bg-slate-900 border border-slate-800 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Chat Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                  <span>Gemini Bioinformatics Mentor</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    <Sparkles className="w-2.5 h-2.5" />
                    Multi-Turn Live
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[280px] sm:max-w-sm">
                Role: <strong className="text-slate-200">{selectedRole.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                showSettings
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Configure Role & Model"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors cursor-pointer"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Optional Role & Model Drawer */}
        {showSettings && (
          <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-4 animate-in fade-in duration-150 shrink-0">
            {/* Model Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Gemini Model Selection
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {AVAILABLE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedModel === m.id
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{m.name}</div>
                    <div className="text-[10px] text-cyan-400 font-semibold">{m.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Persona Role Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Bioinformatics Persona & System Instruction
              </label>
              <select
                value={selectedRole.id}
                onChange={(e) => {
                  const found = BIO_ROLES.find((r) => r.id === e.target.value);
                  if (found) setSelectedRole(found);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {BIO_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.desc.slice(0, 45)}...
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Dna className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 shadow-md ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {/* Message Meta */}
                  <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400 opacity-80 border-b border-white/10 pb-1.5">
                    <span>{isUser ? 'You' : `Gemini (${m.model || selectedModel})`}</span>
                    <span>{m.timestamp}</span>
                  </div>

                  {/* Message Content */}
                  <div className="whitespace-pre-wrap font-sans leading-relaxed break-words">
                    {m.text}
                  </div>

                  {/* Actions for Assistant Message */}
                  {!isUser && (
                    <div className="pt-2 flex items-center gap-2 border-t border-slate-800/80">
                      <button
                        onClick={() => handleCopy(m.text, m.id)}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-white transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleVoiceSpeak(m)}
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold transition-colors ${
                          isPlayingAudio === m.id
                            ? 'text-cyan-400 animate-pulse'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="Read aloud with Gemini 3.8 Flash Lite TTS"
                      >
                        {isPlayingAudio === m.id ? (
                          <>
                            <VolumeX className="w-3 h-3" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Speak Answer</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0">
                <Dna className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-cyan-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Gemini is generating bioinformatics response with {selectedModel}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Audio Transcription Microphone */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 space-y-2 shrink-0"
        >
          {/* Quick Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <span className="text-slate-500 font-bold shrink-0">Ask:</span>
            {[
              'Explain Nextflow DSL2 channel operators',
              'GATK 4 somatic filtering best practices',
              'How to cite AlphaFold 3 pLDDT in papers',
              'Review my genomic resume bullet points',
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setInputText(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                isRecording
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-lg shadow-rose-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
              }`}
              title={
                isRecording
                  ? 'Click to stop and transcribe'
                  : 'Speak audio input with gemini-3.5-transcribe'
              }
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about NGS, Nextflow, AlphaFold, Seurat, or interview prep..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold transition-all shadow-md shadow-cyan-600/20 disabled:opacity-40 cursor-pointer shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
