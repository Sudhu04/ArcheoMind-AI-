import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Mail, User as UserIcon, ArrowRight, ShieldCheck, Loader2, Lock } from 'lucide-react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthGatewayProps {
  onLogin: (user: User) => void;
}

export default function AuthGateway({ onLogin }: AuthGatewayProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignup) {
        const user = await authService.signup(email, name, password, 'user');
        onLogin(user);
      } else {
        const user = await authService.login(email, password);
        // If admin tab is active, ensure user is admin
        if (activeTab === 'admin' && user.role !== 'admin') {
          authService.logout();
          throw new Error('Unauthorized: Admin access only');
        }
        onLogin(user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTab = (tab: 'user' | 'admin') => {
    setActiveTab(tab);
    setIsSignup(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?auto=format&fit=crop&q=80&w=2000" 
          alt="Ancient Pyramids" 
          className="w-full h-full object-cover opacity-20 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C0B0A] via-transparent to-[#0C0B0A]" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-[#D4AF37] rounded-[2.5rem] shadow-[0_0_60px_rgba(212,175,55,0.3)] mb-8"
          >
            {activeTab === 'admin' ? (
              <ShieldCheck className="w-12 h-12 text-[#0C0B0A]" />
            ) : (
              <UserIcon className="w-12 h-12 text-[#0C0B0A]" />
            )}
          </motion.div>
          <h1 className="text-6xl font-black tracking-tighter italic text-white mb-2 uppercase font-display">
            {activeTab === 'admin' ? 'Commander' : 'Researcher'}
          </h1>
          <p className="text-[#D4AF37] uppercase tracking-[0.4em] text-[10px] font-black opacity-60">ArcheoMind Neural Access</p>
        </div>

        <div className="bg-[#080706]/80 backdrop-blur-3xl border border-[#D4AF37]/20 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="flex gap-4 mb-10 p-1.5 bg-white/5 rounded-2xl border border-white/5">
            <button 
              onClick={() => toggleTab('user')}
              className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'user' ? 'bg-[#D4AF37] text-[#0C0B0A] shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              User Login
            </button>
            <button 
              onClick={() => toggleTab('admin')}
              className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'admin' ? 'bg-[#D4AF37] text-[#0C0B0A] shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              Admin Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {isSignup && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/40" />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Indiana Jones"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white placeholder:text-white/10"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/40" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@archeomind.ai"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/40" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white placeholder:text-white/10"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-[#D4AF37] hover:bg-[#C4A030] text-[#0C0B0A] font-black rounded-2xl transition-all flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(212,175,55,0.2)] group hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span className="uppercase tracking-[0.2em]">{isSignup ? 'Sign Up' : 'Login'}</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center space-y-4">
            {activeTab === 'user' && (
              <button 
                onClick={() => setIsSignup(!isSignup)}
                className="text-[10px] text-white/40 hover:text-[#D4AF37] font-black uppercase tracking-[0.2em] transition-colors"
              >
                {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </button>
            )}
            {activeTab === 'admin' && (
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">
                Commander access requires prior authorization
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
