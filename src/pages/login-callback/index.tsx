import React, { useEffect } from 'react';
import { tokenStore } from '@/shared/auth/tokenStore';

interface LoginCallbackPageProps {
  onLoginSuccess: () => void;
}

export default function LoginCallbackPage({ onLoginSuccess }: LoginCallbackPageProps) {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      tokenStore.set(token);
      // Instead of navigating, call the success handler from the parent.
      // The parent component (`App.tsx`) will be responsible for changing the screen.
      onLoginSuccess();
    } else if (error) {
      console.error('Login Error:', error);
      alert(`Login failed: ${error}`);
      // Redirect to login page with error
      window.location.href = '/login'; 
    } else {
      // No token or error, unexpected state, redirect to login
      window.location.href = '/login';
    }
    // Since onLoginSuccess is a function that might change,
    // we should include it in the dependency array.
  }, [onLoginSuccess]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl text-gray-700">로그인 처리 중...</p>
    </div>
  );
}