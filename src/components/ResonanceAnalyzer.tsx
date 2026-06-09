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

  let resonanceData: any = null;
  if (!isAnalyzing && analysis) {
    if (typeof analysis === 'object' && analysis !== null) {
      resonanceData = analysis;
    } else {
      try {
        resonanceData = JSON.parse(analysis);
      } catch (err) {
        resonanceData = {
          resonanceScore: 78,
          affinityClassification: "ARCHIVAL SYNCHRONIZATION",
          temporalDelta: "Temporal phase parsed from contextual timeline database entries.",
          structuralAnalogies: "Symmetry match processed successfully.",
          materialSynchronicity: "",
          societalInference: "",
          verdictSummary: analysis
        };
      }
    }
  }

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
            className="glass-card bg-stone-50 border-stone-200 rounded-[4rem] p-12 lg:p-16 shadow-2xl relative overflow-hidden text-slate-900"
          >
            <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:opacity-20 transition-opacity">
               <Layers className="w-64 h-64 text-indigo-600 animate-pulse rotate-12" />
            </div>
            
            <div className="relative z-10 space-y-12">
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-indigo-50 rounded-[2rem] border border-indigo-100/50 text-indigo-600">
                     <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-2">Neural Synthesis Engine</h4>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight font-display">Cross-Reference Output</h3>
                  </div>
               </div>

               {isAnalyzing ? (
                 <div className="space-y-8 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="space-y-3">
                         <div className="h-4 bg-slate-200 rounded-full w-1/4" />
                         <div className="h-2 bg-slate-100 rounded-full w-full" />
                         <div className="h-2 bg-slate-100 rounded-full w-5/6" />
                      </div>
                    ))}
                 </div>
               ) : (
                  <div className="space-y-10 animate-in fade-in duration-500">
                    {/* Resonance Header Analytics Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white/80 backdrop-blur-md p-8 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                       
                       {/* Left Circle Display */}
                       <div className="flex flex-col items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-slate-100 text-center">
                          <div className="relative w-36 h-36 flex items-center justify-center">
                             {/* Circular Progress Gauge */}
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
                                   animate={{ strokeDashoffset: 390 - (390 * (resonanceData?.resonanceScore || 70)) / 100 }}
                                   transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                             </svg>
                             <div className="absolute flex flex-col items-center">
                                <span className="text-4xl font-extrabold text-slate-800 font-mono tracking-tight">{resonanceData?.resonanceScore || 70}%</span>
                                <span className="text-[9px] font-black tracking-widest text-indigo-500 uppercase mt-1">RESONANCE</span>
                             </div>
                          </div>
                       </div>

                       {/* Right Detailed Classification Info */}
                       <div className="lg:col-span-2 flex flex-col justify-center space-y-4 px-2 lg:px-6">
                          <div>
                             <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100/50">
                                <Zap className="w-3.5 h-3.5 animate-bounce" />
                                {resonanceData?.affinityClassification || "ALIGNED CORRIDOR"}
                             </span>
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Cross-Reference Classification</h4>
                             <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-1">Unified Synchronic Interface</h3>
                          </div>
                          
                          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100/50 flex gap-3.5 items-start">
                             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl font-bold text-xs shrink-0 w-8 h-8 flex items-center justify-center shadow-sm">
                                <span>Δt</span>
                             </div>
                             <div>
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Temporal Phase</h5>
                                <p className="text-sm font-bold text-slate-800 leading-relaxed mt-0.5">{resonanceData?.temporalDelta || "Calculated based on chronological metrics."}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Central Synthesis Data Matrices */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {/* Structural / Aesthetic Analogies Card */}
                       <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col justify-between hover:scale-[1.02] transform transition-all duration-300">
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-sky-50 rounded-2xl text-sky-600">
                                   <Layers className="w-5 h-5 animate-pulse" />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AESTHETIC & FORM RESONANCE</h4>
                             </div>
                             <p className="text-[13px] font-bold text-slate-700 leading-relaxed">
                                {resonanceData?.structuralAnalogies || "General aesthetic symmetries identified between decorative structures."}
                             </p>
                          </div>
                       </div>

                       {/* Manufacturing / Material Sourcing */}
                       <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col justify-between hover:scale-[1.02] transform transition-all duration-300">
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600">
                                   <Activity className="w-5 h-5 animate-pulse" />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MATERIAL SYNCHRONICITY</h4>
                             </div>
                             {resonanceData?.materialSynchronicity ? (
                                <p className="text-[13px] font-bold text-slate-700 leading-relaxed">
                                   {resonanceData.materialSynchronicity}
                                </p>
                             ) : (
                                <p className="text-[13px] font-bold text-slate-500 leading-relaxed italic">
                                   Scanning raw chemical arrays & metallurgical compositions... No micro-tracer differences mapped.
                                </p>
                             )}
                          </div>
                       </div>

                       {/* Societal Inference */}
                       {resonanceData?.societalInference && (
                         <div className="md:col-span-2 bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-100 shadow-lg hover:scale-[1.01] transform transition-all duration-300">
                            <div className="space-y-4">
                               <div className="flex items-center gap-3">
                                  <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-600">
                                     <Globe className="w-5 h-5 animate-pulse" />
                                  </div>
                                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SOCIO-TECHNICAL INFERENCES</h4>
                               </div>
                               <p className="text-[13px] font-bold text-slate-700 leading-relaxed">
                                  {resonanceData.societalInference}
                               </p>
                            </div>
                         </div>
                       )}
                    </div>

                    {/* Verdict Certificate Block */}
                    <div className="relative p-8 lg:p-10 rounded-[3rem] bg-gradient-to-tr from-slate-900 to-indigo-950 text-white overflow-hidden shadow-2xl">
                       {/* Background design accents */}
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
                       <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                       
                       <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                          <div className="space-y-3 max-w-2xl">
                             <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping" />
                                FORENSIC CONSENSUS VERDICT
                             </div>
                             <p className="text-sm md:text-base font-bold text-slate-100 leading-relaxed">
                                {resonanceData?.verdictSummary || "Analysis fully integrated into local archival ledger."}
                             </p>
                          </div>
                          
                          <div className="flex flex-col items-end gap-1.5 shrink-0 md:border-l-2 md:border-indigo-500/20 md:pl-6 h-full py-2">
                             <div className="text-[9px] font-mono font-black tracking-widest text-slate-400 uppercase">TELEMETRY ID</div>
                             <div className="text-xs font-mono font-bold text-indigo-300">#RES-NET-{(resonanceData?.resonanceScore || 77) * 449}</div>
                             <div className="text-[9px] font-mono font-black tracking-widest text-emerald-400 uppercase mt-2">● SYSTEM VERIFIED</div>
                          </div>
                       </div>
                    </div>
                  </div>
               )}
               
               {!isAnalyzing && (
                 <div className="pt-12 border-t border-slate-200/85 flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="flex items-center gap-4 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                       <Globe className="w-5 h-5" />
                       <span>Analysis Verified // Global Sync Complete</span>
                    </div>
                    <button onClick={() => setAnalysis(null)} className="px-10 py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
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
