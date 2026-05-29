import React from 'react';
import { motion } from 'motion/react';
import { Shield, AlertCircle, CheckCircle, Clock, MapPin, Activity } from 'lucide-react';

const SITES = [
  { name: 'Hampi Monuments', status: 'critical', preservation: 65, threat: 'Erosion', region: 'Karnataka' },
  { name: 'Konark Sun Temple', status: 'stable', preservation: 88, threat: 'Salt Air', region: 'Odisha' },
  { name: 'Dholavira', status: 'monitoring', preservation: 72, threat: 'Excavation Exposure', region: 'Gujarat' },
  { name: 'Ajanta Caves', status: 'improving', preservation: 82, threat: 'Humidity', region: 'Maharashtra' }
];

export const HeritageStatus: React.FC = () => {
  return (
    <div className="glass-effect-dark rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
             <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">Preservation Monitor</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-none mt-1">Heritage Site Integrity Tracking</p>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
           <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Status: YELLOW</span>
        </div>
      </div>

      <div className="space-y-4">
        {SITES.map((site) => (
          <div key={site.name} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{site.name}</span>
              </div>
              <div className="flex items-center gap-2">
                 {site.status === 'critical' ? (
                   <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                 ) : (
                   <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                 )}
                 <span className={`text-[10px] font-black uppercase tracking-widest ${
                   site.status === 'critical' ? 'text-rose-500' : 'text-emerald-500'
                 }`}>{site.status}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-500 uppercase tracking-widest">Integrity Matrix</span>
                <span className="text-white">{site.preservation}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${site.preservation}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full ${
                    site.preservation < 70 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' :
                    site.preservation < 85 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' :
                    'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  }`}
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
               <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span className="text-[9px] text-slate-400 font-medium">Last Scan: 2h ago</span>
               </div>
               <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-slate-500" />
                  <span className="text-[9px] text-slate-400 font-medium">Primary Threat: {site.threat}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-3 group/btn relative overflow-hidden"
      >
        <span className="relative z-10">Download Protection Report</span>
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse relative z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
      </motion.button>
    </div>
  );
};
