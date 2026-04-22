import React, { useState, useRef } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Phone, 
  Camera, 
  Save, 
  CheckCircle2,
  AlertCircle
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
    name: currentUser.name,
    email: currentUser.email,
    password: currentUser.password || '',
    phoneNumber: currentUser.phoneNumber || '',
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
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        profileImage: profileImage || undefined
      };

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
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 italic">NEURAL PROFILE</h1>
          <p className="text-white/40 max-w-xl leading-relaxed text-sm uppercase tracking-widest font-bold">
            Manage your researcher identity and security protocols.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Image Section */}
        <div className="lg:col-span-1 flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden border-2 border-[#D4AF37]/30 bg-white/5 shadow-2xl shadow-[#D4AF37]/10">
              {profileImage ? (
                <img src={profileImage} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" alt="Profile" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#D4AF37]/20">
                  <UserIcon className="w-20 h-20" />
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-4 right-4 p-3 bg-[#D4AF37] text-[#0C0B0A] rounded-2xl shadow-xl hover:scale-110 transition-all group-hover:rotate-12"
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
            <p className="text-lg font-black italic tracking-tight">{currentUser.name}</p>
            <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest">{currentUser.role}</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <UserIcon className="w-3 h-3" />
                  Researcher Name
                </label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  Neural Address
                </label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  Comms Link
                </label>
                <input 
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phoneNumber}
                  onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Security Protocol
                </label>
                <input 
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold">
                <AlertCircle className="w-4 h-4" />
                {errorMessage}
              </div>
            )}

            {status === 'success' && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-500 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Neural profile updated successfully.
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={status === 'saving'}
              className="w-full py-5 bg-[#D4AF37] hover:bg-[#C4A030] disabled:opacity-50 text-[#0C0B0A] font-black uppercase tracking-widest rounded-[2rem] transition-all flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(212,175,55,0.2)]"
            >
              {status === 'saving' ? (
                <div className="w-6 h-6 border-2 border-[#0C0B0A]/30 border-t-[#0C0B0A] rounded-full animate-spin" />
              ) : (
                <Save className="w-6 h-6" />
              )}
              Update Identity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
