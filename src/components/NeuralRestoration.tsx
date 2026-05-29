import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Layers, History, ShieldCheck, Zap, Download, RefreshCw, Eye } from 'lucide-react';

export const NeuralRestoration: React.FC = () => {
  const [restorationLevel, setRestorationLevel] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setRestorationLevel(100);
      setIsProcessing(false);
    }, 2500);
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Neural Restoration Lab</h2>
            <p className="text-xs text-slate-400">Volumetric Infilling & Surface Repair</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-mono text-green-500 uppercase font-bold tracking-widest">Core Synchronized</span>
        </div>
      </div>

      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Layers className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold">Structural Recovery</h3>
                <p className="text-xs text-slate-400">Generative adversarial networks predicting missing geometry based on stylistic priors.</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="p-3 bg-pink-500/20 rounded-xl">
                <History className="w-6 h-6 text-pink-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold">Chrominance Correction</h3>
                <p className="text-xs text-slate-400">Recovery of original pigment data through deep spectroscopic simulation.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">RESTORATION INTENSITY</span>
              <span className="text-sm font-mono text-purple-400 font-bold">{restorationLevel}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={restorationLevel}
              onChange={(e) => setRestorationLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-bold tracking-wider">
              <span>RAW DATA</span>
              <span>COMPLETE RECONSTRUCTION</span>
            </div>
          </div>

          <button 
            onClick={handleProcess}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold flex items-center justify-center gap-3 hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl shadow-purple-500/20 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                DENSE POINT RECONSTRUCTION...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                INITIATE NEURAL REPAIR
              </>
            )}
          </button>
        </div>

        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative aspect-square rounded-3xl bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center">
            {/* Simulation of Before/After */}
            <div className="absolute inset-0 flex">
              <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1590050752117-23a9d7f66c3d?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center grayscale opacity-80" />
              <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1590050752117-23a9d7f66c3d?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
            </div>

            <div 
              className="absolute inset-0 bg-black backdrop-blur-[20px] transition-all duration-1000 pointer-events-none" 
              style={{ opacity: 1 - (restorationLevel / 100) }}
            />

            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Authenticity Guard Active</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="w-full h-1 bg-white/10 relative overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
