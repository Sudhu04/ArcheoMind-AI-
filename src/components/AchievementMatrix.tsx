import React from 'react';
import { Trophy, Star, Shield, Award, Zap, BookOpen } from 'lucide-react';
import { User } from '../types';
import { motion } from 'motion/react';

interface AchievementMatrixProps {
  user: User;
}

export default function AchievementMatrix({ user }: AchievementMatrixProps) {
  const achievements = [
    { id: '1', name: 'First Contact', description: 'Linked first artifact specimen', icon: <Zap />, color: 'text-amber-500', bgColor: 'bg-amber-50', earned: true },
    { id: '2', name: 'Deep Archivist', description: 'Manually ingested 5 discovery files', icon: <BookOpen />, color: 'text-indigo-500', bgColor: 'bg-indigo-50', earned: (user.xp || 0) > 100 },
    { id: '3', name: 'Verified Unit', description: 'Account verified by Head Admin', icon: <Shield />, color: 'text-emerald-500', bgColor: 'bg-emerald-50', earned: !!user.isVerified },
    { id: '4', name: 'Visionary Master', description: 'Scanned 10 artifacts using Neural API', icon: <Trophy />, color: 'text-violet-500', bgColor: 'bg-violet-50', earned: (user.xp || 0) > 500 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
               <Trophy className="w-4 h-4 text-indigo-500" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Researcher Achievement Matrix</h4>
         </div>
         <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Level {user.level || 1}</span>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {achievements.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-5 rounded-[2rem] border-2 transition-all relative overflow-hidden group ${
              item.earned 
              ? 'bg-white border-white shadow-xl shadow-indigo-100/50' 
              : 'bg-slate-50/50 border-slate-100 opacity-40 grayscale'
            }`}
          >
            <div className={`p-3 rounded-2xl w-fit mb-4 ${item.earned ? item.bgColor + ' ' + item.color : 'bg-slate-200 text-slate-400'}`}>
               {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
            </div>
            <h5 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${item.earned ? 'text-slate-800' : 'text-slate-400'}`}>
              {item.name}
            </h5>
            <p className="text-[9px] font-bold text-slate-400 leading-tight">
              {item.description}
            </p>
            {item.earned && (
               <div className="absolute top-0 right-0 p-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
               </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-7 glass-card border-white bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 mt-4 relative overflow-hidden">
         <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
               <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Experience Progression</p>
               <h4 className="text-xl font-black tracking-tight">{user.xp || 0} Synapse Points</h4>
            </div>
            <Award className="w-8 h-8 opacity-40" />
         </div>
         <div className="mt-6 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((user.xp || 0) % 1000) / 10}%` }}
              className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            />
         </div>
      </div>
    </div>
  );
}
