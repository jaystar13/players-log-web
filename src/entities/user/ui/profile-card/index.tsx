import React from 'react';
import { Edit3, Instagram, Youtube, Twitter, AtSign, User } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';

interface ProfileCardProps {
  userProfile: {
    name: string;
    role: string;
    avatar: string;
    socials: {
      instagram?: string;
      youtube?: string;
      threads?: string;
      twitter?: string;
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
          src={userProfile.avatar} 
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
      <p className="text-sm text-slate-500 mb-4 line-clamp-2 px-2">{userProfile.role}</p>

      {userProfile.socials && Object.values(userProfile.socials).some(Boolean) && (
        <div className="flex justify-center gap-3 mb-5">
          {userProfile.socials.instagram && (
            <a href={userProfile.socials.instagram.startsWith('http') ? userProfile.socials.instagram : `https://instagram.com/${userProfile.socials.instagram}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {userProfile.socials.youtube && (
            <a href={userProfile.socials.youtube.startsWith('http') ? userProfile.socials.youtube : `https://youtube.com/${userProfile.socials.youtube}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-600 transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          )}
          {userProfile.socials.threads && (
            <a href={userProfile.socials.threads.startsWith('http') ? userProfile.socials.threads : `https://threads.net/${userProfile.socials.threads}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
              <AtSign className="w-4 h-4" />
            </a>
          )}
          {userProfile.socials.twitter && (
            <a href={userProfile.socials.twitter.startsWith('http') ? userProfile.socials.twitter : `https://twitter.com/${userProfile.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
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
