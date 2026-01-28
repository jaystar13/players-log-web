import { LikeLog } from '@/features/like-log/ui';
import { Log } from '@/entities/log/model/types';
import React from 'react';

interface LogInteractionSidebarProps {
  log: Partial<Log>;
}

export const LogInteractionSidebar = ({ log }: LogInteractionSidebarProps) => {
  return (
    <aside className="lg:col-span-4 space-y-6">
      <div className="sticky top-24">
        <LikeLog 
          logId={log.id!}
          initialLikes={log.stats?.likes || 0}
          isArchived={log.isArchived}
        />
        {/* Other interaction elements can be added here in the future */}
      </div>
    </aside>
  );
};
