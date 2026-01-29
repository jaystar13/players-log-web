import React, { useState, useEffect } from 'react';
import { Loader2, ChevronLeft, Share2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { Goll } from '@/entities/goll/model/types';
import { api } from '@/shared/api';
import { GollDetailCard } from '@/widgets/goll-detail-card/ui';
import { GollInteractionSidebar } from '@/widgets/goll-interaction-sidebar/ui';
import { ManageGoll } from '@/features/manage-goll/ui';

// Fallback data
const DEFAULT_LOG_DATA: Partial<Goll> = {
  id: 0,
  sport: "Unknown",
  title: "Log Not Found",
  date: "",
  venue: "",
  teams: "",
  matchType: "vs",
  participants: [],
  owner: { name: "Unknown", avatar: "" },
  description: "This log could not be loaded.",
  stats: { likes: 0, views: 0 },
  isArchived: false,
  media: [],
};

interface GollDetailPageProps {
  onBack: () => void;
  gollId?: number | string;
  previewData?: Partial<Goll>;
  onEdit?: (gollData: Goll) => void;
}

export default function GollDetailPage({ onBack, gollId: gollId, previewData, onEdit = () => {} }: GollDetailPageProps) {
  const [goll, setGoll] = useState<Partial<Goll> | null>(previewData || null);
  const [loading, setLoading] = useState(!previewData);

  useEffect(() => {
    if (previewData) {
      setGoll(previewData);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const golls = await api.getGolls(); // In a real app, this would be api.getLogById(logId)
        const foundGoll = golls.find((l: any) => l.id == gollId);

        if (foundGoll) {
          const uiLog = {
            ...foundGoll,
            matchType: foundGoll.matchType || 'vs',
            participants: foundGoll.participants || [],
            media: foundGoll.media || (foundGoll.previewLinks || []).map((link: string, idx: number) => ({
              type: link.includes('youtube') ? 'video' : 'article',
              title: `Linked Resource ${idx + 1}`,
              url: link,
              thumbnail: '',
            })),
            description: foundGoll.description,
            stats: { likes: foundGoll.likes || 0, views: 0 },
            isArchived: foundGoll.isArchived || false,
          };
          setGoll(uiLog);
        } else {
          setGoll(DEFAULT_LOG_DATA);
        }
      } catch (error) {
        console.error("Error fetching log detail:", error);
        setGoll(DEFAULT_LOG_DATA);
      } finally {
        setLoading(false);
      }
    };

    if (gollId) {
      fetchData();
    }
  }, [gollId, previewData]);

  const handleArchive = (isArchived: boolean) => {
    setGoll(prevGoll => prevGoll ? { ...prevGoll, isArchived } : null);
    alert(isArchived ? "Log archived." : "Log unarchived.");
  }

  const handleDelete = () => {
    alert("Log deleted (simulation).");
    onBack();
  }
  
  const handleReport = () => {
    alert("Log reported (simulation).");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#1A237E] animate-spin" />
      </div>
    );
  }

  if (!goll) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 relative">
      {goll.isArchived && (
        <div className="bg-slate-800 text-white text-center py-2 px-4 text-sm font-bold sticky top-16 z-20 flex items-center justify-center gap-2">
          Archived
        </div>
      )}

      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500">Back</span>
              {previewData && (
                <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded uppercase">Preview</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <ManageGoll 
              goll={goll} 
              onEdit={onEdit} 
              onArchive={handleArchive}
              onDelete={handleDelete}
              onReport={handleReport}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <GollDetailCard goll={goll} />
          </div>
          <div className="lg:col-span-4">
            <GollInteractionSidebar goll={goll} />
          </div>
        </div>
      </main>
    </div>
  );
}
