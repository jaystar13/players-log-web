import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

import { useGolls } from '@/features/goll/fetch-golls/lib/use-golls';
import { CategoryNav } from '@/features/goll/filter-golls/ui/category-nav';
import { Header } from '@/widgets/header/ui';
import { GollFeed } from '@/widgets/goll-feed/ui';
import { Screen } from '@/shared/lib/navigation';
import { UserProfile } from '@/entities/user/model/types';

interface MainFeedPageProps {
  onNavigate: (screen: Screen, params?: any) => void;
  onGollClick: (id: number | string) => void;
  userProfile: UserProfile | null;
}

export default function MainFeedPage({ onNavigate, onGollClick, userProfile }: MainFeedPageProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const { golls, loading: isLoading, error, hasMore, loadMore } = useGolls();

  // TODO: Client-side filtering is not ideal with pagination.
  // The activeCategory should be passed to the `useGolls` hook
  // to be used in the API request for backend filtering.
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
      <Header onNavigate={onNavigate} userProfile={userProfile} />
      <CategoryNav activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {activeCategory === "All" ? "Recent Match Logs" : `${activeCategory} Logs`}
          </h2>
          <span className="text-sm text-slate-500">
            {golls.length > 0 && `Showing ${golls.length} results`}
          </span>
        </div>

        <GollFeed
          golls={filteredGolls}
          isLoading={isLoading && golls.length === 0} // Show skeleton only on initial load
          activeCategory={activeCategory}
          onGollClick={onGollClick}
          onNavigate={onNavigate}
        />

        <div className="mt-8 text-center">
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
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