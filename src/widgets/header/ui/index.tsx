import { useState } from 'react';
import { Bell, Plus, Search, LogIn } from 'lucide-react';
import { Screen } from '@/shared/lib/navigation';
import { UserProfile } from '@/entities/user/model/types';
import { redirectStore } from '@/shared/auth/redirectStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

interface HeaderProps {
  onNavigate: (screen: Screen, params?: any) => void;
  userProfile: UserProfile | null;
}

export const Header = ({ onNavigate, userProfile }: HeaderProps) => {
  const [isCreateAlertOpen, setCreateAlertOpen] = useState(false);
  const profileImage = userProfile?.profileImageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100";

  const handleCreateClick = () => {
    if (userProfile) {
      onNavigate('create');
    } else {
      redirectStore.set('create');
      setCreateAlertOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('feed')}>
            <div className="w-8 h-8 bg-[#1A237E] rounded-lg flex items-center justify-center text-white font-bold text-lg">
              P
            </div>
            <span className="text-xl font-bold text-[#1A237E] tracking-tight">Players Log</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Match, Player, or Team..." 
                className="w-full bg-[#F1F5F9] border-none rounded-full py-2.5 pl-12 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1A237E] focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleCreateClick}
              className="hidden sm:flex items-center gap-2 bg-[#1A237E] hover:bg-[#151b60] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-blue-900/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Log</span>
            </button>
            
            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            {userProfile ? (
              <div 
                onClick={() => onNavigate('mypage', { userId: userProfile.id })}
                className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img 
                  src={profileImage}
                  alt="Profile" 
                  className="w-9 h-9 rounded-full border border-slate-200"
                />
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 pl-2 text-sm font-bold text-slate-600 hover:text-[#1A237E] transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <AlertDialog open={isCreateAlertOpen} onOpenChange={setCreateAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to create a new log. Would you like to go to the login page?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onNavigate('login')}>
              Go to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
