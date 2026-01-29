import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import MainFeedPage from '@/pages/main-feed';
import CreateGollPage from '@/pages/create-goll';
import EditGollPage from '@/pages/edit-goll';
import GollDetailPage from '@/pages/goll-detail/ui';
import MyPage from '@/pages/my-page/ui';
import LoginPage from '@/pages/login-page';
import { Screen } from '@/shared/lib/navigation';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { checkAuthStatus } from '@/shared/api/auth';
import { tokenStore } from '@/shared/auth/tokenStore';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedGollId, setSelectedGollId] = useState<number | undefined>(undefined);
  const [editingGoll, setEditingGoll] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app startup
  useEffect(() => {
    const verifySession = async () => {
      try {
        // This call will succeed if the HttpOnly refresh token cookie is valid
        const { accessToken, user } = await checkAuthStatus();
        tokenStore.set(accessToken);
        console.log("Session verified, user:", user);
        setCurrentScreen('feed');
      } catch (e) {
        console.log("No active session found.");
        // Stay on the login screen
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
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const handleEditClick = (gollData: any) => {
    setEditingGoll(gollData);
    setCurrentScreen('edit');
  };

  const handleGollClick = (id: number) => {
    navigateTo('detail', { id });
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('feed');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Toaster position="top-center" richColors />
      
      {currentScreen === 'login' && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}

      {currentScreen === 'feed' && (
        <MainFeedPage onNavigate={navigateTo} onGollClick={handleGollClick} />
      )}
      
      {currentScreen === 'create' && (
        <CreateGollPage 
          onBack={() => navigateTo('feed')} 
          onNavigate={navigateTo}
        />
      )}

      {currentScreen === 'edit' && (
        <EditGollPage 
          onBack={() => navigateTo('detail', { id: editingGoll?.id })} 
          onNavigate={navigateTo}
          initialData={editingGoll}
        />
      )}

      {currentScreen === 'detail' && (
        <GollDetailPage 
          onBack={() => navigateTo('feed')} 
          gollId={selectedGollId}
          onEdit={handleEditClick}
        />
      )}

      {currentScreen === 'mypage' && (
        <MyPage 
          onBack={() => navigateTo('feed')}
          onNavigate={navigateTo}
        />
      )}
    </div>
    </GoogleOAuthProvider>
  );
}
