import { Log } from '@/entities/goll/model/types';
import { cn } from '@/shared/ui/utils';
import { motion } from 'framer-motion';
import { Calendar, Heart, User, ArrowRight } from 'lucide-react';
import React from 'react';

interface MyLogListItemProps {
  log: Log;
  activeTab: 'created' | 'liked';
  onNavigateToDetail: (id: number) => void;
}

export const MyLogListItem = ({ log, activeTab, onNavigateToDetail }: MyLogListItemProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onNavigateToDetail(log.id)}
      className="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-[#1A237E] transition-all cursor-pointer relative overflow-hidden"
    >
      {/* Hover Decoration */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1A237E] scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-[#E1F5FE] text-[#1A237E] text-[10px] font-bold uppercase tracking-wider">
              {log.sport}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {log.date}
            </span>
            {activeTab === 'created' && (
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                "bg-emerald-50 text-emerald-600"
              )}>
                Published
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 truncate group-hover:text-[#1A237E] transition-colors">
            {log.title}
          </h3>
          
          <div className="flex items-center gap-4 mt-3">
            {log.teams && (
              <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium bg-rose-50 px-2 py-1 rounded-md">
                <Heart className="w-3 h-3 fill-rose-500" />
                Match: {log.teams}
              </div>
            )}
            {activeTab === 'liked' && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <User className="w-3 h-3" />
                by {log.owner?.name || "Unknown"}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 pl-0 sm:pl-4">
           {activeTab === 'created' && (
             <div className="text-center sm:text-right">
               <div className="text-sm font-bold text-slate-700">{log.likes || 0}</div>
               <div className="text-[10px] text-slate-400 uppercase">Likes</div>
             </div>
           )}
           <button className="p-2 text-slate-300 hover:text-[#1A237E] rounded-full hover:bg-slate-50 transition-colors">
             <ArrowRight className="w-5 h-5" />
           </button>
        </div>
      </div>
    </motion.div>
  );
};
