import React, { useState, useEffect } from 'react';
import { Loader2, ChevronLeft, Share2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { Goll } from '@/entities/goll/model/types';
import { api } from '@/shared/api';
import { GollDetailCard } from '@/widgets/goll-detail-card/ui';
import { GollInteractionSidebar } from '@/widgets/goll-interaction-sidebar/ui';
import { ManageGoll } from '@/features/manage-goll/ui';
import { Screen } from '@/shared/lib/navigation';
import { UserProfile } from '@/entities/user/model/types';
import { ShareGollModal } from '@/widgets/share-goll-modal/ui/ShareGollModal'; // Import ShareGollModal

// Fallback data
const DEFAULT_LOG_DATA: Partial<Goll> = {
  id: 0,
  sport: "Unknown",
  title: "Log Not Found",
  matchDate: "",
  venue: "",
  matchType: "vs",
  participants: [],
  owner: { id: 0, name: "Unknown", profileImageUrl: "" },
  description: "This log could not be loaded.",
  stats: { likes: 0, views: 0 },
  status: 'ACTIVE',
  media: [],
};

interface GollDetailPageProps {
  onBack: () => void;
  gollId: number | string;
  previewData?: Partial<Goll>;
  onEdit?: (gollData: Goll) => void;
  onNavigate: (screen: Screen, params?: any) => void;
  userProfile: UserProfile | null;
}

export default function GollDetailPage({ onBack, gollId: gollId, previewData, onEdit = () => {}, onNavigate, userProfile }: GollDetailPageProps) {
  const [goll, setGoll] = useState<Partial<Goll> | null>(previewData || null);
  const [loading, setLoading] = useState(!previewData);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState('');

  useEffect(() => {
    if (previewData) {
      setGoll(previewData);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const foundGoll = await api.getGollById(gollId);
        
        if (foundGoll) {
          // Ensure all fields expected by the UI are present or have default values
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
            // Assuming backend provides 'likes' and 'views' or they are handled elsewhere
            stats: foundGoll.stats || { likes: 0, views: 0 },
            status: foundGoll.status || 'ACTIVE',
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

  useEffect(() => {
    if (gollId && !previewData) {
      const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE}/golls/${gollId}/subscribe`);

      const handleLikeUpdate = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.gollId.toString() === gollId.toString()) { // Ensure type safety for comparison
          setGoll(prevGoll => {
            if (!prevGoll) return null;
            
            const updatedParticipants = prevGoll.participants?.map(p => ({
              ...p,
              votes: p.id !== undefined ? data.voteCounts[String(p.id)] ?? 0 : p.votes ?? 0,
            }));

            // Create a new goll object with updated likes and participants
            const newGoll = {
              ...prevGoll,
              likes: data.likes, // Update the top-level likes property
              participants: updatedParticipants
            };

            return newGoll;
          });
        }
      };

      eventSource.addEventListener('GOLL_LIKE_UPDATE', handleLikeUpdate);
      eventSource.addEventListener('VOTE_UPDATE', handleLikeUpdate);

      eventSource.onerror = (error) => {
        console.error("EventSource failed for gollId:", gollId, error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [gollId, previewData]);


  const handleArchive = async (archive: boolean) => {
    if (!goll?.id) return;
    try {
      const newStatus = archive ? 'ARCHIVED' : 'ACTIVE';
      const updatedGoll = await api.patchGoll(goll.id, { status: newStatus });
      // Re-construct the media field
      const updatedGollWithMedia = {
        ...updatedGoll,
        media: updatedGoll.media || (updatedGoll.previewLinks || []).map((link: string, idx: number) => ({
          type: link.includes('youtube') ? 'video' : 'article',
          title: `Linked Resource ${idx + 1}`,
          url: link,
          thumbnail: '',
        })),
      };
      setGoll(updatedGollWithMedia);
      alert(archive ? "Log archived." : "Log unarchived.");
    } catch (error) {
      console.error("Failed to update archive status:", error);
      alert("Failed to update archive status. Please try again.");
    }
  }

  const handleDelete = async () => {
    if (!goll?.id) return;
    try {
      const updatedGoll = await api.patchGoll(goll.id, { status: 'DELETED' });
      // Re-construct the media field
      const updatedGollWithMedia = {
        ...updatedGoll,
        media: updatedGoll.media || (updatedGoll.previewLinks || []).map((link: string, idx: number) => ({
          type: link.includes('youtube') ? 'video' : 'article',
          title: `Linked Resource ${idx + 1}`,
          url: link,
          thumbnail: '',
        })),
      };
      setGoll(updatedGollWithMedia);
      alert("Log deleted successfully.");
      onBack();
    } catch (error) {
      console.error("Failed to delete log:", error);
      alert("Failed to delete log. Please try again.");
    }
  }
  
  const handleReport = () => {
    alert("Log reported (simulation).");
  }

  const handleShareClick = async () => {
    if (!goll?.id) return;
    try {
      // Assuming shortUrlApi is defined in @/shared/api/shortUrl.ts
      // And it returns just the shortCode, which we then prepend with the base URL.
      const shortCode = await api.generateShortUrl(Number(goll.id)); // Use api.generateShortUrl
      const fullShortUrl = `${window.location.origin}/s/${shortCode}`; // Construct full URL
      setShortenedUrl(fullShortUrl);
      setIsShareModalOpen(true);
    } catch (error) {
      console.error("Error generating short URL:", error);
      alert("Failed to generate short URL. Please try again.");
    }
  };


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
      {goll.status === 'ARCHIVED' && (
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
            <button 
              onClick={handleShareClick} // Added onClick handler
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <ManageGoll
              goll={goll}
              isOwner={goll.isOwner || false}
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
            <GollDetailCard goll={goll} onNavigate={onNavigate} userProfile={userProfile} />
          </div>
          <div className="lg:col-span-4">
            <GollInteractionSidebar goll={goll} initialIsLiked={goll.isLiked || false} onNavigate={onNavigate} userProfile={userProfile} />
          </div>
        </div>
      </main>

      <ShareGollModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shortUrl={shortenedUrl}
      />
    </div>
  );
}

