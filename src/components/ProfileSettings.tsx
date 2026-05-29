import React, { useState, useRef } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Phone, 
  Camera, 
  Save, 
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sun,
  Moon,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { authService } from '../services/authService';
import { User } from '../types';

interface ProfileSettingsProps {
  currentUser: User;
  onUpdate: (user: User) => void;
}

export default function ProfileSettings({ currentUser, onUpdate }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    bio: currentUser.bio || '',
    specialization: currentUser.specialization || '',
    affiliation: currentUser.affiliation || '',
    location: currentUser.location || '',
    website: currentUser.website || '',
    twitter: currentUser.socialLinks?.twitter || '',
    linkedin: currentUser.socialLinks?.linkedin || '',
    github: currentUser.socialLinks?.github || '',
    researchInterests: currentUser.researchInterests?.join(', ') || '',
    theme: currentUser.theme || 'light',
    geminiApiKey: typeof window !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY_OVERRIDE') || '' : ''
  });
  const [profileImage, setProfileImage] = useState<string | null>(currentUser.profileImage || null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setStatus('error');
      setErrorMessage('Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setStatus('saving');
    try {
      const updatedData: Partial<User> = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        specialization: formData.specialization,
        affiliation: formData.affiliation,
        location: formData.location,
        website: formData.website,
        socialLinks: {
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          github: formData.github
        },
        researchInterests: formData.researchInterests.split(',').map(s => s.trim()).filter(s => s !== ''),
        profileImage: profileImage || undefined,
        theme: formData.theme as 'light' | 'dark'
      };

      // Save Gemini API Key Override to localStorage
      if (formData.geminiApiKey) {
        localStorage.setItem('GEMINI_API_KEY_OVERRIDE', formData.geminiApiKey);
      } else {
        localStorage.removeItem('GEMINI_API_KEY_OVERRIDE');
      }

      await authService.updateUserProfile(currentUser.id, updatedData);
      
      const updatedUser = { ...currentUser, ...updatedData };
      onUpdate(updatedUser);
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-50 rounded-xl">
                <UserIcon className="w-5 h-5 text-indigo-600" />
             </div>
             <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest">Researcher Identity</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 font-display">
            Neural <span className="text-indigo-600">Profile</span>
          </h1>
          <p className="text-slate-500 max-w-xl leading-relaxed text-sm font-medium">
            Manage your researcher credentials and secure the integrity of your neural link.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Image Section */}
        <div className="lg:col-span-1 space-y-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <div className="w-44 h-44 rounded-3xl overflow-hidden border-4 border-white bg-slate-50 shadow-xl shadow-indigo-100/50">
                {profileImage ? (
                  <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <UserIcon className="w-16 h-16" />
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 p-3 radiant-gradient text-white rounded-2xl shadow-lg hover:scale-110 transition-all border-2 border-white"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input 
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <div className="text-center">
              <p className="text-xl font-extrabold text-slate-900 tracking-tight">{currentUser.name}</p>
              <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest leading-none mt-1">{currentUser.role}</p>
            </div>
          </div>

          <div className="space-y-6">
             <div className="glass-card p-6 space-y-4 rounded-3xl border-white/40 bg-white/40">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Zap className="w-3.5 h-3.5" />
                 Environmental Theme
               </h3>
               <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormData(p => ({ ...p, theme: 'light' }))}
                    className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.theme === 'light' ? 'bg-white border-indigo-500 text-indigo-600 shadow-lg ring-4 ring-indigo-50' : 'bg-white/50 border-white text-slate-400 hover:border-slate-200'}`}
                  >
                     <Sun className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Surface</span>
                  </button>
                  <button
                    onClick={() => setFormData(p => ({ ...p, theme: 'dark' }))}
                    className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.theme === 'dark' ? 'bg-slate-900 border-indigo-500 text-white shadow-lg ring-4 ring-indigo-50' : 'bg-white/50 border-white text-slate-400 hover:border-slate-200'}`}
                  >
                     <Moon className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Deep</span>
                  </button>
               </div>
             </div>

             <div className="glass-card p-6 space-y-4 rounded-3xl border-white/40 bg-white/40">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Sparkles className="w-3.5 h-3.5" />
                 Impact Metrics
               </h3>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Rank</p>
                   <p className="text-xl font-black text-indigo-600">Level 4</p>
                 </div>
                 <div className="bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Trust</p>
                   <p className="text-xl font-black text-emerald-600">99.8%</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card border-white/50 bg-white/70 rounded-[2.5rem] p-8 space-y-8 shadow-2xl shadow-slate-200/50">
            {/* Core Identity */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4">Core Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <UserIcon className="w-3.5 h-3.5" />
                    Full Alias
                  </label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300"
                    placeholder="E.g. Dr. Zeno"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    Neural Comms ID
                  </label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300"
                    placeholder="email@archeomind.ai"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  Professional Bio
                </label>
                <textarea 
                  value={formData.bio}
                  onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300 resize-none"
                  placeholder="Share your research philosophy or background..."
                />
              </div>
            </div>

            {/* Expertise */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4">Professional Vectors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Specialization</label>
                  <input 
                    type="text"
                    value={formData.specialization}
                    onChange={e => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
                    placeholder="E.g. Marine Archaeology"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Institutional Affiliation</label>
                  <input 
                    type="text"
                    value={formData.affiliation}
                    onChange={e => setFormData(prev => ({ ...prev, affiliation: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
                    placeholder="E.g. Heritage Institute"
                  />
                </div>
              </div>
            </div>

            {/* Location & Web */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4">Spatial Presence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Base</label>
                  <input 
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Neural Node (Website)</label>
                  <input 
                    type="url"
                    value={formData.website}
                    onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4">Advanced Neural Link</h3>
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-600 text-[10px] font-bold leading-relaxed">
                   <AlertCircle className="w-4 h-4 flex-shrink-0" />
                   Neural Quota Management: If you are experiencing "Neural Link Saturated" (Quota Exceeded) errors, provide your own Gemini API Key here. This key stays locally on your device.
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    Gemini API Key Override
                  </label>
                  <input 
                    type="password"
                    value={formData.geminiApiKey}
                    onChange={e => setFormData(prev => ({ ...prev, geminiApiKey: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-mono text-slate-700 focus:outline-none focus:border-indigo-400"
                    placeholder="AIzaSy..."
                  />
                  <p className="text-[9px] text-slate-400 ml-1">Leave blank to use the institution's default neural link.</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4">Social Uplinks</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">X (Twitter)</label>
                  <input 
                    type="text"
                    value={formData.twitter}
                    onChange={e => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400"
                    placeholder="@handle"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">LinkedIn</label>
                  <input 
                    type="text"
                    value={formData.linkedin}
                    onChange={e => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400"
                    placeholder="profile-id"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">GitHub</label>
                  <input 
                    type="text"
                    value={formData.github}
                    onChange={e => setFormData(prev => ({ ...prev, github: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>

            {/* Research Interests */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4">Research Vectors</h3>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  Interest Tags (Comma separated)
                </label>
                <input 
                  type="text"
                  value={formData.researchInterests}
                  onChange={e => setFormData(prev => ({ ...prev, researchInterests: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300"
                  placeholder="E.g. Mesopotamia, Ceramic Analysis, Bronze Age"
                />
              </div>
            </div>

            <div className="pt-4">
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-500 text-xs font-bold mb-6"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage}
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-xs font-bold mb-6"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Spatial identity updated successfully.
                </motion.div>
              )}

              <button
                onClick={handleSave}
                disabled={status === 'saving'}
                className="btn-primary w-full flex items-center justify-center gap-3 py-6 shadow-xl shadow-indigo-200/50 hover:shadow-indigo-300/50 transition-all active:scale-[0.98]"
              >
                {status === 'saving' ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Save className="w-6 h-6" />
                )}
                <span className="text-lg font-black uppercase tracking-widest">Sync Neural Identity</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
