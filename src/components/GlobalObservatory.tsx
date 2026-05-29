import React, { useMemo, useState, useEffect } from 'react';
import { Artifact } from '../types';
import { Globe, Users, Activity, Map as MapIcon, Database, ShieldCheck, Compass, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { predictHotspots } from '../services/geminiService';

interface Hotspot {
  name: string;
  lat: number;
  lng: number;
  reasoning: string;
  inferredCivilization: string;
}

interface LiveSite {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  status: 'Active' | 'Under Analysis' | 'Mapping';
  discoveryType: string;
  researchLead: string;
}

interface GlobalObservatoryProps {
  artifacts: Artifact[];
}

export default function GlobalObservatory({ artifacts }: GlobalObservatoryProps) {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [isLiveMode, setIsLiveMode] = useState(false);

  const liveSites: LiveSite[] = [
    { id: 'ls1', name: 'Rakhigarhi Excavation', location: 'Haryana, India', lat: 29.28, lng: 76.08, status: 'Active', discoveryType: 'Harappan Cemetery', researchLead: 'S.K. Manjul (ASI)' },
    { id: 'ls2', name: 'Pompeii Regio IX', location: 'Naples, Italy', lat: 40.75, lng: 14.48, status: 'Active', discoveryType: 'Roman Insula & Frescoes', researchLead: 'Gabriel Zuchtriegel' },
    { id: 'ls3', name: 'Giza ScanPyramids', location: 'Giza, Egypt', lat: 29.97, lng: 31.13, status: 'Active', discoveryType: 'Great Pyramid Void Analysis', researchLead: 'Hany Helal' },
    { id: 'ls4', name: 'Keeladi Phase IX', location: 'Tamil Nadu, India', lat: 9.86, lng: 78.18, status: 'Active', discoveryType: 'Sangam Era Urban Settlement', researchLead: 'R. Sivanandam' },
    { id: 'ls5', name: 'Terracotta Army Pit 1', location: 'Xi\'an, China', lat: 34.38, lng: 109.27, status: 'Active', discoveryType: 'Qin Emperor Mausoleum', researchLead: 'Shen Maosheng' },
    { id: 'ls6', name: 'Chichén Itzá Subterranean', location: 'Yucatán, Mexico', lat: 20.68, lng: -88.56, status: 'Mapping', discoveryType: 'Maya Sacred Cenote Links', researchLead: 'Guillermo de Anda' },
    { id: 'ls7', name: 'Vadnagar Multi-Cultural Site', location: 'Gujarat, India', lat: 23.78, lng: 72.63, status: 'Under Analysis', discoveryType: 'Buddhist Monastery', researchLead: 'Abhijit Ambekar' },
    { id: 'ls8', name: 'Machu Picchu Conservation', location: 'Cusco, Peru', lat: -13.16, lng: -72.54, status: 'Mapping', discoveryType: 'Inca Terrace Hydrology', researchLead: 'Jose Bastante' },
    { id: 'ls9', name: 'Troy Archaeological Project', location: 'Hisarlik, Turkey', lat: 39.95, lng: 26.23, status: 'Active', discoveryType: 'Lower City Fortifications', researchLead: 'Rustem Aslan' },
    { id: 'ls10', name: 'Stonehenge Hidden Landscape', location: 'Wiltshire, UK', lat: 51.17, lng: -1.82, status: 'Under Analysis', discoveryType: 'Neolithic Pit Alignments', researchLead: 'Vince Gaffney' },
    { id: 'ls11', name: 'Petra Garden & Pool', location: 'Ma\'an, Jordan', lat: 30.32, lng: 35.44, status: 'Active', discoveryType: 'Nabataean Hydraulic Engineering', researchLead: 'Leigh-Ann Bedal' },
    { id: 'ls12', name: 'Great Zimbabwe Walls', location: 'Masvingo, Zimbabwe', lat: -20.27, lng: 30.93, status: 'Mapping', discoveryType: 'Iron Age Capital Forensics', researchLead: 'Shadreck Chirikure' },
    { id: 'ls13', name: 'Tikal Temple IV', location: 'Petén, Guatemala', lat: 17.22, lng: -89.62, status: 'Active', discoveryType: 'Late Classic Maya Dynastic Text', researchLead: 'Edwin Román-Ramírez' },
    { id: 'ls14', name: 'Angkor Wat Reservoir', location: 'Siem Reap, Cambodia', lat: 13.41, lng: 103.86, status: 'Under Analysis', discoveryType: 'Khmer Hydraulic Network', researchLead: 'Alison Carter' },
    { id: 'ls15', name: 'Göbekli Tepe Karahantepe', location: 'Şanlıurfa, Turkey', lat: 37.22, lng: 38.92, status: 'Active', discoveryType: 'Pre-Pottery Neolithic T-Pillars', researchLead: 'Necmi Karul' }
  ];

  const stats = useMemo(() => {
    return {
      total: artifacts.length,
      verified: artifacts.filter(a => a.isVerified).length,
      civilizations: new Set(artifacts.map(a => a.civilization)).size,
      activeRegions: new Set(artifacts.map(a => a.location.name)).size
    };
  }, [artifacts]);

  const fetchHotspots = async () => {
    if (artifacts.length === 0) return;
    setIsPredicting(true);
    try {
      const data = await predictHotspots(artifacts);
      setHotspots(data);
    } catch (error) {
      console.error("Hotspot error:", error);
    } finally {
      setIsPredicting(false);
    }
  };

  useEffect(() => {
    if (artifacts.length > 0) {
      fetchHotspots();
    }
  }, []);

  // Simulated real-time users
  const activeResearchers = [
    { id: 1, name: 'Dr. Aris Thorne', location: 'Giza, Egypt', status: 'Excavating' },
    { id: 2, name: 'Elena Vance', location: 'Cusco, Peru', status: 'Mapping' },
    { id: 3, name: 'Marcus Aurelius', location: 'Athens, Greece', status: 'Analyzing' }
  ];

  return (
    <div className="space-y-12">
      {/* Real-time Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusCard icon={<Activity />} label="Neural Load" value="98.4%" color="text-indigo-600" bgColor="bg-indigo-50" />
        <StatusCard icon={<ShieldCheck />} label="Verified Records" value={stats.verified.toString()} color="text-emerald-600" bgColor="bg-emerald-50" />
        <StatusCard icon={<Database />} label="Global Clusters" value={stats.civilizations.toString()} color="text-violet-600" bgColor="bg-violet-50" />
        <StatusCard icon={<Compass />} label="Discovery Rate" value="0.8/hr" color="text-rose-600" bgColor="bg-rose-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Global Discovery Map (Heatmap simulated) */}
        <div className="lg:col-span-2 glass-card border-white/50 bg-white/70 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">GLOBAL OBSERVATORY</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Real-Time Spatial Intelligence Matrix</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isLiveMode ? 'bg-rose-600 text-white shadow-lg shadow-rose-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
              >
                <Activity className="w-3.5 h-3.5" />
                Live Mode: {isLiveMode ? 'ACTIVE' : 'OFF'}
              </button>
              <button 
                onClick={() => setShowHotspots(!showHotspots)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${showHotspots ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Hotspots: {showHotspots ? 'ON' : 'OFF'}
              </button>
              <div className="flex items-center gap-3 text-[10px] font-bold text-indigo-500 uppercase tracking-widest px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                Live Feed Active
              </div>
            </div>
          </div>

          <div className="aspect-video bg-slate-100 rounded-[2.5rem] border border-slate-200 overflow-hidden relative shadow-inner group/map">
            <iframe 
               width="100%" 
               height="100%" 
               frameBorder="0" 
               scrolling="no" 
               src={`https://maps.google.com/maps?q=${isLiveMode ? 20 : (artifacts[0]?.location?.lat || 20)},${isLiveMode ? 0 : (artifacts[0]?.location?.lng || 78)}&z=${isLiveMode ? 2 : 4}&t=k&ie=UTF8&iwloc=&output=embed`}
               className="grayscale opacity-50 contrast-[1.1] saturate-50 hover:opacity-70 transition-opacity duration-1000 scale-110"
            />
            
            {/* Real Discovery Pins & AI Hotspots & Live Sites */}
            <div className="absolute inset-0 pointer-events-none">
              {!isLiveMode && artifacts.filter(a => (a.location?.lat || 0) !== 0 || (a.location?.lng || 0) !== 0).map((a, i) => {
                const lat = a.location?.lat || 0;
                const lng = a.location?.lng || 0;
                const top = ((90 - lat) / 180) * 100;
                const left = ((lng + 180) / 360) * 100;

                return (
                  <motion.div
                     key={a.id}
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                     style={{ 
                        top: `${Math.max(5, Math.min(95, top))}%`, 
                        left: `${Math.max(5, Math.min(95, left))}%` 
                     }}
                     className="absolute w-6 h-6 -ml-3 -mt-3 z-20 pointer-events-auto cursor-pointer group/pin"
                  >
                    <div className="absolute inset-0 radiant-gradient rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)] border-2 border-white scale-75 group-hover/pin:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20" />
                    
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 pointer-events-none opacity-0 group-hover/pin:opacity-100 transition-all duration-300 translate-y-2 group-hover/pin:translate-y-0 z-30">
                      <div className="glass-card bg-slate-900/90 text-white p-4 border-slate-700 rounded-2xl whitespace-nowrap shadow-2xl min-w-[160px]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300">Verified Discovery</p>
                        </div>
                        <p className="text-xs font-black tracking-tight mb-1">{a.name}</p>
                        <div className="flex justify-between items-center gap-4">
                          <p className="text-[10px] font-bold text-slate-400">{a.civilization}</p>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-slate-900/90 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b border-slate-700" />
                    </div>
                  </motion.div>
                );
              })}

              {isLiveMode && liveSites.map((site, i) => {
                const top = ((90 - site.lat) / 180) * 100;
                const left = ((site.lng + 180) / 360) * 100;

                return (
                  <motion.div
                    key={site.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
                    style={{ 
                       top: `${Math.max(5, Math.min(95, top))}%`, 
                       left: `${Math.max(5, Math.min(95, left))}%` 
                    }}
                    className="absolute w-10 h-10 -ml-5 -mt-5 z-40 pointer-events-auto cursor-pointer group/live"
                  >
                    <div className="absolute inset-0 bg-rose-500 rounded-full shadow-[0_0_25px_rgba(244,63,94,0.9)] border-4 border-white flex items-center justify-center">
                       <Activity className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-rose-400 rounded-full animate-ping opacity-60" />
                    
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 pointer-events-none opacity-0 group-hover/live:opacity-100 transition-all duration-300 translate-y-2 group-hover/live:translate-y-0 z-50">
                       <div className="glass-card bg-slate-950 text-white p-6 border-rose-500/30 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] min-w-[320px]">
                          <div className="flex items-center gap-4 mb-4">
                             <div className="p-3 bg-rose-500/20 rounded-2xl">
                                <Activity className="w-5 h-5 text-rose-400" />
                             </div>
                             <div>
                                <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em]">Live Excavation Feed</h4>
                                <h3 className="text-2xl font-black tracking-tight">{site.name}</h3>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-5">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                              <p className="text-xs font-black text-emerald-400 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                {site.status}
                              </p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Region</p>
                              <p className="text-xs font-black">{site.location}</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Primary Objective</p>
                              <p className="text-sm font-medium text-white/90 leading-relaxed capitalize">{site.discoveryType}</p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                              <div className="flex items-center gap-2">
                                <Users className="w-3 h-3 text-rose-400" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Lead: {site.researchLead}</span>
                              </div>
                              <span className="text-[9px] font-mono opacity-50">{site.lat.toFixed(3)}, {site.lng.toFixed(3)}</span>
                            </div>
                          </div>
                       </div>
                       <div className="w-5 h-5 bg-slate-950 rotate-45 absolute -bottom-2.5 left-1/2 -translate-x-1/2 border-r border-b border-rose-500/30" />
                    </div>
                  </motion.div>
                );
              })}

              {!isLiveMode && showHotspots && hotspots.map((spot, i) => {
                const top = ((90 - spot.lat) / 180) * 100;
                const left = ((spot.lng + 180) / 360) * 100;

                return (
                  <motion.div
                    key={`hotspot-${i}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                    transition={{ delay: 1 + (i * 0.2), duration: 0.4, ease: "easeOut" }}
                    style={{ 
                       top: `${Math.max(5, Math.min(95, top))}%`, 
                       left: `${Math.max(5, Math.min(95, left))}%` 
                    }}
                    className="absolute w-8 h-8 -ml-4 -mt-4 z-20 pointer-events-auto cursor-pointer group/hotspot"
                  >
                    <div className="absolute inset-0 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] border-4 border-white flex items-center justify-center">
                       <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-40" />
                    
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 pointer-events-none opacity-0 group-hover/hotspot:opacity-100 transition-all duration-300 translate-y-2 group-hover/hotspot:translate-y-0 z-30">
                       <div className="glass-card bg-emerald-900/95 text-white p-6 border-emerald-700 rounded-[2rem] shadow-2xl min-w-[280px]">
                          <div className="flex items-center gap-3 mb-4">
                             <div className="p-2 bg-emerald-500/20 rounded-xl">
                                <Activity className="w-4 h-4 text-emerald-400" />
                             </div>
                             <div>
                                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">AI Predictive Hotspot</h4>
                                <h3 className="text-xl font-black tracking-tight">{spot.name}</h3>
                             </div>
                          </div>
                          <p className="text-xs text-white/80 leading-relaxed font-medium mb-4 italic">"{spot.reasoning}"</p>
                          <div className="flex justify-between items-center pt-4 border-t border-emerald-500/20">
                             <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{spot.inferredCivilization}</span>
                             <span className="text-[9px] font-mono opacity-50 px-3 py-1 bg-white/5 rounded-lg border border-white/10">{spot.lat.toFixed(2)}, {spot.lng.toFixed(2)}</span>
                          </div>
                       </div>
                       <div className="w-4 h-4 bg-emerald-900/95 rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2 border-r border-b border-emerald-700" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Scan Sweep Effect */}
            <motion.div 
              animate={{ left: ['-10%', '110%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 bottom-0 w-px bg-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.5)] z-10"
            />

            {/* Live Data Ticker */}
            <AnimatePresence>
              {isLiveMode && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-6 left-6 right-6 z-30"
                >
                  <div className="glass-card bg-slate-950/80 border-rose-500/30 backdrop-blur-xl px-8 py-3 rounded-full flex items-center gap-10 overflow-hidden">
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Live Telemetry Stream</span>
                    </div>
                    <div className="flex items-center gap-12 animate-scroll-text whitespace-nowrap">
                      {liveSites.map((site, i) => (
                        <div key={`ticker-${site.id}`} className="flex items-center gap-4">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">[{site.lat.toFixed(2)}, {site.lng.toFixed(2)}]</span>
                          <span className="text-xs font-black text-white/90 uppercase tracking-tight">{site.name}</span>
                          <span className="text-[9px] font-bold text-rose-500/60 uppercase">— {site.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Decorative Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Real-time Web of Researchers */}
        <div className="glass-card border-white/50 bg-white/70 rounded-[3rem] p-10 space-y-8">
          <div className="space-y-1">
             <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xl font-extrabold tracking-tight text-slate-900">Research Web</h3>
             </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Active Expedition Links</p>
          </div>

          <div className="space-y-4">
            {(isLiveMode ? liveSites.map(s => ({ id: s.id, name: s.researchLead, location: s.location, status: s.status })) : activeResearchers).map((researcher) => (
              <div key={researcher.id} className="flex items-center gap-4 p-4 glass-card border-white bg-white/50 rounded-2xl hover:border-indigo-100 transition-all group">
                <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 overflow-hidden">
                   <Users className="w-5 h-5 text-indigo-300 group-hover:text-indigo-600 transition-all" />
                </div>
                <div className="flex-1 space-y-0.5">
                   <h4 className="text-sm font-bold text-slate-800 tracking-tight">{researcher.name}</h4>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{researcher.location}</p>
                </div>
                <div className="text-right">
                   <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest px-2.5 py-1 bg-indigo-50 rounded-lg border border-indigo-100">{researcher.status}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-4 radiant-gradient text-white rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Establish Secure Comms
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ icon, label, value, color, bgColor }: { icon: React.ReactNode, label: string, value: string, color: string, bgColor: string }) {
  return (
    <div className="glass-card border-white/50 p-6 rounded-[2rem] space-y-3 shadow-sm">
      <div className={`flex items-center gap-2.5 ${color}`}>
         <div className={`p-1.5 ${bgColor} rounded-lg`}>
            {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-3.5 h-3.5' })}
         </div>
         <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{label}</span>
      </div>
      <p className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
