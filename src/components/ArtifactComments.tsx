import React, { useState } from 'react';
import { Comment, User } from '../types';
import { MessageSquare, Send, Heart, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ArtifactCommentsProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  currentUser: User | null;
}

export default function ArtifactComments({ comments, onAddComment, currentUser }: ArtifactCommentsProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 rounded-xl">
          <MessageSquare className="w-4 h-4 text-indigo-500" />
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Collaborative Neural Links</h4>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {comments.length === 0 ? (
            <div className="py-12 text-center opacity-30">
               <MessageSquare className="w-8 h-8 mx-auto mb-3" />
               <p className="text-xs font-bold uppercase tracking-widest">No neural connections yet</p>
            </div>
          ) : (
            comments.sort((a,b) => b.timestamp - a.timestamp).map((comment) => (
              <motion.div 
                key={comment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-5 glass-card border-white bg-white/50 rounded-3xl space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                       <UserIcon className="w-3 h-3 text-slate-400" />
                    </div>
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">{comment.userName}</span>
                    <span className="text-[9px] font-bold text-slate-300">{new Date(comment.timestamp).toLocaleDateString()}</span>
                  </div>
                  <button className="flex items-center gap-1 text-slate-300 hover:text-rose-500 transition-colors">
                    <Heart className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{comment.likes}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{comment.text}</p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {currentUser && (
        <form onSubmit={handleSubmit} className="relative mt-8">
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Link your analysis..."
            className="w-full bg-slate-50 border-2 border-white rounded-[2rem] px-6 py-4 text-xs font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-none resize-none h-24"
          />
          <button 
            type="submit"
            disabled={!newComment.trim()}
            className="absolute right-3 bottom-3 p-3 bg-indigo-600 text-white rounded-2xl shadow-lg disabled:opacity-50 hover:scale-110 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
