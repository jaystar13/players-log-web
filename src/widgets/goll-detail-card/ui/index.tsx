import React from 'react';
import { Log } from '@/entities/goll/model/types';
import { LogHeader } from '@/entities/goll/ui/goll-header';
import { LogOwner } from '@/entities/goll/ui/goll-owner';
import { LogDescription } from '@/entities/goll/ui/goll-description';
import { LogMedia } from '@/entities/goll/ui/goll-media';
import { VoteForParticipant } from '@/features/vote-for-participant/ui';

interface LogDetailCardProps {
  log: Partial<Log>;
}

export const LogDetailCard = ({ log }: LogDetailCardProps) => {
  return (
    <article className="space-y-8">
      <LogHeader log={log} />
      
      <VoteForParticipant log={log} />

      <div className="border-b border-slate-200" />

      <LogOwner owner={log.owner} />

      <LogDescription description={log.description || ''} />

      <LogMedia media={log.media} />
    </article>
  );
};
