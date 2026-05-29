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
  Tag,
  Layers,
  ShieldCheck,
  Sparkles,
  Camera,
  Search
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
  const [entryMode, setEntryMode] = useState<'single' | 'batch'>('single');
  const [batchJson, setBatchJson] = useState('');
  const [batchError, setBatchError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);
  const [extraImages, setExtraImages] = useState<string[]>(initialData?.extraImages || []);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'Monument',
    rarityLevel: initialData?.rarityLevel || 1,
    description: initialData?.description || '',
    historicalContext: initialData?.historicalContext || '',
    estimatedEra: initialData?.estimatedEra || '',
    civilization: initialData?.civilization || '',
    lat: initialData?.suggestedDiscoveryLocation?.lat || 0,
    lng: initialData?.suggestedDiscoveryLocation?.lng || 0,
    locationName: initialData?.suggestedDiscoveryLocation?.name || '',
    continent: initialData?.region?.continent || '',
    country: initialData?.region?.country || '',
    state: initialData?.region?.state || '',
    tags: initialData?.suggestedTags?.join(', ') || '',
    materialAnalysis: initialData?.materialAnalysis || '',
    culturalSignificance: initialData?.culturalSignificance || '',
    depth: initialData?.stratigraphy?.depth || '',
    layer: initialData?.stratigraphy?.layer || '',
    stratigraphyDescription: initialData?.stratigraphy?.description || '',
    ocrTranscription: initialData?.neuralAnnotations?.ocrTranscription || '',
    provenancePrediction: initialData?.neuralAnnotations?.provenancePrediction || '',
    restorationDescription: initialData?.neuralAnnotations?.restorationDescription || ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraImagesRef = useRef<HTMLInputElement>(null);

  const handleLookup = async () => {
    if (!formData.name.trim()) return;
    
    try {
      const artifacts = await storage.getArtifacts();
      const query = formData.name.toLowerCase();
      
      // Fuzzy matching
      const matches = artifacts.map(a => {
        const name = (a.name || '').toLowerCase();
        let score = 0;
        if (name === query) score += 100;
        else if (name.startsWith(query)) score += 50;
        else if (name.includes(query)) score += 20;
        return { artifact: a, score };
      })
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score);
      
      if (matches.length > 0) {
        const match = matches[0].artifact;
        setFormData({
          ...formData,
          name: match.name,
          type: match.type || 'Ceramic',
          rarityLevel: match.rarityLevel || 1,
          description: match.description || '',
          historicalContext: match.historicalContext || '',
          estimatedEra: match.estimatedEra || '',
          civilization: match.civilization || '',
          lat: match.location?.lat || 0,
          lng: match.location?.lng || 0,
          locationName: match.location?.name || '',
          continent: match.region?.continent || 'Asia',
          country: match.region?.country || 'India',
          state: match.region?.state || '',
          tags: match.tags?.join(', ') || '',
          materialAnalysis: match.materialAnalysis || '',
          culturalSignificance: match.culturalSignificance || '',
          depth: match.stratigraphy?.depth?.toString() || '',
          layer: match.stratigraphy?.layer || '',
          stratigraphyDescription: match.stratigraphy?.description || '',
          ocrTranscription: match.neuralAnnotations?.ocrTranscription || '',
          provenancePrediction: match.neuralAnnotations?.provenancePrediction || '',
          restorationDescription: match.neuralAnnotations?.restorationDescription || ''
        });
        if (match.imageUrl) setPreview(match.imageUrl);
        if (match.extraImages) setExtraImages(match.extraImages);
      }
    } catch (err) {
      console.error("Lookup failed", err);
    }
  };

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
      type: formData.type,
      rarityLevel: formData.rarityLevel,
      description: formData.description,
      historicalContext: formData.historicalContext,
      estimatedEra: formData.estimatedEra,
      civilization: formData.civilization,
      location: {
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        name: formData.locationName
      },
      region: {
        continent: formData.continent,
        country: formData.country,
        state: formData.state
      },
      imageUrl: preview,
      extraImages: extraImages,
      timestamp: Date.now(),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      confidenceScore: 1.0,
      materialAnalysis: formData.materialAnalysis,
      culturalSignificance: formData.culturalSignificance,
      stratigraphy: {
        depth: Number(formData.depth) || 0,
        layer: formData.layer,
        description: formData.stratigraphyDescription
      },
      neuralAnnotations: {
        ocrTranscription: formData.ocrTranscription,
        provenancePrediction: formData.provenancePrediction,
        restorationDescription: formData.restorationDescription
      },
      isVerified: false
    };

    await storage.saveArtifact(newArtifact);
    await storage.logAction({
      action: 'ARTIFACT_INGESTED',
      userId: currentUser.id,
      userName: currentUser.name,
      targetId: newArtifact.id,
      targetName: newArtifact.name
    });
    onArtifactSaved(newArtifact.id);
  };

  const handleBatchSave = async () => {
    try {
      const data = JSON.parse(batchJson);
      if (!Array.isArray(data)) throw new Error("Batch data must be an array");
      
      for (const item of data) {
         const artifact: Artifact = {
            id: crypto.randomUUID(),
            userId: currentUser.id,
            userName: currentUser.name,
            timestamp: Date.now(),
            confidenceScore: 0.95,
            isVerified: false,
            ...item
         };
         await storage.saveArtifact(artifact);
      }
      onArtifactSaved(data[0]?.id || 'batch');
    } catch (err: any) {
      setBatchError(err.message);
    }
  };

  if (entryMode === 'batch') {
    return (
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <button 
              onClick={() => setEntryMode('single')}
              className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors group mb-2"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Switch to Single Record</span>
            </button>
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-indigo-50 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
               </div>
               <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-display">Batch <span className="text-indigo-600">Ingestion</span></h1>
            </div>
          </div>
        </div>

        <div className="glass-card bg-white p-12 rounded-[3.5rem] shadow-2xl border-white space-y-8">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Dataset (JSON Array)</label>
              <textarea 
                value={batchJson}
                onChange={e => setBatchJson(e.target.value)}
                placeholder='[ { "name": "Artifact 1", "imageUrl": "...", ... } ]'
                className="w-full h-[400px] bg-slate-50 border-2 border-white rounded-[2rem] p-8 text-xs font-mono focus:outline-none focus:border-indigo-400 transition-all shadow-inner"
              />
           </div>
           
           {batchError && (
             <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-600 text-xs font-bold font-mono">
                <X className="w-4 h-4" />
                Error: {batchError}
             </div>
           )}

           <button 
             onClick={handleBatchSave}
             className="w-full py-6 radiant-gradient text-white font-black uppercase text-xs tracking-widest rounded-[2rem] shadow-2xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all"
           >
              Initialize Neural Batch Sequence
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors group mb-2"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Back to Scanning</span>
          </button>
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-indigo-50 rounded-xl">
                <Sparkles className="w-5 h-5 text-indigo-600" />
             </div>
             <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-display">Neural <span className="text-indigo-600">Archivist</span></h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setEntryMode('batch')}
             className="px-6 py-3 bg-white border-2 border-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-50 transition-all"
           >
              Batch Mode
           </button>
           <div className="flex items-center gap-4 px-6 py-3 glass-card border-white bg-indigo-50/30 rounded-[1.5rem]">
              <Info className="w-4 h-4 text-indigo-500" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manual Ingestion Protocol Active</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Media Upload */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
              <Camera className="w-3.5 h-3.5" />
              Primary Spatial Visual
            </h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video rounded-[3rem] border-4 border-dashed border-slate-100 bg-white flex flex-col items-center justify-center cursor-pointer hover:border-indigo-200 hover:bg-slate-50 transition-all group overflow-hidden relative shadow-inner"
            >
              {preview ? (
                <img src={preview} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Preview" />
              ) : (
                <>
                  <div className="p-5 radiant-gradient rounded-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-100">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Upload Main Specimen</p>
                </>
              )}
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleMainImage} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
              <Plus className="w-3.5 h-3.5" />
              Supplementary Links ({extraImages.length})
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {extraImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-md group bg-white">
                  <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                  <button 
                    onClick={() => setExtraImages(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 p-1.5 bg-rose-500/90 text-white rounded-xl transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all shadow-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => extraImagesRef.current?.click()}
                className="aspect-square rounded-2xl border-4 border-dashed border-slate-100 bg-white flex items-center justify-center hover:border-indigo-200 hover:bg-slate-50 transition-all group shadow-inner"
              >
                <Plus className="w-8 h-8 text-slate-200 group-hover:text-indigo-400 transition-colors" />
              </button>
              <input ref={extraImagesRef} type="file" className="hidden" accept="image/*" multiple onChange={handleExtraImages} />
            </div>
          </div>
        </div>

        {/* Right: Data Form */}
        <div className="space-y-8">
          <div className="glass-card border-white bg-white/70 rounded-[3rem] p-10 space-y-10 shadow-2xl shadow-indigo-100/50">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <InputGroup label="Specimen Designation" icon={<Tag />} value={formData.name} onChange={v => setFormData(p => ({...p, name: v}))} placeholder="e.g. Jade Emperor Seal" />
                  <button 
                    onClick={handleLookup}
                    className="absolute right-2 top-8 p-2 text-indigo-500 hover:text-indigo-700 bg-indigo-50 rounded-lg transition-colors border border-indigo-100"
                    title="Sync with Archives"
                  >
                    <Search className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    Classification Type
                  </label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold focus:outline-none focus:border-indigo-400 transition-all shadow-inner"
                  >
                    <option value="Ceramic">Ceramic</option>
                    <option value="Metalwork">Metalwork</option>
                    <option value="Script">Script</option>
                    <option value="Tool">Tool</option>
                    <option value="Ornament">Ornament</option>
                    <option value="Monument">Monument</option>
                    <option value="Unknown">Unknown Asset</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Civilization Matrix" icon={<Globe />} value={formData.civilization} onChange={v => setFormData(p => ({...p, civilization: v}))} placeholder="e.g. Han Dynasty" />
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Rarity Level (1-10)
                  </label>
                  <input 
                    type="range" min="1" max="10"
                    value={formData.rarityLevel}
                    onChange={e => setFormData(p => ({ ...p, rarityLevel: Number(e.target.value) }))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
                    <span>Common</span>
                    <span>Relic</span>
                    <span>Mythic</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Neural Chronology" icon={<HistoryIcon />} value={formData.estimatedEra} onChange={v => setFormData(p => ({...p, estimatedEra: v}))} placeholder="e.g. 2nd Century BCE" />
                <InputGroup label="Metadata Tags" icon={<Tag />} value={formData.tags} onChange={v => setFormData(p => ({...p, tags: v}))} placeholder="e.g. ritual, jade, empire" />
              </div>

              <TextAreaGroup label="Specimen Description" value={formData.description} onChange={v => setFormData(p => ({...p, description: v}))} placeholder="Detail physical properties..." />
              <TextAreaGroup label="Historical Narrative" value={formData.historicalContext} onChange={v => setFormData(p => ({...p, historicalContext: v}))} placeholder="Explain the cultural significance..." />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <TextAreaGroup label="Material Matrix" value={formData.materialAnalysis} onChange={v => setFormData(p => ({...p, materialAnalysis: v}))} placeholder="Lapis lazuli, obsidian..." />
                 <TextAreaGroup label="Cultural Weight" value={formData.culturalSignificance} onChange={v => setFormData(p => ({...p, culturalSignificance: v}))} placeholder="Role in ancient society..." />
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                <SectionHeader label="Stratigraphic Matrix" icon={<Layers />} color="text-indigo-500" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup type="number" label="Target Depth (m)" icon={<Layers />} value={formData.depth.toString()} onChange={v => setFormData(p => ({...p, depth: v}))} placeholder="0.0" />
                  <InputGroup label="Primary Stratum" icon={<Layers />} value={formData.layer} onChange={v => setFormData(p => ({...p, layer: v}))} placeholder="e.g. Loam Layer B" />
                </div>
                <TextAreaGroup label="Soil Composition" value={formData.stratigraphyDescription} onChange={v => setFormData(p => ({...p, stratigraphyDescription: v}))} placeholder="Describe the surrounding context..." />
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                <SectionHeader label="Neural Annotations" icon={<ShieldCheck />} color="text-violet-500" />
                <div className="space-y-6">
                  <InputGroup label="Script OCR Transcription" icon={<Tag />} value={formData.ocrTranscription} onChange={v => setFormData(p => ({...p, ocrTranscription: v}))} placeholder="Deciphered characters..." />
                  <InputGroup label="Geological Provenance" icon={<Globe />} value={formData.provenancePrediction} onChange={v => setFormData(p => ({...p, provenancePrediction: v}))} placeholder="Source region analysis..." />
                  <TextAreaGroup label="Spatial Restoration" value={formData.restorationDescription} onChange={v => setFormData(p => ({...p, restorationDescription: v}))} placeholder="Projected primary state..." />
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                <SectionHeader label="Spatial Coordinates" icon={<MapPin />} color="text-rose-500" />
                <div className="space-y-6">
                  <InputGroup label="Discovery Site Name" icon={<MapPin />} value={formData.locationName} onChange={v => setFormData(p => ({...p, locationName: v}))} placeholder="e.g. Xian, China" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputGroup label="Continent" icon={<Globe />} value={formData.continent} onChange={v => setFormData(p => ({...p, continent: v}))} placeholder="e.g. Asia" />
                    <InputGroup label="Country" icon={<Globe />} value={formData.country} onChange={v => setFormData(p => ({...p, country: v}))} placeholder="e.g. China" />
                    <InputGroup label="State / Province" icon={<Globe />} value={formData.state} onChange={v => setFormData(p => ({...p, state: v}))} placeholder="e.g. Shaanxi" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <InputGroup type="number" label="Latitude" icon={<MapPin />} value={formData.lat.toString()} onChange={v => setFormData(p => ({...p, lat: Number(v)}))} placeholder="0.00" />
                    <InputGroup type="number" label="Longitude" icon={<MapPin />} value={formData.lng.toString()} onChange={v => setFormData(p => ({...p, lng: Number(v)}))} placeholder="0.00" />
                  </div>
                   <div className="aspect-video rounded-[2rem] overflow-hidden border-4 border-white bg-slate-50 shadow-xl relative group">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      src={`https://maps.google.com/maps?q=${formData.lat},${formData.lng}&t=k&z=13&ie=UTF8&iwloc=&output=embed`}
                      className="grayscale opacity-60 contrast-125 saturate-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-bold text-slate-500 uppercase tracking-widest shadow-md">
                      Satellite Visual Map
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={handleSave}
                disabled={!preview || !formData.name || !formData.locationName}
                className="btn-primary w-full flex items-center justify-center gap-4 py-6"
              >
                <CheckCircle2 className="w-6 h-6" />
                Commit to Dashboard Archives
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, placeholder, value, onChange, icon, type = "text" }: { label: string, placeholder: string, value: string, onChange: (v: string) => void, icon?: React.ReactNode, type?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
         {icon && React.cloneElement(icon as React.ReactElement<any>, { className: 'w-3 h-3' })}
         {label}
      </label>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-50/50 border-2 border-white rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
      />
    </div>
  );
}

function TextAreaGroup({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <textarea 
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-50/50 border-2 border-white rounded-[1.5rem] px-5 py-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all h-32 resize-none shadow-sm"
      />
    </div>
  );
}

function SectionHeader({ label, icon, color }: { label: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="flex items-center gap-3">
       <div className={`p-2 bg-slate-50 rounded-xl border border-white ${color}`}>
          {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
       </div>
       <h3 className={`text-xs font-bold uppercase tracking-[0.2em] ${color}`}>{label}</h3>
    </div>
  );
}
