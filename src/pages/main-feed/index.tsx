import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

import { useLogs } from '@/features/log/fetch-logs/lib/use-logs';
import { CategoryNav } from '@/features/log/filter-logs/ui/category-nav';
import { Header } from '@/widgets/header/ui';
import { LogFeed } from '@/widgets/log-feed/ui';
import { Screen } from '@/shared/lib/navigation';

interface MainFeedPageProps {
  onNavigate: (screen: Screen, params?: any) => void;
  onLogClick: (id: number) => void;
}

export default function MainFeedPage({ onNavigate, onLogClick }: MainFeedPageProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const { logs, loading: isLoading, error } = useLogs();

  const filteredLogs = activeCategory === "All" 
    ? logs 
    : logs.filter(log => log.sport === activeCategory);

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
            {isLoading ? "Loading..." : `Showing ${filteredLogs.length} results`}
          </span>
        </div>

        <LogFeed 
          logs={filteredLogs}
          isLoading={isLoading}
          activeCategory={activeCategory}
          onLogClick={onLogClick}
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
