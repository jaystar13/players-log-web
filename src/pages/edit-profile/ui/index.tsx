import React, { useState, useEffect } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/shared/api';
import { toast } from 'sonner';
import { EditProfileForm } from '@/features/edit-profile/ui';

interface EditProfilePageProps {
  onBack: () => void;
  onSaveComplete: () => void;
}

export default function EditProfilePage({ onBack, onSaveComplete }: EditProfilePageProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
        } else {
          toast.warning("Could not find user session. Please log in.");
          onBack(); // Go back if no user
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [onBack]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1A237E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Edit Profile</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EditProfileForm user={user} onSaveComplete={onSaveComplete} />
      </main>
    </div>
  );
}
