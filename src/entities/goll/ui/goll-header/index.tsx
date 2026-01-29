import { Log } from '@/entities/goll/model/types';
import { cn } from '@/shared/ui/utils';
import { Calendar, Clock, MapPin } from 'lucide-react';
import React from 'react';

type LogHeaderProps = {
  log: Partial<Log>;
};

export const LogHeader = ({ log }: LogHeaderProps) => {
  return (
    <div className="space-y-4 relative">
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 rounded-full bg-[#E1F5FE] text-[#1A237E] text-sm font-bold uppercase tracking-wider">
          {log.sport}
        </span>
        <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {log.createdAt ? log.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]} Logged
        </span>
        {log.isArchived && (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-bold rounded uppercase border border-slate-200">
            Archived
          </span>
        )}
      </div>
      
      <h1 className={cn(
        "text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight",
        log.isArchived && "opacity-50"
      )}>
        {log.title || "Untitled Log"}
      </h1>

      <div className="flex flex-wrap gap-4 text-slate-600 pt-2">
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
          <Calendar className="w-4 h-4 text-[#1A237E]" />
          <span className="font-semibold text-sm">{log.date || 'No Date'}</span>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-sm">{log.time || '--:--'}</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
          <MapPin className="w-4 h-4 text-[#1A237E]" />
          <span className="font-semibold text-sm">{log.venue || 'No Venue'}</span>
        </div>
      </div>
    </div>
  );
};
