import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import MainFeedPage from '@/pages/main-feed';
import CreateLogPage from '@/pages/create-log'; // New import
import EditLogPage from '@/pages/edit-log'; // New import
import LogDetailPage from '@/pages/log-detail/ui';
import MyPage from '@/pages/my-page/ui';
import LoginPage from '@/pages/login-page';
import { api, supabase } from '@/shared/api';
import { Screen } from '@/shared/lib/navigation'; // New import
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedLogId, setSelectedLogId] = useState<number | undefined>(undefined);
  const [editingLog, setEditingLog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setCurrentScreen('feed');
        }
      } catch (e) {
        console.error("Session check failed", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const navigateTo = (screen: Screen, params?: any) => {
    if (screen === 'detail' && params?.id) {
      setSelectedLogId(params.id);
    }
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  // handleRegister and handleUpdate are now handled internally by CreateLogPage/EditLogPage
  // so they are removed from App.tsx

  const handleEditClick = (logData: any) => {
    setEditingLog(logData);
    setCurrentScreen('edit');
  };

  const handleLogClick = (id: number) => {
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
        <MainFeedPage onNavigate={navigateTo} onLogClick={handleLogClick} />
      )}
      
      {currentScreen === 'create' && (
        <CreateLogPage 
          onBack={() => navigateTo('feed')} 
          onNavigate={navigateTo}
        />
      )}

      {currentScreen === 'edit' && (
        <EditLogPage 
          onBack={() => navigateTo('detail', { id: editingLog?.id })} 
          onNavigate={navigateTo}
          initialData={editingLog}
        />
      )}

      {currentScreen === 'detail' && (
        <LogDetailPage 
          onBack={() => navigateTo('feed')} 
          logId={selectedLogId}
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
