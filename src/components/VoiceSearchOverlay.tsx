import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, X, Sparkles, Volume2, Search, AlertCircle, HelpCircle } from 'lucide-react';
import { executeVoiceArcheologySearch } from '../services/geminiService';

interface VoiceSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceSearchOverlay({ isOpen, onClose }: VoiceSearchOverlayProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<{ isRelated: boolean; answer: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fallbackInput, setFallbackInput] = useState('');
  const [microphoneStatus, setMicrophoneStatus] = useState<'idle' | 'listening' | 'error' | 'unsupported'>('idle');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      return;
    }

    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicrophoneStatus('unsupported');
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setMicrophoneStatus('listening');
        setTranscript('Listening for query...');
      };

      recognition.onerror = (event: any) => {
        console.error('OCR Voice Error: ', event.error);
        setMicrophoneStatus('error');
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setTranscript('Microphone access denied. You can search manually using the field below.');
        } else {
          setTranscript(`Unable to parse audio wave. Please speak clearly or write the prompt manually.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (microphoneStatus === 'listening') {
          setMicrophoneStatus('idle');
        }
      };

      recognition.onresult = async (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        await analyzeVoicePrompt(spokenText);
      };

      recognitionRef.current = recognition;
      startListening();
    }

    return () => {
      stopListening();
    };
  }, [isOpen]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        setResult(null);
        recognitionRef.current.start();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }
    setIsListening(false);
  };

  const analyzeVoicePrompt = async (text: string) => {
    if (!text.trim() || text === 'Listening for query...') return;
    setIsLoading(true);
    setResult(null);
    try {
      const dbResult = await executeVoiceArcheologySearch(text);
      setResult(dbResult);
    } catch (err) {
      console.error(err);
      setResult({
        isRelated: false,
        answer: "Uplink anomaly. Failed to retrieve answer from global archaeological catalog."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fallbackInput.trim()) return;
    setTranscript(fallbackInput);
    analyzeVoicePrompt(fallbackInput);
    setFallbackInput('');
    stopListening();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl overflow-hidden bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl p-8 md:p-12"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Neural Audio Search</h3>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Excavation Oracle</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center space-y-8 text-center pb-4">
            {/* Visualizer Circle */}
            <div className="relative flex items-center justify-center w-28 h-28">
              {isListening && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full bg-rose-500/20"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
                    className="absolute inset-0 rounded-full bg-indigo-500/15"
                  />
                </>
              )}
              <button
                onClick={isListening ? stopListening : startListening}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-rose-500 text-white shadow-xl shadow-rose-900/40 animate-pulse' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-900/40'
                }`}
              >
                {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
              </button>
            </div>

            {/* Transcript Area */}
            <div className="space-y-2 w-full max-w-lg">
              <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">TRANSCRIPT FEED</p>
              <div className="p-6 bg-slate-950 rounded-2xl border border-white/5 min-h-[4rem] flex items-center justify-center">
                <p className={`text-sm font-bold ${isListening ? 'text-indigo-400 italic' : 'text-slate-300'}`}>
                  {transcript || 'Press the mic button and initiate an archaeological inquiry...'}
                </p>
              </div>
            </div>

            {microphoneStatus === 'error' && (
              <div className="p-5 bg-rose-950/30 border border-rose-500/20 rounded-[1.5rem] text-left w-full max-w-lg text-rose-300 text-xs flex gap-3.5 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-black uppercase text-[9px] tracking-widest text-rose-400">Microphone Access Restricted</p>
                  <p className="font-bold text-slate-400 leading-relaxed text-[11px]">
                    Browser microphone permissions are blocked. Since ArcheoMind runs in a secure sandbox frame, please check your browser's address bar to enable microphone access, or utilize the <strong className="text-white">Keyboard Search Terminal</strong> below to query manually.
                  </p>
                </div>
              </div>
            )}

            {microphoneStatus === 'unsupported' && (
              <div className="p-5 bg-amber-950/30 border border-amber-500/20 rounded-[1.5rem] text-left w-full max-w-lg text-amber-300 text-xs flex gap-3.5 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-black uppercase text-[9px] tracking-widest text-amber-400">Speech Recognition Unsupported</p>
                  <p className="font-bold text-slate-400 leading-relaxed text-[11px]">
                    Your current browser does not support the Web Speech API. Please switch to Google Chrome, Chromium, or Safari, or insert your search phrases into the <strong className="text-white">Keyboard Search Terminal</strong> below.
                  </p>
                </div>
              </div>
            )}

            {/* AI Search Result Area */}
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center space-y-3"
                >
                  <div className="flex gap-1.5 p-3 bg-white/5 rounded-full px-5 border border-white/5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0s]" />
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Consulting Chronicles...</span>
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-lg text-left"
                >
                  <div className={`p-8 rounded-[2rem] border relative overflow-hidden ${
                    result.isRelated 
                      ? 'bg-indigo-950/20 border-indigo-500/20 text-slate-100' 
                      : 'bg-rose-950/20 border-rose-500/20 text-rose-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      {result.isRelated ? (
                        <>
                          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Query Resolved</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-rose-400" />
                          <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Out of Archaeological Scope</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed font-medium">
                      {result.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Helper guidelines */}
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ask about heritages, civilizations, dating methods, Giza, Keeladi, etc.</span>
            </div>

            {/* Manual fallback input */}
            <form onSubmit={handleManualSubmit} className="w-full max-w-lg border-t border-white/5 pt-6 space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                Keyboard Search Terminal (Universal Backup)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter archaeological phrase or query..."
                  value={fallbackInput}
                  onChange={(e) => setFallbackInput(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-6 pr-14 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 focus:bg-slate-950 transition-all"
                />
                <button
                  type="submit"
                  disabled={!fallbackInput.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
