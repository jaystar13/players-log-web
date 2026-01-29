import React from 'react';
import { Goll } from '@/entities/goll/model/types';
import { GollHeader } from '@/entities/goll/ui/goll-header';
import { GollOwner } from '@/entities/goll/ui/goll-owner';
import { GollDescription } from '@/entities/goll/ui/goll-description';
import { GollMedia } from '@/entities/goll/ui/goll-media';
import { VoteForParticipant } from '@/features/vote-for-participant/ui';

interface GollDetailCardProps {
  goll: Partial<Goll>;
}

export const GollDetailCard = ({ goll }: GollDetailCardProps) => {
  return (
    <article className="space-y-8">
      <GollHeader goll={goll} />
      
      <VoteForParticipant goll={goll} />

      <div className="border-b border-slate-200" />

      <GollOwner owner={goll.owner} />

      <GollDescription description={goll.description || ''} />

      <GollMedia media={goll.media} />
    </article>
  );
};
