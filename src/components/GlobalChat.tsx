import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageSquare, Terminal, Shield } from 'lucide-react';
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
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-96 h-[500px] glass-card flex flex-col overflow-hidden border-indigo-400/30 shadow-[0_32px_64px_-16px_rgba(79,70,229,0.3)]"
          >
            <div className="p-4 bg-slate-900 flex items-center justify-between border-b border-slate-800">
               <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Neural Channel // Active</span>
               </div>
               {currentUser.role === 'admin' && (
                  <div title="Admin Monitored">
                    <Shield className="w-3 h-3 text-emerald-400" />
                  </div>
               )}
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

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 relative ${
          isOpen ? 'bg-slate-900 rotate-90' : 'btn-primary'
        }`}
      >
        <MessageSquare className="w-7 h-7" />
        {!isOpen && messages.length > 0 && (
           <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-[10px] font-black text-white">{messages.length > 9 ? '9+' : messages.length}</span>
           </div>
        )}
      </button>
    </div>
  );
};

export default GlobalChat;
