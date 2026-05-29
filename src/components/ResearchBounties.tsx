import React from 'react';
import { motion } from 'motion/react';
import { Target, Zap, Clock, ShieldCheck } from 'lucide-react';
import { Artifact, User } from '../types';

interface BountyProps {
  user: User;
  artifacts: Artifact[];
}

const ResearchBounties: React.FC<BountyProps> = ({ user, artifacts }) => {
  const userArtifacts = artifacts.filter(a => a.userId === user.id);
  const verifiedCount = userArtifacts.filter(a => a.isVerified).length;

  const bounties = [
    {
      id: 'b1',
      title: 'Vanguard Pulse',
      description: 'Log 5 distinct spatial fragments in the system.',
      target: 5,
      current: artifacts.length,
      reward: 500,
      icon: <Target className="w-5 h-5" />
    },
    {
      id: 'b2',
      title: 'Neural Integrity',
      description: 'Have 3 of your artifact records authenticated by admin.',
      target: 3,
      current: verifiedCount,
      reward: 1200,
      icon: <ShieldCheck className="w-5 h-5" />
    },
    {
       id: 'b3',
       title: 'Quick Recon',
       description: 'Analyze an artifact with over 90% AI confidence.',
       target: 1,
       current: userArtifacts.some(a => a.confidenceScore > 0.9) ? 1 : 0,
       reward: 350,
       icon: <Zap className="w-5 h-5" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
         <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Active Bounties</h4>
         <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <Clock className="w-3 h-3" />
            Resets in 14h 22m
         </div>
      </div>

      <div className="space-y-4">
        {bounties.map((b) => {
          const progress = Math.min(100, (b.current / b.target) * 100);
          const isComplete = progress === 100;

          return (
            <div key={b.id} className={`glass-card p-6 rounded-[2.5rem] border-2 transition-all ${isComplete ? 'border-emerald-100 bg-emerald-50/20' : 'border-white/50 bg-white/70'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                   <div className={`p-3 rounded-2xl ${isComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      {b.icon}
                   </div>
                   <div>
                      <h5 className="font-black text-slate-900 tracking-tight">{b.title}</h5>
                      <p className="text-[10px] font-medium text-slate-500 max-w-[180px] leading-tight mt-0.5">{b.description}</p>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-xs font-black text-indigo-600">+{b.reward}</div>
                   <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Synapse</div>
                </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className={isComplete ? 'text-emerald-600' : 'text-slate-400'}>{isComplete ? 'Analysis Optimized' : 'Processing...'}</span>
                    <span className="text-slate-600">{b.current} / {b.target}</span>
                 </div>
                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={`h-full ${isComplete ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                    />
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResearchBounties;
