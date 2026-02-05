import React from 'react';
import { motion } from 'motion/react';
import SocialLoginButtons from '@/features/auth-by-social/SocialLoginButtons';
import { Screen } from '@/shared/lib/navigation'; // Import Screen

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (screen: Screen, params?: any) => void; // Add onNavigate
}

export default function LoginPage({ onLoginSuccess, onNavigate }: LoginPageProps) { // Destructure onNavigate
  


  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0F172A]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1609709795647-cf9f73023b58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx3aW50ZXJsMjBzcG9ydHMlMjBpY2UlMjByaW5rJTIwYWJzdHJhY3QlMjBkYXJrJTIwYmx1ZSUyMG5hdnl8ZW58MXx8fHwxNzY5MTY3ODY0fDA&ixlib=rb-4.1.0&q=80&w=1080" 
          alt="Winter Sports Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-[#1e3a8a]/30 mix-blend-multiply" />
      </div>

      {/* Main Content Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1A237E] rounded-2xl shadow-lg mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <span className="text-3xl font-black text-white">P</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Players Log</h1>
            <p className="text-blue-200/80 text-sm font-medium">2026 Winter Sports Record Service</p>
          </div>

          <SocialLoginButtons onLoginSuccess={onLoginSuccess} onNavigate={onNavigate} /> {/* Pass onNavigate */}

        </div>
      </motion.div>

      {/* Footer Decoration */}
      <div className="absolute bottom-6 w-full text-center z-10">
        <p className="text-white/30 text-xs tracking-widest uppercase font-light">
          Official Partner of Ice & Snow
        </p>
      </div>
    </div>
  );
}
