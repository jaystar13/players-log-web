import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

import { useGolls } from '@/features/goll/fetch-golls/lib/use-golls';
import { CategoryNav } from '@/features/goll/filter-golls/ui/category-nav';
import { Header } from '@/widgets/header/ui';
import { GollFeed } from '@/widgets/goll-feed/ui';
import { Screen } from '@/shared/lib/navigation';

interface MainFeedPageProps {
  onNavigate: (screen: Screen, params?: any) => void;
  onGollClick: (id: number) => void;
}

export default function MainFeedPage({ onNavigate, onGollClick }: MainFeedPageProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const { golls: golls, loading: isLoading, error } = useGolls();

  const filteredGolls = activeCategory === "All" 
    ? golls 
    : golls.filter(goll => goll.sport === activeCategory);

  // You could handle the error state here, e.g. show a toast or an error message
  if (error) {
    // For now, just logging it
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header onNavigate={onNavigate} />
      <CategoryNav activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {activeCategory === "All" ? "Recent Match Logs" : `${activeCategory} Logs`}
          </h2>
          <span className="text-sm text-slate-500">
            {isLoading ? "Loading..." : `Showing ${filteredGolls.length} results`}
          </span>
        </div>

        <GollFeed 
          golls={filteredGolls}
          isLoading={isLoading}
          activeCategory={activeCategory}
          onGollClick={onGollClick}
          onNavigate={onNavigate}
        />
      </main>

      {/* Floating Action Button for Mobile only */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onNavigate('create')}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#1A237E] text-white rounded-full shadow-lg shadow-blue-900/30 flex items-center justify-center z-50 hover:bg-[#151b60] transition-colors"
      >
        <Plus className="w-7 h-7" />
      </motion.button>
    </div>
  );
}
