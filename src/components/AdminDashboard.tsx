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
  X,
  Sparkles,
  BookOpen,
  Globe,
  Twitter,
  Linkedin,
  Github,
  MapPin,
  Briefcase,
  GraduationCap,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import NeuralAuditLogs from './NeuralAuditLogs';

interface AdminDashboardProps {
  artifacts: Artifact[];
  currentUser: User;
  onUpdate: () => void;
}

import { UsageDashboard } from './UsageDashboard';

export default function AdminDashboard({ artifacts, currentUser, onUpdate }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [dataset, setDataset] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'logs' | 'dataset'>('users');
  const isHeadAdmin = authService.isHeadAdmin(currentUser);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Back-end Indian Dataset (5000+ Records) Explorer states
  const [datasetMode, setDatasetMode] = useState<'local' | 'indian-heritage'>('local');
  const [indianSearch, setIndianSearch] = useState<string>('');
  const [indianPage, setIndianPage] = useState<number>(1);
  const [indianTotal, setIndianTotal] = useState<number>(5000);
  const [indianTotalPages, setIndianTotalPages] = useState<number>(500);
  const [indianRecords, setIndianRecords] = useState<any[]>([]);
  const [loadingIndian, setLoadingIndian] = useState<boolean>(false);

  const fetchIndianDataset = async () => {
    try {
      setLoadingIndian(true);
      const res = await fetch(`/api/indian-dataset?page=${indianPage}&limit=10&search=${encodeURIComponent(indianSearch)}`);
      if (res.ok) {
        const data = await res.json();
        setIndianRecords(data.records || []);
        setIndianTotal(data.total || 0);
        setIndianTotalPages(data.totalPages || 0);
      }
    } catch (e) {
      console.error("Failed to fetch Indian dataset: ", e);
    } finally {
      setLoadingIndian(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'dataset' && datasetMode === 'indian-heritage') {
      fetchIndianDataset();
    }
  }, [activeTab, datasetMode, indianPage, indianSearch]);
  
  const loadData = async () => {
    try {
      const allUsers = await authService.getUsers();
      setUsers(allUsers);
      const allLogs = await authService.getLogs();
      setLogs(allLogs);
      // Dataset master now shows verified artifacts from the main repository
      const verified = artifacts.filter(a => a.isVerified);
      setDataset(verified);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [artifacts]);

  const stats = {
    totalScans: artifacts.length,
    totalUsers: users.length,
    verifiedScans: artifacts.filter(a => a.isVerified).length,
    activeCivilizations: new Set(artifacts.map(a => a.civilization)).size
  };

  const handleVerify = async (id: string, name: string) => {
    try {
      await storage.verifyArtifact(id);
      onUpdate();
      await storage.logAction({
        action: 'VERIFIED_FRAGMENT',
        userId: currentUser.id,
        userName: currentUser.name,
        targetId: id,
        targetName: name
      });
    } catch (err) { console.error(err); }
  };

  const handleUnverify = async (id: string, name: string) => {
    try {
      await storage.unverifyArtifact(id);
      onUpdate();
      await storage.logAction({
        action: 'DE_AUTHENTICATED',
        userId: currentUser.id,
        userName: currentUser.name,
        targetId: id,
        targetName: name
      });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm('Permanently purge this fragment from the global archive?')) return;
    try {
      await storage.deleteArtifact(id);
      onUpdate();
      await storage.logAction({
        action: 'PERMANENT_PURGE',
        userId: currentUser.id,
        userName: currentUser.name,
        targetId: id,
        targetName: name
      });
    } catch (err) { console.error(err); }
  };

  const handleBulkVerify = async () => {
    if (selectedIds.size === 0) return;
    for (const id of Array.from(selectedIds)) {
      await storage.verifyArtifact(id);
    }
    setSelectedIds(new Set());
  };

  const handleBulkUnverify = async () => {
    if (selectedIds.size === 0) return;
    for (const id of Array.from(selectedIds)) {
      await storage.unverifyArtifact(id);
    }
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(`PERMANENTLY PURGE ALL ${selectedIds.size} SELECTED RECORDS?`)) {
      for (const id of Array.from(selectedIds)) {
        await storage.deleteArtifact(id);
      }
      setSelectedIds(new Set());
      onUpdate();
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === artifacts.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(artifacts.map(a => a.id)));
  };

  const handlePromote = async (userId: string) => {
    await authService.updateUserRole(userId, 'admin');
    loadData();
  };

  const handleDemote = async (userId: string) => {
    const userToDemote = users.find(u => u.id === userId);
    if (authService.isHeadAdmin(userToDemote || null)) {
      alert("Cannot demote the Head Admin.");
      return;
    }
    await authService.updateUserRole(userId, 'researcher');
    loadData();
  };

  const handleDeleteUser = async (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (authService.isHeadAdmin(userToDelete || null)) {
      alert("Cannot delete the Head Admin.");
      return;
    }
    
    if (confirm(`Are you sure you want to PERMANENTLY PURGE the account for ${userToDelete?.name}? This action is irreversible within the matrix.`)) {
      await authService.deleteUser(userId);
      setSelectedUser(null);
      loadData();
    }
  };

  const handleToggleUserVerification = async (userId: string, currentStatus: boolean) => {
    await authService.updateUserVerification(userId, !currentStatus);
    // Update local state for immediate feedback if needed, or just reload
    loadData();
    // Update selected user if open
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, isVerified: !currentStatus });
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-50 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
             </div>
             <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest">Administrative Matrix</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 font-display leading-[0.85]">
            Command <span className="text-gradient animate-gradient-x bg-[length:200%_auto]">Center</span>
          </h1>
          <p className="text-slate-500 max-w-xl leading-relaxed text-sm font-medium">
            Global repository oversight and neural authentication management.
          </p>
        </div>
        <div className="flex gap-4">
          <AnimatePresence>
            {selectedIds.size > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-2 bg-slate-900 p-1.5 rounded-2xl shadow-2xl border border-slate-800"
              >
                <button 
                  onClick={handleBulkVerify}
                  className="px-4 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all"
                >
                  Verify ({selectedIds.size})
                </button>
                <button 
                  onClick={handleBulkUnverify}
                  className="px-4 py-2 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-all"
                >
                  Unverify
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 transition-all"
                >
                  Purge
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="px-6 py-3 glass-card rounded-2xl flex items-center gap-3 border-white">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Sync: Active</span>
          </div>
        </div>
      </div>

      <UsageDashboard />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Database />} label="Archived Fragments" value={stats.totalScans} color="text-indigo-600" bgColor="bg-indigo-50" />
        <StatCard icon={<Users />} label="Active Researchers" value={stats.totalUsers} color="text-teal-600" bgColor="bg-teal-50" />
        <StatCard icon={<ShieldCheck />} label="Verified Records" value={stats.verifiedScans} color="text-violet-600" bgColor="bg-violet-50" />
        <StatCard icon={<ArrowUpRight />} label="Spatial Clusters" value={stats.activeCivilizations} color="text-rose-600" bgColor="bg-rose-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Tab Selector */}
        <div className="lg:col-span-1 space-y-8">
          <div className="flex gap-4 p-2 bg-slate-100 rounded-3xl">
            <button 
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Researchers
            </button>
            <button 
              onClick={() => setActiveTab('logs')}
              className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Operations Log
            </button>
            <button 
              onClick={() => setActiveTab('dataset')}
              className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'dataset' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Dataset Master
            </button>
          </div>

          {activeTab === 'users' ? (
            <>
              <h3 className="text-xl font-extrabold tracking-tight flex items-center gap-3 text-slate-800 font-display">
                <Users className="w-6 h-6 text-indigo-500" />
                Personnel Database
              </h3>
              <div className="space-y-3 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {users.map(user => (
                  <motion.div 
                    key={user.id} 
                    whileHover={{ x: 5 }}
                    onClick={() => setSelectedUser(user)}
                    className="glass-card border-white/50 p-5 rounded-[1.5rem] flex items-center justify-between group hover:border-indigo-100 transition-all cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100 overflow-hidden shrink-0">
                        {user.profileImage ? (
                          <img src={user.profileImage} className="w-full h-full object-cover" alt="" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-800 tracking-tight">{user.name}</p>
                          {user.isVerified && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{user.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : activeTab === 'logs' ? (
            <div className="space-y-3 h-[600px] overflow-y-auto pr-2 custom-scrollbar lg:col-span-1">
               <NeuralAuditLogs />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-extrabold tracking-tight flex items-center gap-3 text-slate-800 font-display">
                  <Database className="w-6 h-6 text-indigo-500" />
                  Dataset Master (Firebase NoSQL)
                </h3>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest shrink-0">500,000+ VIRTUAL RECORDS</span>
              </div>
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl mb-4">
                <div className="flex items-center gap-3 text-indigo-700">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <p className="text-[10px] font-bold leading-tight uppercase tracking-wider">Neural dataset transition complete. Real-time sync active across global nodes.</p>
                </div>
              </div>

              {/* Dataset Selector Tabs - Only Verified Local Scans */}
              <div className="flex border-b border-slate-100 mb-4 gap-4 pb-1">
                <span className="pb-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-indigo-500 text-indigo-600 font-extrabold">
                  Verified Local Scans ({dataset.length})
                </span>
              </div>

              <div className="space-y-3 h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                {dataset.length === 0 ? (
                  <div className="p-10 text-center bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">No local verified specimens in repository yet.</p>
                  </div>
                ) : (
                  dataset.map(item => (
                    <div key={item.id} className="p-5 bg-white/50 border border-slate-100 rounded-3xl space-y-4 hover:border-indigo-200 transition-all shadow-sm group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-black text-slate-800 tracking-tight">{item.name}</h4>
                          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{item.civilization}</p>
                        </div>
                        <div className="px-2 py-1 bg-indigo-50/50 rounded-lg border border-indigo-100">
                          <span className="text-[8px] font-black text-indigo-600">ERA: {item.estimatedEra}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium line-clamp-3 italic opacity-70">
                        "{item.description}"
                      </p>
                      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Confidence</span>
                          <span className="text-[10px] font-bold text-slate-700">{(item.confidenceScore * 100)}%</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Material</span>
                          <span className="text-[10px] font-bold text-slate-700 truncate">{item.materialComposition || item.materialAnalysis}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* Global Feed / Verification */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 text-slate-800 font-display">
              <Activity className="w-8 h-8 text-indigo-500" />
              Discovery Authentication
            </h3>
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleAll}
                className="px-4 py-2 border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all font-sans select-none"
              >
                {selectedIds.size === artifacts.length ? 'Deselect All' : 'Select All'}
              </button>
              {selectedIds.size > 0 && (
                <button 
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-sans flex items-center gap-1.5 shadow-sm select-none"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete All ({selectedIds.size})
                </button>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {artifacts.length > 0 ? (
              artifacts.map((artifact, idx) => (
                <motion.div 
                  key={artifact.id} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className={`glass-card p-6 rounded-[2.5rem] flex flex-col md:flex-row gap-8 hover:bg-white transition-all group border-4 ${selectedIds.has(artifact.id) ? 'border-indigo-500 bg-indigo-50/10' : 'border-white/50'} shadow-xl`}
                >
                  <button 
                    onClick={() => toggleSelect(artifact.id)}
                    className="shrink-0 flex items-center justify-center p-2"
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${selectedIds.has(artifact.id) ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg' : 'border-slate-200 hover:border-indigo-200'}`}>
                      {selectedIds.has(artifact.id) && <CheckCircle className="w-4 h-4" />}
                    </div>
                  </button>

                  <div className="w-full md:w-32 h-32 rounded-[1.5rem] overflow-hidden shrink-0 border border-slate-100 relative shadow-inner">
                    <img src={artifact.imageUrl} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-2xl font-black tracking-tight text-slate-900 font-display">{artifact.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                          Found by <span className="text-indigo-600">{artifact.userName || 'Anonymous'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2.5">
                        <button 
                          onClick={() => artifact.isVerified ? handleUnverify(artifact.id, artifact.name) : handleVerify(artifact.id, artifact.name)}
                          className={`p-3 rounded-2xl border transition-all shadow-sm ${
                            artifact.isVerified 
                              ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600 hover:text-white' 
                              : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white'
                          }`}
                          title={artifact.isVerified ? 'Revoke Authentication' : 'Authenticate Record'}
                        >
                          {artifact.isVerified ? <X className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleDelete(artifact.id, artifact.name)}
                          className="p-3 bg-rose-50 text-rose-500 rounded-2xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          title="Purge Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 max-w-lg italic opacity-80">"{artifact.description}"</p>
                    <div className="flex items-center gap-6 pt-3 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Neural Match: {(artifact.confidenceScore * 100).toFixed(0)}%</span>
                        {artifact.isVerified && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Authenticated
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-24 text-center glass-card border-dashed border-slate-200 rounded-[3rem]">
                <AlertTriangle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-300 font-bold uppercase tracking-widest text-[11px]">No Discovery Data Pending</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-white/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-card border-white bg-white/95 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="radiant-gradient absolute top-0 left-0 w-full h-1.5" />
              
              <button 
                onClick={() => setSelectedUser(null)}
                className="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-full transition-all border border-slate-100"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <div className="flex flex-col items-center text-center space-y-8">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 border-indigo-100 bg-slate-50 shadow-xl">
                  {selectedUser.profileImage ? (
                    <img src={selectedUser.profileImage} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <Users className="w-16 h-16" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display mb-1">{selectedUser.name}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-[11px] text-indigo-500 font-bold uppercase tracking-widest leading-none">{selectedUser.role}</p>
                    {selectedUser.isVerified && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-emerald-100 flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" />
                        Verified Researcher
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full space-y-4 pt-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-1 gap-3">
                    <DetailItem icon={<Mail />} label="Secure ID" value={selectedUser.email} />
                    <DetailItem icon={<Calendar />} label="Registered" value={new Date(selectedUser.joinedAt).toLocaleDateString()} />
                    <DetailItem icon={<Activity />} label="Archived Work" value={artifacts.filter(a => a.userId === selectedUser.id).length.toString()} />
                  </div>

                  {selectedUser.bio && (
                    <div className="p-4 bg-slate-50/50 border border-slate-100/50 rounded-2xl text-left">
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-2">Researcher Dossier</p>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{selectedUser.bio}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedUser.specialization && <DetailItem icon={<GraduationCap />} label="Field" value={selectedUser.specialization} />}
                    {selectedUser.affiliation && <DetailItem icon={<Briefcase />} label="Base" value={selectedUser.affiliation} />}
                    {selectedUser.location && <DetailItem icon={<MapPin />} label="Spatial Node" value={selectedUser.location} />}
                    {selectedUser.website && <DetailItem icon={<Globe />} label="Neural Hub" value={selectedUser.website} />}
                  </div>

                  {selectedUser.researchInterests && selectedUser.researchInterests.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest ml-1">Research Vectors</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.researchInterests.map((interest, i) => (
                          <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold border border-indigo-100 italic">
                            #{interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(selectedUser.socialLinks?.twitter || selectedUser.socialLinks?.linkedin || selectedUser.socialLinks?.github) && (
                    <div className="flex justify-center gap-4 pt-4">
                      {selectedUser.socialLinks?.twitter && (
                        <a href={`https://twitter.com/${selectedUser.socialLinks.twitter}`} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all text-slate-400">
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {selectedUser.socialLinks?.linkedin && (
                        <a href={`https://linkedin.com/in/${selectedUser.socialLinks.linkedin}`} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all text-slate-400">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {selectedUser.socialLinks?.github && (
                        <a href={`https://github.com/${selectedUser.socialLinks.github}`} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all text-slate-400">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {selectedUser.id !== currentUser.id && isHeadAdmin && (
                  <div className="w-full pt-6 flex flex-col gap-4">
                    <div className="flex gap-4">
                      {selectedUser.role !== 'admin' ? (
                        <button 
                          onClick={() => {
                            handlePromote(selectedUser.id);
                            setSelectedUser(null);
                          }}
                          className="flex-1 py-4 radiant-gradient text-white font-bold uppercase tracking-widest text-xs rounded-[1.5rem] shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-all"
                        >
                          Grant Oversight
                        </button>
                      ) : !authService.isHeadAdmin(selectedUser) && (
                        <button 
                          onClick={() => {
                            handleDemote(selectedUser.id);
                            setSelectedUser(null);
                          }}
                          className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold uppercase tracking-widest text-xs rounded-[1.5rem] hover:bg-slate-200 transition-all"
                        >
                          Revoke Access
                        </button>
                      )}

                      <button 
                        onClick={() => handleToggleUserVerification(selectedUser.id, !!selectedUser.isVerified)}
                        className={`flex-1 py-4 font-bold uppercase tracking-widest text-xs rounded-[1.5rem] transition-all ${
                          selectedUser.isVerified 
                            ? 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100' 
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'
                        }`}
                      >
                        {selectedUser.isVerified ? 'Unverify Unit' : 'Verify Researcher'}
                      </button>
                    </div>

                    <button 
                      onClick={() => {
                        handleDeleteUser(selectedUser.id);
                      }}
                      className="w-full py-4 bg-rose-50 text-rose-500 border border-rose-100 font-bold uppercase tracking-widest text-xs rounded-[1.5rem] hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Purge Neural Account
                    </button>
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
    <div className="flex items-center gap-4 p-4 bg-slate-50/50 border border-slate-100/50 rounded-2xl">
      <div className="p-2 bg-white rounded-lg text-indigo-500 shadow-sm">
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
      </div>
      <div className="text-left">
        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-xs font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, bgColor }: { icon: React.ReactNode, label: string, value: number, color: string, bgColor: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="glass-card border-white/50 p-6 rounded-[2rem] shadow-sm"
    >
      <div className={`p-3 ${bgColor} rounded-xl w-fit mb-4 ${color} shadow-sm`}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
    </motion.div>
  );
}
