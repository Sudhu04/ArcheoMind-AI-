import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Columns, ArrowRightLeft, Sparkles, X } from 'lucide-react';
import { Artifact } from '../types';
import { runAI } from '../services/geminiService';

interface ComparativeAnalyzerProps {
  artifacts: Artifact[];
  onClose: () => void;
}

export default function ComparativeAnalyzer({ artifacts, onClose }: ComparativeAnalyzerProps) {
  const [selected, setSelected] = useState<[string | null, string | null]>([null, null]);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const art1 = artifacts.find(a => a.id === selected[0]);
  const art2 = artifacts.find(a => a.id === selected[1]);

  const handleAnalyze = async () => {
    if (!art1 || !art2) return;
    setIsLoading(true);
    try {
      const prompt = `Compare these two archaeological artifacts:
      1. ${art1.name} (${art1.civilization}, ${art1.estimatedEra}) - ${art1.description}
      2. ${art2.name} (${art2.civilization}, ${art2.estimatedEra}) - ${art2.description}
      
      Provide a sophisticated comparative analysis in 3 sections.`;

      const responseText = await runAI(prompt);
      setAnalysis(responseText || "Neural comparison matrix failed to stabilize.");
    } catch (err) {
      console.error(err);
      setAnalysis("Neural comparison matrix failed to stabilize.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-3xl flex items-center justify-center p-6 md:p-20"
    >
      <div className="w-full max-w-7xl h-full glass-card bg-white rounded-[4rem] border-8 border-white shadow-2xl flex flex-col overflow-hidden">
        <div className="p-10 radiant-gradient flex items-center justify-between text-white">
           <div className="flex items-center gap-6">
              <ArrowRightLeft className="w-8 h-8" />
              <h2 className="text-4xl font-black font-display">Neural Comparative Analyzer</h2>
           </div>
           <button onClick={onClose} className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-all"><X className="w-8 h-8" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-12 space-y-16">
           {selected[0] && selected[1] && !analysis && (
             <button onClick={handleAnalyze} disabled={isLoading} className="btn-primary w-full py-6">
                {isLoading ? "Running Sweep..." : "Initialize Analysis"}
             </button>
           )}
           {analysis && (
             <div className="p-12 bg-indigo-50 rounded-[3rem]">
                <p className="text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{analysis}</p>
             </div>
           )}
           <div className="grid grid-cols-6 gap-6">
              {artifacts.map(a => (
                <button key={a.id} onClick={() => {
                  if (selected[0] === a.id) setSelected([null, selected[1]]);
                  else if (selected[1] === a.id) setSelected([selected[0], null]);
                  else if (!selected[0]) setSelected([a.id, selected[1]]);
                  else if (!selected[1]) setSelected([selected[0], a.id]);
                }} className={`aspect-square rounded-2xl overflow-hidden border-4 ${selected.includes(a.id) ? 'border-indigo-500' : 'border-white'}`}>
                   <img src={a.imageUrl} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
