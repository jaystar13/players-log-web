import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Search } from 'lucide-react';
import { GollFilter } from '@/features/filter-my-golls/ui';
import { MyGollListItem } from '@/entities/goll/ui/my-goll-list-item';
import { Goll } from '@/entities/goll/model/types';

interface MyGollListProps {
  golls: Goll[];
  activeTab: 'created' | 'liked';
  loading: boolean;
  onNavigateToDetail: (id: number) => void;
}

export const MyGollList = ({ golls: golls, activeTab, loading, onNavigateToDetail }: MyGollListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const getFilteredGolls = () => {
    return golls.filter((goll) => {
      const matchesSearch = 
        (goll.title && goll.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (goll.teams && goll.teams.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (goll.sport && goll.sport.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSport = selectedSport ? goll.sport === selectedSport : true;

      return matchesSearch && matchesSport;
    });
  };

  const filteredGolls = getFilteredGolls();
  const allSports = Array.from(new Set(golls.map((l) => l.sport))).filter(Boolean);

  return (
    <section className="lg:col-span-9 space-y-6">
      <GollFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSport={selectedSport}
        setSelectedSport={setSelectedSport}
        allSports={allSports}
      />

      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold text-slate-800">
          {activeTab === 'created' ? "My Created Logs" : "Liked Logs"}
          <span className="ml-2 text-sm font-normal text-slate-400">({filteredGolls.length})</span>
        </h2>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#1A237E]" />
            </div>
          ) : filteredGolls.length > 0 ? (
            filteredGolls.map((goll) => (
              <MyGollListItem
                key={goll.id}
                goll={goll}
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
