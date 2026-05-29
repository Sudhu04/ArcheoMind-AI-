import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Mail, User as UserIcon, ArrowRight, ShieldCheck, Loader2, Lock, Sparkles, Eye, EyeOff, FlaskConical, CircleUserRound } from 'lucide-react';
import { authService } from '../services/authService';
import { User } from '../types';
import { DUMMY_RESEARCHERS } from '../constants/dummyUsers';

interface AuthGatewayProps {
  onLogin: (user: User) => void;
}

export default function AuthGateway({ onLogin }: AuthGatewayProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [isSignup, setIsSignup] = useState(false);
  const [showDemoUsers, setShowDemoUsers] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleDummyLogin = async (dummy: any) => {
    setIsLoading(true);
    try {
      const user: User = {
        id: dummy.id,
        email: dummy.email,
        name: dummy.name,
        role: 'researcher',
        joinedAt: Date.now(),
        specialization: dummy.specialization,
        xp: 2500,
        level: 5
      };
      const loggedUser = await authService.loginAsDummy(user);
      onLogin(loggedUser);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignup) {
        const targetRole = activeTab === 'admin' ? 'admin' : 'researcher';
        const user = await authService.signup(email, name, password, targetRole);
        onLogin(user);
      } else {
        const user = await authService.login(email, password);
        if (activeTab === 'admin' && user.role !== 'admin') {
          // Double check if it's whitelisted but somehow didn't upgrade
          if (email === 'sudhanvams7@gmail.com' || email === 'kratosadmin@archeomind.ai') {
            user.role = 'admin'; // Optimistic upgrade if logic somehow lagged
            onLogin(user);
            return;
          }
          await authService.logout();
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl z-10 grid grid-cols-1 lg:grid-cols-5 gap-0 overflow-hidden rounded-[3rem] shadow-2xl border border-white/5"
      >
        <div className="lg:col-span-2 radiant-gradient p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <motion.div 
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-12 border border-white/20"
            >
              <Compass className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-black text-white leading-tight mb-4">
              Gateway to <br/> Neural <span className="text-white/60 font-outline">Archive</span>
            </h2>
            <p className="text-indigo-100/60 text-sm font-medium leading-relaxed">
              Establishing a secure temporal connection to the ArcheoMind global node.
            </p>
          </div>
          
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-4">
                <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.5em]">Protocol Stable</span>
             </div>
             <p className="text-[10px] font-mono text-white/30 truncate">NODES: 42 // SYNC: OPTIMAL</p>
          </div>

          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="lg:col-span-3 bg-slate-900 p-12 relative">
          <div className="flex gap-6 mb-12">
            <button 
              onClick={() => toggleTab('user')}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all pb-2 border-b-2 ${activeTab === 'user' ? 'text-indigo-400 border-indigo-400' : 'text-slate-600 border-transparent hover:text-slate-400'}`}
            >
              Researcher
            </button>
            <button 
              onClick={() => toggleTab('admin')}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all pb-2 border-b-2 ${activeTab === 'admin' ? 'text-indigo-400 border-indigo-400' : 'text-slate-600 border-transparent hover:text-slate-400'}`}
            >
              Commander
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {isSignup && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-2"
                >
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Profile Identity</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Identified Explorer"
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all text-slate-300 placeholder:text-slate-700"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Neural Credential</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@archeomind.link"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all text-slate-300 placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Cipher</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all text-slate-300 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-600 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center bg-rose-500/5 border border-rose-500/20 p-4 rounded-2xl">
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 radiant-gradient text-white font-black rounded-2xl transition-all flex items-center justify-center gap-4 shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="uppercase tracking-[0.3em] text-[11px]">{isSignup ? 'Init Registration' : 'Authenticate Link'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center space-y-6">
            {activeTab === 'user' ? (
              <div className="space-y-6">
                <button 
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-[10px] text-slate-600 hover:text-indigo-400 font-black uppercase tracking-widest transition-colors block w-full"
                >
                  {isSignup ? 'Return to Authentication' : "Request New Credentials"}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em] text-slate-700 bg-slate-900 px-4">
                    Neural Lab Access
                  </div>
                </div>

                {!showDemoUsers ? (
                  <button 
                    onClick={() => setShowDemoUsers(true)}
                    className="flex items-center gap-3 mx-auto px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-all text-[9px] font-bold uppercase tracking-widest"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    Bypass to Researcher Demo
                  </button>
                ) : (
                  <div className="grid grid-cols-5 gap-3">
                    {DUMMY_RESEARCHERS.map((dummy) => (
                      <button
                        key={dummy.id}
                        type="button"
                        onClick={() => handleDummyLogin(dummy)}
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 group-hover:border-indigo-500 group-hover:bg-indigo-500/10 transition-all overflow-hidden relative">
                           <CircleUserRound className="w-6 h-6 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                           <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                        </div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">{dummy.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 mt-4 opacity-50">
                <ShieldCheck className="w-5 h-5 text-slate-800" />
                <p className="text-[10px] text-slate-900 font-bold uppercase tracking-widest">
                  Secure Command Center Access
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
