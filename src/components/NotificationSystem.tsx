import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Zap, Info, ShieldCheck, Sparkles, X } from 'lucide-react';

export interface ResearchAlert {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  type: 'discovery' | 'update' | 'alert';
}

export default function NotificationSystem() {
  const [alerts, setAlerts] = useState<ResearchAlert[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simulated real-time alerts
    const timer = setTimeout(() => {
      const newAlert: ResearchAlert = {
        id: Math.random().toString(36).substring(7),
        title: 'Neural Resonance Spike',
        message: 'A significant discovery has been logged in the Mediterranean sector.',
        timestamp: Date.now(),
        type: 'discovery'
      };
      setAlerts(prev => [newAlert, ...prev]);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-white/50 hover:bg-white rounded-full transition-all relative group shadow-xl border border-white"
      >
        <Bell className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
        {alerts.length > 0 && (
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute top-full right-0 mt-6 w-80 glass-card bg-white rounded-[2.5rem] shadow-2xl border-white z-[100] overflow-hidden"
          >
            <div className="p-8 radiant-gradient text-white flex justify-between items-center">
               <div>
                  <h4 className="text-lg font-black tracking-tight leading-none">Neural Feed</h4>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-70 mt-1">Global Intelligence Stream</p>
               </div>
               <button onClick={() => setAlerts([])} className="text-[8px] font-black uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all">Clear All</button>
            </div>
            
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {alerts.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
                      <Zap className="w-8 h-8 text-slate-200" />
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No active anomalies detected</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {alerts.map(alert => (
                    <div key={alert.id} className="p-6 hover:bg-slate-50 transition-colors group">
                       <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-xl border ${
                            alert.type === 'discovery' ? 'bg-indigo-50 border-indigo-100 text-indigo-500' :
                            alert.type === 'alert' ? 'bg-rose-50 border-rose-100 text-rose-500' :
                            'bg-violet-50 border-violet-100 text-violet-500'
                          }`}>
                             {alert.type === 'discovery' ? <Sparkles className="w-3.5 h-3.5" /> :
                              alert.type === 'alert' ? <ShieldCheck className="w-3.5 h-3.5" /> :
                              <Info className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1 space-y-1">
                             <h5 className="text-[11px] font-black text-slate-900 tracking-tight">{alert.title}</h5>
                             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{alert.message}</p>
                             <span className="block text-[8px] font-bold text-slate-300 uppercase tracking-widest pt-1">Matrix Time: {new Date(alert.timestamp).toLocaleTimeString()}</span>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
