import React from 'react';
import { Goll } from '@/entities/goll/model/types';
import { GollHeader } from '@/entities/goll/ui/goll-header';
import { GollOwner } from '@/entities/goll/ui/goll-owner';
import { GollDescription } from '@/entities/goll/ui/goll-description';
import { GollMedia } from '@/entities/goll/ui/goll-media';
import { VoteForParticipant } from '@/features/vote-for-participant/ui';
import { cn } from '@/shared/ui/utils';
import { Screen } from '@/shared/lib/navigation';
import { UserProfile } from '@/entities/user/model/types';

interface GollDetailCardProps {
  goll: Partial<Goll>;
  onNavigate: (screen: Screen, params?: any) => void;
  userProfile: UserProfile | null;
}

export const GollDetailCard = ({ goll, onNavigate, userProfile }: GollDetailCardProps) => {
  const isArchived = goll.status === 'ARCHIVED';
  return (
    <article className={cn("space-y-8", isArchived && "grayscale opacity-60")}>
      <GollHeader goll={goll} />
      
      <VoteForParticipant goll={goll} onNavigate={onNavigate} userProfile={userProfile} />

      <div className="border-b border-slate-200" />

      <GollOwner owner={goll.owner} onNavigate={onNavigate} />

      <GollDescription description={goll.description || ''} />

      <GollMedia media={goll.media} />
    </article>
  );
};
