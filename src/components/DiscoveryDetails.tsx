import React, { useState, useEffect } from 'react';
import { Artifact, Comment, User, Exhibit } from '../types';
import { 
  X, 
  ShieldCheck, 
  Activity, 
  MapPin, 
  Plus, 
  Layers, 
  FileText, 
  History, 
  Download,
  Mic,
  MessageSquare,
  Sparkles,
  Info,
  Copy,
  Check,
  Zap,
  Globe,
  Share2,
  Library,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translateDescription, askHistorian } from '../services/geminiService';
import { storage } from '../services/storageService';
import ArtifactComments from './ArtifactComments';
import ArtifactHistory from './ArtifactHistory';
import ScientificToolkit from './ScientificToolkit';

interface DiscoveryDetailsProps {
  artifact: Artifact;
  onClose: () => void;
  currentUser: User | null;
  onUpdateArtifact: (artifact: Artifact) => void;
}

export default function DiscoveryDetails({ artifact, onClose, currentUser, onUpdateArtifact }: DiscoveryDetailsProps) {
  const [copied, setCopied] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'comments' | 'ledger' | 'science'>('analysis');
  const [isExhibitOpen, setIsExhibitOpen] = useState(false);
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);

  useEffect(() => {
    storage.getExhibits().then(setExhibits);
  }, []);

  const handleAddToExhibit = async (exhibitId: string) => {
     // This would ideally be a storage update for exhibits, but for now we simulate or use existing
     console.log("Adding to exhibit", exhibitId);
     setIsExhibitOpen(false);
  };

  const handleCreateExhibit = async () => {
    if (!currentUser) return;
    const name = prompt("Enter Exhibit Name:");
    if (!name) return;
    
    await storage.saveExhibit({
      name,
      description: `Curated collection featuring ${artifact.name}`,
      artifactIds: [artifact.id],
      createdBy: currentUser.id,
      creatorName: currentUser.name
    });
    
    const fresh = await storage.getExhibits();
    setExhibits(fresh);
    setIsExhibitOpen(false);
  };

  const handleAskHistorian = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim() || isAsking) return;

    const userMessage = chatQuery;
    setChatQuery('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsAsking(true);

    try {
      const answer = await askHistorian(artifact, userMessage);
      setChatHistory(prev => [...prev, { role: 'ai', content: answer }]);
    } catch (error) {
      console.error("AI Historian failed:", error);
      setChatHistory(prev => [...prev, { role: 'ai', content: "Neural link interrupted. Historical record inaccessible at this moment." }]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleAddComment = (text: string) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substring(7),
      userId: currentUser.id,
      userName: currentUser.name,
      text,
      timestamp: Date.now(),
      likes: 0
    };
    
    const updatedArtifact = {
      ...artifact,
      comments: [...(artifact.comments || []), newComment],
      history: [...(artifact.history || []), {
        id: Math.random().toString(36).substring(7),
        action: 'Neural Link Added',
        actor: currentUser.name,
        timestamp: Date.now(),
        description: `Verified researcher contributed to the discourse: "${text.substring(0, 30)}..."`
      }]
    };
    onUpdateArtifact(updatedArtifact);
  };

  const copyToClipboard = () => {
    if (artifact.reconstructionPrompt) {
      navigator.clipboard.writeText(artifact.reconstructionPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    // Simulated Export
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(artifact, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `${artifact.name.replace(/\s+/g, '_')}_dossier.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-50/95 backdrop-blur-3xl"
    >
      <div className="min-h-screen flex justify-center py-20 px-6 md:px-20">
        <div className="w-full max-w-7xl relative h-fit">
          
          <div className="fixed top-6 right-6 flex gap-4 z-[100]">
             <div className="relative">
               <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExhibitOpen(!isExhibitOpen)}
                  className={`p-4 glass-effect rounded-2xl transition-all shadow-xl border-white ${isExhibitOpen ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-white/50 text-slate-400 hover:bg-white hover:text-indigo-600'}`}
                  title="Curate to Exhibit"
                >
                  <Library className="w-6 h-6" />
                </motion.button>
                <AnimatePresence>
                   {isExhibitOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute top-full right-0 mt-4 w-64 glass-card bg-white p-6 rounded-[2rem] shadow-2xl z-[70] border-white"
                      >
                         <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4">Neural Exhibits</h4>
                         <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {exhibits.length === 0 ? (
                               <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest italic py-4">No active exhibits</p>
                            ) : (
                               exhibits.map(ex => (
                                  <button
                                    key={ex.id}
                                    onClick={() => handleAddToExhibit(ex.id)}
                                    className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 flex items-center justify-between group"
                                  >
                                     <span className="text-xs font-bold text-slate-700 truncate">{ex.name}</span>
                                     <Plus className="w-3 h-3 text-slate-300 group-hover:text-indigo-500" />
                                  </button>
                               ))
                            )}
                         </div>
                         <button 
                           onClick={handleCreateExhibit}
                           className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
                         >
                           + Create New Exhibit
                         </button>
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>
             
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={handleExport}
               className="p-4 glass-effect bg-indigo-600 text-white rounded-2xl transition-all shadow-xl shadow-indigo-200 border-indigo-400"
               title="Export Neural Dossier"
             >
               <Download className="w-6 h-6" />
             </motion.button>
             <motion.button 
               whileHover={{ scale: 1.05, rotate: 90 }}
               whileTap={{ scale: 0.95 }}
               onClick={onClose}
               className="p-4 glass-effect bg-white/50 rounded-2xl hover:bg-white transition-all text-slate-400 hover:text-rose-500 shadow-xl border-white"
             >
               <X className="w-6 h-6" />
             </motion.button>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Visuals stays consistent */}
          <div className="lg:col-span-1 space-y-10">
            <div className="aspect-square rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl relative group bg-white">
              <div className={`w-full h-full transition-all duration-1000 ${isRestoring ? 'saturate-200 brightness-110 contrast-125 sepia-[0.3] hue-rotate-[10deg]' : ''}`}>
                <img src={artifact.imageUrl} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" alt={artifact.name} />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              
              <button 
                onClick={() => setIsRestoring(!isRestoring)}
                className={`absolute top-10 right-10 p-4 rounded-2xl border transition-all backdrop-blur-md z-20 ${isRestoring ? 'bg-emerald-500/80 text-white border-emerald-400' : 'bg-white/20 text-white border-white/20 hover:bg-white/40'}`}
              >
                {isRestoring ? <Zap className="w-5 h-5 animate-pulse" /> : <Sparkles className="w-5 h-5" />}
                <div className="absolute top-full right-0 mt-3 whitespace-nowrap bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {isRestoring ? 'Deactivate Neural Restoration' : 'Neural Restoration Active'}
                </div>
              </button>

              <div className="absolute bottom-10 left-10 right-10">
                <div className="radiant-gradient px-4 py-1.5 rounded-full w-fit mb-4 shadow-lg shadow-indigo-200 border border-white/20">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none flex items-center gap-2">
                    <Activity className="w-3 h-3" />
                    Archive Integrity: {(artifact.confidenceScore * 100).toFixed(0)}%
                  </span>
                </div>
                {isRestoring && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-4 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-4 py-2 rounded-xl"
                  >
                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Visual Restoration: Phase Alpha
                    </p>
                  </motion.div>
                )}
                <h2 className="text-5xl font-black tracking-tighter leading-none text-white font-display mb-2">{artifact.name}</h2>
                <div className="flex items-center gap-2 text-indigo-200 text-[10px] font-black uppercase tracking-[0.3em]">
                   <Globe className="w-3.5 h-3.5" />
                   {artifact.civilization} // {artifact.estimatedEra}
                </div>
                {artifact.region && (
                  <div className="mt-2 flex items-center gap-2 text-indigo-100/60 text-[8px] font-bold uppercase tracking-[0.4em]">
                    <MapPin className="w-2.5 h-2.5" />
                    {artifact.region.continent} · {artifact.region.country} {artifact.region.state ? `· ${artifact.region.state}` : ''}
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card border-white bg-white/70 rounded-[3rem] p-10 space-y-8 shadow-xl shadow-indigo-50">
                {/* Visual Depth Indicators */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl">
                      <Layers className="w-4 h-4 text-indigo-500" />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Excavation Layer</h4>
                  </div>
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                     LEVEL: {artifact.stratigraphy?.layer || 'ALPHA'}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="flex items-end gap-3 h-24 bg-slate-50/50 rounded-2xl border-2 border-white p-4 relative shadow-inner overflow-hidden">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: Math.random() * 100 + '%' }}
                        className={`flex-1 rounded-full ${i % 3 === 0 ? 'bg-indigo-500' : 'bg-slate-200'}`}
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <p className="text-xl font-black text-slate-900 tracking-tighter">{artifact.stratigraphy?.depth || '0.0'}m DEPTH</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed italic text-center">
                     "{artifact.stratigraphy?.description || 'Surface collection, minimal stratigraphic interference.'}"
                  </p>
                </div>
            </div>

            {/* Achievement Matrix Hook (if this is the user's find) */}
            {currentUser?.id === artifact.userId && (
              <div className="p-8 radiant-gradient rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 group overflow-hidden relative">
                 <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Zap className="w-32 h-32" />
                 </div>
                 <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-indigo-100">Neural Sync Success</p>
                    <h4 className="text-xl font-black tracking-tight mb-2">+150 Synapse XP</h4>
                    <p className="text-xs font-medium text-white/80 leading-relaxed mb-6">Discovery hash confirmed. Your contribution to the global record has been verified.</p>
                    <button className="w-full py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">Claim Matrix Reward</button>
                 </div>
              </div>
            )}
          </div>

          {/* Tabbed Interface for Meta Data */}
          <div className="lg:col-span-2 space-y-10 py-4">
             <div className="flex items-center gap-6 p-2 bg-white/50 border border-white rounded-[2rem] w-fit shadow-lg shadow-indigo-100/30 mb-8 sticky top-4 z-40 backdrop-blur-xl">
                <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} icon={<Activity />} label="Analysis" />
                <TabButton active={activeTab === 'science'} onClick={() => setActiveTab('science')} icon={<Zap />} label="Science Lab" />
                <TabButton active={activeTab === 'comments'} onClick={() => setActiveTab('comments')} icon={<MessageSquare />} label="Neural Links" />
                <TabButton active={activeTab === 'ledger'} onClick={() => setActiveTab('ledger')} icon={<History />} label="Ledger" />
             </div>

             <AnimatePresence mode="wait">
                {activeTab === 'analysis' && (
                  <motion.div 
                    key="analysis"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-12"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-10">
                        <section className="space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="p-1.5 bg-indigo-50 rounded-lg"><Info className="w-4 h-4 text-indigo-500" /></div>
                                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Historical Narrative</h4>
                              </div>
                              <select 
                                onChange={async (e) => {
                                  if (e.target.value === 'original') return;
                                  const translated = await import('../services/geminiService').then(m => m.translateDescription(artifact.description, e.target.value));
                                  onUpdateArtifact({...artifact, description: translated});
                                }}
                                className="bg-slate-50 border border-slate-100 rounded-lg text-[8px] font-black uppercase tracking-widest px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              >
                                 <option value="original">Translate</option>
                                 <option value="Spanish">Español</option>
                                 <option value="French">Français</option>
                                 <option value="German">Deutsch</option>
                                 <option value="Chinese">中文</option>
                                 <option value="Hindi">हिन्दी</option>
                                 <option value="Japanese">日本語</option>
                              </select>
                           </div>
                           <p className="text-xl font-medium text-slate-800 leading-[1.6] tracking-tight">{artifact.description}</p>
                           <div className="p-8 bg-slate-50 border-2 border-white rounded-[2.5rem] shadow-inner font-medium italic text-slate-500 text-base leading-relaxed">
                              "{artifact.historicalContext}"
                           </div>
                        </section>

                        <section className="space-y-6">
                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Neural Signatures</h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <InsightCard label="Carbon Matrix" content={artifact.materialAnalysis || "Undetermined"} color="text-indigo-600" />
                              <InsightCard label="Cultural Output" content={artifact.culturalSignificance || "Analyzing..."} color="text-violet-600" />
                              <InsightCard label="Functional Logic" content={artifact.historicalUsage || "Ritual use probable"} color="text-emerald-600" />
                              <InsightCard label="Social Tier" content={artifact.socialStructureInference || "Class stratified"} color="text-amber-600" />
                           </div>
                        </section>
                      </div>

                      <div className="space-y-10">
                        <section className="space-y-4">
                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Discovery Vector</h4>
                           <div className="aspect-[4/3] rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden relative group bg-white">
                              <iframe 
                                width="100%" height="100%" frameBorder="0" scrolling="no" 
                                src={`https://maps.google.com/maps?q=${artifact.location?.lat || 0},${artifact.location?.lng || 0}&z=10&t=k&output=embed`}
                                className="grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 saturate-150"
                              />
                              <div className="absolute bottom-6 left-6 radiant-gradient px-5 py-2.5 rounded-2xl shadow-xl shadow-indigo-200 border border-white/20 backdrop-blur-md">
                                 <p className="text-[10px] font-black text-white uppercase tracking-widest">{artifact.location?.name}</p>
                              </div>
                           </div>
                        </section>

                        {artifact.reconstructionPrompt && (
                          <section className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Reconstruction Prompt</h4>
                               <button onClick={copyToClipboard} className="text-indigo-500 hover:text-indigo-700 transition-colors">
                                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                               </button>
                            </div>
                            <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl relative group">
                               <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-125 transition-transform duration-1000">
                                  <Zap className="w-32 h-32 text-indigo-400" />
                               </div>
                               <p className="text-xs font-mono text-indigo-100/80 leading-relaxed relative z-10">{artifact.reconstructionPrompt}</p>
                            </div>
                          </section>
                        )}
                      </div>
                    </div>

                    <section className="glass-card border-white bg-white rounded-[3.5rem] p-10 space-y-8 shadow-2xl">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="p-3 radiant-gradient rounded-2xl shadow-lg shadow-indigo-100">
                                <MessageSquare className="w-6 h-6 text-white" />
                             </div>
                             <h3 className="text-3xl font-black text-slate-900 tracking-tight">Neural Codex Chat</h3>
                          </div>
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">AI Expert Online</span>
                       </div>
                       
                       <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                          {chatHistory.length === 0 ? (
                            <div className="py-12 text-center opacity-30 italic text-slate-500 text-sm">Initiate query to decipher historical anomalies...</div>
                          ) : (
                            chatHistory.map((m, i) => (
                              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`p-6 rounded-[2.5rem] text-sm font-medium leading-relaxed max-w-[85%] ${m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-indigo-50/50 text-slate-700 rounded-tl-none border border-white'}`}>
                                    {m.content}
                                 </div>
                              </div>
                            ))
                          )}
                          {isAsking && <div className="text-xs font-bold text-indigo-400 animate-pulse bg-indigo-50 w-fit px-4 py-2 rounded-full border border-indigo-100">AI SIFTING THROUGH ARCHIVES...</div>}
                       </div>

                       <form onSubmit={handleAskHistorian} className="flex gap-4">
                          <input 
                            value={chatQuery}
                            onChange={e => setChatQuery(e.target.value)}
                            placeholder="Decipher the past..."
                            className="flex-1 bg-slate-50 border-2 border-white rounded-3xl px-8 py-5 text-sm font-bold focus:outline-none focus:border-indigo-400 transition-all shadow-inner"
                          />
                          <button disabled={isAsking} className="radiant-gradient px-10 rounded-3xl text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.03] active:scale-95 transition-all">Transmit</button>
                       </form>
                    </section>
                  </motion.div>
                )}

                {activeTab === 'comments' && (
                  <motion.div 
                    key="comments"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-3xl mx-auto"
                  >
                    <ArtifactComments 
                      comments={artifact.comments || []} 
                      onAddComment={handleAddComment} 
                      currentUser={currentUser} 
                    />
                  </motion.div>
                )}

                {activeTab === 'science' && (
                  <motion.div 
                    key="science"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-4xl mx-auto"
                  >
                    <ScientificToolkit />
                  </motion.div>
                )}

                {activeTab === 'ledger' && (
                  <motion.div 
                    key="ledger"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-3xl mx-auto"
                  >
                    <ArtifactHistory history={artifact.history || artifact.provenanceChain?.map(p => ({
                      id: p.id,
                      action: p.step,
                      actor: p.actor,
                      timestamp: p.timestamp,
                      description: `System generated log for ${p.step} event.`
                    })) || []} />
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
        </div>
      </div>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-8 py-4 rounded-[1.5rem] flex items-center gap-3 transition-all ${
        active 
        ? 'radiant-gradient text-white shadow-xl shadow-indigo-100' 
        : 'text-slate-400 hover:text-indigo-600 hover:bg-white'
      }`}
    >
      <div className={`transition-transform duration-500 ${active ? 'scale-110' : 'scale-100'}`}>
         {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
      </div>
      <span className="text-[11px] font-black uppercase tracking-widest leading-none">{label}</span>
    </button>
  );
}
function InsightCard({ label, content, color }: { label: string, content: string, color: string }) {
  return (
    <div className="p-6 bg-white border border-slate-50 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group">
      <h5 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${color} opacity-60 group-hover:opacity-100 transition-opacity`}>{label}</h5>
      <p className="text-xs font-bold text-slate-600 leading-relaxed">{content}</p>
    </div>
  );
}

function ReportCard({ label, content }: { label: string, content: string }) {
  return (
    <div className="glass-card border-white bg-white p-8 rounded-[2.5rem] shadow-sm hover:border-indigo-100 transition-all group">
      <div className="flex items-center justify-between mb-4">
         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-indigo-500 transition-colors">{label}</h4>
         <div className="w-1.5 h-1.5 bg-slate-100 rounded-full group-hover:bg-indigo-400 transition-colors" />
      </div>
      <p className="text-base text-slate-800 font-extrabold tracking-tight leading-tight">{content}</p>
    </div>
  );
}
