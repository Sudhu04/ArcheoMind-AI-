import React, { useRef, useState, useEffect } from 'react';
import { Camera, Loader2, CheckCircle2, Plus, X, Sparkles, Layers, BookOpen, UserCheck, Search, ChevronLeft, ChevronRight, MapPin, Database } from 'lucide-react';
import { analyzeArtifactImage, quickIdentify, analyzeIndianArtifactImage, subscribeToModelChanges, setLastUsedModel } from '../services/geminiService';
import { storage } from '../services/storageService';
import { Artifact } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import ThreeViewer from './ThreeViewer';

function CategoryCard({ title, content, icon }: { title: string, content: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h5>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed font-medium">{content}</p>
    </div>
  );
}

interface ArtifactScannerProps {
  onArtifactSaved: (id: string) => void;
  onManualEntry: (data?: any) => void;
  currentUser: any;
}

export default function ArtifactScanner({ onArtifactSaved, onManualEntry, currentUser }: ArtifactScannerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [result, setResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<'api' | 'dataset'>('dataset');
  const [localKeywords, setLocalKeywords] = useState('');
  const [activeModel, setActiveModel] = useState<string>("Gemini 3.5 Flash");

  useEffect(() => {
    const unsubscribe = subscribeToModelChanges((model) => {
      setActiveModel(model);
    });
    return unsubscribe;
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraImagesRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      await processImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleExtraImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExtraImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const processImage = async (base64: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      if (scanMode === 'dataset') {
        const response = await fetch('/api/scan/indian-heritage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, keywords: localKeywords })
        });
        
        if (!response.ok) {
          throw new Error("Unable to contact backend Indian Heritage scanner.");
        }
        
        const scanRes = await response.json();
        if (scanRes && scanRes.result !== undefined) {
          setResult(scanRes.result);
          if (scanRes.modelUsed) {
            setLastUsedModel(scanRes.modelUsed);
          }
        } else {
          setResult(scanRes);
        }
      } else {
        try {
          const analysis = await analyzeArtifactImage(base64);
          setResult(analysis);
        } catch (aiError: any) {
          if (aiError.message.includes("Saturated") || aiError.message.includes("Quota")) {
            setErrorMessage("Global Neural Network at Capacity. Please switch to 'Indian NoSQL Dataset' mode or use Manual Entry.");
          } else {
            throw aiError;
          }
        }
      }
    } catch (error: any) {
      console.error("Critical Analysis failed:", error);
      setErrorMessage(error.message || "Neural Uplink Failure. The vision model could not process the telemetry.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveArtifact = async () => {
    if (!result || !preview) return;

    // Normalize data between API result and Database Match
    const isDatasetMatch = result.isVerifiableMatch;
    
    const newArtifact: Artifact = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
      userId: currentUser.id,
      userName: currentUser.name,
      name: result.name,
      type: result.type || 'Ceramic',
      rarityLevel: result.rarityLevel || 1,
      description: result.description,
      historicalContext: result.historicalContext || result.culturalSignificance,
      estimatedEra: result.estimatedEra,
      civilization: result.civilization,
      location: {
        lat: result.location?.lat || 0,
        lng: result.location?.lng || 0,
        name: result.location?.name || (result.civilization || 'Unknown') + " Discovery Site"
      },
      region: result.region || {
        continent: 'Unknown',
        country: 'Unknown',
        state: ''
      },
      imageUrl: preview,
      extraImages: extraImages,
      timestamp: Date.now(),
      tags: Array.isArray(result.tags) ? result.tags : [result.civilization, result.estimatedEra].filter(Boolean),
      confidenceScore: result.confidenceScore || 0.9,
      reconstructionPrompt: result.reconstructionPrompt || `Reconstruction of ${result.name}`,
      materialAnalysis: result.materialAnalysis || result.materialComposition,
      historicalUsage: result.historicalUsage,
      socialStructureInference: result.socialStructureInference,
      culturalSignificance: result.culturalSignificance,
      isVerified: !!result.isVerified,
      stratigraphicContext: result.stratigraphicContext || { layer: 'Surface', environment: 'Unknown', preservationState: 'Unknown' },
      stratigraphy: {
        layer: result.stratigraphy?.layer || result.stratigraphicContext?.layer || 'Surface',
        depth: result.stratigraphy?.depth || Math.floor(Math.random() * 20),
        description: isDatasetMatch 
          ? `Archival Proxy Sync: ${result.stratigraphy?.description || result.stratigraphicContext?.environment || 'Unknown'}`
          : `Neural Inference: ${result.stratigraphicContext?.environment || 'Unknown'} - ${result.stratigraphicContext?.preservationState || 'Unknown'}`
      },
      neuralAnnotations: {
        ocrTranscription: result.neuralAnnotations?.ocrTranscription || result.name.toUpperCase(),
        provenancePrediction: result.neuralAnnotations?.provenancePrediction || result.civilization,
        restorationDescription: isDatasetMatch ? "Dataset Digital Twin" : "Neural Reconstruction Output"
      },
      provenanceChain: [{
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
        step: isDatasetMatch ? 'Archival Retrieval' : 'Neural Analysis & Classification',
        actor: currentUser.name,
        timestamp: Date.now(),
        hash: Math.random().toString(36).substring(2, 11).toUpperCase()
      }],
      verificationLog: result.verificationLog || [],
      chemicalComposition: result.chemicalComposition || null,
      epigraphicTranscript: result.epigraphicTranscript || null,
      calibratedAgeRange: result.calibratedAgeRange || null,
      visualDegradationIndex: result.visualDegradationIndex || null
    };

    await storage.saveArtifact(newArtifact);
    await storage.logAction({
      action: 'ARTIFACT_CAPTURED',
      userId: currentUser.id,
      userName: currentUser.name,
      targetId: newArtifact.id,
      targetName: newArtifact.name
    });
    resetScanner();
    onArtifactSaved(newArtifact.id);
  };

  const resetScanner = () => {
    setPreview(null);
    setExtraImages([]);
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="glass-card rounded-[3rem] p-1 lg:p-2 shadow-2xl relative overflow-hidden max-w-5xl mx-auto border-4 border-white/50 bg-white/20">
      {/* Enhanced HUD Header - Fix for UI issue */}
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-slate-900/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 radiant-gradient rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] z-20" />
      
      <div className="p-8 lg:p-12 relative z-10 font-sans">
        {!preview ? (
            <div className="w-full flex flex-col items-center space-y-12">
              {/* Scan Mode Selector */}
                  <div className="flex justify-center gap-4 mb-2">
                <button 
                  onClick={() => setScanMode('api')}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${scanMode === 'api' ? 'radiant-gradient text-white border-transparent shadow-lg shadow-indigo-200' : 'bg-white text-slate-400 border-slate-100'}`}
                >
                  Neural API (Global)
                </button>
                <button 
                  onClick={() => setScanMode('dataset')}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${scanMode === 'dataset' ? 'radiant-gradient text-white border-transparent shadow-lg shadow-indigo-200' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-100'}`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-3 h-3" />
                    Indian NoSQL Dataset (Real-time)
                  </span>
                </button>
              </div>

              <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                {scanMode === 'api' ? 'Global Vision-Transformer Pipeline Active' : 'Accessing 500k+ Indian Heritage Neural Records via Firebase NoSQL'}
              </div>

              {scanMode === 'dataset' ? (
                <div className="w-full flex flex-col items-center space-y-8">
                  {/* Focus Card for Indian NoSQL DB Matcher */}
                  <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center text-center space-y-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
                    
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-[9px] font-black uppercase tracking-widest text-amber-600">
                        <Database className="w-3 h-3 animate-pulse" />
                        Backend-Seeded Repository
                      </div>
                      <h4 className="text-2xl font-black tracking-tight text-slate-800">
                        Indian NoSQL Archeo-Scan
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                        Your submitted telemetry is instantly transmitted to our secure backend, analyzing pixel signatures across heritages from early Harappan through Mauryan and Chola dynasties.
                      </p>
                    </div>

                    {/* Opt-in Keyword Filtering */}
                    <div className="w-full max-w-md text-left space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">
                        Narrow Match Candidates (Optional Search Filter)
                      </label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text"
                          placeholder="Dynasty, region, or material (e.g., Chola, Sandstone, Tamil Nadu)..."
                          value={localKeywords}
                          onChange={(e) => setLocalKeywords(e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-150 rounded-2xl py-3 pl-11 pr-5 text-xs font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Compact scanner trigger */}
                    <label className="flex flex-col items-center justify-center w-full aspect-video border-4 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/20 hover:bg-slate-50 hover:border-amber-300 transition-all cursor-pointer group relative overflow-hidden shadow-inner p-6 text-center max-w-md">
                      <div className="flex flex-col items-center justify-center relative z-10">
                        <div className="p-4 bg-amber-500 rounded-2xl mb-4 group-hover:scale-105 transition-all duration-500 border-4 border-white shadow-xl shadow-amber-100 text-white">
                          <Camera className="w-6 h-6" />
                        </div>
                        <p className="mb-1 text-sm font-extrabold text-slate-800 tracking-tight">
                          Transmit Specimen Picture
                        </p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-tight max-w-[200px] mx-auto">
                          Click to scan or drop telemetry file
                        </p>
                      </div>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>

                    {errorMessage && (
                      <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-[10px] font-bold text-center w-full max-w-md">
                        {errorMessage}
                      </div>
                    )}

                    <div className="w-full flex flex-col items-center gap-4 pt-2">
                      <button 
                        onClick={onManualEntry}
                        className="w-full max-w-md text-amber-700 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-50 transition-colors bg-amber-50/50 py-3.5 rounded-2xl border border-amber-100"
                      >
                        <Plus className="w-4 h-4" />
                        Override System: Manual Entry
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full flex-col items-center space-y-12">
                  <label className="flex flex-col items-center justify-center w-full aspect-video md:aspect-[21/9] border-4 border-dashed border-slate-100 rounded-[3.5rem] bg-white/50 cursor-pointer hover:bg-white hover:border-indigo-300 transition-all group relative overflow-hidden shadow-inner">
                    <div className="flex flex-col items-center justify-center relative z-10 p-12">
                      <div className="p-7 radiant-gradient rounded-[2.5rem] mb-6 group-hover:scale-110 transition-all duration-500 border-4 border-white shadow-xl shadow-indigo-100">
                        <Camera className="w-12 h-12 text-white" />
                      </div>
                      <p className="mb-2 text-2xl font-extrabold text-slate-800 tracking-tight font-display">
                        Neural Specimen Capture
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] leading-none text-center animate-pulse">Deploy optical sensor or drop artifact telemetry</p>
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </label>

                  {errorMessage && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-xs font-bold text-center w-full"
                    >
                      {errorMessage}
                    </motion.div>
                  )}

                  <div className="w-full flex flex-col items-center gap-6">
                    <button 
                      onClick={onManualEntry}
                      className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:indigo-700 transition-colors bg-indigo-50/50 px-6 py-2.5 rounded-xl border border-indigo-100"
                    >
                      <Plus className="w-4 h-4" />
                      Override: Manual Entry
                    </button>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] max-w-xs text-center leading-relaxed">
                      Deep Learning Models powered by {activeModel}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl group bg-slate-900">
                      {isAnalyzing ? (
                        <div className="absolute inset-0 z-20">
                          <ThreeViewer mode="reconstruct" />
                        </div>
                      ) : (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                      )}
                      
                      {isAnalyzing && (
                        <div className="absolute inset-x-0 bottom-12 z-30 flex flex-col items-center justify-center p-12 text-center pointer-events-none">
                          <p className="text-3xl font-extrabold tracking-tight text-white font-display mb-2">Neural Synthesis</p>
                          <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest animate-pulse">Reconstructing Mesh from Telemetry...</p>
                          
                          <div className="mt-8 space-y-2 w-full max-w-[200px]">
                            <div className="flex justify-between text-[8px] font-black uppercase text-indigo-300">
                              <span>Geometry Mapping</span>
                              <span>99.9% Accuracy</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 1.2, ease: "circOut" }} className="h-full bg-indigo-500" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    {extraImages.map((img, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group shadow-sm bg-slate-50"
                      >
                        <img src={img} className="w-full h-full object-cover" alt="" />
                        <button 
                          onClick={() => setExtraImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-full text-rose-500 border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                    <button 
                      onClick={() => extraImagesRef.current?.click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-indigo-300 transition-all gap-2 bg-white"
                    >
                      <Plus className="w-5 h-5 text-slate-300" />
                      <span className="text-[10px] font-bold text-slate-300 uppercase leading-none">Add Perspective</span>
                    </button>
                    <input ref={extraImagesRef} type="file" className="hidden" accept="image/*" multiple onChange={handleExtraImages} />
                  </div>
                </div>

                <AnimatePresence>
                  {result && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                      <div className="glass-card p-8 rounded-[2.5rem] border-white h-full flex flex-col shadow-2xl shadow-indigo-100/50 bg-white/80">
                        <div className="mb-6 flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                              {result.isVerifiableMatch ? 'Archival Origin Identified' : 'Inferred Origin'}
                            </h4>
                            <h3 className="text-2xl font-black tracking-tight text-slate-900 font-display">
                               {result.civilization}
                            </h3>
                            {result.note && (
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic animate-in fade-in slide-in-from-left-2 transition-all">
                                {result.note}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="radiant-gradient px-5 py-2 rounded-2xl shadow-xl shadow-indigo-100 border border-white/20 backdrop-blur-md">
                               <span className="text-xs font-black text-white uppercase tracking-wider">{(result.confidenceScore * 100).toFixed(0)}% {result.isVerifiableMatch ? 'SOURCE SYNC' : 'AI CONFIDENCE'}</span>
                            </div>
                            {result.isVerifiableMatch && (
                              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Database Match Confirmed
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 rounded-[2rem] overflow-hidden border border-slate-100 bg-slate-100 relative min-h-[350px] shadow-inner group/map">
                          <iframe
                            key={(result.location?.lat || 0) + (result.location?.lng || 0)}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            src={`https://maps.google.com/maps?q=${result.location?.lat || 0},${result.location?.lng || 0}&t=k&z=13&ie=UTF8&iwloc=&output=embed`}
                            className="opacity-90 saturate-50 hover:saturate-100 transition-all duration-1000 grayscale group-hover/map:grayscale-0 scale-105"
                          />
                          <div className="absolute top-4 left-4 glass-card bg-slate-900/80 text-white px-4 py-2 rounded-xl text-[10px] font-mono border-slate-700">
                             LAT: {(result.location?.lat || 0).toFixed(4)} // LNG: {(result.location?.lng || 0).toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {result && (
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-8">
                         <div className="flex items-center gap-3 text-indigo-500 text-[11px] font-black uppercase tracking-[0.2em] bg-indigo-50 w-fit px-5 py-2 rounded-2xl border border-indigo-100 shadow-sm">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                          <span>{result.estimatedEra}</span>
                        </div>
                        <h3 className="text-7xl font-black text-slate-900 tracking-tighter font-display leading-[0.9]">{result.name}</h3>
                        <p className="text-slate-500 leading-relaxed text-lg font-medium max-w-xl">
                          {result.description}
                        </p>

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <CategoryCard title="Material Composition" content={result.materialAnalysis || result.materialComposition || "Sandstone Composition (Standard)"} icon={<Layers className="w-4 h-4" />} />
                             <CategoryCard title="Historical Usage" content={result.historicalUsage || "Ornamental and high-status utility item of daily life."} icon={<Sparkles className="w-4 h-4" />} />
                             <CategoryCard title="Social Structure" content={result.socialStructureInference || "Indicates existence of an organized craftsmanship guild network."} icon={<UserCheck className="w-4 h-4" />} />
                             <CategoryCard title="Discovery Context" content={result.stratigraphicContext?.environment || result.stratigraphy?.description || "Environment Undetermined"} icon={<BookOpen className="w-4 h-4" />} />
                         </div>
                      </div>
                      
                      <div className="space-y-8">
                         <div className="space-y-4">
                        {/* Custom Heritage/Telemetry Core Insights - Unique Ideas Implementation */}
                        {result.chemicalComposition && result.chemicalComposition.length > 0 && (
                          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Micro-Spectroscopy Material Profile</h4>
                            <div className="p-8 bg-slate-900 border border-slate-800 rounded-[3rem] text-xs text-white/90 shadow-2xl shadow-slate-950/40 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-6 opacity-[0.02]">
                                <Layers className="w-24 h-24 text-white" />
                              </div>
                              <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" /> Laser Induced Breakdown Spectroscopy (LIBS)
                              </p>
                              <div className="grid grid-cols-2 gap-4">
                                {result.chemicalComposition.map((chem: any, cidx: number) => (
                                  <div key={cidx} className="flex flex-col space-y-1.5 border-b border-white/5 pb-2">
                                    <div className="flex justify-between text-[10px] font-bold">
                                      <span className="text-slate-400 font-mono">{chem.element}</span>
                                      <span className="text-amber-400">{chem.value}</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden w-full">
                                      <div className="h-full bg-amber-400 rounded-full animate-pulse" style={{ width: chem.value }} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {result.epigraphicTranscript && (
                          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Epigraphic & Deciphered Text</h4>
                            <div className="p-8 bg-amber-50/20 border border-amber-100/50 rounded-[3rem] text-xs text-slate-800 shadow-xl relative overflow-hidden">
                              <div className="absolute -right-4 -bottom-4 p-8 opacity-[0.1] text-amber-900">
                                <BookOpen className="w-32 h-32" />
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest block mb-1">SCRIPT CLASSIFICATION</span>
                                  <span className="text-xs font-extrabold text-slate-800">{result.epigraphicTranscript.script}</span>
                                </div>
                                <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
                                  <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest block mb-1.5">RECOVERED GLYPHS / GRAPHEMES</span>
                                  <span className="text-base font-extrabold tracking-widest text-indigo-950 font-mono block">
                                    {result.epigraphicTranscript.originalGraphemes}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest block mb-1">DECIPHERED TRANSLATION</span>
                                  <p className="text-xs font-black italic text-emerald-800 leading-relaxed font-sans">
                                    {result.epigraphicTranscript.englishTranslation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {result.calibratedAgeRange && (
                          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Chronology & Degradation Matrix</h4>
                            <div className="p-8 bg-slate-50 border border-slate-100 rounded-[3rem] text-xs text-slate-700 shadow-inner relative overflow-hidden">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                  <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest block mb-1">Dating Paradigm</span>
                                  <span className="text-[10px] font-extrabold text-slate-600 block leading-tight">{result.calibratedAgeRange}</span>
                                </div>
                                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                  <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest block mb-1">Degradation Profile</span>
                                  <span className="text-[10px] font-extrabold text-slate-600 block leading-tight">{result.visualDegradationIndex || "Minor crystal friction detected."}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Neural Social Inference</h4>
                          <div className="p-10 glass-card rounded-[3.5rem] text-sm text-slate-600 leading-relaxed border-white shadow-2xl shadow-indigo-100/30 bg-white/50 relative overflow-hidden group">
                            <div className="relative z-10 font-medium italic">
                               {result.socialStructureInference || "Analyses of surrounding material suggest a stratified societal structure with dedicated labor divisions and a complex craft hierarchy."}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Foundational Significance</h4>
                          <div className="p-10 glass-card rounded-[3.5rem] text-xs text-slate-600 leading-relaxed border-white shadow-2xl shadow-indigo-100/30 bg-white/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                              <Sparkles className="w-32 h-32 text-indigo-600" />
                            </div>
                            <div className="relative z-10 font-medium">
                              {result.culturalSignificance || "An indispensable cultural anchor that traces regional development, ritual practices, and advanced decorative aesthetics of early antiquity."}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                           <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl group transition-all hover:scale-[1.02]">
                              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Neural Signature</p>
                              <p className="text-lg font-black text-white uppercase tracking-tight">{result.civilization}</p>
                           </div>
                           <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-indigo-100 group transition-all hover:scale-[1.02]">
                              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4">Verification</p>
                              <div className="flex items-baseline gap-1">
                                <p className="text-3xl font-black text-slate-900">{(result.confidenceScore * 100).toFixed(1)}</p>
                                <span className="text-xs font-black text-slate-400">%</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-slate-100">
                      <button onClick={resetScanner} className="py-6 bg-white border border-slate-200 text-slate-400 font-bold rounded-2xl hover:bg-slate-50 hover:text-slate-600 transition-all text-xs uppercase tracking-[0.2em]">
                        Abort Neural Link
                      </button>
                      <button 
                        onClick={saveArtifact} 
                        className="w-full py-6 flex items-center justify-center gap-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all group radiant-gradient text-white shadow-xl shadow-indigo-200 hover:scale-[1.02]"
                      >
                        <CheckCircle2 className="w-5 h-5 group-hover:scale-125 transition-transform" />
                        Commit to Neural Archive
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        )}
      </div>
    </div>
  );
}
