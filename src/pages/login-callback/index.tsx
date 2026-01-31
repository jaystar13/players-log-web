import React, { useEffect } from 'react';
import { tokenStore } from '@/shared/auth/tokenStore';
import { exchangeCodeForToken } from '@/shared/api/auth';

interface LoginCallbackPageProps {
  onLoginSuccess: () => void;
}

export default function LoginCallbackPage({ onLoginSuccess }: LoginCallbackPageProps) {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    const handleTokenExchange = async (authCode: string) => {
      try {
        const { accessToken } = await exchangeCodeForToken(authCode);
        tokenStore.set(accessToken);
        
        // URL에서 code 쿼리 파라미터를 제거하여 주소창을 깔끔하게 정리합니다.
        window.history.replaceState({}, '', '/');
        
        onLoginSuccess();
      } catch (exchangeError) {
        console.error('Token exchange failed:', exchangeError);
        alert('Login failed during token exchange. Please try again.');
        window.location.href = '/login';
      }
    };

    if (code) {
      handleTokenExchange(code);
    } else if (error) {
      console.error('OAuth Error:', error);
      alert(`Login failed: ${error}`);
      window.location.href = '/login'; 
    } else {
      // No code or error, unexpected state
      console.error('Unexpected state on callback page. No code or error found.');
      window.location.href = '/login';
    }
  }, [onLoginSuccess]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl text-gray-700">로그인 처리 중...</p>
    </div>
  );
}