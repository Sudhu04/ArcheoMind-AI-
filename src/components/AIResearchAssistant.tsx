import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles, MessageCircle, Microscope, Compass, Quote } from 'lucide-react';
import { askHistorian } from '../services/geminiService';
import { Artifact, User } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  senderName: string;
  timestamp: number;
}

type PersonaType = 'general' | 'epigraphist' | 'metallurgist' | 'botanist';

const PERSONAS: Record<PersonaType, { name: string; title: string; color: string; icon: string; welcome: string }> = {
  general: {
    name: "A.I.D.E.N.",
    title: "Consensus AI System",
    color: "from-blue-600 to-indigo-600",
    icon: "💻",
    welcome: "Ready to cross-reference our entire ancient data matrix. What administrative or statistical patterns shall we synthesize?"
  },
  epigraphist: {
    name: "Dr. Evelyn Vance",
    title: "Chief Epigraphist & Philologist",
    color: "from-purple-600 to-fuchsia-600",
    icon: "📜",
    welcome: "Greetings. I am ready to translate, analyze scripts, trans-regional philology, or decode stamps. Which inscriptional elements shall we scrutinize?"
  },
  metallurgist: {
    name: "Prof. Rajan Mehta",
    title: "Principal Archaeometallurgist",
    color: "from-amber-600 to-orange-600",
    icon: "🔬",
    welcome: "Thermal recrystallization, sintered clays, and element traces are my specialty. Fire away your chemical or mineral diagnostics!"
  },
  botanist: {
    name: "Dr. Chloe Durand",
    title: "Senior Archaeobotanist",
    color: "from-emerald-600 to-teal-600",
    icon: "🌱",
    welcome: "Looking closely at environmental evidence. I am ready to dissect stratigraphy, palynological maps, or soil residues."
  }
};

const SUGGESTIONS = [
  "What is the composition analysis of this artifact?",
  "Tell me about the estimated era and dating parameters.",
  "What is the cultural significance of this civilization?",
  "How does the stratigraphic layer influence our understanding?"
];

export default function AIResearchAssistant({ currentUser, artifacts }: { currentUser: User, artifacts: Artifact[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePersona, setActivePersona] = useState<PersonaType>('general');
  const [messages, setMessages] = useState<Record<PersonaType, Message[]>>({
    general: [
      {
        id: 'welcome-gen',
        role: 'assistant',
        senderName: 'A.I.D.E.N.',
        content: `Greetings, ${currentUser.name}. I am your Consensus AI System. I have indexed ${artifacts.length} artifacts in this local research node. How can I assist your investigation today?`,
        timestamp: Date.now()
      }
    ],
    epigraphist: [
      {
        id: 'welcome-epi',
        role: 'assistant',
        senderName: 'Dr. Evelyn Vance',
        content: `Hello, colleague. Dr. Evelyn Vance here. Ready to decode scripts, examine stamps, and investigate classical philological lineages across these specimens. Let's delve into the letters.`,
        timestamp: Date.now()
      }
    ],
    metallurgist: [
      {
        id: 'welcome-met',
        role: 'assistant',
        senderName: 'Prof. Rajan Mehta',
        content: `Mehta here. Excited to drill down into the micro-crystalline structure, heat thresholds, and mineral components of these findings. Send over your questions.`,
        timestamp: Date.now()
      }
    ],
    botanist: [
      {
        id: 'welcome-bot',
        role: 'assistant',
        senderName: 'Dr. Chloe Durand',
        content: `Greetings! Dr. Chloe Durand here. Ready to evaluate micro-organic structures, seed carbonization, or stratigraphic horizons. Let's dig deeper.`,
        timestamp: Date.now()
      }
    ]
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = messages[activePersona];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isOpen, activePersona]);

  const handleSend = async (messageText: string = input) => {
    const textToSubmit = messageText.trim();
    if (!textToSubmit || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      senderName: currentUser.name,
      content: textToSubmit,
      timestamp: Date.now()
    };

    setMessages(prev => ({
      ...prev,
      [activePersona]: [...prev[activePersona], userMessage]
    }));

    if (messageText === input) {
      setInput('');
    }
    setIsLoading(true);

    try {
      // Find context if user is asking about a specific artifact
      const artifactContext = artifacts.find(a => 
        textToSubmit.toLowerCase().includes((a.name || '').toLowerCase()) || 
        textToSubmit.toLowerCase().includes((a.civilization || '').toLowerCase())
      ) || artifacts[0];

      const response = await askHistorian(artifactContext, textToSubmit, activePersona);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        senderName: PERSONAS[activePersona].name,
        content: response || "My cognitive neural gate could not synthesize a consensus response. Let us review the primary physical data catalog.",
        timestamp: Date.now()
      };

      setMessages(prev => ({
        ...prev,
        [activePersona]: [...prev[activePersona], assistantMessage]
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[26rem] h-[580px] glass-card rounded-[2.5rem] border-white shadow-2xl overflow-hidden flex flex-col bg-white/95 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className={`p-6 bg-gradient-to-tr ${PERSONAS[activePersona].color} text-white flex items-center justify-between transition-all duration-300`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md text-xl">
                  {PERSONAS[activePersona].icon}
                </div>
                <div>
                  <h3 className="text-white font-black text-xs uppercase tracking-widest leading-none mb-1">
                    {PERSONAS[activePersona].name}
                  </h3>
                  <p className="text-[9px] text-white/80 font-bold uppercase tracking-wider">
                    {PERSONAS[activePersona].title}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl text-white/80 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Persona Switch Board */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-1.5 overflow-x-auto scrollbar-none">
              {(Object.keys(PERSONAS) as PersonaType[]).map((key) => {
                const p = PERSONAS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setActivePersona(key)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      activePersona === key 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span className="hidden sm:inline">{p.name.split(' ').pop()}</span>
                  </button>
                );
              })}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {currentMessages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">
                    {m.senderName}
                  </span>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed font-bold ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex flex-col items-start animate-pulse">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">
                    {PERSONAS[activePersona].name} is analyzing...
                  </span>
                  <div className="bg-slate-100/80 border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Slider */}
            <div className="px-5 py-2 bg-slate-50/50 border-t border-slate-100 overflow-x-auto scrollbar-none flex gap-2">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  disabled={isLoading}
                  onClick={() => handleSend(s)}
                  className="flex-shrink-0 text-[10px] font-bold text-indigo-600 bg-white border border-indigo-50 hover:bg-indigo-50/50 px-3 py-1.5 rounded-full shadow-sm transition-all whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <div className="relative">
                <input 
                  type="text"
                  placeholder={`Consult ${PERSONAS[activePersona].name}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-6 pr-14 text-xs font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-100 shadow-indigo-100/50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 radiant-gradient rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-200 border-4 border-white/20 relative group"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-indigo-400/30 group-hover:hidden" />
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
