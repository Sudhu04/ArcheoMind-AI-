import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Columns, ArrowRightLeft, Zap, Info, ShieldAlert, Sparkles } from 'lucide-react';
import { Artifact } from '../types';

interface NeuralComparatorProps {
  artifacts: Artifact[];
}

const NeuralComparator: React.FC<NeuralComparatorProps> = ({ artifacts }) => {
  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [selectedB, setSelectedB] = useState<string | null>(null);

  const artA = artifacts.find(a => a.id === selectedA);
  const artB = artifacts.find(a => a.id === selectedB);

  const calculateSimilarity = () => {
    if (!artA || !artB) return 0;
    let score = 0;
    if (artA.type === artB.type) score += 40;
    if (Math.abs(artA.confidenceScore - artB.confidenceScore) < 0.1) score += 20;
    // Mock similarity logic
    return Math.min(98.4, score + (Math.random() * 30));
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Differential Analysis</h4>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 font-display">Neural Comparator</h2>
        </div>
        <Columns className="w-10 h-10 text-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {['A', 'B'].map((slot) => {
          const selectedId = slot === 'A' ? selectedA : selectedB;
          const setSelect = slot === 'A' ? setSelectedA : setSelectedB;
          const currentArt = slot === 'A' ? artA : artB;

          return (
            <div key={slot} className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synapse Node {slot}</h5>
                  {currentArt && (
                    <button 
                       onClick={() => setSelect(null)}
                       className="text-[9px] font-bold text-rose-500 uppercase tracking-widest hover:underline"
                    >
                       Reset
                    </button>
                  )}
               </div>

               {currentArt ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-[3rem] p-8 border-4 border-white shadow-2xl relative overflow-hidden group"
                  >
                     <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 border border-slate-100 shadow-inner">
                        <img src={currentArt.imageUrl} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" alt="" />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{currentArt.name}</h3>
                        <div className="flex flex-wrap gap-2">
                           <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                              {currentArt.type}
                           </span>
                           <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-lg">
                              Level {currentArt.rarityLevel}
                           </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed italic opacity-80 line-clamp-3">"{currentArt.description}"</p>
                     </div>
                  </motion.div>
               ) : (
                  <div className="aspect-square glass-card rounded-[3rem] border-dashed border-4 border-slate-100 flex flex-col items-center justify-center p-12 text-center group transition-all hover:border-indigo-200 bg-white/50">
                     <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                        <Zap className="w-8 h-8 text-slate-200 group-hover:text-indigo-300" />
                     </div>
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6">Awaiting Input Link</p>
                     
                     <div className="w-full max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {artifacts.filter(a => a.id !== (slot === 'A' ? selectedB : selectedA)).map(a => (
                           <button
                             key={a.id}
                             onClick={() => setSelect(a.id)}
                             className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 group/btn"
                           >
                              <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest truncate">{a.name}</div>
                              <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{a.type}</div>
                           </button>
                        ))}
                     </div>
                  </div>
               )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {artA && artB && (
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 30 }}
             className="relative"
           >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border-4 border-white shadow-2xl z-20">
                 <ArrowRightLeft className="w-6 h-6 text-indigo-400" />
              </div>
              
              <div className="glass-card rounded-[4rem] p-12 mt-12 bg-indigo-600 border-indigo-400 text-white shadow-[0_40px_80px_-20px_rgba(79,70,229,0.4)] relative overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.2),transparent)]" />
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                    <div className="text-center space-y-4">
                       <h5 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Neural Resonance</h5>
                       <div className="text-6xl font-black tracking-tighter text-gradient animate-gradient-x bg-[length:200%_auto] from-white via-indigo-100 to-white">
                          {calculateSimilarity().toFixed(1)}%
                       </div>
                       <p className="text-[9px] font-black uppercase tracking-[0.2em] italic">Probability of Cultural Divergence</p>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                       <div className="flex items-center gap-4">
                          <Sparkles className="w-6 h-6 text-indigo-300" />
                          <h4 className="text-xl font-black italic tracking-tight">AI Synthesis Prediction</h4>
                       </div>
                       <p className="text-sm leading-relaxed font-medium text-indigo-50">
                          Linking <span className="font-black text-white">{artA.name}</span> and <span className="font-black text-white">{artB.name}</span> reveals a significant overlap in <span className="italic">"{artA.type}"</span> archetypes. Neural mapping suggests these fragments likely originated from the same temporal stratum within 3.5 cycles of variation.
                       </p>
                       <div className="grid grid-cols-2 gap-4 pt-4">
                          <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                             <div className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Timeline Offset</div>
                             <div className="text-lg font-black">~142.5 Cycles</div>
                          </div>
                          <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                             <div className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Material Integrity</div>
                             <div className="text-lg font-black">+8.2% Diff</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeuralComparator;
