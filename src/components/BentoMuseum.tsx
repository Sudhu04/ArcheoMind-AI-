import React, { useState } from 'react';
import { Artifact } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Sparkles, Filter, ChevronRight, LayoutGrid, Clock, Activity, Languages, Zap, Compass, Feather, X } from 'lucide-react';
import { EpigraphyTranslator } from './EpigraphyTranslator';
import { NeuralRestoration } from './NeuralRestoration';
import { VedicChronicles } from './VedicChronicles';
import { ArcheoPulse } from './ArcheoPulse';

interface BentoMuseumProps {
  artifacts: Artifact[];
}

type ResearchModule = 'epigraphy' | 'restoration' | 'chronicles' | null;

export default function BentoMuseum({ artifacts }: BentoMuseumProps) {
  const [activeModule, setActiveModule] = useState<ResearchModule>(null);

  const modules = [
    { id: 'epigraphy', name: 'Epigraphy Decoder', icon: <Languages className="w-5 h-5" />, color: 'bg-teal-500', desc: 'AI Script Translation' },
    { id: 'restoration', name: 'Neural Repair', icon: <Zap className="w-5 h-5" />, color: 'bg-purple-500', desc: 'Geometry Restoration' },
    { id: 'chronicles', name: 'Vedic Chronicles', icon: <Feather className="w-5 h-5" />, color: 'bg-amber-500', desc: 'Textual Correlation' },
  ];

  return (
    <div className="space-y-12 pb-24">
      {/* ArcheoPulse Live Ticker */}
      <ArcheoPulse />

      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-indigo-50 rounded-[1.5rem] border border-indigo-100 flex items-center justify-center shadow-lg shadow-indigo-100/50">
                <Sparkles className="w-6 h-6 text-indigo-600" />
             </div>
             <div className="flex flex-col">
                <h2 className="text-6xl font-black tracking-tight text-slate-900 font-display leading-none">Neural <span className="text-slate-300">Archives</span></h2>
                <div className="flex items-center gap-2 mt-2">
                   <div className="w-1 h-1 bg-indigo-500 rounded-full animate-ping" />
                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] leading-none">Cognitive Curator Online</p>
                </div>
             </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm flex items-center gap-2">
             <Filter className="w-4 h-4" />
             Filter Era
          </button>
        </div>
      </div>

      {/* New Research Module Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((mod) => (
          <button 
            key={mod.id}
            onClick={() => setActiveModule(mod.id as ResearchModule)}
            className="group relative h-32 rounded-3xl overflow-hidden border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${mod.color}`} />
            <div className="p-6 flex flex-col justify-between h-full text-left">
              <div className={`w-10 h-10 rounded-xl ${mod.color.replace('bg-', 'bg-')}/10 flex items-center justify-center ${mod.color.replace('bg-', 'text-')}`}>
                {mod.icon}
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-sm tracking-tight">{mod.name}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{mod.desc}</p>
              </div>
            </div>
            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[400px] gap-6">
        {/* Modal Overlay for Research Modules */}
        <AnimatePresence>
          {activeModule && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" 
                onClick={() => setActiveModule(null)}
              />
              <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="relative w-full max-w-6xl max-h-full bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
              >
                <button 
                  onClick={() => setActiveModule(null)}
                  className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="h-[80vh] overflow-y-auto">
                  {activeModule === 'epigraphy' && <EpigraphyTranslator />}
                  {activeModule === 'restoration' && <NeuralRestoration />}
                  {activeModule === 'chronicles' && <VedicChronicles />}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Large Feature Card: Neural Curation Engine */}
        <div className="md:col-span-2 md:row-span-2 glass-card border-white bg-white/80 rounded-[3.5rem] p-10 md:p-14 flex flex-col justify-between relative overflow-hidden group min-h-[500px] shadow-2xl shadow-indigo-100/40">
          <div className="absolute top-0 right-0 p-8 flex items-center gap-2">
            <div className="flex -space-x-1">
              {[1, 2, 3].map(i => <div key={i} className="w-1 h-4 bg-indigo-500/20 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
            </div>
            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Neural Sync: 99.8%</span>
          </div>

          <div className="relative z-10 space-y-6">
             <div className="flex items-center gap-2">
                <span className="px-5 py-1.5 radiant-gradient text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-indigo-100">Intelligent Exhibit</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-lg">Accuracy Focus</span>
             </div>
            <h3 className="text-6xl font-extrabold tracking-tight leading-[0.9] text-slate-900 font-display">ARCHIVAL <br/> <span className="text-indigo-600">SPOTLIGHT</span></h3>
            <p className="text-slate-500 text-base max-w-sm leading-relaxed font-medium">ArcheoMind AI's premier verified recoveries of early human civilizations. Reviewing isotopic data, stratigraphic preservation, and neural visual reconstructive models.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 relative z-10">
             {artifacts.slice(0, 2).map((a) => (
                <div key={a.id} className="space-y-4 group/item">
                   <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-100 relative">
                      <img src={a.imageUrl} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" alt={a.name} />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-white/50 shadow-sm flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black text-indigo-600">{a.confidenceScore}% Provenance</span>
                      </div>
                   </div>
                   <div className="space-y-1.5 pl-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <h4 className="text-sm font-black text-slate-800 tracking-tight truncate">{a.name}</h4>
                      </div>
                      <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest opacity-70">{a.civilization} // {a.estimatedEra}</p>
                   </div>
                </div>
             ))}
          </div>

          {/* Background Decorative */}
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.08),transparent)] pointer-events-none" />
          <div className="absolute bottom-12 right-12">
            <button className="flex items-center gap-3 text-indigo-100 bg-slate-900 px-8 py-4 rounded-[1.5rem] text-[11px] font-bold uppercase tracking-[0.2em] group hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
               Enter Virtual Lab <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Efficiency & Accuracy Analytics */}
        <div className="md:col-span-1 md:row-span-1 glass-card border-white/50 bg-slate-900 rounded-[3rem] p-10 flex flex-col justify-between min-h-[300px] group transition-all shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20">
               <div className="grid grid-cols-4 gap-1">
                  {[...Array(16)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ opacity: [0.2, 0.8, 0.2] }}
                      transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                      className="w-2 h-2 bg-indigo-400 rounded-full"
                    />
                  ))}
               </div>
            </div>
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 relative z-10">
               <Activity className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-4 relative z-10">
               <div>
                  <h4 className="text-4xl font-extrabold tracking-tight text-white font-display leading-[1.1]">ACCURACY <br/> CORE</h4>
                  <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-1">Neural Verification Engine</p>
               </div>
               <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white leading-none">99.98</span>
                  <span className="text-lg font-bold text-indigo-400">%</span>
               </div>
            </div>
        </div>

        {/* Accuracy Matrix Preview */}
        <div className="md:col-span-1 md:row-span-1 glass-card border-white bg-white/70 rounded-[3rem] p-10 relative overflow-hidden group min-h-[300px] shadow-xl shadow-indigo-50">
           <div className="flex flex-col h-full justify-between relative z-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl">
                      <LayoutGrid className="w-4 h-4 text-indigo-500" />
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cognitive Mapping</h4>
                 </div>
                 <div>
                    <h5 className="text-xl font-black text-slate-800 tracking-tight">Spatial Clusters</h5>
                    <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: '85%' }}
                         transition={{ duration: 2, ease: "easeOut" }}
                         className="h-full radiant-gradient"
                       />
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">85% Global Alignment Sync</p>
                 </div>
              </div>
              <div className="flex -space-x-4 pl-4 pt-4">
                 {artifacts.slice(0, 4).map((a, i) => (
                    <motion.div 
                      key={a.id} 
                      whileHover={{ scale: 1.2, zIndex: 50, y: -5 }}
                      className="w-14 h-14 rounded-full border-4 border-white shadow-xl overflow-hidden relative cursor-pointer group/avatar" 
                      style={{ zIndex: 10 - i }}
                    >
                       <img src={a.imageUrl} className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110" alt="" />
                    </motion.div>
                 ))}
              </div>
           </div>
           {/* Decorative Grid */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:10px_10px]" />
        </div>

        {/* Global Catalog Count */}
        <div className="md:col-span-1 md:row-span-1 glass-card border-indigo-100 bg-indigo-50 rounded-[3rem] p-10 flex flex-col justify-between min-h-[300px] shadow-inner relative overflow-hidden group">
           <div className="absolute -right-6 -top-6 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <Sparkles className="w-48 h-48 text-indigo-600 rotate-12" />
           </div>
           <div className="space-y-1 relative z-10">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Total Archives</h4>
              <div className="flex items-baseline gap-2">
                 <span className="text-7xl font-black text-slate-900 tracking-tighter">{artifacts.length.toString().padStart(2, '0')}</span>
                 <div className="flex flex-col">
                    <span className="text-xs font-black text-indigo-500 uppercase">Records</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Commited</span>
                 </div>
              </div>
           </div>
           <div className="space-y-4 relative z-10">
              <div className="flex gap-1.5 items-end h-8">
                 {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div 
                       key={i}
                       initial={{ height: '20%' }}
                       animate={{ height: [`${20 + Math.random() * 60}%`, `${40 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`] }}
                       transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                       className="flex-1 bg-indigo-200 rounded-full"
                    />
                 ))}
              </div>
              <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-[0.2em]">Neural Capacity: 12.4% Used</p>
           </div>
        </div>

        {/* Full Display Row */}
        <div className="md:col-span-2 md:row-span-1 glass-card border-white/50 bg-slate-50 rounded-[3.5rem] p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden group min-h-[300px]">
           <div className="flex-1 space-y-6">
              <h4 className="text-4xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.1]">RECENT <br/> <span className="text-slate-300">DISCOVERIES</span></h4>
              <button className="px-8 py-3.5 radiant-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 hover:scale-105 active:scale-[0.98] transition-all">
                Full Collection
              </button>
           </div>
           <div className="flex gap-6 overflow-hidden">
              {artifacts.slice(0, 3).map((a, i) => (
                 <motion.div 
                    key={a.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="w-40 h-40 shrink-0 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl relative group/img"
                 >
                    <img src={a.imageUrl} className="w-full h-full object-cover transition-transform duration-500" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-5">
                       <p className="text-[10px] font-bold text-white tracking-tight truncate">{a.name}</p>
                    </div>
                 </motion.div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
