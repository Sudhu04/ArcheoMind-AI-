import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, Users, ChevronRight, Globe, Lock, Plus } from 'lucide-react';
import { storage } from '../services/storageService';
import { ResearchLab, User } from '../types';

interface ResearchLabsProps {
  currentUser: User;
}

const RegionalResearchLabs: React.FC<ResearchLabsProps> = ({ currentUser }) => {
  const [labs, setLabs] = useState<ResearchLab[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLabName, setNewLabName] = useState('');

  useEffect(() => {
    const unsubscribe = storage.subscribeToLabs(setLabs);
    return () => unsubscribe();
  }, []);

  const handleCreateLab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabName.trim()) return;
    
    const docRef = await storage.saveLab({
      name: newLabName.trim(),
      description: "Collaborative neural research for temporal discoveries.",
      memberIds: [currentUser.id],
      leadId: currentUser.id,
      status: 'active',
      artifactCount: 0
    });
    
    await storage.logAction({
      action: 'LAB_DESIGNATED',
      userId: currentUser.id,
      userName: currentUser.name,
      targetId: docRef?.id || 'new_lab',
      targetName: newLabName.trim()
    });
    
    setNewLabName('');
    setShowCreateModal(false);
  };

  const handleJoinLab = async (labId: string) => {
    try {
      const lab = labs.find(l => l.id === labId);
      if (!lab) return;
      if (lab.memberIds.includes(currentUser.id)) {
        alert("You are already a member of this node.");
        return;
      }
      
      const newMemberIds = [...lab.memberIds, currentUser.id];
      await storage.updateLab(labId, { memberIds: newMemberIds });
      await storage.logAction({
        action: 'JOINED_NODE',
        userId: currentUser.id,
        userName: currentUser.name,
        targetId: labId,
        targetName: lab.name
      });
      // Subscription will handle update
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Collaborative Nodes</h4>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 font-display">Research Labs</h2>
        </div>
        <button 
           onClick={() => setShowCreateModal(true)}
           className="btn-primary rounded-2xl flex items-center gap-3 px-6 py-3"
        >
           <Plus className="w-4 h-4" />
           <span className="text-xs font-black uppercase tracking-widest">Inaugurate Lab</span>
        </button>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-card rounded-[3rem] p-10 bg-white border-white shadow-2xl"
            >
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Inaugurate New Node</h3>
              <form onSubmit={handleCreateLab} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Laboratory Designation</label>
                  <input 
                    autoFocus
                    type="text"
                    value={newLabName}
                    onChange={(e) => setNewLabName(e.target.value)}
                    placeholder="e.g. Chronos Institute"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-slate-200 transition-all"
                  >
                    Abort
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    Initialize Node
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {labs.length === 0 ? (
          <div className="md:col-span-3 py-20 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-xl text-slate-300">
                <Beaker className="w-10 h-10" />
             </div>
             <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2">No Active Hubs Found</h4>
             <p className="text-sm font-medium text-slate-500 max-w-sm mb-8 leading-relaxed">System requires institutional nodes for multi-user collaboration and distributed archival scanning.</p>
             <button 
               onClick={() => setShowCreateModal(true)}
               className="px-8 py-3 bg-white border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:border-indigo-200 transition-all"
             >
                Initialize First Laboratory Instance
             </button>
          </div>
        ) : (
          labs.map((lab, idx) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 rounded-[3rem] bg-white border-white shadow-xl hover:shadow-2xl transition-all group hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-8">
                 <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <Beaker className="w-8 h-8 text-slate-400 group-hover:text-indigo-500" />
                 </div>
                 <div className="flex gap-2">
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-lg">
                       Active
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{lab.name}</h3>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed opacity-80">{lab.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-50">
                 <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-slate-400" />
                    <div>
                       <div className="text-[10px] font-black tabular-nums">{lab.memberIds.length}</div>
                       <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Colleagues</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <div>
                       <div className="text-[10px] font-black tabular-nums">{lab.artifactCount}</div>
                       <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Discoveries</div>
                    </div>
                 </div>
              </div>

              <div className="mt-8">
                 {lab.memberIds.includes(currentUser.id) ? (
                   <button className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center gap-3 transition-all hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                      <span className="text-[10px] font-black uppercase tracking-widest">Enter Laboratory Node</span>
                      <ChevronRight className="w-4 h-4" />
                   </button>
                 ) : (
                   <button 
                     onClick={() => handleJoinLab(lab.id)}
                     className="w-full py-4 bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all border border-transparent hover:border-indigo-100"
                   >
                      <Plus className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Join Research Node</span>
                   </button>
                 )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-10 bg-indigo-600 rounded-[3.5rem] text-white flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(79,70,229,0.4)]">
         <div className="absolute top-0 right-0 p-12 opacity-10">
            <Lock className="w-48 h-48" />
         </div>
         <div className="flex-1 space-y-4 relative z-10">
            <h3 className="text-3xl font-black tracking-tight leading-none italic">Industrial Research Access</h3>
            <p className="text-sm font-medium text-indigo-100 max-w-lg">Requesting specialized Laboratory status enables cross-node artifact sharing, bulk neural processing, and multi-signature verification protocols.</p>
         </div>
         <button className="bg-white text-indigo-600 px-10 py-5 rounded-3xl text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10">
            Apply for Institutional Grant
         </button>
      </div>
    </div>
  );
};

export default RegionalResearchLabs;
