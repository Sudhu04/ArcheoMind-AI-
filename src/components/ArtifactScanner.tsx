import React, { useRef, useState } from 'react';
import { Camera, Upload, Loader2, CheckCircle2, MapPin, Plus, X, Globe } from 'lucide-react';
import { analyzeArtifact } from '../services/geminiService';
import { storage } from '../services/storageService';
import { Artifact } from '../types';
import { motion, AnimatePresence } from 'motion/react';

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
      await processImage(base64, file.type);
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

  const processImage = async (base64: string, mimeType: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeArtifact(base64, mimeType);
      setResult(analysis);
    } catch (error) {
      console.error("Analysis failed:", error);
      setErrorMessage("Neural Analysis Failed. Please try another image or use Manual Entry.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveArtifact = async () => {
    if (!result || !preview) return;

    const newArtifact: Artifact = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      userName: currentUser.name,
      name: result.name,
      description: result.description,
      historicalContext: result.historicalContext,
      estimatedEra: result.estimatedEra,
      civilization: result.civilization,
      location: {
        lat: result.suggestedDiscoveryLocation.lat,
        lng: result.suggestedDiscoveryLocation.lng,
        name: result.suggestedDiscoveryLocation.name
      },
      imageUrl: preview,
      extraImages: extraImages,
      timestamp: Date.now(),
      tags: result.suggestedTags,
      confidenceScore: result.confidenceScore,
      reconstructionPrompt: result.reconstructionPrompt,
      materialAnalysis: result.materialAnalysis,
      culturalSignificance: result.culturalSignificance
    };

    await storage.saveArtifact(newArtifact);
    resetScanner();
    onArtifactSaved(newArtifact.id);
  };

  const resetScanner = () => {
    setPreview(null);
    setExtraImages([]);
    setResult(null);
    setErrorMessage(null);
  };

  const getPublicMapUrl = (lat: number, lng: number) => {
    return `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="bg-[#080706] border border-[#D4AF37]/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      
      <div className="flex flex-col items-center justify-center space-y-10">
        {!preview ? (
          <div className="w-full max-w-xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black italic tracking-tighter font-display">INITIATE <span className="text-[#D4AF37]">SCAN</span></h2>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">Neural Link: Ready for Input</p>
            </div>

            <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-[#D4AF37]/10 rounded-[2.5rem] cursor-pointer hover:bg-[#D4AF37]/5 transition-all group relative overflow-hidden">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                <div className="p-6 bg-[#D4AF37]/10 rounded-3xl mb-6 group-hover:scale-110 group-hover:bg-[#D4AF37]/20 transition-all duration-700 border border-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                  <Camera className="w-10 h-10 text-[#D4AF37]" />
                </div>
                <p className="mb-2 text-sm font-black text-white uppercase tracking-widest">
                  Upload Specimen
                </p>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">RAW / NEURAL / LIDAR DATA</p>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
              {/* Decorative background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </label>

            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center"
              >
                {errorMessage}
              </motion.div>
            )}

            <div className="flex gap-4">
              <button 
                onClick={onManualEntry}
                className="flex-1 py-4 bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <Plus className="w-4 h-4" />
                Manual Data Entry
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000" />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-[#0C0B0A]/80 backdrop-blur-xl flex flex-col items-center justify-center text-white p-10">
                      <div className="relative mb-8">
                        <Loader2 className="w-16 h-16 animate-spin text-[#D4AF37]" />
                        <div className="absolute inset-0 w-16 h-16 border-4 border-[#D4AF37]/20 rounded-full" />
                      </div>
                      <p className="text-2xl font-black italic tracking-tighter text-center font-display mb-2">NEURAL RECONSTRUCTION</p>
                      <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.4em] animate-pulse">Deep Forensic Analysis in Progress...</p>
                      
                      {/* Neural Data Stream */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ y: -100, x: Math.random() * 400 }}
                            animate={{ y: 500 }}
                            transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, ease: "linear" }}
                            className="absolute text-[8px] font-mono text-[#D4AF37] whitespace-nowrap"
                          >
                            {Math.random().toString(16).substring(2, 15).toUpperCase()}
                          </motion.div>
                        ))}
                      </div>

                      {/* Scanning line effect */}
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-px bg-[#D4AF37] shadow-[0_0_15px_#D4AF37] z-20"
                      />
                    </div>
                  )}
                </div>
                
                {/* Extra Images */}
                <div className="grid grid-cols-4 gap-4">
                  {extraImages.map((img, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group"
                    >
                      <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                      <button 
                        onClick={() => setExtraImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                  <button 
                    onClick={() => extraImagesRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center hover:bg-white/5 hover:border-[#D4AF37]/30 transition-all gap-2"
                  >
                    <Plus className="w-5 h-5 text-white/20" />
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Add View</span>
                  </button>
                  <input 
                    ref={extraImagesRef}
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={handleExtraImages} 
                  />
                </div>
              </div>

              <AnimatePresence>
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 h-full flex flex-col shadow-2xl relative overflow-hidden group">
                      <div className="mb-6 relative z-10">
                        <h4 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-2">Neural Coordinate Match</h4>
                        <div className="flex items-center gap-3 text-2xl font-black italic tracking-tighter font-display">
                          <MapPin className="w-6 h-6 text-[#D4AF37]" />
                          {result?.suggestedDiscoveryLocation.name}
                        </div>
                      </div>

                      <div className="flex-1 rounded-[2rem] overflow-hidden border border-white/10 bg-black relative min-h-[300px] shadow-inner">
                        <iframe
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          scrolling="no"
                          src={getPublicMapUrl(
                            result?.suggestedDiscoveryLocation.lat, 
                            result?.suggestedDiscoveryLocation.lng
                          )}
                          className="grayscale opacity-40 contrast-150 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
                        />
                        <div className="absolute bottom-4 right-4 bg-[#0C0B0A]/80 backdrop-blur-xl px-4 py-2 rounded-xl border border-[#D4AF37]/20 text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">
                          Satellite Discovery Mapping
                        </div>
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-[60px] pointer-events-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 bg-white/5 p-10 rounded-[3rem] border border-white/10 relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em]">
                        <span>{result.civilization}</span>
                        <span className="w-1.5 h-1.5 bg-[#D4AF37]/30 rounded-full" />
                        <span>{result.estimatedEra}</span>
                      </div>
                      <h3 className="text-5xl font-black italic tracking-tighter font-display">{result.name}</h3>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <div className="bg-[#D4AF37] px-5 py-2 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                        <span className="text-xs font-black text-[#0C0B0A] uppercase tracking-widest">{(result.confidenceScore * 100).toFixed(1)}% NEURAL MATCH</span>
                      </div>
                      <button 
                        onClick={() => onManualEntry({ ...result, imageUrl: preview, extraImages })}
                        className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-3 h-3" />
                        Refine Neural Data
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Specimen Description</h4>
                      <p className="text-white/60 leading-relaxed text-sm font-medium">{result.description}</p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Historical Context</h4>
                      <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 italic text-sm text-white/40 leading-relaxed">
                        "{result.historicalContext}"
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">Material Analysis</h4>
                      <div className="p-6 bg-[#D4AF37]/5 rounded-[2rem] border border-[#D4AF37]/10 text-sm text-white/70 leading-relaxed">
                        {result.materialAnalysis}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">Cultural Significance</h4>
                      <div className="p-6 bg-[#D4AF37]/5 rounded-[2rem] border border-[#D4AF37]/10 text-sm text-white/70 leading-relaxed">
                        {result.culturalSignificance}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={saveArtifact}
                    className="w-full py-6 bg-[#D4AF37] hover:bg-[#C4A030] text-[#0C0B0A] font-black rounded-[2rem] transition-all flex items-center justify-center gap-4 mt-6 shadow-[0_0_50px_rgba(212,175,55,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <CheckCircle2 className="w-7 h-7" />
                    COMMIT TO ARCHIVES
                  </button>
                  
                  {/* Decorative background */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={resetScanner}
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/20 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all border border-transparent hover:border-white/10"
            >
              Abort Neural Scan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
