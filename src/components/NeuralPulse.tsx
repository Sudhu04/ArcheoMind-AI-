import React, { useEffect, useState } from 'react';
import { Activity, Globe, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Artifact, User } from '../types';

interface NeuralPulseProps {
  artifacts: Artifact[];
}

export default function NeuralPulse({ artifacts }: NeuralPulseProps) {
  const [pulseEntries, setPulseEntries] = useState<any[]>([]);

  useEffect(() => {
    // Convert artifacts into recent activity entries
    const entries = artifacts
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)
      .map(a => ({
        id: a.id,
        type: 'discovery',
        text: `New specimen "${a.name}" linked to ${a.civilization} matrix`,
        actor: a.userName,
        timestamp: a.timestamp,
        location: a.location.name
      }));
    
    setPulseEntries(entries);
  }, [artifacts]);

  return (
    <div className="glass-card border-white bg-slate-900/5 backdrop-blur-md rounded-[2.5rem] p-8 shadow-inner overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5">
         <Globe className="w-48 h-48 text-indigo-600" />
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-200">
            <Zap className="w-4 h-4 text-white animate-pulse" />
          </div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Atmospheric Pulse</h4>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Neural Stream Active</span>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <AnimatePresence initial={false}>
          {pulseEntries.map((entry, idx) => (
            <motion.div 
              key={entry.id + idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-start gap-4 group"
            >
              <div className="mt-1 flex flex-col items-center">
                 <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform" />
                 {idx !== pulseEntries.length - 1 && <div className="w-0.5 h-12 bg-slate-100 rounded-full mt-2" />}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-700 leading-tight group-hover:text-indigo-600 transition-colors">
                  {entry.text}
                </p>
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                   <span>{entry.actor}</span>
                   <span>•</span>
                   <span>{entry.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="mt-8 p-4 bg-white/50 border border-white rounded-2xl flex items-center justify-between">
         <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Protocol Verified</span>
         </div>
         <span className="text-[8px] font-mono text-slate-300">0.02ms Latency</span>
      </div>
    </div>
  );
}
