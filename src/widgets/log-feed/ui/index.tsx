import { Loader2, Search } from 'lucide-react';

import { Log } from '@/entities/log/model/types';
import { MatchLogCard } from '@/entities/log/ui/log-card';
import { Screen } from '@/shared/lib/navigation';

interface LogFeedProps {
  logs: Log[];
  isLoading: boolean;
  activeCategory: string;
  onLogClick: (id: number) => void;
  onNavigate: (screen: Screen) => void;
}

export const LogFeed = ({ logs, isLoading, activeCategory, onLogClick, onNavigate }: LogFeedProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#1A237E]" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 opacity-40" />
        </div>
        <p className="text-lg font-medium">No logs found for {activeCategory}</p>
        <p className="text-sm">Try selecting a different category or create a new log.</p>
        <button 
          onClick={() => onNavigate('create')}
          className="mt-4 text-[#1A237E] font-bold text-sm hover:underline"
        >
          Create your first log now
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {logs.map(log => (
        <MatchLogCard key={log.id} log={log} onClick={onLogClick} />
      ))}
    </div>
  );
};
