import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Type, Sparkles, BookOpen, Search, Languages, ChevronRight, Hash, Globe } from 'lucide-react';

const SCRIPTS = [
  { id: 'brahmi', name: 'Brahmi', period: '3rd Century BC - 4th Century AD', description: 'The mother of most Indian scripts, used in Ashoka\'s edicts.' },
  { id: 'kharosthi', name: 'Kharosthi', period: '3rd Century BC - 3rd Century AD', description: 'Ancient script used in Gandhara, written from right to left.' },
  { id: 'grantha', name: 'Grantha', period: '5th Century AD - Present', description: 'Historically used by Tamil speakers to write Sanskrit.' },
  { id: 'devanagari', name: 'Early Devanagari', period: '7th Century AD - Present', description: 'The script of classical Sanskrit and modern Hindi.' }
];

export const EpigraphyTranslator: React.FC = () => {
  const [selectedScript, setSelectedScript] = useState(SCRIPTS[0]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<null | { transcription: string, translation: string, context: string }>(null);

  const handleTranslate = () => {
    setIsTranslating(true);
    // Simulate complex neural translation
    setTimeout(() => {
      setTranslationResult({
        transcription: "देवानांपियदसी लाजा एवं आहा (Devānāṃpiyadasi lājā evaṃ āhā)",
        translation: "The King, Beloved of the Gods, speaks thus...",
        context: "This is a recurring introductory formula found in the Major Rock Edicts of Emperor Ashoka, establishing royal authority through divine favor."
      });
      setIsTranslating(false);
    }, 2000);
  };

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-teal-500/10 to-blue-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <Languages className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Epigraphy Decoder</h2>
            <p className="text-xs text-slate-400">Neural Script Analysis & Translation</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 divide-x divide-white/10">
        {/* Left: Script Selection */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[400px]">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Select Target Script</h3>
          {SCRIPTS.map((script) => (
            <button
              key={script.id}
              onClick={() => setSelectedScript(script)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedScript.id === script.id
                  ? 'bg-teal-500/10 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.1)]'
                  : 'bg-white/5 border-transparent hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-medium ${selectedScript.id === script.id ? 'text-teal-400' : 'text-white'}`}>
                  {script.name}
                </span>
                <Hash className="w-3 h-3 text-slate-500" />
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">{script.description}</p>
            </button>
          ))}
        </div>

        {/* Center: Input/Action */}
        <div className="col-span-2 p-6 flex flex-col gap-6">
          <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05),transparent)] pointer-events-none" />
            
            {!translationResult && !isTranslating && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                  <Type className="w-10 h-10 text-teal-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Ready for Decoding</h4>
                  <p className="text-sm text-slate-400 max-w-xs mx-auto">
                    Upload an engraving or select a sample to begin the neural translation process.
                  </p>
                </div>
              </motion.div>
            )}

            {isTranslating && (
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-teal-500/20 border-t-teal-500 animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-teal-400 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-teal-400 font-mono text-sm animate-pulse">ALGORITHMIC RECONSTRUCTION IN PROGRESS</p>
                  <p className="text-[10px] text-slate-500 font-mono italic">Matching phonemes against Indological database...</p>
                </div>
              </div>
            )}

            {translationResult && !isTranslating && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Transcription</span>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 font-serif italic text-lg text-white">
                    {translationResult.transcription}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Modern Translation</span>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-slate-200">
                    {translationResult.translation}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/20 flex gap-4">
                  <BookOpen className="w-5 h-5 text-teal-400 shrink-0 mt-1" />
                  <p className="text-sm text-slate-400 italic">
                    <span className="text-teal-400 font-bold not-italic">Historical Analysis:</span> {translationResult.context}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setTranslationResult(null)}
              className="flex-1 py-3 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
            >
              Clear Analysis
            </button>
            <button 
              onClick={handleTranslate}
              disabled={isTranslating}
              className="flex-[2] py-3 px-6 rounded-xl bg-teal-500 text-slate-900 font-bold flex items-center justify-center gap-2 hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Specimen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
