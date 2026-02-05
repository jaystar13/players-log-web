import { useState, useEffect } from 'react';
import { Loader2, LogOut, ChevronLeft } from 'lucide-react';
import { api } from '@/shared/api';
import { MyPageSidebar } from '@/widgets/my-page-sidebar/ui';
import { MyGollList } from '@/widgets/my-goll-list/ui';
import { Screen } from '@/shared/lib/navigation';
import EditProfilePage from '@/pages/edit-profile/ui';
import { Goll } from '@/entities/goll/model/types';
import { UserProfile } from '@/entities/user/model/types';
import { logout } from '@/shared/api/auth';
import { tokenStore } from '@/shared/auth/tokenStore';

interface MyPageProps {
  onBack: () => void;
  onNavigate: (screen: Screen, params?: any) => void;
  userId?: number; // The ID of the user whose page to display
  userProfile: UserProfile | null;
}

export default function MyPage({ onBack, onNavigate, userId, userProfile: currentUser }: MyPageProps) {
  const [activeTab, setActiveTab] = useState<'created' | 'liked'>('created');
  const [createdGolls, setCreatedGolls] = useState<Goll[]>([]);
  const [likedGolls, setLikedGolls] = useState<Goll[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const profileIdToFetch = userId || currentUser?.id;

      if (!profileIdToFetch) {
        setLoading(false);
        return; // Cannot determine a profile to fetch
      }

      // Correctly determine if it's the current user's profile
      const isOwnProfile = currentUser ? currentUser.id === profileIdToFetch : false;
      setIsMyProfile(isOwnProfile);
      
      const profile = await api.getUserProfile(profileIdToFetch);
      setUserProfile(profile);

      // Fetch golls for the determined user ID
      const createdPromise = api.getGollsForUser(profile.id, 'created');
      const likedPromise = isOwnProfile ? api.getGollsForUser(profile.id, 'liked') : Promise.resolve(null);

      const [createdData, likedData] = await Promise.all([
        createdPromise,
        likedPromise
      ]);

      if (createdData?.content) {
        setCreatedGolls(createdData.content);
      }
      if (likedData?.content) {
        setLikedGolls(likedData.content);
      }

    } catch (error) {
      console.error("Failed to fetch data for MyPage:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, currentUser]);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to sign out from backend", error);
    } finally {
      tokenStore.clear();
      onNavigate('login');
    }
  };

  const onNavigateToDetail = (id: number | string) => {
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
            <h1 className="text-xl font-bold text-slate-800">
              {isMyProfile ? "My Archives" : `${userProfile?.name || 'User'}'s Archives`}
            </h1>
          </div>
          
          {isMyProfile && (
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          )}
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
              isMyProfile={isMyProfile}
            />
            <MyGollList
              golls={activeTab === 'created' ? createdGolls : likedGolls}
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