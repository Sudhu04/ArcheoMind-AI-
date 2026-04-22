import React, { useState } from 'react';
import { Artifact, User } from '../types';
import { storage } from '../services/storageService';
import { authService } from '../services/authService';
import { 
  Users, 
  Database, 
  ShieldCheck, 
  Activity, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  ArrowUpRight,
  Mail,
  Phone,
  Calendar,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

interface AdminDashboardProps {
  artifacts: Artifact[];
  currentUser: User;
  onUpdate: () => void;
}

export default function AdminDashboard({ artifacts, currentUser, onUpdate }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const isHeadAdmin = authService.isHeadAdmin(currentUser);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  React.useEffect(() => {
    setUsers(authService.getUsers());
  }, [artifacts]); // Refresh users when artifacts change (contributions count)

  const stats = {
    totalScans: artifacts.length,
    totalUsers: users.length,
    verifiedScans: artifacts.filter(a => a.isVerified).length,
    activeCivilizations: new Set(artifacts.map(a => a.civilization)).size
  };

  const handleVerify = async (id: string) => {
    await storage.verifyArtifact(id);
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    await storage.deleteArtifact(id);
    onUpdate();
  };

  const handlePromote = async (userId: string) => {
    await authService.updateUserRole(userId, 'admin');
    onUpdate();
  };

  const handleDemote = async (userId: string) => {
    if (authService.isHeadAdmin(users.find(u => u.id === userId) || null)) {
      alert("Cannot demote the Head Admin.");
      return;
    }
    await authService.updateUserRole(userId, 'user');
    onUpdate();
  };

  return (
    <div className="space-y-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <h1 className="text-7xl font-black tracking-tighter italic font-display leading-none">
            COMMAND <span className="text-[#D4AF37]">CENTER</span>
          </h1>
          <p className="text-white/40 max-w-xl leading-relaxed text-sm font-medium">
            System-wide monitoring and artifact verification protocols. Overseeing the global digital excavation network.
          </p>
        </div>
        <div className="flex gap-6">
          <div className="px-8 py-4 bg-white/5 border border-[#D4AF37]/20 rounded-2xl flex items-center gap-4 shadow-2xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Neural Link: Stable</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={<Database />} label="Total Archives" value={stats.totalScans} color="text-[#D4AF37]" />
        <StatCard icon={<Users />} label="Neural Researchers" value={stats.totalUsers} color="text-[#D4AF37]" />
        <StatCard icon={<ShieldCheck />} label="Verified Specimens" value={stats.verifiedScans} color="text-[#D4AF37]" />
        <StatCard icon={<ArrowUpRight />} label="Active Civilizations" value={stats.activeCivilizations} color="text-[#D4AF37]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* User Management */}
        <div className="lg:col-span-1 space-y-10">
          <h3 className="text-2xl font-black italic tracking-tight flex items-center gap-4 font-display">
            <Users className="w-7 h-7 text-[#D4AF37]" />
            RESEARCHER REGISTRY
          </h3>
          <div className="space-y-4">
            {users.map(user => (
              <motion.div 
                key={user.id} 
                whileHover={{ x: 10 }}
                onClick={() => setSelectedUser(user)}
                className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/30 transition-all cursor-pointer shadow-xl"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-black text-xs border border-[#D4AF37]/30 overflow-hidden shrink-0">
                    {user.profileImage ? (
                      <img src={user.profileImage} className="w-full h-full object-cover" alt="" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">{user.name}</p>
                    <p className="text-[9px] text-[#D4AF37] uppercase tracking-widest font-bold opacity-60">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[8px] text-white/20 uppercase tracking-widest font-black">Joined</p>
                    <p className="text-[10px] font-black">{formatDistanceToNow(user.joinedAt)} ago</p>
                  </div>
                  {user.role === 'user' && isHeadAdmin && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePromote(user.id); }}
                      className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-[#0C0B0A] transition-all"
                      title="Promote to Admin"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global Feed / Verification */}
        <div className="lg:col-span-2 space-y-10">
          <h3 className="text-2xl font-black italic tracking-tight flex items-center gap-4 font-display">
            <Activity className="w-7 h-7 text-[#D4AF37]" />
            GLOBAL DISCOVERY FEED
          </h3>
          <div className="space-y-6">
            {artifacts.length > 0 ? (
              artifacts.map((artifact, idx) => (
                <motion.div 
                  key={artifact.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white/5 border border-white/10 p-8 rounded-[3rem] flex flex-col md:flex-row gap-8 hover:bg-white/10 transition-all group relative overflow-hidden shadow-2xl"
                >
                  <div className="w-full md:w-40 h-40 rounded-[2rem] overflow-hidden shrink-0 border border-white/10 relative">
                    <img src={artifact.imageUrl} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-2xl font-black italic tracking-tighter font-display mb-1">{artifact.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.2em]">
                          <Users className="w-3 h-3" />
                          Found by {artifact.userName || 'Anonymous'}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {!artifact.isVerified && (
                          <button 
                            onClick={() => handleVerify(artifact.id)}
                            className="p-3 bg-green-500/10 text-green-500 rounded-xl border border-green-500/20 hover:bg-green-500 hover:text-white transition-all shadow-lg"
                            title="Verify Artifact"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(artifact.id)}
                          className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                          title="Delete (Admin Privilege)"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed line-clamp-2 font-medium">{artifact.description}</p>
                      <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Neural Confidence: {(artifact.confidenceScore * 100).toFixed(1)}%</span>
                        {artifact.isVerified && (
                        <span className="flex items-center gap-2 text-[9px] font-black text-green-500 uppercase tracking-[0.3em]">
                          <ShieldCheck className="w-4 h-4" />
                          Verified Specimen
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-[#D4AF37]/10 rounded-tr-[3rem] pointer-events-none" />
                </motion.div>
              ))
            ) : (
              <div className="py-32 text-center bg-white/5 border border-white/10 border-dashed rounded-[3rem]">
                <AlertTriangle className="w-16 h-16 text-white/5 mx-auto mb-6" />
                <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">No Neural Data Recorded</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-[#0C0B0A]/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-xl bg-[#080706] border border-[#D4AF37]/20 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#D4AF37]" />
              
              <button 
                onClick={() => setSelectedUser(null)}
                className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10"
              >
                <X className="w-6 h-6 text-white/20" />
              </button>

              <div className="flex flex-col items-center text-center space-y-8">
                <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-2 border-[#D4AF37]/30 bg-white/5 shadow-2xl">
                  {selectedUser.profileImage ? (
                    <img src={selectedUser.profileImage} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#D4AF37]/20">
                      <Users className="w-16 h-16" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-4xl font-black italic tracking-tighter font-display mb-2">{selectedUser.name}</h3>
                  <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.4em]">{selectedUser.role}</p>
                </div>

                <div className="w-full grid grid-cols-1 gap-4 pt-4">
                  <DetailItem icon={<Mail />} label="Neural Address" value={selectedUser.email} />
                  <DetailItem icon={<Phone />} label="Comms Link" value={selectedUser.phoneNumber || 'Not established'} />
                  <DetailItem icon={<Calendar />} label="Enlistment Date" value={new Date(selectedUser.joinedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} />
                  <DetailItem icon={<Activity />} label="Neural Contributions" value={artifacts.filter(a => a.userId === selectedUser.id).length.toString()} />
                </div>

                {selectedUser.id !== currentUser.id && isHeadAdmin && (
                  <div className="w-full pt-8 flex gap-4">
                    {selectedUser.role === 'user' ? (
                      <button 
                        onClick={() => {
                          handlePromote(selectedUser.id);
                          setSelectedUser(null);
                        }}
                        className="flex-1 py-5 bg-[#D4AF37] text-[#0C0B0A] font-black uppercase tracking-widest text-xs rounded-[2rem] hover:bg-[#C4A030] transition-all shadow-2xl"
                      >
                        Promote to Admin
                      </button>
                    ) : !authService.isHeadAdmin(selectedUser) && (
                      <button 
                        onClick={() => {
                          handleDemote(selectedUser.id);
                          setSelectedUser(null);
                        }}
                        className="flex-1 py-5 bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase tracking-widest text-xs rounded-[2rem] hover:bg-red-500 hover:text-white transition-all shadow-2xl"
                      >
                        Revoke Authority
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
      <div className="p-2 bg-white/5 rounded-lg text-amber-500">
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
      </div>
      <div className="text-left">
        <p className="text-[8px] text-white/20 font-black uppercase tracking-widest">{label}</p>
        <p className="text-xs font-bold text-white/80">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white/5 border border-white/10 p-6 rounded-[2rem] shadow-xl"
    >
      <div className={`p-3 bg-white/5 rounded-xl w-fit mb-4 ${color}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black italic">{value}</p>
    </motion.div>
  );
}
