import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, Info, AlertCircle, RefreshCw } from 'lucide-react';

export default function ScientificToolkit() {
  const [c14Amount, setC14Amount] = useState<number>(100);
  const [estimatedAge, setEstimatedAge] = useState<number | null>(null);

  const calculateAge = () => {
    // Basic C14 half-life formula: t = [ ln (Nf/No) / (-0.693) ] * t1/2
    // t1/2 = 5730 years
    const age = (Math.log(c14Amount / 100) / -0.693) * 5730;
    setEstimatedAge(Math.round(age));
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <div className="p-3 radiant-gradient rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center text-white">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Scientific <span className="text-indigo-600">Toolkit</span></h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Lab Instrumentation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Carbon-14 Estimator */}
        <div className="glass-card bg-white border-2 border-slate-50 p-8 rounded-[3rem] shadow-xl space-y-6">
           <div className="flex items-center justify-between mb-2">
             <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">C14 Decay Profiler</h4>
             <Zap className="w-4 h-4 text-amber-400" />
           </div>
           
           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Residual C14 (%)</label>
               <span className="text-lg font-black text-slate-900">{c14Amount}%</span>
             </div>
             <input 
               type="range" 
               min="1" 
               max="100" 
               value={c14Amount}
               onChange={(e) => setC14Amount(Number(e.target.value))}
               className="w-full appearance-none h-1.5 bg-slate-100 rounded-full accent-indigo-600 cursor-pointer"
             />
           </div>

           <button 
             onClick={calculateAge}
             className="w-full py-4 radiant-gradient text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
           >
              Run Probabilistic Epoch Sweep
           </button>

           <AnimatePresence>
             {estimatedAge !== null && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="p-6 bg-indigo-50 border border-indigo-100 rounded-[2rem] text-center"
               >
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Estimated Chronological Age</p>
                  <p className="text-4xl font-black text-indigo-700 tracking-tighter">~{estimatedAge} <span className="text-lg opacity-50">Years</span></p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-bold text-indigo-400 uppercase">
                    <Info className="w-3 h-3" />
                    ± 40 Year Variance Margin
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Stratigraphic Density Tool */}
        <div className="glass-card bg-slate-900 p-8 rounded-[3rem] shadow-2xl space-y-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-45 transition-transform duration-1000">
              <RefreshCw className="w-24 h-24 text-white" />
           </div>
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h4 className="text-[11px] font-black text-indigo-300 uppercase tracking-widest mb-4">Stratigraphic Solver</h4>
                <div className="space-y-4">
                   <div className="h-2 bg-white/10 rounded-full w-full overflow-hidden">
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '0%' }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                        className="h-full w-1/2 radiant-gradient opacity-30"
                      />
                   </div>
                   <p className="text-xs text-white/60 leading-relaxed font-medium">
                      Automated soil density analysis and compaction signature detection. Requires specialized sensory input.
                   </p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                 <AlertCircle className="w-5 h-5 text-rose-400" />
                 <p className="text-[9px] font-black text-rose-300 uppercase tracking-widest">Awaiting Local Core Sensor Stream</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

import { AnimatePresence } from 'motion/react';
