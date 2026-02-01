import React from 'react';
import { Edit3, Instagram, Youtube, Twitter, AtSign, User } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';

interface ProfileCardProps {
  userProfile: {
    name: string;
    description: string;
    profileImageUrl: string;
    socialLinks?: {
      instagram?: string;
      youtube?: string;
      threads?: string;
      x?: string;
    };
    stats: {
      created: number;
      cheers: number;
    };
  } | null;
  onEditClick: () => void;
}

const ProfileCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center">
    <div className="relative inline-block mb-4">
      <Skeleton className="w-24 h-24 rounded-full" />
    </div>
    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
    <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
    <div className="flex justify-center gap-6 border-t border-slate-100 pt-4">
      <div className="text-center">
        <Skeleton className="h-6 w-8 mx-auto" />
        <Skeleton className="h-3 w-10 mx-auto mt-1" />
      </div>
      <div className="text-center">
        <Skeleton className="h-6 w-8 mx-auto" />
        <Skeleton className="h-3 w-12 mx-auto mt-1" />
      </div>
    </div>
  </div>
);

export const ProfileCard = ({ userProfile, onEditClick }: ProfileCardProps) => {
  if (!userProfile) {
    return <ProfileCardSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center relative overflow-hidden">
      <div className="relative inline-block mb-4">
        <img 
          src={userProfile.profileImageUrl} 
          alt={userProfile.name} 
          className="w-24 h-24 rounded-full object-cover border-4 border-[#E1F5FE] bg-slate-100"
        />
        <button 
          onClick={onEditClick}
          className="absolute bottom-0 right-0 p-1.5 bg-[#1A237E] text-white rounded-full hover:bg-blue-900 transition-colors shadow-md"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <h2 className="text-xl font-bold text-slate-900 truncate px-2">{userProfile.name}</h2>
      <p className="text-sm text-slate-500 mb-4 line-clamp-2 px-2">{userProfile.description || 'No description provided'}</p>

      {userProfile.socialLinks && Object.values(userProfile.socialLinks).some(Boolean) && (
        <div className="flex justify-center gap-3 mb-5">
          {userProfile.socialLinks.instagram && (
            <a href={userProfile.socialLinks.instagram.startsWith('http') ? userProfile.socialLinks.instagram : `https://instagram.com/${userProfile.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {userProfile.socialLinks.youtube && (
            <a href={userProfile.socialLinks.youtube.startsWith('http') ? userProfile.socialLinks.youtube : `https://youtube.com/${userProfile.socialLinks.youtube}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-600 transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          )}
          {userProfile.socialLinks.threads && (
            <a href={userProfile.socialLinks.threads.startsWith('http') ? userProfile.socialLinks.threads : `https://threads.net/@${userProfile.socialLinks.threads.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
              <AtSign className="w-4 h-4" />
            </a>
          )}
          {userProfile.socialLinks.x && (
            <a href={userProfile.socialLinks.x.startsWith('http') ? userProfile.socialLinks.x : `https://twitter.com/${userProfile.socialLinks.x.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      )}
      
      <div className="flex justify-center gap-6 border-t border-slate-100 pt-4">
        <div className="text-center">
          <div className="text-lg font-black text-[#1A237E]">{userProfile.stats?.created || 0}</div>
          <div className="text-xs text-slate-400 font-medium uppercase">Logs</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-black text-rose-500">{userProfile.stats?.cheers || 0}</div>
          <div className="text-xs text-slate-400 font-medium uppercase">Cheers</div>
        </div>
      </div>
    </div>
  );
};
