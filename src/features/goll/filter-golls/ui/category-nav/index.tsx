import { cn } from "@/shared/ui/utils";

const SPORTS_CATEGORIES = [
  "All",
  "Short Track",
  "Figure Skating",
  "Curling",
  "Speed Skating",
  "Ice Hockey",
  "Alpine Skiing",
  "Snowboard",
  "Skeleton",
  "Luge",
  "Bobsleigh",
  "Ski Jumping",
  "Biathlon",
  "Cross Country",
  "Freestyle Skiing",
  "Nordic Combined"
];

interface CategoryNavProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const CategoryNav = ({ activeCategory, setActiveCategory }: CategoryNavProps) => {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3">
          {SPORTS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === cat 
                  ? "bg-[#E1F5FE] text-[#1A237E] shadow-sm ring-1 ring-[#1A237E]/20" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};