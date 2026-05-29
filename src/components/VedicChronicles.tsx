import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Book, Feather, ScrollText, Sparkles, Search, Library, FileText, Bookmark } from 'lucide-react';

const TEXTS = [
  { id: 'rigveda', name: 'Rigveda', category: 'Shruti', date: 'c. 1500–1200 BC', description: 'The oldest known Vedic Sanskrit text, containing hymns to deities.' },
  { id: 'mahabharata', name: 'Mahabharata', category: 'Itihasa', date: 'c. 400 BC – 400 AD', description: 'The world\'s longest epic poem, detailing the Kurukshetra War.' },
  { id: 'arthashastra', name: 'Arthashastra', category: 'Shastra', date: 'c. 2nd Century BC – 3rd Century AD', description: 'Ancient Indian treatise on statecraft, economic policy, and military strategy.' },
  { id: 'sangam', name: 'Sangam Literature', category: 'Kavya', date: 'c. 300 BC – 300 AD', description: 'The earliest available Tamil literature, reflecting South Indian life.' }
];

export const VedicChronicles: React.FC = () => {
  const [selectedText, setSelectedText] = useState(TEXTS[0]);

  return (
    <div className="bg-slate-950 border border-amber-900/30 rounded-2xl overflow-hidden h-full flex flex-col shadow-2xl">
      <div className="p-6 border-b border-amber-900/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
            <Feather className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-50" style={{ fontFamily: 'serif' }}>Vedic Chronicles Engine</h2>
            <p className="text-[10px] text-amber-500/70 font-mono uppercase tracking-[0.2em]">Textual Correlation & Mythology</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
        {/* Library Sidebar */}
        <div className="lg:col-span-3 p-4 border-r border-amber-900/20 space-y-2 bg-black/20">
          <div className="flex items-center gap-2 px-2 py-3">
            <Library className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Ancient Archives</span>
          </div>
          {TEXTS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedText(t)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedText.id === t.id
                  ? 'bg-amber-900/20 border-amber-500/50 text-amber-50'
                  : 'bg-transparent border-transparent text-amber-900 hover:text-amber-600 hover:bg-amber-900/5'
              }`}
            >
              <h4 className="font-bold text-sm">{t.name}</h4>
              <p className="text-[10px] opacity-60 font-medium">{t.date}</p>
            </button>
          ))}
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-9 p-8 flex flex-col gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full" />
          
          <div className="relative z-10 flex flex-col h-full">
            <motion.div
              key={selectedText.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                  {selectedText.category}
                </span>
                <span className="text-xs text-amber-700 font-serif italic">Canonical Record</span>
              </div>

              <h3 className="text-4xl font-serif font-bold text-amber-100 italic">{selectedText.name}</h3>
              <p className="text-amber-200/60 leading-relaxed max-w-2xl font-serif text-lg">
                "{selectedText.description}"
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 rounded-2xl bg-amber-900/10 border border-amber-900/20 space-y-4">
                  <div className="flex items-center gap-2">
                    <ScrollText className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-bold text-amber-50 text-uppercase italic">Neural Correlation</span>
                  </div>
                  <p className="text-sm text-amber-200/40 leading-relaxed font-serif">
                    AI identifies high semantic overlap between archaeological findings at Kurukshetra and references in the {selectedText.name}. 
                    Significant alignment in metallurgical descriptions of weaponry.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-amber-900/10 border border-amber-900/20 flex flex-col justify-between">
                  <div className="space-y-2">
                     <span className="text-[10px] font-bold text-amber-600/80 uppercase tracking-[0.3em]">Associated Entities</span>
                     <div className="flex flex-wrap gap-2">
                        {['Dharma', 'Vyuha', 'Astras', 'Chakra'].map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-amber-300 border border-amber-500/20 px-2 py-1 rounded-md bg-amber-500/5">
                            {tag}
                          </span>
                        ))}
                     </div>
                  </div>
                  <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-amber-600 text-amber-950 font-bold rounded-xl hover:bg-amber-500 transition-colors">
                    <Book className="w-4 h-4" />
                    Read Neural Dissertation
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="mt-auto pt-8 border-t border-amber-900/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-amber-900/50 flex items-center justify-center text-[10px] font-bold text-amber-500">
                        {i}
                     </div>
                   ))}
                </div>
                <span className="text-[10px] text-amber-700 font-bold uppercase tracking-widest leading-none">
                  104 Peers <br/> currently analyzing
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500 hover:bg-amber-500/10 transition-all">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500 hover:bg-amber-500/10 transition-all">
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
