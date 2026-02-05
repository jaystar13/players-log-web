import { useState } from 'react'; // Import useState
import { Loader2, Search } from 'lucide-react';

import { Goll } from '@/entities/goll/model/types';
import { MatchGollCard } from '@/entities/goll/ui/goll-card';
import { Screen } from '@/shared/lib/navigation';
import { UserProfile } from '@/entities/user/model/types'; // Import UserProfile
import { redirectStore } from '@/shared/auth/redirectStore'; // Import redirectStore
import { // Import AlertDialog components
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";


interface GollFeedProps {
  golls: Goll[];
  isLoading: boolean;
  activeCategory: string;
  onGollClick: (id: number | string) => void;
  onNavigate: (screen: Screen) => void;
  userProfile: UserProfile | null; // Add userProfile to props
}

export const GollFeed = ({ golls, isLoading, activeCategory, onGollClick, onNavigate, userProfile }: GollFeedProps) => {
  const [isLoginAlertOpen, setLoginAlertOpen] = useState(false); // State for login alert

  const handleCreateLogClick = () => {
    if (userProfile) {
      onNavigate('create');
    } else {
      redirectStore.set('create');
      setLoginAlertOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#1A237E]" />
      </div>
    );
  }

  // Render content based on whether there are golls, but always include AlertDialog
  return (
    <>
      {golls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 opacity-40" />
          </div>
          <p className="text-lg font-medium">No logs found for {activeCategory}</p>
          <p className="text-sm">Try selecting a different category or create a new log.</p>
          <button 
            onClick={handleCreateLogClick}
            className="mt-4 text-[#1A237E] font-bold text-sm hover:underline"
          >
            Create your first log now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {golls.map(goll => (
            <MatchGollCard key={goll.id} goll={goll} onClick={onGollClick} />
          ))}
        </div>
      )}

      <AlertDialog open={isLoginAlertOpen} onOpenChange={setLoginAlertOpen}>
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
