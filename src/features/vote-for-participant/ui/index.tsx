import { Log } from '@/entities/goll/model/types';
import { cn } from '@/shared/ui/utils';
import { motion } from 'framer-motion';
import { Shield, Sparkles, ThumbsUp, Trophy, User } from 'lucide-react';
import React, { useState } from 'react';

type VoteForParticipantProps = {
  log: Partial<Log>;
};

export const VoteForParticipant = ({ log }: VoteForParticipantProps) => {
  const { matchType, participants: initialParticipants, isArchived } = log;
  
  const [participants, setParticipants] = useState(initialParticipants || []);
  const [votedParticipantId, setVotedParticipantId] = useState<string | null>(null);

  const handleVote = (id: string) => {
    if (votedParticipantId === id) {
      setVotedParticipantId(null);
      setParticipants((prev: any[]) => prev.map(p => 
        p.id === id ? { ...p, votes: (p.votes || 0) - 1 } : p
      ));
    } else {
      setParticipants((prev: any[]) => prev.map(p => {
        if (p.id === id) return { ...p, votes: (p.votes || 0) + 1 };
        if (p.id === votedParticipantId) return { ...p, votes: (p.votes || 0) - 1 };
        return p;
      }));
      setVotedParticipantId(id);
    }
  };

  if (!participants || participants.length === 0) {
    return null;
  }
  
  const totalVotes = participants.reduce((acc, curr) => acc + (curr.votes || 0), 0);

  return (
    <section className={cn(
      "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-opacity",
      isArchived && "opacity-75 grayscale-[0.5]"
    )}>
      <div className="bg-[#1A237E] p-4 flex items-center justify-between">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Who are you cheering for?
        </h3>
        <span className="text-blue-200 text-xs font-medium bg-blue-900/50 px-2 py-1 rounded">
          {totalVotes.toLocaleString()} Total Cheers
        </span>
      </div>
      
      <div className="p-6">
        {matchType === 'vs' && participants.length === 2 && (
          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
              <span>{participants[0]?.name}</span>
              <span>{participants[1]?.name}</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex relative">
               <motion.div 
                 className="h-full bg-blue-500 relative"
                 initial={{ width: '50%' }}
                 animate={{ width: `${totalVotes > 0 ? (participants[0].votes / totalVotes) * 100 : 50}%` }}
                 transition={{ duration: 1, ease: "circOut" }}
               />
               <div className="w-1 h-full bg-white z-10" />
               <motion.div 
                 className="h-full bg-red-500 flex-1"
               />
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-800 mt-2">
              <span className="text-blue-600">{Math.round(totalVotes > 0 ? (participants[0].votes / totalVotes) * 100 : 0)}%</span>
              <span className="text-red-600">{Math.round(totalVotes > 0 ? (participants[1].votes / totalVotes) * 100 : 0)}%</span>
            </div>
          </div>
        )}

        <div className={cn(
          "grid gap-4",
          matchType === 'vs' ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
        )}>
          {participants.map((p: any, index: number) => {
            const isSelected = votedParticipantId === p.id;
            
            return (
              <motion.button
                key={p.id || index}
                whileHover={!isArchived ? { scale: 1.02 } : {}}
                whileTap={!isArchived ? { scale: 0.98 } : {}}
                onClick={() => !isArchived && handleVote(p.id)}
                disabled={isArchived}
                className={cn(
                  "relative flex flex-col items-center p-4 rounded-xl border-2 transition-all overflow-hidden",
                  isSelected 
                    ? "border-[#1A237E] bg-[#E1F5FE]" 
                    : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-md",
                  isArchived && "cursor-not-allowed hover:bg-slate-50 hover:border-slate-100 hover:shadow-none"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }}
                      className="text-[#1A237E]"
                    >
                      <Sparkles className="w-5 h-5 fill-[#1A237E]" />
                    </motion.div>
                  </div>
                )}
                
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-3 text-white font-bold text-lg shadow-sm",
                  index === 0 ? "bg-blue-500" : (index === 1 && matchType === 'vs' ? "bg-red-500" : "bg-slate-400")
                )}>
                  {p.type === 'individual' ? <User className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                </div>
                
                <h4 className="font-bold text-slate-800 text-center mb-1">{p.name}</h4>
                
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full",
                    isSelected ? "bg-[#1A237E] text-white" : "bg-slate-200 text-slate-500"
                  )}>
                    {(p.votes || 0).toLocaleString()} votes
                  </span>
                </div>
                
                {isSelected ? (
                  <div className="mt-3 text-xs font-bold text-[#1A237E] flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5 fill-[#1A237E]" />
                    Cheering!
                  </div>
                ) : (
                  <div className="mt-3 text-xs font-medium text-slate-400">
                    {isArchived ? "Voting Closed" : "Tap to Cheer"}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
