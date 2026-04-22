import React from 'react';
import { motion } from 'motion/react';
import { Compass, ArrowRight } from 'lucide-react';

interface CoverPageProps {
  onEnter: () => void;
}

export default function CoverPage({ onEnter }: CoverPageProps) {
  return (
    <div className="fixed inset-0 z-[200] bg-[#0C0B0A] flex items-center justify-center overflow-hidden">
      {/* Background Cinematic Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=2000" 
          alt="Ancient Ruins" 
          className="w-full h-full object-cover opacity-30 scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0B0A] via-transparent to-[#0C0B0A]" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Animated Particles/Dust */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{ 
              y: [null, Math.random() * -100],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="w-1 h-1 bg-[#D4AF37]/40 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-12 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="inline-flex items-center justify-center w-32 h-32 bg-[#D4AF37] rounded-[3rem] shadow-[0_0_100px_rgba(212,175,55,0.3)] mb-8"
        >
          <Compass className="w-16 h-16 text-[#0C0B0A]" />
        </motion.div>

        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-8xl md:text-9xl font-black tracking-tighter italic font-display leading-none text-white"
          >
            ARCHEO<span className="text-[#D4AF37]">MIND</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-[#D4AF37] text-sm md:text-lg font-black uppercase tracking-[0.5em] opacity-60"
          >
            Neural Gateway to the Ancient World
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <button 
            onClick={onEnter}
            className="group relative px-12 py-6 bg-transparent border-2 border-[#D4AF37]/30 rounded-full overflow-hidden transition-all hover:border-[#D4AF37] hover:shadow-[0_0_50px_rgba(212,175,55,0.2)]"
          >
            <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 flex items-center gap-4 text-[#D4AF37] group-hover:text-[#0C0B0A] font-black uppercase tracking-widest text-sm transition-colors">
              Initiate Neural Link
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="pt-20 flex flex-col items-center gap-4"
        >
          <div className="w-px h-20 bg-gradient-to-b from-[#D4AF37]/40 to-transparent" />
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Authorized Access Only</p>
        </motion.div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-12 left-12 w-24 h-24 border-t-2 border-l-2 border-[#D4AF37]/20 rounded-tl-[4rem]" />
      <div className="absolute bottom-12 right-12 w-24 h-24 border-b-2 border-r-2 border-[#D4AF37]/20 rounded-br-[4rem]" />
    </div>
  );
}
