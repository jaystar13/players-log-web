import { ProfileCard } from '@/entities/user/ui/profile-card';
import { cn } from '@/shared/ui/utils';
import { Edit3, Heart } from 'lucide-react';
import React from 'react';

interface MyPageSidebarProps {
  userProfile: any;
  activeTab: 'created' | 'liked';
  setActiveTab: (tab: 'created' | 'liked') => void;
  onEditClick: () => void;
}

export const MyPageSidebar = ({ userProfile, activeTab, setActiveTab, onEditClick }: MyPageSidebarProps) => {
  return (
    <aside className="lg:col-span-3 space-y-6">
      <ProfileCard userProfile={userProfile} onEditClick={onEditClick} />
      
      {/* Navigation Menu */}
      <nav className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <button
          onClick={() => setActiveTab('created')}
          className={cn(
            "w-full flex items-center justify-between p-4 transition-all border-b border-slate-50",
            activeTab === 'created' 
              ? "bg-[#E1F5FE] text-[#1A237E] font-bold" 
              : "text-slate-600 hover:bg-slate-50"
          )}
        >
          <div className="flex items-center gap-3">
            <Edit3 className="w-5 h-5" />
            <span>My Created Logs</span>
          </div>
          {activeTab === 'created' && <div className="w-1.5 h-1.5 rounded-full bg-[#1A237E]" />}
        </button>
        
        <button
          onClick={() => setActiveTab('liked')}
          className={cn(
            "w-full flex items-center justify-between p-4 transition-all",
            activeTab === 'liked' 
              ? "bg-[#E1F5FE] text-[#1A237E] font-bold" 
              : "text-slate-600 hover:bg-slate-50"
          )}
        >
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5" />
            <span>Liked Logs</span>
          </div>
          {activeTab === 'liked' && <div className="w-1.5 h-1.5 rounded-full bg-[#1A237E]" />}
        </button>
      </nav>
    </aside>
  );
};
