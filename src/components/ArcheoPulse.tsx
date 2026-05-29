import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, AlertTriangle, CloudLightning, Globe, ArrowUpRight, TrendingUp } from 'lucide-react';

const NEWS_EVENTS = [
  { id: 1, type: 'discovery', text: 'New Neolithic site identified in Guntur valley via satellite thermal imaging.', location: 'Andhra Pradesh' },
  { id: 2, type: 'alert', text: 'Monsoon flooding risks reported near Hampi ruins. Preservation teams deployed.', location: 'Karnataka' },
  { id: 3, type: 'achievement', text: 'Neural Archive reaches 500,000 scanned Indian artifacts milestone.', location: 'Global' },
  { id: 4, type: 'research', text: 'Isotopic signature of Indus pottery DNA shows links to ancient Mediterranean trade.', location: 'Research Lab' }
];

export const ArcheoPulse: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % NEWS_EVENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = NEWS_EVENTS[currentIndex];

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-6 overflow-hidden">
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <Radio className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-ping opacity-75" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full" />
        </div>
        <div className="hidden md:block">
           <h3 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">ArcheoPulse</h3>
           <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Live Intelligence Ticker</p>
        </div>
      </div>

      <div className="h-px w-8 bg-white/10 hidden lg:block" />

      <div className="flex-1 relative h-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className={`text-[9px] font-black uppercase px-2 py-1 rounded border ${
                current.type === 'alert' ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' : 
                current.type === 'discovery' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                'bg-blue-500/20 border-blue-500/30 text-blue-400'
              }`}>
                {current.type}
              </span>
              <p className="text-sm font-medium text-slate-200 line-clamp-1">{current.text}</p>
            </div>
            
            <div className="hidden sm:flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-2 text-slate-500">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{current.location}</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-indigo-400 opacity-50" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="h-px w-8 bg-white/10 hidden lg:block" />

      <div className="shrink-0 flex items-center gap-3">
         <div className="text-right hidden sm:block">
            <p className="text-[8px] font-black text-slate-500 uppercase">Archive Velocity</p>
            <div className="flex items-center gap-1 text-emerald-400">
               <TrendingUp className="w-3.5 h-3.5" />
               <span className="text-xs font-bold font-mono">+12.4%</span>
            </div>
         </div>
      </div>
    </div>
  );
};
