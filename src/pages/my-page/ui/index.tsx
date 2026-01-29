import { useState, useEffect } from 'react';
import { Loader2, LogOut, ChevronLeft } from 'lucide-react';
import { api } from '@/shared/api';
import { MyPageSidebar } from '@/widgets/my-page-sidebar/ui';
import { MyGollList } from '@/widgets/my-goll-list/ui';
import { Screen } from '@/shared/lib/navigation';
import EditProfilePage from '@/pages/edit-profile/ui';
import { Goll } from '@/entities/goll/model/types';
import { logout } from '@/shared/api/auth';
import { tokenStore } from '@/shared/auth/tokenStore';

interface MyPageProps {
  onBack: () => void;
  onNavigate: (screen: Screen, params?: any) => void;
}

export default function MyPage({ onBack, onNavigate }: MyPageProps) {
  const [activeTab, setActiveTab] = useState<'created' | 'liked'>('created');
  const [allGolls, setAllGolls] = useState<Goll[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [userProfile, setUserProfile] = useState<any>(null); // In a real app, this would come from a user context/store
  const [showEditProfile, setShowEditProfile] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have specific endpoints for user's created/liked golls
      const gollsData = await api.getGolls(); 
      if (gollsData) {
        setAllGolls(gollsData);
      }

      // In a real app, user profile would be fetched from your own backend
      // after login and stored in a global state.
      setUserProfile({
        name: "Mock User",
        username: "@mock_user",
        role: "Player-Log Enthusiast",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200",
        socials: {},
        stats: {
          created: gollsData ? gollsData.length : 0,
          liked: 0,
          cheers: 0
        }
      });
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
    try {
      await logout(); // Call backend to invalidate session/cookie
    } catch (error) {
      console.error("Failed to sign out from backend", error);
    } finally {
      tokenStore.clear(); // Clear token from frontend
      onNavigate('login'); // Navigate to login screen
    }
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
            <MyGollList
              golls={allGolls} // Simplified: In a real app, you'd fetch liked golls separately
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
