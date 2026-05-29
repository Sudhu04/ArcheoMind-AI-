import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Sparkles, TrendingUp, AlertCircle, Calendar, ChevronRight, Globe, Zap } from 'lucide-react';
import { Artifact, User } from '../types';
import { runAI } from '../services/geminiService';

interface AIBriefingProps {
  artifacts: Artifact[];
  currentUser: User;
}

export default function AIBriefing({ artifacts, currentUser }: AIBriefingProps) {
  const [briefing, setBriefing] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeInsight, setActiveInsight] = useState(0);

  const insights = [
    { label: 'Neural Sync', value: 'Perfect', icon: <Zap className="w-4 h-4" /> },
    { label: 'Discovery Trend', value: '+12%', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Archive Integrity', value: '99.9%', icon: <AlertCircle className="w-4 h-4" /> }
  ];

  useEffect(() => {
    async function generateBriefing() {
      try {
        const artifactContext = artifacts.slice(0, 5).map(a => `${a.name} (${a.civilization})`).join(', ');
        const prompt = `Generate a high-tech "Daily Archaeological Intelligence Briefing" for Researcher ${currentUser.name}. 
        Mention these recent artifacts: ${artifactContext}.
        Speak in a sophisticated, cyber-archaeology tone. 
        Focus on: "Neural Resonance Patterns", "Provenience Accuracy", and "Cultural Connectivity". 
        Keep it to about 3-4 powerful sentences.`;

        const responseText = await runAI(prompt);
        setBriefing(responseText || "System briefing unavailable. Core neural links stabilizing...");
      } catch (err) {
        console.error(err);
        setBriefing("System briefing unavailable. Core neural links stabilizing...");
      } finally {
        setIsLoading(false);
      }
    }

    generateBriefing();
  }, [artifacts, currentUser.name]);

  return (
    <div className="glass-card rounded-[3.5rem] p-1 bg-white/50 border-4 border-white shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 flex items-center gap-2 opacity-20">
         <div className="flex -space-x-1">
           {[...Array(4)].map((_, i) => <div key={i} className="w-1 h-3 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 p-10">
        <div className="flex-1 space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 radiant-gradient rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 border border-white/20">
                <Bot className="w-8 h-8" />
             </div>
             <div>
                <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1">Intelligence Matrix</h3>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display">Daily Briefing</h2>
             </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-indigo-500/20 rounded-full" />
            {isLoading ? (
              <div className="space-y-3">
                 <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse" />
                 <div className="h-4 bg-slate-100 rounded-full w-[90%] animate-pulse" />
                 <div className="h-4 bg-slate-100 rounded-full w-[80%] animate-pulse" />
              </div>
            ) : (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg text-slate-600 font-medium leading-relaxed italic pr-8"
              >
                {briefing}
              </motion.p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
             {insights.map((insight, idx) => (
                <div key={idx} className="px-5 py-3 bg-white/60 border border-slate-100 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                   <div className="text-indigo-500">{insight.icon}</div>
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{insight.label}</span>
                      <span className="text-xs font-black text-slate-800 leading-none">{insight.value}</span>
                   </div>
                </div>
             ))}
          </div>
        </div>

        <div className="w-full lg:w-80 glass-card bg-slate-900 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group/mini">
          <div className="absolute inset-0 radiant-gradient opacity-0 group-hover/mini:opacity-10 transition-opacity" />
          <div className="relative z-10 space-y-6">
             <div className="flex justify-between items-start">
                <Globe className="w-8 h-8 text-indigo-400 opacity-50" />
                <Sparkles className="w-5 h-5 text-indigo-500" />
             </div>
             <div>
                <h4 className="text-white font-black text-lg tracking-tight">Active Nodes</h4>
                <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mt-1">Global Coverage Map</p>
             </div>
             <div className="grid grid-cols-5 gap-2 h-12 items-end">
                {Array.from({ length: 10 }).map((_, i) => (
                   <div 
                      key={i} 
                      className="bg-indigo-500/30 rounded-full w-full"
                      style={{ height: `${20 + Math.random() * 80}%` }}
                   />
                ))}
             </div>
          </div>
          <button className="relative z-10 w-full py-4 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
             View Global Feeds
          </button>
        </div>
      </div>
    </div>
  );
}
