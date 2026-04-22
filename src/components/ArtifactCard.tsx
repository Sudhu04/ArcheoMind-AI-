import { Artifact } from '../types';
import { Clock, MapPin, Trash2, ExternalLink, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ArtifactCardProps {
  artifact: Artifact;
  onDelete: (id: string) => void;
  onSelect: () => void;
  isActive?: boolean;
}

export default function ArtifactCard({ artifact, onDelete, onSelect, isActive }: ArtifactCardProps) {
  return (
    <div 
      onClick={onSelect}
      className={`group bg-[#080706] border rounded-[2.5rem] overflow-hidden transition-all duration-700 shadow-2xl cursor-pointer relative ${isActive ? 'border-[#D4AF37] bg-[#D4AF37]/5 ring-1 ring-[#D4AF37]/30' : 'border-white/5 hover:border-white/20'}`}
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <img 
          src={artifact.imageUrl} 
          alt={artifact.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-transparent to-transparent opacity-80" />
        
        <div className="absolute top-6 left-6 flex gap-3">
          {artifact.extraImages && artifact.extraImages.length > 0 && (
            <div className="bg-[#0C0B0A]/80 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <Plus className="w-3 h-3 text-[#D4AF37]" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">{artifact.extraImages.length}</span>
            </div>
          )}
        </div>

          <div className="absolute top-6 right-6 flex gap-3">
            <div className="bg-[#D4AF37] px-3 py-1.5 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <span className="text-[9px] font-black text-[#0C0B0A] uppercase tracking-widest">{(artifact.confidenceScore * 100).toFixed(1)}% NEURAL MATCH</span>
            </div>
            <button 
            onClick={(e) => { e.stopPropagation(); onDelete(artifact.id); }}
            className="p-2.5 bg-red-500/10 text-red-500/40 rounded-xl border border-red-500/10 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-6 left-8 right-8">
          <div className="flex items-center gap-2 text-[#D4AF37] text-[9px] font-black uppercase tracking-[0.2em] mb-2">
            <span>{artifact.civilization}</span>
            <span className="w-1 h-1 bg-[#D4AF37]/40 rounded-full" />
            <span>{artifact.estimatedEra}</span>
          </div>
          <h3 className="text-3xl font-black text-white truncate italic tracking-tighter font-display">{artifact.name}</h3>
        </div>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Discovery Site</p>
            <p className="text-xs font-bold text-white/60 leading-tight">{artifact.location.name}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 text-white/20 text-[9px] font-black uppercase tracking-widest">
            <Clock className="w-4 h-4" />
            {formatDistanceToNow(artifact.timestamp)} ago
          </div>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${artifact.location.lat},${artifact.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-3 bg-white/5 rounded-xl border border-white/5 text-white/40 hover:bg-[#D4AF37] hover:text-[#0C0B0A] hover:border-[#D4AF37] transition-all duration-500"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
      {/* Decorative corner */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#D4AF37]/20 rounded-tl-[2.5rem] pointer-events-none" />
    </div>
  );
}
