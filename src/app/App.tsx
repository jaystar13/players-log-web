import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import MainFeedPage from '@/pages/main-feed';
import CreateGollPage from '@/pages/create-goll';
import EditGollPage from '@/pages/edit-goll';
import GollDetailPage from '@/pages/goll-detail/ui';
import MyPage from '@/pages/my-page/ui';
import LoginPage from '@/pages/login-page';
import LoginCallbackPage from '@/pages/login-callback'; // Import LoginCallbackPage
import { Screen } from '@/shared/lib/navigation';
import { api } from '@/shared/api';
import { tokenStore } from '@/shared/auth/tokenStore';
import { UserProfile } from '@/entities/user/model/types'; // Import UserProfile type
import { redirectStore } from '@/shared/auth/redirectStore';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('feed');
  const [selectedGollId, setSelectedGollId] = useState<number | undefined>(undefined);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);
  const [editingGoll, setEditingGoll] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // New state for user profile

  // Check for existing session on app startup
  useEffect(() => {
    const path = window.location.pathname;

    if (path === '/login/callback') {
      setCurrentScreen('login-callback');
      setIsLoading(false);
      return;
    }

    const verifySession = async () => {
      try {
        const profile = await api.getCurrentUserProfile(); // Fetch user profile
        setUserProfile(profile); // Store user profile
        setCurrentScreen('feed');
      } catch (e) {
        setUserProfile(null); // Explicitly set user as null
        setCurrentScreen('feed'); // Proceed to feed for non-logged-in users
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const navigateTo = (screen: Screen, params?: any) => {
    if (screen === 'detail' && params?.id) {
      setSelectedGollId(params.id);
    }
    if (screen === 'mypage' && params?.userId) {
      setSelectedUserId(params.userId);
    } else {
      setSelectedUserId(undefined); // Reset when navigating away
    }
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const handleEditClick = (gollData: any) => {
    setEditingGoll(gollData);
    setCurrentScreen('edit');
  };

  const handleGollClick = (id: number | string) => {
    navigateTo('detail', { id });
  };

  const handleLoginSuccess = async () => {
    try {
      const profile = await api.getCurrentUserProfile();
      setUserProfile(profile);

      const redirectInfo = redirectStore.getAndClear();
      if (redirectInfo) {
        navigateTo(redirectInfo.screen, redirectInfo.params);
      } else {
        // If no redirect info, just go to feed
        setCurrentScreen('feed');
      }
    } catch (e) {
      console.error("Failed to fetch user profile after login:", e);
      setCurrentScreen('login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Toaster position="top-center" richColors />
      
      {currentScreen === 'login' && (
        <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={navigateTo} />
      )}

      {currentScreen === 'feed' && (
        <MainFeedPage onNavigate={navigateTo} onGollClick={handleGollClick} userProfile={userProfile} />
      )}
      
            {currentScreen === 'create' && (
              <CreateGollPage
                onBack={() => navigateTo('feed')}
                onNavigate={navigateTo}
                userProfile={userProfile}
              />
            )}
            {currentScreen === 'edit' && (
              <EditGollPage
                onBack={() => navigateTo('detail', { id: editingGoll?.id })}
                onNavigate={navigateTo}
                initialData={editingGoll}
                userProfile={userProfile}
              />
            )}
      {currentScreen === 'detail' && (
        <GollDetailPage
          onBack={() => navigateTo('feed')}
          gollId={selectedGollId ? selectedGollId : 0}
          onEdit={handleEditClick}
          onNavigate={navigateTo}
          userProfile={userProfile}
        />
      )}

      {currentScreen === 'mypage' && (
        <MyPage
          onBack={() => navigateTo('feed')}
          onNavigate={navigateTo}
          userId={selectedUserId}
          userProfile={userProfile}
        />
      )}
      {currentScreen === 'login-callback' && (
        <LoginCallbackPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
