import React, { useState, useEffect } from 'react';
import { storage } from './services/storageService';
import { authService } from './services/authService';
import { Artifact, User } from './types';
import ArtifactScanner from './components/ArtifactScanner';
import ArtifactCard from './components/ArtifactCard';
import ThreeViewer from './components/ThreeViewer';
import AuthGateway from './components/AuthGateway';
import AdminDashboard from './components/AdminDashboard';
import ManualEntry from './components/ManualEntry';
import ProfileSettings from './components/ProfileSettings';
import CoverPage from './components/CoverPage';
import { 
  Compass, 
  LayoutDashboard, 
  Plus,
  History,
  Globe,
  Settings,
  LogOut,
  Menu,
  ShieldCheck,
  Activity,
  Map as MapIcon,
  MapPin,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scan' | 'admin' | 'manual-entry' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [manualEntryData, setManualEntryData] = useState<any>(null);
  const [showCover, setShowCover] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) setCurrentUser(user);
    setIsAuthReady(true);
    loadArtifacts();
  }, []);

  const loadArtifacts = async (selectId?: string) => {
    const all = await storage.getArtifacts();
    setArtifacts(all);
    if (selectId) {
      setSelectedArtifactId(selectId);
    } else if (all.length > 0 && !selectedArtifactId) {
      setSelectedArtifactId(all[0].id);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') setActiveTab('admin');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleDelete = async (id: string) => {
    await storage.deleteArtifact(id);
    loadArtifacts();
  };

  if (!isAuthReady) return null;

  const userArtifacts = currentUser ? (currentUser.role === 'admin' 
    ? artifacts 
    : artifacts.filter(a => a.userId === currentUser.id))
    .filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.civilization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : [];

  return (
    <AnimatePresence mode="wait">
      {showCover ? (
        <motion.div
          key="cover"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <CoverPage onEnter={() => setShowCover(false)} />
        </motion.div>
      ) : !currentUser ? (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AuthGateway onLogin={handleLogin} />
        </motion.div>
      ) : (
        <motion.div 
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-[#0C0B0A] text-[#E4E3E0] font-sans selection:bg-[#D4AF37]/30 selection:text-[#D4AF37] overflow-x-hidden"
        >
          {/* Sidebar */}
          <aside className={`fixed left-0 top-0 h-full bg-[#080706] border-r border-[#D4AF37]/10 transition-all duration-700 z-50 ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
            <div className="flex flex-col h-full p-8">
              <div className="flex items-center gap-4 mb-16">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                  <Compass className="w-7 h-7 text-[#0C0B0A]" />
                </div>
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-black tracking-tighter uppercase italic font-display"
                  >
                    ArcheoMind
                  </motion.span>
                )}
              </div>

              <nav className="flex-1 space-y-3">
                <NavItem 
                  icon={<LayoutDashboard />} 
                  label="Neural Feed" 
                  active={activeTab === 'dashboard'} 
                  onClick={() => setActiveTab('dashboard')}
                  collapsed={!isSidebarOpen}
                />
                <NavItem 
                  icon={<Plus />} 
                  label="Neural Scan" 
                  active={activeTab === 'scan'} 
                  onClick={() => setActiveTab('scan')}
                  collapsed={!isSidebarOpen}
                />
                {currentUser.role === 'admin' && (
                  <NavItem 
                    icon={<ShieldCheck />} 
                    label="Command" 
                    active={activeTab === 'admin'} 
                    onClick={() => setActiveTab('admin')}
                    collapsed={!isSidebarOpen}
                  />
                )}
                <NavItem 
                  icon={<History />} 
                  label="Timeline" 
                  active={activeTab === 'dashboard' && searchQuery === 'timeline'} 
                  onClick={() => {
                    setActiveTab('dashboard');
                    setSearchQuery('timeline');
                  }}
                  collapsed={!isSidebarOpen}
                />
              </nav>

              <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
                <div className={`flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 ${!isSidebarOpen ? 'justify-center' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-black text-xs border border-[#D4AF37]/30 overflow-hidden shrink-0">
                    {currentUser.profileImage ? (
                      <img src={currentUser.profileImage} className="w-full h-full object-cover" alt="" />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>
                  {isSidebarOpen && (
                    <div className="overflow-hidden">
                      <p className="text-xs font-black truncate uppercase tracking-tight">{currentUser.name}</p>
                      <p className="text-[9px] text-[#D4AF37] uppercase tracking-widest font-bold opacity-60">{currentUser.role}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`p-3 rounded-xl transition-all flex-1 flex justify-center border ${activeTab === 'settings' ? 'bg-[#D4AF37] text-[#0C0B0A] border-[#D4AF37]' : 'bg-white/5 border-white/5 text-white/20 hover:text-white hover:bg-white/10'}`}
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-3 bg-red-500/10 border border-red-500/10 rounded-xl text-red-500/40 hover:text-red-500 hover:bg-red-500/20 transition-all flex-1 flex justify-center"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className={`transition-all duration-700 ${isSidebarOpen ? 'pl-72' : 'pl-24'} relative min-h-screen`}>
            {/* Background Image Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] grayscale mix-blend-overlay overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=2000" 
                className="w-full h-full object-cover scale-110"
                alt=""
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0C0B0A]/80 backdrop-blur-2xl border-b border-white/5 px-10 py-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2.5 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10"
                >
                  <Menu className="w-5 h-5 text-white/40" />
                </button>
                <div className="flex flex-col">
                  <h2 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-0.5">
                    {activeTab === 'dashboard' ? 'Neural Discovery Feed' : activeTab === 'scan' ? 'Artifact Analysis' : 'System Administration'}
                  </h2>
                  <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold">ArcheoMind Terminal v4.0.2</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Satellite Link: Optimal</span>
                </div>
              </div>
            </header>

            <div className="p-10 max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && (
                  <motion.div 
                    key="dashboard"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-16"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                      <div className="space-y-4">
                        <h1 className="text-7xl font-black tracking-tighter italic font-display leading-none">
                          FIELD <span className="text-[#D4AF37]">JOURNAL</span>
                        </h1>
                        <p className="text-white/40 max-w-xl leading-relaxed text-sm font-medium">
                          {currentUser.role === 'admin' ? 'Overseeing the global digital excavation. Every discovery is a neural link to the past.' : 'Your personal digital excavation log. Synchronizing neural data with historical reality.'}
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('scan')}
                        className="px-10 py-5 bg-[#D4AF37] text-[#0C0B0A] font-black rounded-2xl hover:bg-[#C4A030] transition-all flex items-center gap-4 shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:scale-105 active:scale-95"
                      >
                        <Plus className="w-7 h-7" />
                        INITIATE SCAN
                      </button>
                    </div>

                    {/* Global Map View */}
                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-3 overflow-hidden shadow-2xl relative group">
                      <div className="h-[500px] rounded-[2.5rem] overflow-hidden relative bg-black">
                        {artifacts.length > 0 ? (
                          (() => {
                            const selected = artifacts.find(a => a.id === selectedArtifactId) || artifacts[0];
                            return (
                              <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                src={`https://maps.google.com/maps?q=${selected.location.lat},${selected.location.lng}(${encodeURIComponent(selected.location.name)})&t=k&z=12&ie=UTF8&iwloc=&output=embed`}
                                className="grayscale opacity-40 contrast-150 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
                              />
                            );
                          })()
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white/10">
                            <Globe className="w-20 h-20 mb-6 animate-pulse" />
                            <p className="font-black uppercase tracking-[0.4em] text-[10px]">Awaiting Site Coordinates</p>
                          </div>
                        )}
                        <div className="absolute top-8 left-8 bg-[#0C0B0A]/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-[#D4AF37]/20 shadow-2xl">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 text-[#D4AF37]">
                            <MapIcon className="w-4 h-4" />
                            {artifacts.find(a => a.id === selectedArtifactId)?.location.name || (currentUser.role === 'admin' ? 'Global Excavation Sites' : 'Active Discovery Zones')}
                          </h3>
                        </div>
                      </div>
                      {/* Decorative corners */}
                      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37]/40 rounded-tl-[3rem] pointer-events-none" />
                      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37]/40 rounded-br-[3rem] pointer-events-none" />
                    </div>

                    {/* Specimen Dossier Section */}
                    <AnimatePresence mode="wait">
                      {selectedArtifactId && (
                        <motion.div
                          key={selectedArtifactId}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -30 }}
                          className="bg-[#080706] border border-[#D4AF37]/20 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
                        >
                          {(() => {
                            const artifact = artifacts.find(a => a.id === selectedArtifactId);
                            if (!artifact) return null;
                            return (
                              <div className="space-y-12">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">
                                      <span>{artifact.civilization}</span>
                                      <span className="w-1.5 h-1.5 bg-[#D4AF37]/30 rounded-full" />
                                      <span>{artifact.estimatedEra}</span>
                                    </div>
                                    <h2 className="text-6xl font-black italic tracking-tighter font-display">{artifact.name}</h2>
                                    <div className="flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-widest">
                                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                                      {artifact.location.name}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-4">
                                    <div className="bg-[#D4AF37] px-6 py-3 rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                                      <span className="text-sm font-black text-[#0C0B0A] uppercase tracking-widest">{(artifact.confidenceScore * 100).toFixed(1)}% NEURAL ACCURACY</span>
                                    </div>
                                    <p className="text-[9px] text-white/20 uppercase tracking-widest font-black">Specimen ID: {artifact.id.substring(0, 8).toUpperCase()}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                  <div className="lg:col-span-2 space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                      <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Forensic Description</h4>
                                        <p className="text-white/60 leading-relaxed text-sm font-medium">{artifact.description}</p>
                                      </div>
                                      <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Historical Context</h4>
                                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 italic text-sm text-white/40 leading-relaxed">
                                          "{artifact.historicalContext}"
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                      <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">Material Analysis</h4>
                                        <div className="p-6 bg-[#D4AF37]/5 rounded-[2rem] border border-[#D4AF37]/10 text-sm text-white/70 leading-relaxed">
                                          {artifact.materialAnalysis || "Analysis Pending..."}
                                        </div>
                                      </div>
                                      <div className="space-y-4">
                                        <h4 className="text-[10px) font-black text-[#D4AF37] uppercase tracking-[0.3em]">Cultural Significance</h4>
                                        <div className="p-6 bg-[#D4AF37]/5 rounded-[2rem] border border-[#D4AF37]/10 text-sm text-white/70 leading-relaxed">
                                          {artifact.culturalSignificance || "Analysis Pending..."}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-8">
                                    <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                                      <img src={artifact.imageUrl} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000" alt="" />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>
                                    {artifact.extraImages && artifact.extraImages.length > 0 && (
                                      <div className="grid grid-cols-3 gap-4">
                                        {artifact.extraImages.map((img, i) => (
                                          <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/10">
                                            <img src={img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" alt="" />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="pt-10 border-t border-white/5 flex flex-wrap gap-4">
                                  {artifact.tags.map(tag => (
                                    <span key={tag} className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all cursor-default">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                          {/* Decorative background */}
                          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                      <div className="lg:col-span-2 space-y-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                          <h3 className="text-2xl font-black italic tracking-tight flex items-center gap-4 font-display">
                            <History className="w-7 h-7 text-[#D4AF37]" />
                            {currentUser.role === 'admin' ? 'GLOBAL ARCHIVES' : 'PERSONAL LOGS'}
                          </h3>
                          <div className="relative max-w-xs w-full group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Search className="w-4 h-4 text-white/20 group-focus-within:text-[#D4AF37] transition-colors" />
                            </div>
                            <input 
                              type="text"
                              placeholder="Search neural records..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all placeholder:text-white/10"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {searchQuery === 'timeline' ? (
                            <div className="col-span-2 space-y-16 relative before:absolute before:left-[23px] before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-transparent before:via-[#D4AF37]/20 before:to-transparent">
                              {userArtifacts
                                .sort((a, b) => b.timestamp - a.timestamp)
                                .map((artifact, idx) => (
                                  <motion.div 
                                    key={artifact.id} 
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="relative pl-16 group"
                                  >
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-[#0C0B0A] border border-[#D4AF37]/30 flex items-center justify-center z-10 group-hover:scale-110 group-hover:border-[#D4AF37] transition-all duration-500 shadow-2xl">
                                      <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                                    </div>
                                    <div 
                                      onClick={() => setSelectedArtifactId(artifact.id)}
                                      className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer duration-500 ${selectedArtifactId === artifact.id ? 'bg-[#D4AF37]/5 border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.1)]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                                    >
                                      <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">{new Date(artifact.timestamp).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">{artifact.civilization}</span>
                                      </div>
                                      <h4 className="text-2xl font-black italic tracking-tighter mb-3 font-display">{artifact.name}</h4>
                                      <p className="text-xs text-white/50 leading-relaxed line-clamp-2 font-medium">{artifact.description}</p>
                                    </div>
                                  </motion.div>
                                ))}
                            </div>
                          ) : userArtifacts.length > 0 ? (
                            userArtifacts.map((artifact, idx) => (
                              <motion.div
                                key={artifact.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                              >
                                <ArtifactCard 
                                  artifact={artifact} 
                                  onDelete={handleDelete} 
                                  onSelect={() => setSelectedArtifactId(artifact.id)}
                                  isActive={selectedArtifactId === artifact.id}
                                />
                              </motion.div>
                            ))
                          ) : (
                            <div className="col-span-2 py-32 text-center bg-white/5 border border-white/10 border-dashed rounded-[3rem]">
                              <History className="w-16 h-16 text-white/5 mx-auto mb-6" />
                              <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">No Neural Records Found</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-10">
                        <h3 className="text-2xl font-black italic tracking-tight flex items-center gap-4 font-display">
                          <Activity className="w-7 h-7 text-[#D4AF37]" />
                          NEURAL CORE
                        </h3>
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
                          <ThreeViewer />
                          <div className="mt-10 p-6 bg-black/40 rounded-3xl border border-white/5 relative z-10">
                            <div className="flex justify-between items-center mb-4">
                              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">System Status</p>
                              <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Stable</span>
                            </div>
                            <p className="text-sm font-bold tracking-tight">Neural Link Synchronized</p>
                            <div className="w-full h-2 bg-white/5 rounded-full mt-4 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                className="h-full bg-gradient-to-r from-[#D4AF37]/50 to-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.5)]" 
                              />
                            </div>
                            <div className="mt-4 flex justify-between text-[8px] text-white/20 font-bold uppercase tracking-widest">
                              <span>Data Rate: 4.2 GB/s</span>
                              <span>Latency: 12ms</span>
                            </div>
                          </div>
                          {/* Decorative background elements */}
                          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'scan' && (
                  <motion.div 
                    key="scan"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="max-w-3xl mx-auto py-12"
                  >
                    <div className="text-center mb-12">
                      <h1 className="text-6xl font-black tracking-tighter mb-4 italic uppercase">Scanner</h1>
                      <p className="text-white/40 max-w-lg mx-auto leading-relaxed">
                        Point your lens at history. ArcheoMind AI will decode the artifact and map its original discovery site.
                      </p>
                    </div>
                    <ArtifactScanner 
                      currentUser={currentUser}
                      onManualEntry={(data) => {
                        setManualEntryData(data || null);
                        setActiveTab('manual-entry');
                      }}
                      onArtifactSaved={(id) => { 
                        setActiveTab('dashboard'); 
                        loadArtifacts(id); 
                      }} 
                    />
                  </motion.div>
                )}

                {activeTab === 'manual-entry' && (
                  <motion.div 
                    key="manual-entry"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="py-12"
                  >
                    <ManualEntry 
                      currentUser={currentUser}
                      initialData={manualEntryData}
                      onArtifactSaved={(id) => {
                        setManualEntryData(null);
                        setActiveTab('dashboard');
                        loadArtifacts(id);
                      }}
                      onCancel={() => {
                        setManualEntryData(null);
                        setActiveTab('scan');
                      }}
                    />
                  </motion.div>
                )}

                {activeTab === 'admin' && currentUser.role === 'admin' && (
                  <motion.div 
                    key="admin"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <AdminDashboard artifacts={artifacts} currentUser={currentUser} onUpdate={loadArtifacts} />
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div 
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ProfileSettings 
                      currentUser={currentUser} 
                      onUpdate={(updatedUser) => {
                        setCurrentUser(updatedUser);
                        loadArtifacts();
                      }} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavItem({ icon, label, active, onClick, collapsed }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, collapsed?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group relative ${active ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
    >
      <span className="shrink-0">{React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}</span>
      {!collapsed && <span className="font-bold text-xs tracking-tight uppercase">{label}</span>}
      {collapsed && (
        <div className="absolute left-20 bg-amber-500 text-black px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </button>
  );
}
