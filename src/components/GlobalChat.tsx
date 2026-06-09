import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageSquare, Terminal, Shield, X } from 'lucide-react';
import { storage } from '../services/storageService';
import { ChatMessage, User } from '../types';

interface GlobalChatProps {
  currentUser: User;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = storage.subscribeToChat((msgs) => {
      setMessages(msgs);
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    });
    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    await storage.sendChatMessage({
      userId: currentUser.id,
      userName: currentUser.name,
      text: inputText.trim()
    });
    setInputText('');
  };

  return (
    <div className="fixed bottom-8 right-28 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-96 h-[500px] glass-card rounded-[2.5rem] border-white shadow-2xl overflow-hidden flex flex-col bg-white/90 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-widest">Neural Channel</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[8px] text-white/70 font-bold uppercase tracking-widest">Research Uplink Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentUser.role === 'admin' && (
                  <div title="Admin Monitored" className="p-2 bg-white/10 rounded-xl">
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.userId === currentUser.id ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex flex-col ${msg.userId === currentUser.id ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 px-2">
                    {msg.userName}
                  </span>
                  <div className={`px-4 py-2.5 rounded-2xl text-xs font-medium max-w-[85%] shadow-sm ${
                    msg.userId === currentUser.id 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Secure uplink..."
                className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              <button 
                type="submit"
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-100 border-4 border-white/20 relative group"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-cyan-400/20 group-hover:hidden" />
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && messages.length > 0 && (
           <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center z-10 shadow-sm">
              <span className="text-[10px] font-black text-white">{messages.length > 9 ? '9+' : messages.length}</span>
           </div>
        )}
      </motion.button>
    </div>
  );
};

export default GlobalChat;
