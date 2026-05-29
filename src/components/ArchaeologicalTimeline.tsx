import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Clock, Calendar, ArrowRight, History, Sparkles } from 'lucide-react';
import { Artifact } from '../types';

interface ArchaeologicalTimelineProps {
  artifacts: Artifact[];
}

export default function ArchaeologicalTimeline({ artifacts }: ArchaeologicalTimelineProps) {
  const [range, setRange] = useState<[number, number]>([-5000, 2024]);
  
  // Basic era parsing (very rough for demo)
  const parsedArtifacts = useMemo(() => {
    return artifacts.map(a => {
      let year = 2000;
      const era = (a.estimatedEra || '').toLowerCase();
      const match = era.match(/\d+/);
      if (match) {
        year = parseInt(match[0]);
        if (era.includes('bc') || era.includes('bce')) year = -year;
      } else if (era.includes('medieval')) year = 1000;
      else if (era.includes('bronze')) year = -2000;
      else if (era.includes('iron')) year = -1000;
      
      return { ...a, year };
    }).sort((a, b) => a.year - b.year);
  }, [artifacts]);

  const filtered = parsedArtifacts.filter(a => a.year >= range[0] && a.year <= range[1]);

  return (
    <div className="glass-card rounded-[3.5rem] p-10 md:p-14 space-y-12 bg-white/40 border-white shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 font-display">Neural <span className="text-indigo-600">Timeline</span></h2>
          </div>
          <p className="text-slate-500 max-w-md text-sm font-medium leading-relaxed">
            Visualizing the temporal distribution of human achievement. Slide the markers to filter artifacts across millennia.
          </p>
        </div>

        <div className="w-full md:w-96 space-y-6">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{range[0] < 0 ? `${Math.abs(range[0])} BC` : `${range[0]} AD`}</span>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{range[1] < 0 ? `${Math.abs(range[1])} BC` : `${range[1]} AD`}</span>
          </div>
          <div className="relative h-2 bg-slate-100 rounded-full">
            <input 
              type="range" 
              min="-5000" 
              max="2024" 
              value={range[0]} 
              onChange={(e) => setRange([parseInt(e.target.value), range[1]])}
              className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto h-2 cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
            />
            <input 
              type="range" 
              min="-5000" 
              max="2024" 
              value={range[1]} 
              onChange={(e) => setRange([range[0], parseInt(e.target.value)])}
              className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto h-2 cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-rose-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 hidden md:block" />
        
        <div className="space-y-12 relative z-10">
          {filtered.map((a, idx) => (
            <motion.div 
              key={a.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className="flex-1 text-right">
                {idx % 2 === 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-black text-indigo-600 font-mono">{a.estimatedEra}</span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{a.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 max-w-sm ml-auto">{a.description}</p>
                  </div>
                )}
              </div>

              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden radiant-gradient p-1">
                  <img src={a.imageUrl} className="w-full h-full object-cover rounded-full" alt="" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white px-3 py-1 rounded-full shadow-md border border-slate-50">
                  <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600">{a.civilization}</span>
                </div>
              </div>

              <div className="flex-1 text-left">
                {idx % 2 !== 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-black text-rose-500 font-mono">{a.estimatedEra}</span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{a.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 max-w-sm">{a.description}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 italic text-slate-400">
               No artifacts discovered within this temporal window.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
