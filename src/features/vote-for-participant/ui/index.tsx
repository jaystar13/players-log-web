import { Goll, Participant } from '@/entities/goll/model/types';
import { cn } from '@/shared/ui/utils';
import { motion } from 'framer-motion';
import { Shield, Sparkles, ThumbsUp, Trophy, User, AlertCircle, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { api } from '@/shared/api';
import { UserProfile } from '@/entities/user/model/types';
import { Screen } from '@/shared/lib/navigation';
import { redirectStore } from '@/shared/auth/redirectStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

type VoteForParticipantProps = {
  goll: Partial<Goll>;
  userProfile: UserProfile | null;
  onNavigate: (screen: Screen, params?: any) => void;
};

export const VoteForParticipant = ({ goll, userProfile, onNavigate }: VoteForParticipantProps) => {
  const { id: gollId, matchType, participants: initialParticipants, status, userVoteId } = goll;
  const isArchived = status === 'ARCHIVED';
  
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants || []);
  const [votedParticipantId, setVotedParticipantId] = useState<number | string | null>(userVoteId || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    setParticipants(initialParticipants || []);
    setVotedParticipantId(userVoteId || null);
  }, [initialParticipants, userVoteId]);


  const handleVote = async (participantId: number | string) => {
    if (!userProfile) {
      redirectStore.set('detail', { id: gollId });
      setAlertOpen(true);
      return;
    }
    
    if (isSubmitting || !gollId) return;

    setIsSubmitting(true);
    try {
      const response = await api.voteForParticipant(gollId, participantId);
      
      // Update state based on the response from the server
      setVotedParticipantId(response.votedParticipantId);
      setParticipants(prev => 
        prev.map(p => ({
          ...p,
          votes: response.voteCounts[p.id!] || 0,
        }))
      );

    } catch (error) {
      console.error("Failed to vote for participant:", error);
      // Optionally show a toast to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!participants || participants.length === 0) {
    return null;
  }
  
  const totalVotes = participants.reduce((acc, curr) => acc + (curr.votes || 0), 0);

  return (
    <>
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
                  animate={{ width: `${totalVotes > 0 ? ((participants[0].votes || 0) / totalVotes) * 100 : 50}%` }}
                  transition={{ duration: 1, ease: "circOut" }}
                />
                <div className="w-1 h-full bg-white z-10" />
                <motion.div 
                  className="h-full bg-red-500 flex-1"
                />
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mt-2">
                <span className="text-blue-600">{Math.round(totalVotes > 0 ? ((participants[0].votes || 0) / totalVotes) * 100 : 0)}%</span>
                <span className="text-red-600">{Math.round(totalVotes > 0 ? ((participants[1].votes || 0) / totalVotes) * 100 : 0)}%</span>
              </div>
            </div>
          )}

          <div className={cn(
            "grid gap-4",
            matchType === 'vs' ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
          )}>
            {participants.map((p, index) => {
              const isSelected = votedParticipantId === p.id;
              
              return (
                <motion.button
                  key={p.id || index}
                  whileHover={!isArchived && !isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isArchived && !isSubmitting ? { scale: 0.98 } : {}}
                  onClick={() => !isArchived && handleVote(p.id!)}
                  disabled={isArchived || isSubmitting}
                  className={cn(
                    "relative flex flex-col items-center p-4 rounded-xl border-2 transition-all overflow-hidden",
                    isSelected 
                      ? "border-[#1A237E] bg-[#E1F5FE]" 
                      : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-md",
                    (isArchived || isSubmitting) && "cursor-not-allowed hover:bg-slate-50 hover:border-slate-100 hover:shadow-none"
                  )}
                >
                  {isSelected && !isSubmitting && (
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
                  
                  {isSubmitting && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
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

          <div className="flex items-center justify-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 py-2 px-3 rounded-lg border border-amber-100 mt-6">
            <AlertCircle className="w-4 h-4" />
            Only 1 vote per user, per log. Changing your vote is possible.
          </div>
        </div>
      </section>

      <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to vote. Would you like to go to the login page?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onNavigate('login')}>
              Go to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
