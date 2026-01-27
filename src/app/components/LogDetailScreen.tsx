import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Link as LinkIcon, 
  Video,
  Heart,
  Share2,
  Clock,
  ExternalLink,
  MessageCircle,
  Flag,
  AlertCircle,
  Trophy,
  ThumbsUp,
  Shield,
  User,
  Sparkles,
  Loader2,
  MoreVertical,
  Edit,
  Archive,
  EyeOff,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { api } from '@/shared/api';

import { Log } from '@/entities/log/model/types'; // Import Log type

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fallback data
const DEFAULT_LOG_DATA: Partial<Log> = {
  id: 0,
  sport: "Unknown",
  title: "Log Not Found",
  date: "",
  venue: "",
  teams: "",
  matchType: "vs",
  participants: [],
  owner: { name: "Unknown", avatar: "" },
  preview: "This log could not be loaded.",
  description: "This log could not be loaded.",
  likes: 0,
  hasVideo: false,
  hasLink: false,
  media: [],
  stats: { likes: 0, views: 0 },
  isArchived: false
};

interface LogDetailScreenProps {
  onBack: () => void;
  logId?: number | string;
  previewData?: Partial<Log>;
  onEdit?: (logData: Log) => void;
}

export default function LogDetailScreen({ onBack, logId, previewData, onEdit }: LogDetailScreenProps) {
  const [data, setData] = useState<Partial<Log> | null>(previewData || null);
  const [loading, setLoading] = useState(!previewData);
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
  // Management State
  const [isOwner, setIsOwner] = useState(true); // Mocking owner status for demo
  const [showMenu, setShowMenu] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  // Voting State
  const [votedParticipantId, setVotedParticipantId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);

  // Fetch Data
  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setParticipants(previewData.participants || []);
      setLikeCount(previewData.stats?.likes || 0);
      setIsArchived(previewData.isArchived || false);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const logs = await api.getLogs();
        const foundLog = logs.find((l: any) => l.id == logId);

        if (foundLog) {
          const uiLog = {
            ...foundLog,
            matchType: foundLog.matchType || 'vs',
            participants: foundLog.participants || [], 
            media: foundLog.media || (foundLog.previewLinks || []).map((link: string, idx: number) => ({
              type: link.includes('youtube') ? 'video' : 'article',
              title: `Linked Resource ${idx + 1}`,
              url: link,
              thumbnail: link.includes('youtube') 
                ? "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400&h=225"
                : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400&h=225"
            })),
            description: foundLog.description || foundLog.content,
            stats: { 
              likes: foundLog.likes || 0, 
              views: foundLog.views || 0 
            },
            isArchived: foundLog.isArchived || false
          };
          
          setData(uiLog);
          setParticipants(uiLog.participants);
          setLikeCount(uiLog.stats.likes);
          setIsArchived(uiLog.isArchived);
        } else {
          setData(DEFAULT_LOG_DATA);
        }
      } catch (error) {
        console.error("Error fetching log detail:", error);
        setData(DEFAULT_LOG_DATA);
      } finally {
        setLoading(false);
      }
    };

    if (logId) {
      fetchData();
    }
  }, [logId, previewData]);

  const handleLike = async () => {
    if (isLiked) return; 

    try {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
      
      if (!previewData && data?.id) {
        await api.likeLog(data.id);
      }
    } catch (error) {
      console.error("Failed to like log:", error);
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    }
  };

  const handleVote = (id: string) => {
    if (votedParticipantId === id) {
      setVotedParticipantId(null);
      setParticipants((prev: any[]) => prev.map(p => 
        p.id === id ? { ...p, votes: (p.votes || 0) - 1 } : p
      ));
    } else {
      setParticipants((prev: any[]) => prev.map(p => {
        if (p.id === id) return { ...p, votes: (p.votes || 0) + 1 };
        if (p.id === votedParticipantId) return { ...p, votes: (p.votes || 0) - 1 };
        return p;
      }));
      setVotedParticipantId(id);
    }
  };

  const handleArchive = async () => {
    // In a real app, call API here. For now, just toggle state.
    const newState = !isArchived;
    setIsArchived(newState);
    setShowMenu(false);
    // await api.updateLog(data.id, { isArchived: newState });
    alert(newState ? "Log archived (hidden from public)." : "Log unarchived (visible to public).");
  };

  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit && data && data.id !== undefined) {
      onEdit(data as Log);
    } else {
      alert("Cannot edit a preview or incomplete log.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#1A237E] animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const totalVotes = participants.reduce((acc: any, curr: any) => acc + (curr.votes || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 relative" onClick={() => setShowMenu(false)}>
      
      {/* Archive Overlay/Banner if archived */}
      {isArchived && (
        <div className="bg-slate-800 text-white text-center py-2 px-4 text-sm font-bold sticky top-16 z-20 flex items-center justify-center gap-2">
          <EyeOff className="w-4 h-4" />
          This log is currently archived and hidden from the public feed.
        </div>
      )}

      {/* Header */}
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
              <span className="text-sm font-medium text-slate-500">Back to Feed</span>
              {previewData && (
                <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded uppercase">Preview Mode</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
            </button>

            {/* Owner Management Menu */}
            {isOwner ? (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className={cn(
                    "p-2 rounded-full transition-all",
                    showMenu ? "bg-[#E1F5FE] text-[#1A237E]" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                <AnimatePresence>
                  {showMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 origin-top-right"
                    >
                      <div className="p-1">
                        <button 
                          onClick={handleEdit}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
                        >
                          <Edit className="w-4 h-4 text-slate-400" />
                          Edit Log
                        </button>
                        <button 
                          onClick={handleArchive}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
                        >
                          {isArchived ? (
                            <>
                              <Eye className="w-4 h-4 text-slate-400" />
                              Unarchive Log
                            </>
                          ) : (
                            <>
                              <Archive className="w-4 h-4 text-slate-400" />
                              Archive Log
                            </>
                          )}
                        </button>
                        <div className="h-px bg-slate-100 my-1" />
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left">
                          <AlertCircle className="w-4 h-4" />
                          Delete Log
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                <Flag className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Main Content (8 Columns) */}
          <article className="lg:col-span-8 space-y-8">
            
            {/* Hero Section */}
            <div className="space-y-4 relative">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#E1F5FE] text-[#1A237E] text-sm font-bold uppercase tracking-wider">
                  {data.sport}
                </span>
                <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {data.createdAt ? data.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]} Logged
                </span>
                {isArchived && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-bold rounded uppercase border border-slate-200">
                    Archived
                  </span>
                )}
              </div>
              
              <h1 className={cn(
                "text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight",
                isArchived && "opacity-50"
              )}>
                {data.title || "Untitled Log"}
              </h1>

              <div className="flex flex-wrap gap-4 text-slate-600 pt-2">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                  <Calendar className="w-4 h-4 text-[#1A237E]" />
                  <span className="font-semibold text-sm">{data.date || 'No Date'}</span>
                  <span className="text-slate-300">|</span>
                  <span className="font-semibold text-sm">{data.time || '--:--'}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                  <MapPin className="w-4 h-4 text-[#1A237E]" />
                  <span className="font-semibold text-sm">{data.venue || 'No Venue'}</span>
                </div>
              </div>
            </div>

            {/* --- Cheering Board Section --- */}
            {participants.length > 0 && (
              <section className={cn(
                "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-opacity",
                isArchived && "opacity-75 grayscale-[0.5]"
              )}>
                <div className="bg-[#1A237E] p-4 flex items-center justify-between">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Who are you cheering for?
                  </h3>
                  <span className="text-blue-200 text-xs font-medium bg-blue-900/50 px-2 py-1 rounded">
                    {totalVotes.toLocaleString()} Total Cheers
                  </span>
                </div>
                
                <div className="p-6">
                  {/* Visual Bar for VS Mode */}
                  {data.matchType === 'vs' && participants.length === 2 && (
                    <div className="mb-8">
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                        <span>{participants[0]?.name}</span>
                        <span>{participants[1]?.name}</span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex relative">
                         {/* Left Bar */}
                         <motion.div 
                           className="h-full bg-blue-500 relative"
                           initial={{ width: '50%' }}
                           animate={{ width: `${totalVotes > 0 ? (participants[0].votes / totalVotes) * 100 : 50}%` }}
                           transition={{ duration: 1, ease: "circOut" }}
                         />
                         {/* Divider */}
                         <div className="w-1 h-full bg-white z-10" />
                         {/* Right Bar */}
                         <motion.div 
                           className="h-full bg-red-500 flex-1"
                         />
                      </div>
                      <div className="flex justify-between text-sm font-bold text-slate-800 mt-2">
                        <span className="text-blue-600">{Math.round(totalVotes > 0 ? (participants[0].votes / totalVotes) * 100 : 0)}%</span>
                        <span className="text-red-600">{Math.round(totalVotes > 0 ? (participants[1].votes / totalVotes) * 100 : 0)}%</span>
                      </div>
                    </div>
                  )}

                  {/* Participant Voting Cards */}
                  <div className={cn(
                    "grid gap-4",
                    data.matchType === 'vs' ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
                  )}>
                    {participants.map((p: any, index: number) => {
                      const isSelected = votedParticipantId === p.id;
                      
                      return (
                        <motion.button
                          key={p.id || index}
                          whileHover={!isArchived ? { scale: 1.02 } : {}}
                          whileTap={!isArchived ? { scale: 0.98 } : {}}
                          onClick={() => !isArchived && handleVote(p.id)}
                          disabled={isArchived}
                          className={cn(
                            "relative flex flex-col items-center p-4 rounded-xl border-2 transition-all overflow-hidden",
                            isSelected 
                              ? "border-[#1A237E] bg-[#E1F5FE]" 
                              : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-md",
                            isArchived && "cursor-not-allowed hover:bg-slate-50 hover:border-slate-100 hover:shadow-none"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <motion.div 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }}
                                className="text-[#1A237E]"
                              >
                                <Sparkles className="w-5 h-5 fill-[#1A237E]" />
                              </motion.div>
                            </div>
                          )}
                          
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center mb-3 text-white font-bold text-lg shadow-sm",
                            index === 0 ? "bg-blue-500" : (index === 1 && data.matchType === 'vs' ? "bg-red-500" : "bg-slate-400")
                          )}>
                            {p.type === 'individual' ? <User className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                          </div>
                          
                          <h4 className="font-bold text-slate-800 text-center mb-1">{p.name}</h4>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <span className={cn(
                              "text-xs font-bold px-2 py-0.5 rounded-full",
                              isSelected ? "bg-[#1A237E] text-white" : "bg-slate-200 text-slate-500"
                            )}>
                              {(p.votes || 0).toLocaleString()} votes
                            </span>
                          </div>
                          
                          {isSelected ? (
                            <div className="mt-3 text-xs font-bold text-[#1A237E] flex items-center gap-1">
                              <ThumbsUp className="w-3.5 h-3.5 fill-[#1A237E]" />
                              Cheering!
                            </div>
                          ) : (
                            <div className="mt-3 text-xs font-medium text-slate-400">
                              {isArchived ? "Voting Closed" : "Tap to Cheer"}
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            <div className="border-b border-slate-200" />

            {/* Owner Info */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <img 
                src={data.owner?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100"} 
                alt={data.owner?.name || "Owner"} 
                className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg">{data.owner?.name || "You"}</h3>
                <p className="text-slate-500 text-sm">{data.owner?.role || "Log Creator"}</p>
              </div>
              <button className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
                View Profile
              </button>
            </div>

            {/* Content Body */}
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
                {data.description || "No content provided."}
              </p>
            </div>

            {/* Media Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {data.media && data.media.map((item: any, index: number) => (
                <a 
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-[#1A237E] hover:shadow-md transition-all"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={item.thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400&h=225"} 
                      alt={item.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white p-1.5 rounded-full backdrop-blur-sm">
                      {item.type === 'video' ? <Video className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-slate-800 line-clamp-2 group-hover:text-[#1A237E] transition-colors">
                      {item.title || "External Link"}
                    </h4>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />
                      {(() => {
                        try {
                          return item.url ? new URL(item.url).hostname : "link.com";
                        } catch (e) {
                          return "link.com";
                        }
                      })()}
                    </p>
                  </div>
                </a>
              ))}
            </div>

          </article>

          {/* RIGHT COLUMN: Interaction Sidebar (4 Columns) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24">
              
              {/* Cheer Card (Log Level) */}
              <div className={cn(
                "bg-white rounded-2xl border border-slate-200 shadow-lg shadow-blue-900/5 p-6 text-center transition-all",
                isArchived && "opacity-60 grayscale"
              )}>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Like this Log?</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Great analysis by {data.owner?.name || "the author"}!<br/>Give it a heart.
                </p>

                <motion.button
                  whileHover={!isArchived ? { scale: 1.05 } : {}}
                  whileTap={!isArchived ? { scale: 0.95 } : {}}
                  onClick={() => !isArchived && handleLike()}
                  disabled={isArchived}
                  className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all shadow-xl",
                    isLiked 
                      ? "bg-gradient-to-br from-pink-500 to-rose-600 shadow-pink-500/30" 
                      : "bg-slate-100 hover:bg-pink-50 text-slate-400 hover:text-pink-500",
                    isArchived && "cursor-not-allowed opacity-50"
                  )}
                >
                  <Heart 
                    className={cn(
                      "w-10 h-10 transition-colors",
                      isLiked ? "fill-white text-white" : "fill-transparent"
                    )} 
                    strokeWidth={2.5}
                  />
                </motion.button>

                <div className="mb-4">
                  <span className="text-3xl font-black text-slate-800">
                    {(likeCount || 0).toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-slate-500 ml-1">Likes</span>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 py-2 px-3 rounded-lg border border-amber-100">
                  <AlertCircle className="w-4 h-4" />
                  Only 1 like per user
                </div>
              </div>

            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
