import React, { useState } from 'react';
import { Artifact } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Activity, Zap, Layers, Globe, Plus } from 'lucide-react';
import { compareArtifactsResonance } from '../services/geminiService';

interface ResonanceAnalyzerProps {
  artifacts: Artifact[];
}

export default function ResonanceAnalyzer({ artifacts }: ResonanceAnalyzerProps) {
  const [selected, setSelected] = useState<[string | null, string | null]>([null, null]);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const item1 = artifacts.find(a => a.id === selected[0]);
  const item2 = artifacts.find(a => a.id === selected[1]);

  const runComparison = async () => {
    if (!item1 || !item2) return;
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const result = await compareArtifactsResonance(item1, item2);
      setAnalysis(result);
    } catch (error: any) {
      console.error("Resonance analysis failed:", error);
      setAnalysis(`Neural resonance failed to synchronize. Reason: ${error.message || "Unknown connectivity failure"}. Ensure your network link is stable.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px w-16 bg-indigo-100" />
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em]">Cross-Resonance Analysis</span>
          <div className="h-px w-16 bg-indigo-100" />
        </div>
        <h2 className="text-6xl font-black tracking-tight text-slate-900 font-display">Neural <span className="text-slate-300">Synchronicity</span></h2>
        <p className="text-slate-500 max-w-lg leading-relaxed font-medium">Select two disparate fragments to mapped potential trade resonance or parallel technical evolution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
        {/* Slot 1 */}
        <SelectionSlot 
          artifact={item1} 
          onClear={() => setSelected([null, selected[1]])} 
          placeholder="Nexus Primus"
        />

        {/* Action Center */}
        <div className="flex flex-col items-center space-y-8 py-12">
          <div className="relative">
            <div className={`p-8 rounded-full bg-white border-4 border-slate-50 shadow-2xl relative z-10 transition-all ${isAnalyzing ? 'scale-110' : ''}`}>
              <Activity className={`w-12 h-12 ${isAnalyzing ? 'text-indigo-600 animate-pulse' : 'text-slate-300'}`} />
            </div>
            {isAnalyzing && (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-indigo-200 rounded-full scale-125"
              />
            )}
          </div>
          
          <button 
            onClick={runComparison}
            disabled={!item1 || !item2 || isAnalyzing}
            className="btn-primary px-12 py-5 flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] disabled:opacity-30 disabled:scale-100 shadow-2xl shadow-indigo-100 lg:-rotate-2 hover:rotate-0"
          >
            <Zap className="w-5 h-5" />
            Synthesize Resonance
          </button>
        </div>

        {/* Slot 2 */}
        <SelectionSlot 
          artifact={item2} 
          onClear={() => setSelected([selected[0], null])} 
          placeholder="Nexus Secundus"
        />
      </div>

      {/* Artifact Picker */}
      <div className="glass-card rounded-[3.5rem] bg-slate-50/50 p-12 border-white shadow-inner">
         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 text-center">Available Repository Data</h4>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artifacts.map(a => {
              const isSelected = selected.includes(a.id);
              return (
                <button 
                  key={a.id}
                  onClick={() => {
                    if (isSelected) return;
                    if (!selected[0]) setSelected([a.id, selected[1]]);
                    else if (!selected[1]) setSelected([selected[0], a.id]);
                  }}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all group ${
                    isSelected ? 'border-indigo-500 scale-95 opacity-50' : 'border-white hover:border-indigo-200'
                  }`}
                >
                  <img src={a.imageUrl} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                    <p className="text-[9px] font-black text-white uppercase tracking-wider">{a.name}</p>
                  </div>
                </button>
              );
            })}
         </div>
      </div>

      {/* Analysis Result */}
      <AnimatePresence>
        {(isAnalyzing || analysis) && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="glass-card bg-slate-900 rounded-[4rem] p-12 lg:p-20 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:opacity-20 transition-opacity">
               <Layers className="w-64 h-64 text-indigo-400 rotate-12" />
            </div>
            
            <div className="relative z-10 space-y-12">
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/10 rounded-[2rem] border border-white/10">
                     <Sparkles className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Neural Synthesis Engine</h4>
                    <h3 className="text-4xl font-black text-white tracking-tight">Cross-Reference Output</h3>
                  </div>
               </div>

               {isAnalyzing ? (
                 <div className="space-y-8 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="space-y-3">
                         <div className="h-4 bg-white/10 rounded-full w-1/4" />
                         <div className="h-2 bg-white/5 rounded-full w-full" />
                         <div className="h-2 bg-white/5 rounded-full w-5/6" />
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="prose prose-invert max-w-none">
                    <div className="text-indigo-100 font-medium leading-relaxed space-y-4 whitespace-pre-wrap text-lg">
                       {analysis}
                    </div>
                 </div>
               )}
               
               {!isAnalyzing && (
                 <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="flex items-center gap-4 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                       <Globe className="w-5 h-5" />
                       <span>Analysis Verified // Global Sync Complete</span>
                    </div>
                    <button onClick={() => setAnalysis(null)} className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all">
                       Resync Repository
                    </button>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectionSlot({ artifact, onClear, placeholder }: { artifact?: Artifact, onClear: () => void, placeholder: string }) {
  return (
    <div className="glass-card bg-white rounded-[3rem] p-4 h-[400px] flex flex-col border-white shadow-xl relative group">
      {artifact ? (
        <div className="h-full flex flex-col">
          <div className="relative flex-1 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-inner mb-6">
            <img src={artifact.imageUrl} className="w-full h-full object-cover" alt="" />
            <button 
              onClick={onClear}
              className="absolute top-4 right-4 p-2 bg-white rounded-full text-slate-400 hover:text-rose-500 shadow-xl transition-all"
            >
              <ArrowRight className="w-5 h-5 rotate-45" />
            </button>
          </div>
          <div className="px-4 pb-4">
            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{artifact.civilization}</h4>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{artifact.name}</h3>
          </div>
        </div>
      ) : (
        <div className="h-full border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 opacity-50 hover:opacity-100 hover:bg-slate-50 transition-all cursor-pointer">
          <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center">
            <Plus className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{placeholder}</p>
        </div>
      )}
    </div>
  );
}
