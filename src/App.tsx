import React, { useState, useEffect } from 'react';
import { storage } from './services/storageService';
import { authService } from './services/authService';
import { Artifact, User } from './types';
import ArtifactScanner from './components/ArtifactScanner';
import ArtifactCard from './components/ArtifactCard';
import ThreeViewer from './components/ThreeViewer';
import AuthGateway from './components/AuthGateway';
import AdminDashboard from './components/AdminDashboard';
import GlobalObservatory from './components/GlobalObservatory';
import BentoMuseum from './components/BentoMuseum';
import DiscoveryDetails from './components/DiscoveryDetails';
import ResonanceAnalyzer from './components/ResonanceAnalyzer';
import ArchaeologicalTimeline from './components/ArchaeologicalTimeline';
import AIBriefing from './components/AIBriefing';
import ComparativeAnalyzer from './components/ComparativeAnalyzer';
import NotificationSystem from './components/NotificationSystem';
import ManualEntry from './components/ManualEntry';
import ProfileSettings from './components/ProfileSettings';
import CoverPage from './components/CoverPage';
import NeuralPulse from './components/NeuralPulse';
import AchievementMatrix from './components/AchievementMatrix';
import GlobalChat from './components/GlobalChat';
import ResearcherLeaderboard from './components/ResearcherLeaderboard';
import VoiceSearchOverlay from './components/VoiceSearchOverlay';
import NeuralComparator from './components/NeuralComparator';
import ResearchBounties from './components/ResearchBounties';
import DailySynthesis from './components/DailySynthesis';
import ResearchLabsHub from './components/ResearchLabsHub';
import AIResearchAssistant from './components/AIResearchAssistant';
import NetworkHealth from './components/NetworkHealth';
import NeuralAuditLogs from './components/NeuralAuditLogs';
import { HeritageStatus } from './components/HeritageStatus';
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
  Search,
  Star,
  ChevronRight,
  Sparkles,
  Layers,
  FileText,
  Library,
  Beaker,
  Zap,
  Mic,
  Moon,
  Sun,
  ArrowRightLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { seedRepository } from './lib/seeder';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scan' | 'admin' | 'manual-entry' | 'settings' | 'observatory' | 'museum' | 'resonance' | 'labs'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterVerified, setFilterVerified] = useState('all');
  const [manualEntryData, setManualEntryData] = useState<any>(null);
  const [showCover, setShowCover] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = authService.onAuthChange((user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
      if (user) {
        if (user.theme) {
          setTheme(user.theme);
        }
        authService.getUsers().then(setUsers);
        if (user.role === 'admin') {
          seedRepository(user);
        }
      }
    });

    const unsubscribeArtifacts = storage.subscribeToArtifacts((data) => {
      setArtifacts(data);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeArtifacts();
    };
  }, []);

  const filteredArtifacts = artifacts.filter(a => {
    const matchesSearch = 
      (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.civilization || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.tags || []).some(t => (t || '').toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'all' || a.type === filterType;
    const matchesVerified = 
      filterVerified === 'all' || 
      (filterVerified === 'verified' && a.isVerified) ||
      (filterVerified === 'unverified' && !a.isVerified);

    return matchesSearch && matchesType && matchesVerified;
  });

  const [semanticResults, setSemanticResults] = useState<string[]>([]);
  const [isSemanticSearching, setIsSemanticSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 5 && filteredArtifacts.length === 0) {
        setIsSemanticSearching(true);
        try {
          const ids = await import('./services/geminiService').then(m => m.semanticSearchGrounding(artifacts, searchQuery));
          setSemanticResults(ids);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSemanticSearching(false);
        }
      } else {
        setSemanticResults([]);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery, artifacts.length]);

  const finalArtifacts = semanticResults.length > 0 
    ? artifacts.filter(a => semanticResults.includes(a.id))
    : filteredArtifacts;

  const userArtifacts = currentUser ? (currentUser.role === 'admin' 
    ? finalArtifacts 
    : finalArtifacts.filter(a => a.userId === currentUser.id))
    : [];

  const artifactTypes = Array.from(new Set(artifacts.map(a => a.type).filter(Boolean))).sort();

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setSelectedArtifactId(null);
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setActiveTab('dashboard');
    setShowCover(true);
  };

  const handleDelete = async (id: string) => {
    await storage.deleteArtifact(id);
  };

  if (!isAuthReady) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] animate-pulse">Syncing Neural Fabric</p>
      </div>
    </div>
  );

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
          className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-transparent text-slate-900'} font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden transition-colors duration-500`}
        >
          <aside className={`fixed left-4 top-4 bottom-4 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-white'} glass-card rounded-[2.5rem] transition-all duration-500 z-50 overflow-hidden flex flex-col 
            ${isSidebarOpen ? 'w-64 lg:w-72 translate-x-0' : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0'}`}
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 radiant-gradient rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-xl font-extrabold tracking-tight font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                  >
                    Archeo<span className="text-indigo-600">Mind</span>
                  </motion.span>
                )}
              </div>

              <nav className="flex-1 space-y-2">
                <NavItem 
                  icon={<LayoutDashboard />} 
                  label="Dashboard" 
                  active={activeTab === 'dashboard'} 
                  onClick={() => setActiveTab('dashboard')}
                  collapsed={!isSidebarOpen}
                />
                <NavItem 
                  icon={<Plus />} 
                  label="Scan" 
                  active={activeTab === 'scan'} 
                  onClick={() => setActiveTab('scan')}
                  collapsed={!isSidebarOpen}
                />
                <NavItem 
                  icon={<Globe />} 
                  label="Observatory" 
                  active={activeTab === 'observatory'} 
                  onClick={() => setActiveTab('observatory')}
                  collapsed={!isSidebarOpen}
                />
                <NavItem 
                  icon={<Library />} 
                  label="Archives" 
                  active={activeTab === 'museum'} 
                  onClick={() => setActiveTab('museum')}
                  collapsed={!isSidebarOpen}
                />
                <NavItem 
                  icon={<Zap />} 
                  label="Resonance" 
                  active={activeTab === 'resonance'} 
                  onClick={() => setActiveTab('resonance')}
                  collapsed={!isSidebarOpen}
                />
                <NavItem 
                  icon={<Beaker />} 
                  label="Research Labs" 
                  active={activeTab === 'labs'} 
                  onClick={() => setActiveTab('labs')}
                  collapsed={!isSidebarOpen}
                />
                <NavItem 
                  icon={<Settings />} 
                  label="My Profile" 
                  active={activeTab === 'settings'} 
                  onClick={() => setActiveTab('settings')}
                  collapsed={!isSidebarOpen}
                />
                {currentUser.role === 'admin' && (
                  <NavItem 
                    icon={<Activity />} 
                    label="Command Center" 
                    active={activeTab === 'admin'} 
                    onClick={() => setActiveTab('admin')}
                    collapsed={!isSidebarOpen}
                  />
                )}
              </nav>

              <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col gap-4">
                <div 
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-3 p-2 rounded-2xl border cursor-pointer transition-all 
                    ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/50 hover:border-slate-200'}
                    ${!isSidebarOpen ? 'justify-center' : ''}`}
                >
                  <div className="w-10 h-10 rounded-xl radiant-gradient flex items-center justify-center text-white font-bold text-xs border border-white shadow-sm overflow-hidden shrink-0">
                    {currentUser.profileImage ? (
                      <img src={currentUser.profileImage} className="w-full h-full object-cover" alt="" />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>
                  {isSidebarOpen && (
                    <div className="overflow-hidden">
                      <p className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{currentUser.name}</p>
                      <p className="text-[10px] text-indigo-500 font-semibold uppercase tracking-wider">{currentUser.role}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`p-2.5 rounded-xl transition-all flex-1 flex justify-center border ${activeTab === 'settings' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50'}`}
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-100 transition-all flex-1 flex justify-center"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main className={`transition-all duration-500 relative min-h-screen py-4 
            ${isSidebarOpen ? 'pl-4 pr-8 lg:pl-80 lg:pr-12' : 'pl-4 pr-8 lg:pl-28 lg:pr-12'}`}
          >
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 lg:hidden"
                />
              )}
            </AnimatePresence>
            <div className={`absolute inset-0 pointer-events-none opacity-[0.03] z-0 ${theme === 'dark' ? 'invert' : ''}`} 
                 style={{ backgroundImage: 'radial-gradient(#6366f1 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
            
            <header className={`${theme === 'dark' ? 'glass-effect-dark' : 'glass-effect'} rounded-3xl sticky top-4 z-40 px-8 py-5 mb-12 flex items-center justify-between shadow-lg shadow-indigo-500/5`}>
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`p-2 rounded-xl transition-all border border-transparent ${theme === 'dark' ? 'hover:bg-slate-800 hover:border-slate-700' : 'hover:bg-slate-100 hover:border-slate-200'}`}
                >
                  <Menu className="w-5 h-5 text-slate-400" />
                </button>
                <div className="flex flex-col">
                  <h2 className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-0.5">
                    {activeTab === 'dashboard' ? 'Neural Dashboard' : 
                     activeTab === 'scan' ? 'Artifact Analysis' : 
                     activeTab === 'observatory' ? 'Global Observatory' :
                     activeTab === 'museum' ? 'Archives Registry' :
                     activeTab === 'resonance' ? 'Resonance Analysis' :
                     activeTab === 'labs' ? 'Research Labs' :
                     activeTab === 'settings' ? 'My Profile Settings' :
                     'Command Center'}
                  </h2>
                  <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>ArcheoMind Core v5.0.0</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setIsVoiceActive(!isVoiceActive)}
                    className={`p-3 rounded-full transition-all border shadow-sm ${isVoiceActive ? 'bg-rose-500 text-white border-rose-400 animate-pulse' : theme === 'dark' ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-indigo-400' : 'bg-white text-slate-400 border-slate-100 hover:text-indigo-600'}`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <NotificationSystem />
                  <button 
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className={`p-3 rounded-full transition-all border shadow-sm ${theme === 'dark' ? 'bg-slate-800 text-indigo-400 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-400 border-slate-100 hover:text-indigo-600'}`}
                  >
                    {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </button>
                <div className={`hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full border ${theme === 'dark' ? 'bg-indigo-950/30 border-indigo-900/50 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Sync: Perfect</span>
                </div>
              </div>
            </header>

            <div className="px-4 max-w-7xl mx-auto pb-12">
              <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && (
                  <motion.div 
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-12"
                  >
                    <AIBriefing artifacts={artifacts} currentUser={currentUser} />
                    <DailySynthesis artifacts={artifacts} />

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                      <div className="space-y-4">
                        <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1 flex items-center gap-2">
                           <Activity className="w-3 h-3" />
                           System Online // Node {currentUser.id.substring(0, 8)}
                        </h2>
                        <h1 className={`text-7xl font-black tracking-tighter font-display leading-[0.85] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          Neural <span className="inline-block text-gradient animate-gradient-x bg-[length:200%_auto]">Archeology</span>
                        </h1>
                        <p className={`max-w-xl leading-relaxed text-base font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {currentUser.role === 'admin' ? 'Monitoring the global repository. Every scanned fragment reconstructs our collective memory.' : 'Your personal archives. Neural mapping complete for all artifacts.'}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setActiveTab('resonance')}
                          className={`px-8 py-5 border-2 font-bold uppercase tracking-widest text-[10px] rounded-[2rem] transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-400' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600'}`}
                        >
                          Deep Resonance
                        </button>
                        <button 
                          onClick={() => setActiveTab('scan')}
                          className="btn-primary flex items-center gap-3 px-10 py-5"
                        >
                          <Plus className="w-6 h-6" />
                          Capture Artifact
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                       <div className="lg:col-span-8 space-y-12">
                          <div className={`glass-card rounded-[3.5rem] p-2 overflow-hidden relative group h-[500px] border-4 ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800 shadow-indigo-900/20' : 'bg-white border-white shadow-indigo-100/50'} shadow-2xl`}>
                            <div className="h-full rounded-[3rem] overflow-hidden relative bg-slate-900">
                              {artifacts.length > 0 ? (
                                (() => {
                                  const selected = artifacts.find(a => a.id === selectedArtifactId) || artifacts[0];
                                  return (
                                    <iframe
                                      width="100%"
                                      height="100%"
                                      frameBorder="0"
                                      scrolling="no"
                                      src={`https://maps.google.com/maps?q=${selected.location?.lat || 0},${selected.location?.lng || 0}(${encodeURIComponent(selected.location?.name || '')})&t=k&z=12&ie=UTF8&iwloc=&output=embed`}
                                      className="opacity-60 saturate-50 hover:saturate-100 transition-all duration-1000 grayscale-[0.5] group-hover:grayscale-0 scale-110 group-hover:scale-100"
                                    />
                                  )
                                })()
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-indigo-400/30">
                                  <Globe className="w-20 h-20 mb-4 animate-spin-slow opacity-30" />
                                  <p className="font-bold uppercase tracking-[0.5em] text-[10px]">Synchronizing Matrix...</p>
                                </div>
                              )}
                              <div className="absolute top-10 left-10 radiant-gradient px-7 py-3 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-md">
                                <h3 className="text-[11px] font-black flex items-center gap-3 text-white uppercase tracking-[0.2em]">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {artifacts.find(a => a.id === selectedArtifactId)?.location?.name || 'Global Grid Active'}
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-8">
                              <div className="space-y-4">
                                 <div className="flex items-center justify-between px-2">
                                    <div className="space-y-1">
                                       <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Historical Records</h4>
                                       <h2 className={`text-3xl font-black tracking-tight font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Neural Archive</h2>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <select 
                                         value={filterType}
                                         onChange={(e) => setFilterType(e.target.value)}
                                         className={`border-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-400 transition-all shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-50 text-slate-500'}`}
                                       >
                                          <option key="all" value="all">All Types</option>
                                          {artifactTypes.map(t => <option key={`type-${t}`} value={t}>{t}</option>)}
                                       </select>
                                       <select 
                                         value={filterVerified}
                                         onChange={(e) => setFilterVerified(e.target.value)}
                                         className={`border-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-indigo-400 transition-all shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-50 text-slate-500'}`}
                                       >
                                          <option key="auth" value="all">Authentication</option>
                                          <option key="verified" value="verified">Verified</option>
                                          <option key="unverified" value="unverified">Unverified</option>
                                       </select>
                                       <div className="relative max-w-xs w-full">
                                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                          <input 
                                            type="text"
                                            placeholder="Neural search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className={`w-full border-2 rounded-2xl py-3.5 pl-12 pr-6 text-xs font-bold focus:outline-none focus:border-indigo-400 transition-all shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-50 text-slate-900'}`}
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {userArtifacts.length > 0 ? (
                                userArtifacts.map((artifact, idx) => (
                                  <motion.div
                                    key={artifact.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
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
                                <div className={`col-span-2 py-32 text-center glass-card border-dashed border-2 rounded-[3rem] ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-slate-100'}`}>
                                  <History className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                                  <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-[10px]">No historical data linked</p>
                                </div>
                              )}
                           </div>
                        </div>
                     </div>

                     <div className="lg:col-span-4 space-y-10">
                        <NeuralPulse artifacts={artifacts} />
                        <HeritageStatus />
                        <ResearchBounties user={currentUser} artifacts={artifacts} />
                        <section className={`glass-card rounded-[3rem] p-10 shadow-xl ${theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white/70 border-white'}`}>
                           <AchievementMatrix user={currentUser} />
                        </section>
                        <section className={`glass-card rounded-[3rem] p-2 border-slate-800 shadow-2xl relative overflow-hidden group ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-900'}`}>
                           <div className="h-64 rounded-[2.5rem] overflow-hidden bg-slate-950 border border-slate-800 relative shadow-inner">
                              <ThreeViewer />
                           </div>
                           <div className="p-8">
                              <h5 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Spatial Mesh</h5>
                              <p className="text-xs text-slate-400 font-medium leading-relaxed italic">Synthesizing 3D geometry from high-fidelity laser telemetry.</p>
                           </div>
                        </section>
                     </div>
                  </div>

                  <AnimatePresence>
                    {selectedArtifactId && artifacts.find(a => a.id === selectedArtifactId) && (
                        <DiscoveryDetails 
                          currentUser={currentUser}
                          artifact={artifacts.find(a => a.id === selectedArtifactId)!} 
                          onClose={() => setSelectedArtifactId(null)} 
                          onUpdateArtifact={(updated) => {
                            storage.saveArtifact(updated);
                          }}
                        />
                    )}
                  </AnimatePresence>

                  <GlobalChat currentUser={currentUser} />
                  <AIResearchAssistant currentUser={currentUser} artifacts={artifacts} />
                  <AnimatePresence>
                     {isComparing && (
                        <ComparativeAnalyzer artifacts={artifacts} onClose={() => setIsComparing(false)} />
                     )}
                  </AnimatePresence>
                </motion.div>
              )}

              {activeTab === 'observatory' && (
                <motion.div 
                  key="observatory"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlobalObservatory artifacts={artifacts} />
                </motion.div>
              )}

              {activeTab === 'museum' && (
                <motion.div 
                  key="museum"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-16 py-8"
                >
                  <ResearcherLeaderboard users={users} artifacts={artifacts} />
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
                     <div className="space-y-2">
                        <h2 className={`text-4xl font-black tracking-tight font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Neural <span className="text-indigo-600">Museum</span></h2>
                        <p className="text-slate-500 text-sm font-medium">Interactive archive of human achievement.</p>
                     </div>
                     <button 
                       onClick={() => setIsComparing(true)}
                       className="px-10 py-5 radiant-gradient text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-3xl shadow-2xl shadow-indigo-200 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4 border-4 border-white/20"
                     >
                        <ArrowRightLeft className="w-5 h-5" />
                        Initialize Comparative Mode
                     </button>
                  </div>
                  <ArchaeologicalTimeline artifacts={artifacts} />
                  <BentoMuseum artifacts={artifacts} />
                </motion.div>
              )}

              {activeTab === 'resonance' && (
                <motion.div 
                  key="resonance"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-16 py-8"
                >
                  <NeuralComparator artifacts={artifacts} />
                  <ResonanceAnalyzer artifacts={artifacts} />
                </motion.div>
              )}

              {activeTab === 'scan' && (
                <motion.div 
                  key="scan"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="max-w-4xl mx-auto py-12"
                >
                  <div className="text-center mb-16 space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="h-px w-12 bg-indigo-100" />
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.4em]">Spatial Protocol</span>
                      <div className="h-px w-12 bg-indigo-100" />
                    </div>
                    <h1 className={`text-7xl font-extrabold tracking-tight font-display leading-[0.9] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Artifact <br/> 
                      <span className="inline-block text-gradient bg-[length:200%_auto] animate-gradient-x">Analysis</span>
                    </h1>
                    <p className={`max-w-lg mx-auto leading-relaxed font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Deployment lens active. ArcheoMind AI will autonomously decode the fragment and synthesize original discovery coordinates.
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
                      setSelectedArtifactId(id); 
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
                      setSelectedArtifactId(id);
                    }}
                    onCancel={() => {
                      setManualEntryData(null);
                      setActiveTab('scan');
                    }}
                  />
                </motion.div>
              )}

              {activeTab === 'labs' && (
                <motion.div 
                  key="labs"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="py-12"
                >
                  <ResearchLabsHub currentUser={currentUser} artifacts={artifacts} />
                </motion.div>
              )}

              {activeTab === 'admin' && currentUser.role === 'admin' && (
                <motion.div 
                  key="admin"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-24 py-12"
                >
                  <NetworkHealth />
                  <AdminDashboard artifacts={artifacts} currentUser={currentUser} onUpdate={() => {}} />
                  <NeuralAuditLogs />
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
                    }} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <VoiceSearchOverlay 
              isOpen={isVoiceActive} 
              onClose={() => setIsVoiceActive(false)} 
            />
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
      className={`sidebar-item w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative active:scale-95 ${active ? 'radiant-gradient text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50/50' : 'text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'}`}
    >
      <span className={`shrink-0 transition-transform duration-500 ${active ? 'scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'group-hover:scale-110'}`}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
      </span>
      {!collapsed && <span className="font-black text-[10px] tracking-[0.2em] uppercase leading-none">{label}</span>}
      {collapsed && (
        <div className="absolute left-20 glass-effect-dark text-white px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-2xl border-white/20 translate-x-4 group-hover:translate-x-0">
          {label}
        </div>
      )}
      {active && (
        <motion.div 
          layoutId="active-pill"
          className="absolute -left-1 top-2 bottom-2 w-1 bg-white rounded-full z-10 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        />
      )}
    </button>
  );
}
