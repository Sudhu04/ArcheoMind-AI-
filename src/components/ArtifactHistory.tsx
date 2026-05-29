import React from 'react';
import { History, User as UserIcon, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface ArtifactHistoryProps {
  history: {
    id: string;
    action: string;
    actor: string;
    timestamp: number;
    description: string;
  }[];
}

export default function ArtifactHistory({ history }: ArtifactHistoryProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-50 rounded-xl">
          <History className="w-4 h-4 text-slate-500" />
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Specimen Lifecycle Log</h4>
      </div>

      <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 before:rounded-full">
        {history.sort((a,b) => b.timestamp - a.timestamp).map((entry, idx) => (
          <motion.div 
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="relative"
          >
            <div className="absolute -left-[31px] top-0 p-1.5 bg-white border-2 border-slate-100 rounded-full z-10">
               <div className="w-2 h-2 rounded-full bg-indigo-500" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">{entry.action}</span>
                <span className="text-[9px] font-bold text-slate-300 flex items-center gap-1">
                   <Clock className="w-3 h-3" />
                   {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed italic">{entry.description}</p>
              <div className="flex items-center gap-1.5 mt-2">
                 <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <UserIcon className="w-2.5 h-2.5 text-slate-400" />
                 </div>
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{entry.actor}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
