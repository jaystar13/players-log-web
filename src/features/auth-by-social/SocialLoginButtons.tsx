import React from 'react';
import { supabase } from '@/shared/api'; // Assuming supabase is needed here
import { Button } from '@/shared/ui/button'; // Re-using the Button component

interface SocialLoginButtonsProps {
  onLoginSuccess: () => void;
}

export default function SocialLoginButtons({ onLoginSuccess }: SocialLoginButtonsProps) {
  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin, // Redirect back to this page
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Login error:', error.message);
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleDemoLogin = () => {
    onLoginSuccess();
  };

  return (
    <>
      {/* Social Login Buttons */}
      <div className="space-y-4">
        {/* Google */}
        <Button
          onClick={() => handleSocialLogin('google')}
          className="h-auto w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-slate-700 font-bold py-3.5 px-4 rounded-xl transition-all active:scale-95 shadow-md group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </Button>

        {/* Apple */}
        <Button
          onClick={() => handleSocialLogin('apple')}
          className="h-auto w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-95 shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.02 3.65-1.02 1.35.05 2.29.74 3.08.74.88 0 1.62-.22 2.38-.64 1.35-.74 2.85-1.08 4.35-1.08.74 0 1.48.22 2.22.64.98.54 1.76 1.33 2.36 2.26-2.65 1.65-2.2 4.7 1.25 5.92-.74 1.94-1.92 3.76-3.14 5.28-.7 1.05-1.41 1.57-2.18 1.57-.04.02-.09.02-.15.02zM12.03 7.25c-.15-2.23 1.59-4.08 3.56-4.25.2.22.4.45.6.68.2.23.4.46.6.69.15 2.23-1.59 4.08-3.56 4.25-.2-.22-.4-.45-.6-.68-.2-.23-.4-.46-.6-.69z" />
            </svg>
            Continue with Apple
        </Button>

        {/* Meta */}
        <Button
          onClick={() => handleSocialLogin('facebook')}
          className="h-auto w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-95 shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Continue with Meta
        </Button>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 text-center">
         <p className="text-xs text-blue-100/60">
           By continuing, you agree to our Terms of Service and Privacy Policy.
         </p>
         {/* Hidden Demo Link for Convenience */}
         <Button 
           onClick={handleDemoLogin}
           variant="link"
           className="mt-4 text-[10px] text-white/30 hover:text-white/50 underline"
         >
           Skip to Demo (Development Only)
         </Button>
      </div>
    </>
  );
}
