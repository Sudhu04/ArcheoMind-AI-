
import React, { useState, useEffect } from 'react';
import { usageService, ApiUsage } from '../services/usageService';
import { motion } from 'motion/react';
import { Zap, Activity, DollarSign, Clock, TrendingUp, Cpu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function UsageDashboard() {
  const [usage, setUsage] = useState<ApiUsage>(usageService.getUsage());

  useEffect(() => {
    return usageService.subscribe(() => {
      setUsage(usageService.getUsage());
    });
  }, []);

  const calculateProgress = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getResetTimeRemaining = (resetTimeString: string) => {
    const now = new Date();
    const reset = new Date(resetTimeString);
    const diff = reset.getTime() - now.getTime();
    if (diff <= 0) return "Resetting now...";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Reset in ${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-8 mb-12">
      {/* Header Info */}
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[200px] glass-card p-6 rounded-3xl border-white bg-white/40 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Matrix Cost</span>
           </div>
           <p className="text-3xl font-black text-slate-900 tracking-tighter">${(usage.gemini.spend + usage.openRouter.spend + (usage.nvidia?.spend || 0)).toFixed(4)}</p>
        </div>
        <div className="flex-1 min-w-[200px] glass-card p-6 rounded-3xl border-white bg-white/40 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Throughput</span>
           </div>
           <p className="text-3xl font-black text-slate-900 tracking-tighter">{(usage.gemini.tokens + usage.openRouter.tokens + (usage.nvidia?.tokens || 0)).toLocaleString()} <span className="text-xs font-bold text-slate-400 tracking-normal">tokens</span></p>
        </div>
        <div className="flex-1 min-w-[200px] glass-card p-6 rounded-3xl border-white bg-white/40 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Providers</span>
           </div>
           <p className="text-3xl font-black text-slate-900 tracking-tighter">3 <span className="text-xs font-bold text-slate-400 tracking-normal">Engines</span></p>
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[2.5rem] p-8 border-white bg-white/50 shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight font-display">Neural Flow Analysis</h3>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Real-time token & cost distribution</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Daily Synthesis Cost</p>
            <p className="text-2xl font-black text-slate-900">${(usage.gemini.spend + usage.openRouter.spend + (usage.nvidia?.spend || 0)).toFixed(4)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[300px]">
          {/* Token Usage Chart */}
          <div className="h-full">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Cpu className="w-3 h-3" />
              Token Throughput
            </p>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usage.history}>
                <defs>
                  <linearGradient id="colorGemini" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOpenRouter" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNvidia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#76b900" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#76b900" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="timestamp" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                  dy={10}
                />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '1rem', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    padding: '1rem'
                  }}
                  itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="geminiTokens" 
                  name="Gemini"
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorGemini)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="openRouterTokens" 
                  name="OpenRouter"
                  stroke="#0f172a" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorOpenRouter)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="nvidiaTokens" 
                  name="NVIDIA NIM"
                  stroke="#76b900" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorNvidia)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Spend Chart */}
          <div className="h-full">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <DollarSign className="w-3 h-3" />
              Accumulated Spend ($)
            </p>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usage.history}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="timestamp" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                  dy={10}
                />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '1rem', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    padding: '1rem'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(6)}`, 'Spend']}
                  itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="geminiSpend" 
                  name="Gemini"
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSpend)" 
                />
                 <Area 
                  type="monotone" 
                  dataKey="openRouterSpend" 
                  name="OpenRouter"
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={0} 
                />
                 <Area 
                  type="monotone" 
                  dataKey="nvidiaSpend" 
                  name="NVIDIA NIM"
                  stroke="#76b900" 
                  strokeWidth={2}
                  fillOpacity={0} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gemini Usage */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[2.5rem] p-6 border-white bg-white/50 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight font-display">Gemini Matrix</h3>
                <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Primary Engine</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {getResetTimeRemaining(usage.gemini.resetTime)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Requests</p>
              <p className="text-lg font-black text-slate-900">{usage.gemini.requests.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Estimated Spend</p>
              <p className="text-lg font-black text-emerald-600">${usage.gemini.spend.toFixed(4)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Daily Request Limit</span>
                <span className="text-xs font-bold text-slate-700">{usage.gemini.requests} / {usage.gemini.limit}</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress(usage.gemini.requests, usage.gemini.limit)}%` }}
                  className={`h-full radiant-gradient rounded-full ${usage.gemini.requests > usage.gemini.limit * 0.8 ? 'from-amber-400 to-amber-600' : ''}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Max Token Throughput</span>
                <span className="text-xs font-bold text-slate-700">{usage.gemini.tokens.toLocaleString()} / {usage.gemini.maxTokens.toLocaleString()}</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress(usage.gemini.tokens, usage.gemini.maxTokens)}%` }}
                  className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* OpenRouter Usage */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[2.5rem] p-6 border-white bg-white/50 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight font-display">OpenRouter Bypass</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Fallback Layer</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {getResetTimeRemaining(usage.openRouter.resetTime)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Requests</p>
              <p className="text-lg font-black text-slate-900">{usage.openRouter.requests.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Estimated Spend</p>
              <p className="text-lg font-black text-indigo-600">${usage.openRouter.spend.toFixed(4)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Daily Request Limit</span>
                <span className="text-xs font-bold text-slate-700">{usage.openRouter.requests} / {usage.openRouter.limit}</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress(usage.openRouter.requests, usage.openRouter.limit)}%` }}
                  className="h-full bg-slate-900 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Max Token Throughput</span>
                <span className="text-xs font-bold text-slate-700">{usage.openRouter.tokens.toLocaleString()} / {usage.openRouter.maxTokens.toLocaleString()}</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress(usage.openRouter.tokens, usage.openRouter.maxTokens)}%` }}
                  className="h-full bg-slate-700 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* NVIDIA NIM Usage */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[2.5rem] p-6 border-white bg-white/50 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight font-display">NVIDIA NIM</h3>
                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Failover Multi-Model Matrix</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {getResetTimeRemaining(usage.nvidia?.resetTime || usage.gemini.resetTime)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Requests</p>
              <p className="text-lg font-black text-slate-900">{(usage.nvidia?.requests || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Estimated Spend</p>
              <p className="text-lg font-black text-emerald-600">${(usage.nvidia?.spend || 0).toFixed(4)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Daily Request Limit</span>
                <span className="text-xs font-bold text-slate-700">{usage.nvidia?.requests || 0} / {usage.nvidia?.limit || 2000}</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress(usage.nvidia?.requests || 0, usage.nvidia?.limit || 2000)}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Max Token Throughput</span>
                <span className="text-xs font-bold text-slate-700">{(usage.nvidia?.tokens || 0).toLocaleString()} / {(usage.nvidia?.maxTokens || 800000).toLocaleString()}</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress(usage.nvidia?.tokens || 0, usage.nvidia?.maxTokens || 800000)}%` }}
                  className="h-full bg-emerald-600 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
