import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Heart } from 'lucide-react';
import { cn } from '@/shared/ui/utils';
import { api } from '@/shared/api';

type LikeLogProps = {
  logId: number;
  initialLikes: number;
  isArchived?: boolean;
};

export const LikeLog = ({ logId, initialLikes, isArchived }: LikeLogProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const handleLike = async () => {
    if (isLiked || isArchived) return;

    try {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
      await api.likeLog(logId);
    } catch (error) {
      console.error("Failed to like log:", error);
      // Revert state on error
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    }
  };

  return (
    <div className={cn(
      "bg-white rounded-2xl border border-slate-200 shadow-lg shadow-blue-900/5 p-6 text-center transition-all",
      isArchived && "opacity-60 grayscale"
    )}>
      <h3 className="font-bold text-slate-800 text-lg mb-2">Like this Log?</h3>
      <p className="text-sm text-slate-500 mb-6">
        Show your appreciation for this log.
      </p>

      <motion.button
        whileHover={!isArchived ? { scale: 1.05 } : {}}
        whileTap={!isArchived ? { scale: 0.95 } : {}}
        onClick={handleLike}
        disabled={isArchived || isLiked}
        className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all shadow-xl",
          isLiked 
            ? "bg-gradient-to-br from-pink-500 to-rose-600 shadow-pink-500/30 cursor-default" 
            : "bg-slate-100 hover:bg-pink-50 text-slate-400 hover:text-pink-500",
          isArchived && "cursor-not-allowed opacity-50"
        )}
      >
        <Heart 
          className={cn(
            "w-10 h-10 transition-colors",
            isLiked ? "fill-white text-white" : "fill-transparent"
          )} 
          strokeWidth={2.5}
        />
      </motion.button>

      <div className="mb-4">
        <span className="text-3xl font-black text-slate-800">
          {likeCount.toLocaleString()}
        </span>
        <span className="text-sm font-medium text-slate-500 ml-1">Likes</span>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 py-2 px-3 rounded-lg border border-amber-100">
        <AlertCircle className="w-4 h-4" />
        Only 1 like per user
      </div>
    </div>
  );
};
