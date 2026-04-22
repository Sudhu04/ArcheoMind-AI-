import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  MapPin, 
  Plus, 
  X, 
  CheckCircle2, 
  Globe,
  Info,
  History as HistoryIcon,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storage } from '../services/storageService';
import { Artifact, User } from '../types';

interface ManualEntryProps {
  currentUser: User;
  initialData?: any;
  onArtifactSaved: (id: string) => void;
  onCancel: () => void;
}

export default function ManualEntry({ currentUser, initialData, onArtifactSaved, onCancel }: ManualEntryProps) {
  const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);
  const [extraImages, setExtraImages] = useState<string[]>(initialData?.extraImages || []);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    historicalContext: initialData?.historicalContext || '',
    estimatedEra: initialData?.estimatedEra || '',
    civilization: initialData?.civilization || '',
    lat: initialData?.suggestedDiscoveryLocation?.lat || 0,
    lng: initialData?.suggestedDiscoveryLocation?.lng || 0,
    locationName: initialData?.suggestedDiscoveryLocation?.name || '',
    tags: initialData?.suggestedTags?.join(', ') || '',
    materialAnalysis: initialData?.materialAnalysis || '',
    culturalSignificance: initialData?.culturalSignificance || ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraImagesRef = useRef<HTMLInputElement>(null);

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleExtraImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setExtraImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    if (!preview || !formData.name || !formData.locationName) return;

    const newArtifact: Artifact = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      userName: currentUser.name,
      name: formData.name,
      description: formData.description,
      historicalContext: formData.historicalContext,
      estimatedEra: formData.estimatedEra,
      civilization: formData.civilization,
      location: {
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        name: formData.locationName
      },
      imageUrl: preview,
      extraImages: extraImages,
      timestamp: Date.now(),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      confidenceScore: 1.0,
      materialAnalysis: formData.materialAnalysis,
      culturalSignificance: formData.culturalSignificance,
      isVerified: false
    };

    await storage.saveArtifact(newArtifact);
    onArtifactSaved(newArtifact.id);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Scanner</span>
        </button>
        <h1 className="text-4xl font-black italic tracking-tighter">MANUAL ARCHIVE PROTOCOL</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Media Upload */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Primary Visual Specimen
            </h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video rounded-[2.5rem] border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-[#D4AF37]/5 transition-all group overflow-hidden relative"
            >
              {preview ? (
                <img src={preview} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" alt="Preview" />
              ) : (
                <>
                  <div className="p-4 bg-[#D4AF37]/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform border border-[#D4AF37]/20">
                    <Plus className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <p className="text-sm font-black text-white/40 uppercase tracking-widest">Upload Main Image</p>
                </>
              )}
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleMainImage} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Supplementary Evidence ({extraImages.length})
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {extraImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                  <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                  <button 
                    onClick={() => setExtraImages(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => extraImagesRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/30 transition-all group"
              >
                <Plus className="w-8 h-8 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
              </button>
              <input ref={extraImagesRef} type="file" className="hidden" accept="image/*" multiple onChange={handleExtraImages} />
            </div>
          </div>
        </div>

        {/* Right: Data Form */}
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Specimen Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Golden Mask of Agamemnon"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Civilization Origin</label>
                  <input 
                    type="text"
                    placeholder="e.g. Mycenaean"
                    value={formData.civilization}
                    onChange={e => setFormData(prev => ({ ...prev, civilization: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Estimated Chronology</label>
                  <input 
                    type="text"
                    placeholder="e.g. 16th Century BC"
                    value={formData.estimatedEra}
                    onChange={e => setFormData(prev => ({ ...prev, estimatedEra: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Neural Metadata Tags</label>
                  <input 
                    type="text"
                    placeholder="e.g. gold, mask, burial"
                    value={formData.tags}
                    onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Specimen Description</label>
                <textarea 
                  placeholder="Describe the artifact's physical characteristics..."
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all h-24 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Historical Context</label>
                <textarea 
                  placeholder="What is the historical significance of this find?"
                  value={formData.historicalContext}
                  onChange={e => setFormData(prev => ({ ...prev, historicalContext: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all h-24 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Material Analysis</label>
                  <textarea 
                    placeholder="e.g. Lapis lazuli, 22k gold leaf..."
                    value={formData.materialAnalysis}
                    onChange={e => setFormData(prev => ({ ...prev, materialAnalysis: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all h-24 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Cultural Significance</label>
                  <textarea 
                    placeholder="Role in society (religious, funerary...)"
                    value={formData.culturalSignificance}
                    onChange={e => setFormData(prev => ({ ...prev, culturalSignificance: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all h-24 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Geospatial Coordinates
              </h3>
              <div className="space-y-4">
                <input 
                  type="text"
                  placeholder="Site Name (e.g. Mycenae, Greece)"
                  value={formData.locationName}
                  onChange={e => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="number"
                    placeholder="Latitude"
                    value={formData.lat}
                    onChange={e => setFormData(prev => ({ ...prev, lat: Number(e.target.value) }))}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                  />
                  <input 
                    type="number"
                    placeholder="Longitude"
                    value={formData.lng}
                    onChange={e => setFormData(prev => ({ ...prev, lng: Number(e.target.value) }))}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                  />
                </div>
              </div>
              
              <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black relative">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={`https://maps.google.com/maps?q=${formData.lat},${formData.lng}&t=k&z=13&ie=UTF8&iwloc=&output=embed`}
                  className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[8px] text-white/40 uppercase tracking-widest">
                  Live Satellite Preview
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!preview || !formData.name || !formData.locationName}
              className="w-full py-5 bg-[#D4AF37] hover:bg-[#C4A030] disabled:opacity-50 disabled:cursor-not-allowed text-[#0C0B0A] font-black uppercase tracking-widest rounded-[2rem] transition-all flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(212,175,55,0.2)]"
            >
              <CheckCircle2 className="w-6 h-6" />
              COMMIT TO ARCHIVES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
