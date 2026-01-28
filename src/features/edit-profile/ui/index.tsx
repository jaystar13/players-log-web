import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  Instagram, 
  Youtube, 
  Twitter, 
  AtSign,
  Save,
  Loader2,
  Mail,
  Info
} from 'lucide-react';
import { supabase } from '@/shared/api';
import { toast } from 'sonner';

export const EditProfileForm = ({ user, onSaveComplete }: { user: any, onSaveComplete: () => void }) => {
  const [saving, setSaving] = useState(false);

  // Form State initialized from props
  const meta = user.user_metadata || {};
  const [nickname, setNickname] = useState(meta.nickname || meta.full_name || meta.name || "");
  const [bio, setBio] = useState(meta.bio || "");
  const [socials, setSocials] = useState({
    instagram: meta.socials?.instagram || "",
    youtube: meta.socials?.youtube || "",
    threads: meta.socials?.threads || "",
    twitter: meta.socials?.twitter || ""
  });
  const avatarUrl = meta.avatar_url || meta.picture || "";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          nickname,
          bio,
          socials
        }
      });

      if (error) throw error;

      toast.success("Profile updated successfully");
      onSaveComplete();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Section: Basic Info */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Basic Information</h2>
        
        {/* Avatar - Display Only */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="w-20 h-20 flex-shrink-0 rounded-full overflow-hidden border-4 border-white shadow-sm">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                <User className="w-8 h-8" />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-slate-700">Profile Picture</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Your profile picture is automatically synced from your social login account. 
              To change it, please update your photo on your social media provider.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold mt-2 border border-blue-100">
              <Info className="w-3 h-3" />
              Synced with Social Account
            </div>
          </div>
        </div>

        {/* Read-only Fields */}
        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-2">Email (Cannot be changed)</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={user?.email || ""}
              disabled
              className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-sm cursor-not-allowed"
            />
          </div>
        </div>

        {/* Editable Fields */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Nickname / Display Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your display name"
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">One-line Bio</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your passion for winter sports..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none resize-none"
            />
          </div>
        </div>
      </section>

      {/* Section: Social Media */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Social Media</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Instagram */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Instagram</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-pink-100 rounded text-pink-600">
                <Instagram className="w-3.5 h-3.5" />
              </div>
              <input 
                type="text"
                value={socials.instagram}
                onChange={(e) => setSocials({...socials, instagram: e.target.value})}
                placeholder="@username or URL"
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
          </div>

          {/* YouTube */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">YouTube</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-red-100 rounded text-red-600">
                <Youtube className="w-3.5 h-3.5" />
              </div>
              <input 
                type="text"
                value={socials.youtube}
                onChange={(e) => setSocials({...socials, youtube: e.target.value})}
                placeholder="Channel URL"
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>

          {/* Threads */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Threads</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-slate-100 rounded text-slate-900">
                <AtSign className="w-3.5 h-3.5" />
              </div>
              <input 
                type="text"
                value={socials.threads}
                onChange={(e) => setSocials({...socials, threads: e.target.value})}
                placeholder="@username"
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
              />
            </div>
          </div>

          {/* X (Twitter) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">X (Twitter)</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-slate-100 rounded text-slate-900">
                <Twitter className="w-3.5 h-3.5" />
              </div>
              <input 
                type="text"
                value={socials.twitter}
                onChange={(e) => setSocials({...socials, twitter: e.target.value})}
                placeholder="@handle"
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-8 py-2.5 bg-[#1A237E] text-white font-bold rounded-xl hover:bg-[#151b60] shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};
