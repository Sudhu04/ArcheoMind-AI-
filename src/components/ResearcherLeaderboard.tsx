import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Award, Zap, Star } from 'lucide-react';
import { User, Artifact } from '../types';

interface LeaderboardProps {
  users: User[];
  artifacts: Artifact[];
}

const ResearcherLeaderboard: React.FC<LeaderboardProps> = ({ users, artifacts }) => {
  // Score calculation: 50 per artifact, 100 extra per verified artifact
  const calculateScore = (user: User) => {
    const userArtifacts = artifacts.filter(a => a.userId === user.id);
    const verifiedCount = userArtifacts.filter(a => a.isVerified).length;
    return (userArtifacts.length * 50) + (verifiedCount * 100) + (user.xp || 0);
  };

  const sortedUsers = [...users].sort((a, b) => calculateScore(b) - calculateScore(a));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Synapse Ranking</h4>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 font-display">Elite Researchers</h2>
        </div>
        <Trophy className="w-10 h-10 text-amber-400" />
      </div>

      <div className="space-y-4">
        {sortedUsers.slice(0, 10).map((user, idx) => {
          const score = calculateScore(user);
          const isTop3 = idx < 3;
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`glass-card p-6 rounded-[2.5rem] flex items-center gap-6 border-4 shadow-xl transition-all hover:scale-[1.02] ${
                isTop3 ? 'border-indigo-100 bg-white' : 'border-white/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-inner ${
                idx === 0 ? 'bg-amber-100 text-amber-600' :
                idx === 1 ? 'bg-slate-100 text-slate-600' :
                idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'
              }`}>
                {idx + 1}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-black text-slate-900 tracking-tight">{user.name}</h4>
                  {user.role === 'admin' && (
                    <div className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[8px] font-black uppercase tracking-widest">
                      Admin
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Zap className="w-3 h-3 text-indigo-500" />
                    {artifacts.filter(a => a.userId === user.id).length} Scans
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Award className="w-3 h-3 text-emerald-500" />
                    {artifacts.filter(a => a.userId === user.id && a.isVerified).length} Verified
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-indigo-600 tracking-tighter tabular-nums">{score}</div>
                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Synapse Pt</div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {sortedUsers.length > 10 && (
         <div className="py-4 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Viewing Top 10 High-Authority Nodes</p>
         </div>
      )}
    </div>
  );
};

export default ResearcherLeaderboard;
