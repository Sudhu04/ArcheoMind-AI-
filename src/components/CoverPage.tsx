import React from 'react';
import { motion } from 'motion/react';
import { Compass, ArrowRight, Sparkles } from 'lucide-react';

interface CoverPageProps {
  onEnter: () => void;
}

export default function CoverPage({ onEnter }: CoverPageProps) {
  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 4, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img 
            src="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80&w=2000" 
            alt="Ancient Discovery" 
            className="w-full h-full object-cover saturate-0 contrast-150 mix-blend-overlay opacity-60"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        {/* Dynamic Scanning Line */}
        <motion.div 
          animate={{ y: ['0%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 inset-x-0 h-[2px] bg-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.5)] z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.1),transparent)]" />
      </div>

      <div className="relative z-20 text-center space-y-16 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative inline-flex items-center justify-center p-8 lg:p-12"
        >
          {/* Animated Rings */}
          <div className="absolute inset-0 border border-indigo-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-2 border border-indigo-500/5 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
          
          <div className="w-32 h-32 lg:w-40 lg:h-40 bg-indigo-500/10 backdrop-blur-3xl rounded-[3rem] border border-indigo-500/20 flex items-center justify-center relative group">
            <Compass className="w-16 h-16 text-indigo-400 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </motion.div>

        <div className="space-y-6">
          <div className="space-y-2">
             <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex items-center justify-center gap-4 mb-4"
             >
                <div className="h-[1px] w-12 bg-indigo-500/40" />
                <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em]">Neural Gateway Protocol // v5.2</span>
                <div className="h-[1px] w-12 bg-indigo-500/40" />
             </motion.div>
             <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="text-[5rem] md:text-[9rem] font-black tracking-tighter font-display leading-[0.8] text-white"
            >
              ARCHEO<span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(99,102,241,1)' }}>MIND</span>
            </motion.h1>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.4 }}
            className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Synthesizing lost histories through advanced <span className="text-white">Spatial Archeology</span> and neural mapping.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <button 
            onClick={onEnter}
            className="group relative px-16 py-7 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 bg-white text-slate-950 font-black uppercase tracking-[0.4em] text-[11px]"
          >
            <div className="absolute inset-0 bg-transparent translate-y-full group-hover:translate-y-0 bg-indigo-600 transition-transform duration-500" />
            <span className="relative z-10 flex items-center gap-6 group-hover:text-white transition-colors">
              Initiate Neural Link
              <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
            </span>
          </button>
        </motion.div>
      </div>

      {/* Cybernetic HUD Elements */}
      <div className="absolute top-12 left-12 space-y-4 opacity-40 hidden lg:block">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-white font-mono tracking-widest uppercase">System Status: Nominal</span>
        </div>
        <div className="w-48 h-[1px] bg-gradient-to-r from-indigo-500 to-transparent" />
      </div>

      <div className="absolute bottom-12 right-12 text-right opacity-40 hidden lg:block">
        <span className="text-[10px] text-white font-mono tracking-[0.5em] uppercase block mb-4">Neural Signature</span>
        <div className="flex gap-2 justify-end">
           {[...Array(5)].map((_, i) => (
             <motion.div key={i} animate={{ height: [10, 30, 10] }} transition={{ duration: 1 + Math.random(), repeat: Infinity }} className="w-1 bg-indigo-500/50" />
           ))}
        </div>
      </div>
    </div>
  );
}
