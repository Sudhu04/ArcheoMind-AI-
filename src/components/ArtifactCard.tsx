import { Artifact } from '../types';
import { Clock, MapPin, Trash2, ExternalLink, Plus, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ArtifactCardProps {
  artifact: Artifact;
  onDelete: (id: string) => void;
  onSelect: () => void;
  isActive?: boolean;
  variant?: 'dark' | 'bright';
}

export default function ArtifactCard({ artifact, onDelete, onSelect, isActive }: ArtifactCardProps) {
  return (
    <div 
      onClick={onSelect}
      className={`group glass-card rounded-[2rem] overflow-hidden transition-all duration-500 cursor-pointer relative ${isActive ? 'ring-2 ring-indigo-500 shadow-2xl shadow-indigo-100 -translate-y-2' : 'hover:shadow-xl hover:shadow-indigo-50 hover:bg-white hover:-translate-y-1'}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={artifact.imageUrl} 
          alt={artifact.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          {artifact.extraImages && artifact.extraImages.length > 0 && (
            <div className="bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/50 flex items-center gap-1.5 shadow-sm">
              <Plus className="w-3 h-3 text-indigo-600" />
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{artifact.extraImages.length}</span>
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
          <div className="radiant-gradient px-3 py-1 rounded-full shadow-lg shadow-indigo-100 border border-white/30 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-white" />
            <span className="text-[9px] font-extrabold text-white uppercase tracking-wider">{(artifact.confidenceScore * 100).toFixed(0)}% MATCH</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-6 right-6">
          <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>{artifact.civilization}</span>
            <span className="w-1 h-1 bg-indigo-200 rounded-full" />
            <span>{artifact.estimatedEra}</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 truncate tracking-tight font-display">{artifact.name}</h3>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl border border-indigo-100">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
              <p className="text-[11px] font-semibold text-slate-600 leading-tight truncate max-w-[140px]">{artifact.location?.name || 'Unknown Location'}</p>
            </div>
          </div>
          
          <div className="flex gap-1.5">
             <button 
                onClick={(e) => { e.stopPropagation(); onDelete(artifact.id); }}
                className="p-2 bg-rose-50 text-rose-400 rounded-lg border border-transparent hover:border-rose-100 hover:bg-rose-100 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${artifact.location?.lat || 0},${artifact.location?.lng || 0}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-300 text-[9px] font-bold uppercase tracking-widest pt-4 border-t border-slate-50">
          <Clock className="w-3.5 h-3.5" />
          {formatDistanceToNow(artifact.timestamp)} ago
        </div>
      </div>
    </div>
  );
}
