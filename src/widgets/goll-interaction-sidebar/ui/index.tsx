import { LikeGoll } from '@/features/like-goll/ui';
import { Goll } from '@/entities/goll/model/types';
import React from 'react';
import { Screen } from '@/shared/lib/navigation';
import { UserProfile } from '@/entities/user/model/types';

interface GollInteractionSidebarProps {
  goll: Partial<Goll>;
  initialIsLiked: boolean;
  onNavigate: (screen: Screen, params?: any) => void;
  userProfile: UserProfile | null;
}

export const GollInteractionSidebar = ({ goll, initialIsLiked, onNavigate, userProfile }: GollInteractionSidebarProps) => {
  return (
    <aside className="lg:col-span-4 space-y-6">
      <div className="sticky top-24">
        <LikeGoll 
          gollId={goll.id!}
          initialLikes={goll.likes || 0}
          initialIsLiked={goll.isLiked || false}
          isArchived={goll.status === 'ARCHIVED'}
          onNavigate={onNavigate}
          userProfile={userProfile}
        />
        {/* Other interaction elements can be added here in the future */}
      </div>
    </aside>
  );
};
