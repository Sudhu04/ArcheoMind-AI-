import React, { useMemo, useState, useEffect } from 'react';
import { Artifact } from '../types';
import { 
  Globe, 
  Users, 
  Activity, 
  Map as MapIcon, 
  Database, 
  ShieldCheck, 
  Compass, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Radar, 
  Layers, 
  Cpu, 
  Radio, 
  Clock, 
  Flame, 
  HelpCircle, 
  ExternalLink 
} from 'lucide-react';
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
  depthProfile: string;
  moisture: string;
  lidarDensity: string;
  soilType: string;
  anomaliesDetected: string[];
}

interface GlobalObservatoryProps {
  artifacts: Artifact[];
}

export default function GlobalObservatory({ artifacts }: GlobalObservatoryProps) {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [selectedSite, setSelectedSite] = useState<LiveSite | null>(null);

  // Simulated live sensor sweeps
  const [lidarSweepRate, setLidarSweepRate] = useState(98.4);
  const [satelliteConnectionStr, setSatelliteConnectionStr] = useState(95.8);

  // Sub-surface Scanning simulator state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showScanSummary, setShowScanSummary] = useState(false);

  const liveSites: LiveSite[] = [
    { 
      id: 'ls1', 
      name: 'Rakhigarhi Excavation', 
      location: 'Haryana, India', 
      lat: 29.28, 
      lng: 76.08, 
      status: 'Active', 
      discoveryType: 'Harappan Cemetery', 
      researchLead: 'S.K. Manjul (ASI)',
      depthProfile: '2.4m - 6.8m',
      moisture: '12.4%',
      lidarDensity: '4,210 pts/m²',
      soilType: 'Alluvial Loam',
      anomaliesDetected: ['Ceramic kiln chamber', 'Massive mudbrick segment', 'Double burial sequence']
    },
    { 
      id: 'ls2', 
      name: 'Pompeii Regio IX', 
      location: 'Naples, Italy', 
      lat: 40.75, 
      lng: 14.48, 
      status: 'Active', 
      discoveryType: 'Roman Insula & Frescoes', 
      researchLead: 'Gabriel Zuchtriegel',
      depthProfile: '1.2m - 4.5m',
      moisture: '8.2%',
      lidarDensity: '3,950 pts/m²',
      soilType: 'Volcanic Tuff',
      anomaliesDetected: ['Charred structural oak beams', 'Hollow decorative plaster void', 'Under-floor ceramic flue pipe']
    },
    { 
      id: 'ls3', 
      name: 'Giza ScanPyramids', 
      location: 'Giza, Egypt', 
      lat: 29.97, 
      lng: 31.13, 
      status: 'Active', 
      discoveryType: 'Great Pyramid Void Analysis', 
      researchLead: 'Hany Helal',
      depthProfile: '20.0m - 120.0m',
      moisture: '2.1%',
      lidarDensity: '8,400 pts/m²',
      soilType: 'Limestone Blockwork',
      anomaliesDetected: ['High-energy muon flux void segment', 'Structural internal ramp alignment', 'Tectonic stress fractures']
    },
    { 
      id: 'ls4', 
      name: 'Keeladi Phase IX', 
      location: 'Tamil Nadu, India', 
      lat: 9.86, 
      lng: 78.18, 
      status: 'Active', 
      discoveryType: 'Sangam Era Urban Settlement', 
      researchLead: 'R. Sivanandam',
      depthProfile: '0.8m - 3.8m',
      moisture: '14.1%',
      lidarDensity: '4,650 pts/m²',
      soilType: 'Red Silica Gravel',
      anomaliesDetected: ['Continuous terra-cotta drainage ducts', 'Pottery ring-well cluster', 'Sub-surface smithing furnace']
    },
    { 
      id: 'ls5', 
      name: 'Terracotta Army Pit 1', 
      location: 'Xi\'an, China', 
      lat: 34.38, 
      lng: 109.27, 
      status: 'Active', 
      discoveryType: 'Qin Emperor Mausoleum', 
      researchLead: 'Shen Maosheng',
      depthProfile: '4.5m - 9.0m',
      moisture: '9.8%',
      lidarDensity: '3,100 pts/m²',
      soilType: 'Reinforced Loess Clay',
      anomaliesDetected: ['Compacted clay infantry ramps', 'Acoustic void matches', 'High organic lacquer trace fields']
    },
    { 
      id: 'ls6', 
      name: 'Chichén Itzá Subterranean', 
      location: 'Yucatán, Mexico', 
      lat: 20.68, 
      lng: -88.56, 
      status: 'Mapping', 
      discoveryType: 'Maya Sacred Cenote Links', 
      researchLead: 'Guillermo de Anda',
      depthProfile: '15.0m - 45.0m',
      moisture: '95.4%',
      lidarDensity: '5,180 pts/m²',
      soilType: 'Karst Carbonate Shelf',
      anomaliesDetected: ['Submerged limestone tunnel networks', 'Skeletal organic calcium pockets', 'Lithic flint deposit vectors']
    },
    { 
      id: 'ls7', 
      name: 'Vadnagar Multi-Cultural Site', 
      location: 'Gujarat, India', 
      lat: 23.78, 
      lng: 72.63, 
      status: 'Under Analysis', 
      discoveryType: 'Buddhist Monastery', 
      researchLead: 'Abhijit Ambekar',
      depthProfile: '3.0m - 12.0m',
      moisture: '18.3%',
      lidarDensity: '4,050 pts/m²',
      soilType: 'Silty Alluvium Layers',
      anomaliesDetected: ['Vihara central residential cells', 'Structured dynamic retaining barrier', 'Indo-Roman pottery fragments']
    },
    { 
      id: 'ls8', 
      name: 'Machu Picchu Conservation', 
      location: 'Cusco, Peru', 
      lat: -13.16, 
      lng: -72.54, 
      status: 'Mapping', 
      discoveryType: 'Inca Terrace Hydrology', 
      researchLead: 'Jose Bastante',
      depthProfile: '0.5m - 2.8m',
      moisture: '28.9%',
      lidarDensity: '6,120 pts/m²',
      soilType: 'Granitic Soil & Drainage Silt',
      anomaliesDetected: ['Multi-tiered dry stone filtration vaults', 'Channelized sub-gravel aqueducts', 'Agricultural nitrogen zones']
    }
  ];

  const stats = useMemo(() => {
    return {
      total: artifacts.length,
      verified: artifacts.filter(a => a.isVerified).length,
      civilizations: new Set(artifacts.map(a => a.civilization)).size,
      activeRegions: new Set(artifacts.map(a => a.location?.name || '')).size
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
    setSelectedSite(liveSites[0]);

    // Minor telemetry value fluctuations
    const interval = setInterval(() => {
      setLidarSweepRate(prev => Math.min(100, Math.max(90, +(prev + (Math.random() - 0.5) * 0.4).toFixed(1))));
      setSatelliteConnectionStr(prev => Math.min(100, Math.max(92, +(prev + (Math.random() - 0.5) * 0.2).toFixed(1))));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // When selected site changes, reset our scanning diagnostics
  useEffect(() => {
    setScanProgress(0);
    setIsScanning(false);
    setShowScanSummary(false);
  }, [selectedSite]);

  const triggerQuantumScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setShowScanSummary(false);

    const intvl = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(intvl);
          setIsScanning(false);
          setShowScanSummary(true);
          return 100;
        }
        return prev + 4;
      });
    }, 120);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-2">
      {/* Dynamic Telemetry Status Headers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard 
          icon={<Radio />} 
          label="SATELLITE FREQUENCY LOCK" 
          value={`${satelliteConnectionStr}%`} 
          color="text-indigo-600" 
          bgColor="bg-indigo-50" 
          indicator={<div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" /><span className="text-[8px] font-bold text-indigo-400">DBS-SAT LINK</span></div>}
        />
        <StatusCard 
          icon={<Radar />} 
          label="LIDAR REFLECTION SWEEP" 
          value={`${lidarSweepRate}%`} 
          color="text-cyan-600" 
          bgColor="bg-cyan-50" 
          indicator={<span className="text-[8px] font-black text-cyan-500 font-mono">312.44 GHz</span>}
        />
        <StatusCard 
          icon={<Database />} 
          label="ACTIVE DISCOVERY CLUSTERS" 
          value={Math.max(4, stats.civilizations).toString()} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50" 
          indicator={<span className="text-[8px] font-bold text-emerald-500 uppercase">SYS STABLE</span>}
        />
        <StatusCard 
          icon={<Compass />} 
          label="GEODETIC HEADING RATE" 
          value="0.92//hr" 
          color="text-rose-600" 
          bgColor="bg-rose-50" 
          indicator={<span className="text-[8px] font-bold text-rose-500 uppercase">TELEMETRY LOCK</span>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* main Map & Simulator Section */}
        <div className="lg:col-span-2 glass-card border-white/50 bg-white/70 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100/50">
                <Globe className="w-3.5 h-3.5 animate-pulse" />
                Archaeological GIS Matrix
              </span>
              <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">GLOBAL OBSERVATORY</h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isLiveMode ? 'bg-rose-600 text-white shadow-lg shadow-rose-100' : 'bg-slate-150 text-slate-400 hover:bg-slate-200'}`}
              >
                <Activity className="w-3.5 h-3.5" />
                Live Mode: {isLiveMode ? 'ACTIVE' : 'OFF'}
              </button>
              <button 
                onClick={() => setShowHotspots(!showHotspots)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${showHotspots ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-150 text-slate-400 hover:bg-slate-200'}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Hotspots: {showHotspots ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Interactive satellite container window */}
          <div className="aspect-video bg-slate-950 rounded-[2.5rem] border-4 border-white shadow-inner relative overflow-hidden group/map group">
            {/* Satellite HUD Overlay Grid */}
            <div className="absolute inset-0 z-20 pointer-events-none border border-white/10 flex flex-col justify-between p-6">
              <div className="flex justify-between items-start">
                <div className="font-mono text-[9px] text-[#22c55e] bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/20 uppercase tracking-widest">
                  SYS_LINK: SAT_ORBIT // LEVEL: 3A
                </div>
                <div className="text-right font-mono text-[9px] text-[#22c55e] bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/20 space-y-0.5">
                  <div>LAT: {selectedSite ? selectedSite.lat.toFixed(4) : "20.0000"}° N</div>
                  <div>LNG: {selectedSite ? selectedSite.lng.toFixed(4) : "78.0000"}° E</div>
                </div>
              </div>

              {/* Center target cursor crosshair */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-16 h-16 border border-[#22c55e] rounded-full flex items-center justify-center relative animate-pulse">
                  <div className="w-2 h-2 bg-[#22c55e] rounded-full" />
                  <div className="absolute w-8 h-px bg-[#22c55e]" />
                  <div className="absolute h-8 w-px bg-[#22c55e]" />
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="font-mono text-[8px] text-white/50 bg-[#0c111d]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 space-y-0.5">
                  <div>SAT LOCK: COGNITIVE GEODETIC SCANNER</div>
                  <div>ALTITUDE: ~512KM ORBIT SCALE</div>
                </div>
                <div className="font-mono text-[8px] text-indigo-400 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-indigo-500/20 uppercase tracking-widest">
                  LiDAR Spectrum Matrix ACTIVE
                </div>
              </div>
            </div>

            {/* Satellite map view */}
            <iframe 
               width="100%" 
               height="100%" 
               frameBorder="0" 
               scrolling="no" 
               src={`https://maps.google.com/maps?q=${selectedSite ? selectedSite.lat : (isLiveMode ? 20 : (artifacts[0]?.location?.lat || 20))},${selectedSite ? selectedSite.lng : (isLiveMode ? 0 : (artifacts[0]?.location?.lng || 78))}&z=${selectedSite ? 14 : (isLiveMode ? 2 : 4)}&t=k&ie=UTF8&iwloc=&output=embed`}
               className="grayscale opacity-50 contrast-[1.25] saturate-[0.35] hover:opacity-60 transition-opacity duration-1000 scale-110 pointer-events-auto"
            />
            
            {/* Real Discovery Pins & AI Hotspots */}
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
                        top: `${Math.max(8, Math.min(92, top))}%`, 
                        left: `${Math.max(8, Math.min(92, left))}%` 
                     }}
                     className="absolute w-6 h-6 -ml-3 -mt-3 z-30 pointer-events-auto cursor-pointer group/pin"
                  >
                    <div className="absolute inset-0 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)] border-2 border-white scale-75 group-hover/pin:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-25" />
                    
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 pointer-events-none opacity-0 group-hover/pin:opacity-100 transition-all duration-300 translate-y-2 group-hover/pin:translate-y-0 z-40">
                      <div className="glass-card bg-slate-900/95 text-white p-4 border-slate-700 rounded-2xl whitespace-nowrap shadow-2xl min-w-[160px]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300">Verified Discovery</p>
                        </div>
                        <p className="text-xs font-black tracking-tight mb-1 text-white">{a.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">{a.civilization}</p>
                      </div>
                      <div className="w-3 h-3 bg-slate-900/95 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b border-slate-700" />
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
                       top: `${Math.max(8, Math.min(92, top))}%`, 
                       left: `${Math.max(8, Math.min(92, left))}%` 
                    }}
                    className="absolute w-8 h-8 -ml-4 -mt-4 z-40 pointer-events-auto cursor-pointer group/hotspot"
                  >
                    <div className="absolute inset-0 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] border-4 border-white flex items-center justify-center">
                       <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-30" />
                    
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 pointer-events-none opacity-0 group-hover/hotspot:opacity-100 transition-all duration-300 translate-y-2 group-hover/hotspot:translate-y-0 z-50">
                       <div className="glass-card bg-emerald-950 text-white p-5 border-emerald-700/50 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.4)] min-w-[280px]">
                          <div className="flex items-center gap-3 mb-3">
                             <div className="p-2 bg-emerald-500/20 rounded-xl">
                                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                             </div>
                             <div>
                                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">AI Predictive Hotspot</h4>
                                <h3 className="text-lg font-black tracking-tight">{spot.name}</h3>
                             </div>
                          </div>
                          <p className="text-[11px] text-white/80 leading-relaxed font-semibold mb-3">"{spot.reasoning}"</p>
                          <div className="flex justify-between items-center pt-3 border-t border-emerald-500/20">
                             <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{spot.inferredCivilization}</span>
                             <span className="text-[9px] font-mono opacity-50 px-2 py-0.5 bg-white/5 rounded">{spot.lat.toFixed(2)}, {spot.lng.toFixed(2)}</span>
                          </div>
                       </div>
                       <div className="w-4 h-4 bg-emerald-950 rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2 border-r border-b border-emerald-700/50" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Sweep overlay line effect */}
            <motion.div 
              animate={{ left: ['-10%', '110%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 bottom-0 w-[2px] bg-emerald-400/40 shadow-[0_0_20px_rgba(52,211,153,0.7)] z-10 pointer-events-none"
            />

            {/* Live Telemetry Ticker */}
            <AnimatePresence>
              {isLiveMode && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-6 left-6 right-6 z-30"
                >
                  <div className="glass-card bg-slate-950/85 border-rose-500/30 backdrop-blur-xl px-6 py-2.5 rounded-full flex items-center gap-8 overflow-hidden shadow-lg border">
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Telem Stream</span>
                    </div>
                    <div className="flex items-center gap-12 animate-scroll-text whitespace-nowrap">
                      {liveSites.map((site) => (
                        <div key={`ticker-${site.id}`} className="flex items-center gap-3">
                          <span className="text-[9px] font-mono text-slate-500 font-bold">[{site.lat.toFixed(2)}, {site.lng.toFixed(2)}]</span>
                          <span className="text-xs font-black text-white/90 uppercase tracking-tight">{site.name}</span>
                          <span className="text-[9px] font-black text-rose-400/80 uppercase tracking-wider">&bull; {site.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sub-Surface Scanner Array Panel */}
          {selectedSite && (
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] shadow-inner space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Integrated Sub-Surface Radar Arrays</h4>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Active Sensor Scanning Modules</h3>
                </div>
                
                <button 
                  onClick={triggerQuantumScan}
                  disabled={isScanning}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      SYSTEM SWEEPING...
                    </>
                  ) : (
                    <>
                      <Radar className="w-4 h-4 animate-pulse" />
                      RUN CHRONO-RADAR SCAN
                    </>
                  )}
                </button>
              </div>

              {/* Advanced Scanning Matrix Graphics */}
              <AnimatePresence mode="wait">
                {isScanning && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="p-4 bg-slate-900 text-white rounded-2xl border border-indigo-500/20 font-mono text-[10px] space-y-2">
                      <div className="flex justify-between text-indigo-400">
                        <span>[ORBITAL COGNITIVE SCAN TRIGGERED]</span>
                        <span>CONFIDENCE 98.6%</span>
                      </div>
                      <div className="text-slate-400 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>&bull; Beam Pulse: Isotopic Stratigraphy Sweep</div>
                        <div>&bull; Depth Index Focus: {selectedSite.depthProfile}</div>
                        <div>&bull; Lidar Wave Reflection Rate: {selectedSite.lidarDensity}</div>
                        <div>&bull; Ground Moisture Index: {selectedSite.moisture}</div>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500" 
                          initial={{ width: 0 }} 
                          animate={{ width: `${scanProgress}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {showScanSummary && !isScanning && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-gradient-to-r from-indigo-950 to-slate-900 text-white rounded-[2rem] border border-indigo-500/20 shadow-xl space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#22c55e]" />
                        <span className="text-[9px] font-black text-[#22c55e] uppercase tracking-widest">Deep Synthesis Summary</span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-400 font-bold px-3 py-1 bg-white/5 rounded-full">#SCAN-{(selectedSite.lat * 55).toFixed(0)}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-400 block uppercase tracking-widest">Ground Layering Stratum</span>
                        <p className="text-sm font-bold text-slate-100">{selectedSite.depthProfile} // {selectedSite.soilType}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-400 block uppercase tracking-widest">Active Tomography Moisture</span>
                        <p className="text-sm font-bold text-slate-100">{selectedSite.moisture} Volume Capacity</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-400 block uppercase tracking-widest">Point Cloud Reflection Density</span>
                        <p className="text-sm font-bold text-slate-100">{selectedSite.lidarDensity}</p>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4 space-y-3">
                      <span className="text-[9.5px] font-black text-indigo-400 block uppercase tracking-widest">Sub-surface Anomalies Mapped</span>
                      <div className="flex flex-wrap gap-2.5">
                        {selectedSite.anomaliesDetected.map((anom, idx) => (
                          <span 
                            key={idx} 
                            className="px-4 py-2 bg-indigo-500/10 rounded-xl text-xs font-bold text-indigo-300 border border-indigo-400/20 flex items-center gap-2 shadow-sm"
                          >
                            <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" />
                            {anom}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Standard active parameters layout when scan hasn't run */}
              {!isScanning && !showScanSummary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">LIDAR DENSITY</span>
                    <p className="text-sm font-black text-slate-800 mt-2">{selectedSite.lidarDensity}</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">STRATUM DEPTH PROFILE</span>
                    <p className="text-sm font-black text-indigo-650 mt-2">{selectedSite.depthProfile}</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">SOIL MATRIX</span>
                    <p className="text-sm font-black text-slate-850 mt-2 truncate">{selectedSite.soilType}</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">MOISTURE VALUE</span>
                    <p className="text-sm font-black text-emerald-650 mt-2">{selectedSite.moisture}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Background Grid Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Real-time Web of Researchers */}
        <div className="glass-card border-white/50 bg-white/70 rounded-[3rem] p-8 space-y-6 flex flex-col h-full justify-between">
          <div className="space-y-5">
            <div className="space-y-1">
               <div className="flex items-center gap-2 mb-1">
                  <Compass className="w-5 h-5 text-indigo-500 animate-spin-slow" />
                  <h3 className="text-xl font-extrabold tracking-tight text-slate-900">GLOBAL EXCAVATIONS</h3>
               </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Major Live Archaeological Sites</p>
            </div>

            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
              {liveSites.map((site) => {
                const isSelected = selectedSite?.id === site.id;
                return (
                  <button 
                    key={site.id} 
                    onClick={() => setSelectedSite(site)}
                    className={`w-full flex items-center gap-3.5 p-3.5 text-left rounded-2xl transition-all border ${
                      isSelected 
                        ? 'bg-rose-50 border-rose-200 shadow-md shadow-rose-100/50' 
                        : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/25'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isSelected ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-50 text-slate-400'
                    }`}>
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-xs font-black text-slate-800 truncate tracking-tight">{site.name}</h4>
                       <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">{site.location}</p>
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${
                      site.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {site.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time details about target directors */}
          {selectedSite && (
            <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white space-y-4 shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                <span className="text-[9px] font-black text-rose-400 uppercase tracking-[0.2em]">DIRECTORATE DATA LINK</span>
              </div>
              
              <div className="space-y-1.5">
                <h4 className="text-sm font-black tracking-tight leading-snug">{selectedSite.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div>
                    <span className="text-slate-400 block font-mono text-[8.5px] uppercase">COORDINATE LAT</span>
                    <span className="font-bold text-slate-200">{selectedSite.lat.toFixed(5)}° N</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[8.5px] uppercase">COORDINATE LNG</span>
                    <span className="font-bold text-slate-200">{selectedSite.lng.toFixed(5)}° E</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] space-y-2 border-t border-white/5 pt-3">
                <div>
                  <span className="text-[8.5px] font-black text-slate-400 uppercase block tracking-wider">Excavation Layer Focus</span>
                  <div className="font-bold text-slate-100 mt-0.5">{selectedSite.discoveryType}</div>
                </div>
                <div>
                  <span className="text-[8.5px] font-black text-slate-400 uppercase block tracking-wider">Director General</span>
                  <div className="font-semibold text-[#22c55e] flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {selectedSite.researchLead}
                  </div>
                </div>
              </div>
            </div>
          )}

          <button className="w-full py-4 bg-gradient-to-tr from-cyan-600 via-indigo-600 to-indigo-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:scale-[1.01] active:scale-[0.99] transition-all shrink-0">
            CONNECT ORBITAL GEOTECH FEED
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ 
  icon, 
  label, 
  value, 
  color, 
  bgColor, 
  indicator 
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  color: string, 
  bgColor: string,
  indicator?: React.ReactNode
}) {
  return (
    <div className="glass-card border-white/50 p-6 rounded-[2.2rem] bg-white/80 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
      <div className="flex items-center justify-between gap-2 text-slate-500">
         <div className={`p-2 ${bgColor} ${color} rounded-xl shadow-sm shrink-0`}>
            {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
         </div>
         {indicator}
      </div>
      <div className="space-y-1 pt-1">
         <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block leading-none">{label}</span>
         <p className="text-2xl font-black tracking-tight text-slate-800 font-mono mt-0.5">{value}</p>
      </div>
    </div>
  );
}
