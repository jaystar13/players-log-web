import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '@/shared/ui/utils';
import { api } from '@/shared/api';

type LikeGollProps = {
  gollId: number | string;
  initialLikes: number;
  initialIsLiked: boolean;
  isArchived?: boolean;
};

export const LikeGoll = ({ gollId, initialLikes, initialIsLiked, isArchived }: LikeGollProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikeCount(initialLikes);
  }, [initialIsLiked, initialLikes]);

  const handleLike = async () => {
    if (isSubmitting || isArchived) return;

    setIsSubmitting(true);
    try {
      const response = await api.likeGoll(gollId);
      setIsLiked(response.liked);
      setLikeCount(response.likes);
    } catch (error) {
      console.error("Failed to update like status:", error);
      // Optionally show a toast message to the user
    } finally {
      setIsSubmitting(false);
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
        whileHover={!isArchived && !isSubmitting ? { scale: 1.05 } : {}}
        whileTap={!isArchived && !isSubmitting ? { scale: 0.95 } : {}}
        onClick={handleLike}
        disabled={isArchived || isSubmitting}
        className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all shadow-xl",
          isLiked 
            ? "bg-gradient-to-br from-pink-500 to-rose-600 shadow-pink-500/30" 
            : "bg-slate-100 hover:bg-pink-50 text-slate-400 hover:text-pink-500",
          (isArchived || isSubmitting) && "cursor-not-allowed opacity-50"
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
    </div>
  );
};
