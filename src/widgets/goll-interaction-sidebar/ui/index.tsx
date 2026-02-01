import { LikeGoll } from '@/features/like-goll/ui';
import { Goll } from '@/entities/goll/model/types';
import React from 'react';

interface GollInteractionSidebarProps {
  goll: Partial<Goll>;
  initialIsLiked: boolean;
}

export const GollInteractionSidebar = ({ goll: goll, initialIsLiked }: GollInteractionSidebarProps) => {
  return (
    <aside className="lg:col-span-4 space-y-6">
      <div className="sticky top-24">
        <LikeGoll 
          gollId={goll.id!}
          initialLikes={goll.likes || 0}
          initialIsLiked={goll.isLiked || false}
          isArchived={goll.isArchived}
        />
        {/* Other interaction elements can be added here in the future */}
      </div>
    </aside>
  );
};
