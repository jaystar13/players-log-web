import React, { useState, useEffect } from 'react';
import { Loader2, LogOut, ChevronLeft } from 'lucide-react';
import { api, supabase } from '@/shared/api';
import { MyPageSidebar } from '@/widgets/my-page-sidebar/ui';
import { MyLogList } from '@/widgets/my-log-list/ui';
import { Screen } from '@/shared/lib/navigation';
import EditProfilePage from '@/pages/edit-profile/ui';
import { Log } from '@/entities/log/model/types';

interface MyPageProps {
  onBack: () => void;
  onNavigate: (screen: Screen, params?: any) => void;
}

export default function MyPage({ onBack, onNavigate }: MyPageProps) {
  const [activeTab, setActiveTab] = useState<'created' | 'liked'>('created');
  const [allLogs, setAllLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const logsData = await api.getLogs();
      if (logsData) {
        setAllLogs(logsData);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        setUserProfile({
          name: meta.nickname || meta.full_name || meta.name || "User",
          username: user.email?.split('@')[0] ? `@${user.email.split('@')[0]}` : "@username",
          role: meta.bio || "Winter Sports Enthusiast",
          avatar: meta.avatar_url || meta.picture || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200",
          socials: meta.socials || {},
          stats: {
            created: logsData ? logsData.length : 0, // Placeholder
            liked: 0, // Placeholder
            cheers: 0 // Placeholder
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };
  
  const onNavigateToDetail = (id: number) => {
    onNavigate('detail', { id });
  }

  if (showEditProfile) {
    return (
      <EditProfilePage 
        onBack={() => setShowEditProfile(false)}
        onSaveComplete={() => {
          setShowEditProfile(false);
          fetchData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">My Archives</h1>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <Loader2 className="w-8 h-8 animate-spin text-[#1A237E]" />
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <MyPageSidebar
              userProfile={userProfile}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onEditClick={() => setShowEditProfile(true)}
            />
            <MyLogList
              logs={allLogs} // Simplified: In a real app, you'd fetch liked logs separately
              activeTab={activeTab}
              loading={loading}
              onNavigateToDetail={onNavigateToDetail}
            />
          </div>
        )}
      </main>
    </div>
  );
}
