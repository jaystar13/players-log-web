import React from 'react';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/shared/ui/utils';

interface LogFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSport: string | null;
  setSelectedSport: (sport: string | null) => void;
  allSports: string[];
}

export const LogFilter = ({
  searchQuery,
  setSearchQuery,
  selectedSport,
  setSelectedSport,
  allSports
}: LogFilterProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by title, player, or sport..."
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1A237E] outline-none text-slate-700"
        />
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <Filter className="w-4 h-4 text-slate-400 mr-1 flex-shrink-0" />
        <button 
          onClick={() => setSelectedSport(null)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border",
            selectedSport === null
              ? "bg-slate-800 text-white border-slate-800"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          )}
        >
          All Sports
        </button>
        {allSports.map(sport => (
          <button 
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border",
              selectedSport === sport
                ? "bg-[#1A237E] text-white border-[#1A237E]"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            )}
          >
            {sport}
          </button>
        ))}
      </div>
    </div>
  );
};
