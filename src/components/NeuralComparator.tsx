import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Columns, 
  ArrowRightLeft, 
  Zap, 
  Info, 
  ShieldAlert, 
  Sparkles, 
  Activity, 
  Layers, 
  Globe, 
  Hourglass, 
  ShieldCheck, 
  Cpu 
} from 'lucide-react';
import { Artifact } from '../types';

interface NeuralComparatorProps {
  artifacts: Artifact[];
}

const NeuralComparator: React.FC<NeuralComparatorProps> = ({ artifacts }) => {
  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [selectedB, setSelectedB] = useState<string | null>(null);
  
  // Advanced Simulation states for syncing
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);

  const artA = artifacts.find(a => a.id === selectedA);
  const artB = artifacts.find(a => a.id === selectedB);

  // Trigger loading projection flow when two nodes are matched
  useEffect(() => {
    if (artA && artB) {
      setIsSyncing(true);
      setSyncStep(0);
      
      const interval = setInterval(() => {
        setSyncStep((prev) => {
          if (prev >= 3) {
            clearInterval(interval);
            setIsSyncing(false);
            return prev;
          }
          return prev + 1;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setIsSyncing(false);
      setSyncStep(0);
    }
  }, [selectedA, selectedB]);

  const calculateSimilarity = () => {
    if (!artA || !artB) return 0;
    
    // Deterministic pseudo-random generation based on names
    let seed = 0;
    const combinedStr = (artA.name + artB.name + artA.type + artB.type);
    for (let i = 0; i < combinedStr.length; i++) {
      seed += combinedStr.charCodeAt(i);
    }
    
    let baseScore = 32;
    if (artA.type === artB.type) baseScore += 35;
    if (artA.civilization === artB.civilization) baseScore += 20;
    
    // Seed variance
    const variance = (seed % 129) / 10; // 0 to 12.9
    return Math.min(99.1, baseScore + variance);
  };

  const getSyncProgressLabel = () => {
    switch (syncStep) {
      case 0: return "Establishing sub-atomic quantum pipeline...";
      case 1: return "Parsing isotopic stratigraphic layers...";
      case 2: return "Evaluating aesthetic morph-symmetry index...";
      case 3: return "Formulating definitive differential matrix...";
      default: return "Initializing interface...";
    }
  };

  const similarityScore = calculateSimilarity();

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Differential Analysis</h4>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 font-display">Neural Comparator</h2>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-[1.2rem] border border-indigo-100">
          <Columns className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {['A', 'B'].map((slot) => {
          const setSelect = slot === 'A' ? setSelectedA : setSelectedB;
          const currentArt = slot === 'A' ? artA : artB;

          return (
            <div key={slot} className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synapse Node {slot}</h5>
                  {currentArt && (
                    <button 
                       onClick={() => setSelect(null)}
                       className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline hover:text-rose-600 transition-all select-none"
                    >
                       Reset Node
                    </button>
                  )}
               </div>

               {currentArt ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-[3rem] p-8 border-4 border-white shadow-2xl relative overflow-hidden group bg-white/80"
                  >
                     <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 border border-slate-100 shadow-inner bg-slate-50 relative">
                        <img 
                          src={currentArt.imageUrl} 
                          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                          alt="" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-full text-[8px] font-black text-indigo-300 uppercase tracking-widest shadow-lg border border-white/10">
                          {currentArt.civilization}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{currentArt.name}</h3>
                        <div className="flex flex-wrap gap-2 pt-1">
                           <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                              {currentArt.type}
                           </span>
                           <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-indigo-100/30">
                              Level {currentArt.rarityLevel} // Confidence: {currentArt.confidenceScore?.toFixed(1) || "94.5"}%
                           </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic font-medium opacity-90 block pt-1 border-t border-slate-100">
                          "{currentArt.description}"
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-3">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">Estimated Era</span>
                            <p className="text-xs font-bold text-slate-700 truncate">{currentArt.estimatedEra || "Indeterminate Epoch"}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">Geotech Stratum</span>
                            <p className="text-xs font-bold text-slate-700 truncate">{currentArt.stratigraphy?.layer || "Surface Holocene Layer"}</p>
                          </div>
                        </div>
                     </div>
                  </motion.div>
               ) : (
                  <div className="aspect-square glass-card rounded-[3rem] border-dashed border-4 border-slate-100 flex flex-col items-center justify-center p-12 text-center group transition-all hover:border-indigo-200 bg-white/50">
                     <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-slate-100">
                        <Zap className="w-8 h-8 text-slate-300 group-hover:text-indigo-400" />
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Awaiting Input Link</p>
                     
                     <div className="w-full max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {artifacts.filter(a => a.id !== (slot === 'A' ? selectedB : selectedA)).map(a => (
                           <button
                             key={a.id}
                             onClick={() => setSelect(a.id)}
                             className="w-full text-left p-3.5 hover:bg-indigo-50/60 rounded-2xl transition-all border border-slate-100 hover:border-indigo-100/50 flex items-center gap-3 group/btn"
                           >
                             <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-sm relative">
                               <img src={a.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                             </div>
                             <div className="truncate flex-1">
                               <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest truncate group-hover/btn:text-indigo-600">{a.name}</div>
                               <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{a.type} &bull; {a.civilization}</div>
                             </div>
                           </button>
                        ))}
                     </div>
                  </div>
               )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {artA && artB && isSyncing && (
           <motion.div
             key="sync-loader"
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -15 }}
             className="glass-card bg-indigo-950/5 border border-indigo-500/20 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center space-y-6 mt-12 shadow-inner"
           >
             <div className="relative flex items-center justify-center">
               <div className="w-16 h-16 rounded-full border-4 border-indigo-200/20 border-t-indigo-600 animate-spin" />
               <Cpu className="w-6 h-6 text-indigo-600 absolute animate-pulse" />
             </div>
             
             <div className="space-y-2">
               <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Differential Engine Active</h3>
               <p className="text-sm font-bold text-slate-700">{getSyncProgressLabel()}</p>
             </div>

             <div className="w-full max-w-sm bg-slate-100 h-1 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600"
                 initial={{ width: 0 }}
                 animate={{ width: `${(syncStep + 1) * 25}%` }}
                 transition={{ duration: 0.4 }}
               />
             </div>
           </motion.div>
        )}

        {artA && artB && !isSyncing && (
           <motion.div
             key="comparison-results"
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 30 }}
             className="relative pt-6"
           >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border-4 border-white shadow-2xl z-20">
                 <ArrowRightLeft className="w-6 h-6 text-indigo-400" />
              </div>
              
              <div className="glass-card bg-stone-50 border-stone-200 rounded-[4rem] p-12 lg:p-16 shadow-2xl relative overflow-hidden text-slate-900 space-y-12">
                 <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                    <Layers className="w-64 h-64 text-indigo-900 animate-pulse rotate-12" />
                 </div>

                 {/* Top Synchronic Header Row */}
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-indigo-50 rounded-[2rem] border border-indigo-100/50 text-indigo-600">
                       <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-1">Differential Output Synthesis</h4>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight font-display">Neural Forensic Evaluation</h3>
                    </div>
                 </div>

                 <div className="space-y-10">
                    {/* Primary Analytics Gauge Block */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white/90 backdrop-blur-md p-8 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                       
                       {/* Left Circle Display */}
                       <div className="flex flex-col items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-slate-100 text-center">
                          <div className="relative w-36 h-36 flex items-center justify-center">
                             <svg className="w-full h-full transform -rotate-90">
                                <circle
                                   cx="72"
                                   cy="72"
                                   r="62"
                                   stroke="rgba(241, 245, 249, 0.9)"
                                   strokeWidth="10"
                                   fill="transparent"
                                />
                                <motion.circle
                                   cx="72"
                                   cy="72"
                                   r="62"
                                   stroke="#4f46e5"
                                   strokeWidth="10"
                                   fill="transparent"
                                   strokeDasharray={390}
                                   initial={{ strokeDashoffset: 390 }}
                                   animate={{ strokeDashoffset: 390 - (390 * similarityScore) / 100 }}
                                   transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                             </svg>
                             <div className="absolute flex flex-col items-center">
                                <span className="text-4xl font-extrabold text-slate-800 font-mono tracking-tight">{similarityScore.toFixed(1)}%</span>
                                <span className="text-[8px] font-black tracking-widest text-indigo-500 uppercase mt-1">ALIGNMENT</span>
                             </div>
                          </div>
                       </div>

                       {/* Right Metadata Classification */}
                       <div className="lg:col-span-2 flex flex-col justify-center space-y-4 px-2 lg:px-6">
                          <div>
                             <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100/50">
                                <Activity className="w-3.5 h-3.5" />
                                {similarityScore > 75 
                                  ? "HIGH SYNAPTIC SYNERGY" 
                                  : similarityScore > 45 
                                  ? "CONVERGENT OUTLIER INDEX" 
                                  : "DISTAL EVOLUTIONARY PARALLEL"}
                             </span>
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Cross-Reference Prediction</h4>
                             <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                               {artA.civilization === artB.civilization ? "Intra-Civilizational Proximity Model" : "Inter-Regional Migration Link"}
                             </h3>
                          </div>
                          
                          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100/50 flex gap-3.5 items-start">
                             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl font-bold text-xs shrink-0 w-8 h-8 flex items-center justify-center shadow-sm">
                                <span>Str</span>
                             </div>
                             <div>
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Structural Paradigm</h5>
                                <p className="text-xs font-bold text-slate-800 leading-relaxed mt-0.5">
                                  Neural models detect {artA.type === artB.type ? 'identical functional layouts representing a unified craft convention.' : 'divergent functional styles mapped across distinct chemical patterns.'}
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Matrix Grid Card Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {/* Form/Aesthetic Analogies */}
                       <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col justify-between hover:scale-[1.02] transform transition-all duration-300">
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-sky-50 rounded-2xl text-sky-600">
                                   <Layers className="w-5 h-5" />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">AESTHETIC SCHEDULARITY</h4>
                             </div>
                             <p className="text-[13px] font-bold text-slate-700 leading-relaxed">
                                Linking <span className="font-extrabold text-indigo-600">{artA.name}</span> with <span className="font-extrabold text-indigo-600">{artB.name}</span> reveals a major structural overlap in <span className="italic">"{artA.type}"</span> motifs. Symmetry layers indicate both maintain comparable tactile handles with concentric perimeter engravings.
                             </p>
                          </div>
                       </div>

                       {/* Material Synchronicity */}
                       <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col justify-between hover:scale-[1.02] transform transition-all duration-300">
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600">
                                   <Activity className="w-5 h-5 animate-pulse" />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MINERALOGICAL MATRIX</h4>
                             </div>
                             <p className="text-[13px] font-bold text-slate-700 leading-relaxed">
                                Geological mapping assigns {artA.materialAnalysis || "organic clays"} in Node A vs {artB.materialAnalysis || "ceramic compositions"} in Node B. Spectrometric alignment predictions evaluate trace metal elements at roughly {(similarityScore * 0.95).toFixed(1)}% correlation, implying shared regional craft workshops.
                             </p>
                          </div>
                       </div>

                       {/* Chronological Delta */}
                       <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-100 shadow-lg hover:scale-[1.01] transform transition-all duration-300">
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-600">
                                   <Hourglass className="w-5 h-5" />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CHRONOLOGICAL DISPLACEMENT</h4>
                             </div>
                             <p className="text-[13px] font-bold text-slate-700 leading-relaxed">
                                Carbon timelines predict a delta threshold of approx. <span className="text-amber-600 font-extrabold">~{(Math.abs(artA.confidenceScore - artB.confidenceScore) * 1150).toFixed(1)} cycles</span>. Temporal horizons trace overlaps that coordinate during active sub-dynastic commercial networks.
                             </p>
                          </div>
                       </div>

                       {/* Spatial Inferences */}
                       <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-100 shadow-lg hover:scale-[1.01] transform transition-all duration-300">
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-600">
                                   <Globe className="w-5 h-5" />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GEOSPATIAL SPAN</h4>
                             </div>
                             <p className="text-[13px] font-bold text-slate-700 leading-relaxed">
                                {artA.location && artB.location ? (
                                  `Inter-transit path calculated at approx ${Math.sqrt(Math.pow((artA.location.lat - artB.location.lat), 2) + Math.pow((artA.location.lng - artB.location.lng), 2)).toFixed(2)} decimal coordinates. This outlines systemic structural integration likely routed through historical dry-port corridors.`
                                ) : (
                                  `Geospatial nodes indicate an administrative proximity map. This indicates both artifacts likely circulated across similar trade networks linked through the regional capital.`
                                )}
                             </p>
                          </div>
                       </div>
                    </div>

                    {/* Verdict Certificate Block */}
                    <div className="relative p-8 lg:p-10 rounded-[3rem] bg-gradient-to-tr from-slate-900 to-indigo-950 text-white overflow-hidden shadow-2xl">
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
                       <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                       
                       <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                          <div className="space-y-3 max-w-2xl">
                             <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                                <ShieldCheck className="w-4.5 h-4.5" />
                                FORENSIC NEURAL DIAGNOSIS CONSENSUS
                             </div>
                             <p className="text-sm md:text-base font-bold text-slate-100 leading-relaxed">
                                Comparison of {artA.name} and {artB.name} supports a {similarityScore > 65 ? "significant physical lineage congruence" : "divergent yet highly compatible regional craft convention"}. These structures successfully qualify standard academic verification criteria.
                             </p>
                          </div>
                          
                          <div className="flex flex-col items-end gap-1.5 shrink-0 md:border-l-2 md:border-indigo-500/20 md:pl-6 h-full py-2">
                             <div className="text-[9px] font-mono font-black tracking-widest text-slate-400 uppercase">NET COMPARISON REFERENCE</div>
                             <div className="text-xs font-mono font-bold text-indigo-300">#RES-NC-{(similarityScore * 312).toFixed(0)}</div>
                             <div className="text-[9px] font-mono font-black tracking-widest text-emerald-400 uppercase mt-2">● SYNAPTIC VERIFIED</div>
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
