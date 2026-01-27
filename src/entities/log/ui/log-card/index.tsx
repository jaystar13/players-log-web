import { motion } from 'framer-motion';
import { Calendar, Heart, Link as LinkIcon, MapPin, User, Video } from 'lucide-react';

import { Log } from '@/entities/log/model/types';
import { cn } from '@/shared/ui/utils';

interface MatchLogCardProps {
  log: Log;
  onClick: (id: number) => void;
}

export const MatchLogCard = ({ log, onClick }: MatchLogCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={() => onClick(log.id)}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-[#1A237E]/20 transition-all duration-300 group cursor-pointer flex flex-col h-full"
    >
      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <span className="px-2.5 py-1 rounded-md bg-[#E1F5FE] text-[#1A237E] text-xs font-bold uppercase tracking-wider">
            {log.sport}
          </span>
          <span className="text-slate-400 text-xs flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {log.date}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 leading-snug mb-2 group-hover:text-[#1A237E] transition-colors line-clamp-2">
          {log.title}
        </h3>

        {/* Info */}
        <div className="text-xs text-slate-500 flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{log.venue}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{log.teams}</span>
          </div>
        </div>

        {/* Preview Snippet */}
        <div className="mt-auto bg-slate-50 rounded-lg p-3 text-sm text-slate-600 line-clamp-3 mb-4 border border-slate-100 italic">
          "{log.preview || log.description || "No preview available"}"
        </div>

        {/* Media Indicators */}
        <div className="flex gap-2 mb-4">
          {log.hasVideo && (
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              <Video className="w-3 h-3" />
              Video
            </div>
          )}
          {log.hasLink && (
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              <LinkIcon className="w-3 h-3" />
              Link
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <img 
              src={log.owner?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100"} 
              alt={log.owner?.name || "User"} 
              className="w-8 h-8 rounded-full border border-white shadow-sm" 
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-700">{log.owner?.name || "Anonymous"}</span>
              <span className="text-[10px] text-slate-400">Owner</span>
            </div>
          </div>
          
          <button className="flex items-center gap-1.5 text-slate-400 hover:text-pink-500 transition-colors group/like">
            <Heart className="w-4 h-4 group-hover/like:fill-pink-500" />
            <span className="text-xs font-semibold">{log.likes || 0}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
