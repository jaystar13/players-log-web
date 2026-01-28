import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Search } from 'lucide-react';
import { LogFilter } from '@/features/filter-my-logs/ui';
import { MyLogListItem } from '@/entities/log/ui/my-log-list-item';
import { Log } from '@/entities/log/model/types';

interface MyLogListProps {
  logs: Log[];
  activeTab: 'created' | 'liked';
  loading: boolean;
  onNavigateToDetail: (id: number) => void;
}

export const MyLogList = ({ logs, activeTab, loading, onNavigateToDetail }: MyLogListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const getFilteredLogs = () => {
    return logs.filter((log) => {
      const matchesSearch = 
        (log.title && log.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.teams && log.teams.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.sport && log.sport.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSport = selectedSport ? log.sport === selectedSport : true;

      return matchesSearch && matchesSport;
    });
  };

  const filteredLogs = getFilteredLogs();
  const allSports = Array.from(new Set(logs.map((l) => l.sport))).filter(Boolean);

  return (
    <section className="lg:col-span-9 space-y-6">
      <LogFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSport={selectedSport}
        setSelectedSport={setSelectedSport}
        allSports={allSports}
      />

      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold text-slate-800">
          {activeTab === 'created' ? "My Created Logs" : "Liked Logs"}
          <span className="ml-2 text-sm font-normal text-slate-400">({filteredLogs.length})</span>
        </h2>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#1A237E]" />
            </div>
          ) : filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <MyLogListItem
                key={log.id}
                log={log}
                activeTab={activeTab}
                onNavigateToDetail={onNavigateToDetail}
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-slate-200"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No logs found matching your criteria.</p>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedSport(null);}}
                className="mt-2 text-sm text-[#1A237E] font-bold hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
