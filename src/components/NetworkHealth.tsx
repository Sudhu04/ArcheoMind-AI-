import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Server, Database, Globe, Zap, ShieldCheck, AlertCircle } from 'lucide-react';

const NetworkHealth: React.FC = () => {
  const [nodes, setNodes] = useState([
    { id: 'Node-Alpha', region: 'NA-East', status: 'optimal', load: 42, latency: 12 },
    { id: 'Node-Beta', region: 'EU-Central', status: 'optimal', load: 18, latency: 45 },
    { id: 'Node-Gamma', region: 'ASIA-South', status: 'warning', load: 88, latency: 124 },
    { id: 'Node-Delta', region: 'AU-East', status: 'optimal', load: 31, latency: 62 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        load: Math.max(10, Math.min(95, node.load + (Math.random() * 10 - 5))),
        latency: Math.max(5, Math.min(200, node.latency + (Math.random() * 20 - 10)))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Infrastructure Telemetry</h4>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 font-display">System Resilience</h2>
        </div>
        <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl border-2 border-emerald-100 flex items-center gap-3">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest">Neural Link Steady</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            layout
            className="glass-card p-6 rounded-[2.5rem] border-white shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between">
               <div className="p-3 bg-slate-50 rounded-2xl">
                  <Server className="w-5 h-5 text-slate-400" />
               </div>
               <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                 node.status === 'optimal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
               }`}>
                 {node.status}
               </div>
            </div>

            <div>
               <h4 className="font-black text-slate-900 tracking-tight">{node.id}</h4>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{node.region}</p>
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                     <span className="text-slate-400">Computational Load</span>
                     <span className="text-slate-900">{node.load.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <motion.div 
                       animate={{ width: `${node.load}%` }}
                       className={`h-full ${node.load > 80 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                     />
                  </div>
               </div>

               <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                     <Zap className="w-3 h-3 text-indigo-400" />
                     <span className="text-[10px] font-black tabular-nums">{node.latency.toFixed(0)}ms</span>
                  </div>
                  <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Ping Response</div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 glass-card rounded-[3rem] p-10 bg-slate-900 border-slate-800 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
               <Activity className="w-24 h-24 text-white/5" />
            </div>
            <div className="relative z-10 space-y-8">
               <div className="flex items-center gap-4">
                  <Globe className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-xl font-black tracking-tight">Global Archival Throughput</h3>
               </div>
               
               <div className="flex flex-wrap gap-12">
                  <div className="space-y-1">
                     <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Sync Rate</div>
                     <div className="text-4xl font-black tracking-tighter tabular-nums">99.98<span className="text-xl opacity-40">%</span></div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Data Integrity</div>
                     <div className="text-4xl font-black tracking-tighter tabular-nums">SHA-512<span className="text-xl opacity-40">++</span></div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Threat Level</div>
                     <div className="text-4xl font-black tracking-tighter tabular-nums">ZERO</div>
                  </div>
               </div>

               <div className="pt-4 flex items-center gap-6">
                  <div className="flex-1 h-32 bg-white/5 rounded-2xl border border-white/5 flex items-end gap-1 p-4">
                     {[...Array(20)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: `${20 + Math.random() * 80}%` }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                          className="flex-1 bg-indigo-500/40 rounded-t-sm" 
                        />
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className="glass-card rounded-[3rem] p-8 border-white bg-white/70 space-y-8">
            <div className="flex items-center gap-4">
               <ShieldCheck className="w-6 h-6 text-indigo-600" />
               <h3 className="text-xl font-black tracking-tight text-slate-900">Security Layers</h3>
            </div>

            <div className="space-y-4">
               {[
                 { label: 'Neural Encryption', status: 'Active' },
                 { label: 'Biometric Handshake', status: 'Verified' },
                 { label: 'Blockchain Ledger', status: 'Synced' },
                 { label: 'Quantum Shielding', status: 'Primed' }
               ].map((layer, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-white">
                    <span className="text-xs font-bold text-slate-700">{layer.label}</span>
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{layer.status}</span>
                 </div>
               ))}
            </div>

            <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-4">
               <AlertCircle className="w-5 h-5 text-rose-500 mt-1" />
               <div>
                  <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Notice // T-42</h5>
                  <p className="text-[10px] font-medium text-rose-500 leading-tight">Routine maintenance scheduled for the Gamma Node in 18 hours. Potential sync drift of &lt;0.01% expected.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default NetworkHealth;
