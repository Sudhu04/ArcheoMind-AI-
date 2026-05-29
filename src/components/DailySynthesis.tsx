import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Activity, FileText, Cpu } from 'lucide-react';
import { Artifact } from '../types';

interface SynthesisProps {
  artifacts: Artifact[];
}

const DailySynthesis: React.FC<SynthesisProps> = ({ artifacts }) => {
  const recent = artifacts.slice(0, 3);
  const totalVerified = artifacts.filter(a => a.isVerified).length;
  
  return (
    <div className="glass-card rounded-[3.5rem] p-10 bg-slate-900 border-slate-800 text-white shadow-2xl relative overflow-hidden">
      {/* Circuit pattern background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      
      <div className="relative z-10 flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3 space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                 <Cpu className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Heuristic AI</h4>
           </div>
           
           <h2 className="text-4xl font-black tracking-tighter leading-[0.9] text-gradient animate-gradient-x bg-[length:200%_auto] from-white via-indigo-200 to-white">
              Daily Neural Synthesis
           </h2>
           
           <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
             Automated summary of global archival activity for the current solar cycle.
           </p>

           <div className="flex gap-4 pt-4">
              <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/5">
                 <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Integrity</div>
                 <div className="text-xl font-black">99.8%</div>
              </div>
              <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/5">
                 <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Authenticated</div>
                 <div className="text-xl font-black">{totalVerified}</div>
              </div>
           </div>
        </div>

        <div className="md:w-2/3 space-y-6">
           <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-4">
              <div className="flex items-center gap-3 text-indigo-300">
                 <Sparkles className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Synapse Report // ST-402</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 font-medium">
                 The neural matrix has detected a surge in <span className="text-indigo-400 font-bold">"{recent[0]?.type || 'Ancient Artifact'}"</span> activity. Current telemetry suggests a high-probability link between the latest discoveries in the northern sector and the previously logged historical strata. Analysis indicates an 85% probability of a unified cultural source across all localized nodes.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-indigo-600/20 rounded-[2rem] border border-indigo-500/30 flex items-center gap-6">
                 <Activity className="w-8 h-8 text-indigo-400" />
                 <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Throughput</h5>
                    <div className="text-xl font-black">2.4 TB/s</div>
                 </div>
              </div>
              <div className="p-6 bg-slate-800/50 rounded-[2rem] border border-slate-700 flex items-center gap-6">
                 <FileText className="w-8 h-8 text-slate-500" />
                 <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Records</h5>
                    <div className="text-xl font-black">{artifacts.length}</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DailySynthesis;
