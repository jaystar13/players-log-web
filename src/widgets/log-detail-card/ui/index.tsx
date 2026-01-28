import React from 'react';
import { Log } from '@/entities/log/model/types';
import { LogHeader } from '@/entities/log/ui/log-header';
import { LogOwner } from '@/entities/log/ui/log-owner';
import { LogDescription } from '@/entities/log/ui/log-description';
import { LogMedia } from '@/entities/log/ui/log-media';
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
