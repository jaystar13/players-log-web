import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Search, 
  Heart, 
  Edit3, 
  Calendar, 
  MapPin, 
  User, 
  Shield, 
  ArrowRight,
  Filter,
  Trophy,
  MoreVertical,
  LogOut,
  Loader2,
  Instagram,
  Youtube,
  Twitter,
  AtSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { api, supabase } from '@/shared/api';
import EditProfileScreen from './EditProfileScreen';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MyPageScreenProps {
  onBack: () => void;
  onNavigateToDetail: (id: number) => void;
}

export default function MyPageScreen({ onBack, onNavigateToDetail }: MyPageScreenProps) {
  const [activeTab, setActiveTab] = useState<'created' | 'liked'>('created');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [createdLogs, setCreatedLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Profile State
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Fetch Logs & Profile
  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Logs
      const logsData = await api.getLogs();
      if (logsData) {
        setCreatedLogs(logsData);
      }

      // 2. Fetch User Profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        setUserProfile({
          name: meta.nickname || meta.full_name || meta.name || "User",
          username: user.email?.split('@')[0] ? `@${user.email.split('@')[0]}` : "@username",
          role: meta.bio || "Winter Sports Enthusiast",
          avatar: meta.avatar_url || meta.picture || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200",
          socials: meta.socials || {},
          stats: {
            created: logsData ? logsData.length : 0, // Simplified count for now
            liked: 0,
            cheers: 0
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Simple reload to reset app state/redirect to login
  };

  // Filter Logic
  const getFilteredLogs = () => {
    const sourceData = createdLogs; 
    
    return sourceData.filter((log: any) => {
      // Search Text Filter
      const matchesSearch = 
        (log.title && log.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.teams && log.teams.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.sport && log.sport.toLowerCase().includes(searchQuery.toLowerCase()));

      // Sport Category Filter
      const matchesSport = selectedSport ? log.sport === selectedSport : true;

      return matchesSearch && matchesSport;
    });
  };

  const filteredLogs = getFilteredLogs();
  const allSports = Array.from(new Set(createdLogs.map((l: any) => l.sport))).filter(Boolean);

  if (showEditProfile) {
    return (
      <EditProfileScreen 
        onBack={() => setShowEditProfile(false)}
        onSaveComplete={() => {
          setShowEditProfile(false);
          fetchData(); // Refresh profile data
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
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
            <h1 className="text-xl font-bold text-slate-800">My Archives</h1>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT SIDEBAR: Navigation & Profile (3 Columns) */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center relative overflow-hidden">
              <div className="relative inline-block mb-4">
                <img 
                  src={userProfile?.avatar} 
                  alt={userProfile?.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#E1F5FE] bg-slate-100"
                />
                <button 
                  onClick={() => setShowEditProfile(true)}
                  className="absolute bottom-0 right-0 p-1.5 bg-[#1A237E] text-white rounded-full hover:bg-blue-900 transition-colors shadow-md"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 truncate px-2">{userProfile?.name || "Loading..."}</h2>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2 px-2">{userProfile?.role}</p>

              {/* Social Media Icons - Small & Subtle */}
              {userProfile?.socials && Object.values(userProfile.socials).some(Boolean) && (
                <div className="flex justify-center gap-3 mb-5">
                  {userProfile.socials.instagram && (
                    <a href={userProfile.socials.instagram.startsWith('http') ? userProfile.socials.instagram : `https://instagram.com/${userProfile.socials.instagram}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {userProfile.socials.youtube && (
                    <a href={userProfile.socials.youtube.startsWith('http') ? userProfile.socials.youtube : `https://youtube.com/${userProfile.socials.youtube}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-600 transition-colors">
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {userProfile.socials.threads && (
                    <a href={userProfile.socials.threads.startsWith('http') ? userProfile.socials.threads : `https://threads.net/${userProfile.socials.threads}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
                      <AtSign className="w-4 h-4" />
                    </a>
                  )}
                  {userProfile.socials.twitter && (
                    <a href={userProfile.socials.twitter.startsWith('http') ? userProfile.socials.twitter : `https://twitter.com/${userProfile.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
              
              <div className="flex justify-center gap-6 border-t border-slate-100 pt-4">
                <div className="text-center">
                  <div className="text-lg font-black text-[#1A237E]">{userProfile?.stats?.created || 0}</div>
                  <div className="text-xs text-slate-400 font-medium uppercase">Logs</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-rose-500">{userProfile?.stats?.cheers || 0}</div>
                  <div className="text-xs text-slate-400 font-medium uppercase">Cheers</div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveTab('created')}
                className={cn(
                  "w-full flex items-center justify-between p-4 transition-all border-b border-slate-50",
                  activeTab === 'created' 
                    ? "bg-[#E1F5FE] text-[#1A237E] font-bold" 
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Edit3 className="w-5 h-5" />
                  <span>My Created Logs</span>
                </div>
                {activeTab === 'created' && <div className="w-1.5 h-1.5 rounded-full bg-[#1A237E]" />}
              </button>
              
              <button
                onClick={() => setActiveTab('liked')}
                className={cn(
                  "w-full flex items-center justify-between p-4 transition-all",
                  activeTab === 'liked' 
                    ? "bg-[#E1F5FE] text-[#1A237E] font-bold" 
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5" />
                  <span>Liked Logs</span>
                </div>
                {activeTab === 'liked' && <div className="w-1.5 h-1.5 rounded-full bg-[#1A237E]" />}
              </button>
            </nav>

          </aside>

          {/* MAIN CONTENT: List Area (9 Columns) */}
          <section className="lg:col-span-9 space-y-6">
            
            {/* Search & Filter Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by title, player, or sport..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1A237E] outline-none text-slate-700"
                />
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <Filter className="w-4 h-4 text-slate-400 mr-1 flex-shrink-0" />
                <button 
                  onClick={() => setSelectedSport(null)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border",
                    selectedSport === null
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  )}
                >
                  All Sports
                </button>
                {allSports.map(sport => (
                  <button 
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border",
                      selectedSport === sport
                        ? "bg-[#1A237E] text-white border-[#1A237E]"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>

            {/* List Header */}
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-slate-800">
                {activeTab === 'created' ? "My Created Logs" : "Liked Logs"}
                <span className="ml-2 text-sm font-normal text-slate-400">({filteredLogs.length})</span>
              </h2>
            </div>

            {/* Logs List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1A237E]" />
                  </div>
                ) : filteredLogs.length > 0 ? (
                  filteredLogs.map((log: any) => (
                    <motion.div
                      key={log.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => onNavigateToDetail(log.id)}
                      className="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-[#1A237E] transition-all cursor-pointer relative overflow-hidden"
                    >
                      {/* Hover Decoration */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1A237E] scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded bg-[#E1F5FE] text-[#1A237E] text-[10px] font-bold uppercase tracking-wider">
                              {log.sport}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {log.date}
                            </span>
                            {/* Status mock for demo since DB doesn't have it yet */}
                            {activeTab === 'created' && (
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                "bg-emerald-50 text-emerald-600"
                              )}>
                                Published
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-bold text-slate-800 truncate group-hover:text-[#1A237E] transition-colors">
                            {log.title}
                          </h3>
                          
                          <div className="flex items-center gap-4 mt-3">
                            {/* Display teams if available */}
                            {log.teams && (
                              <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium bg-rose-50 px-2 py-1 rounded-md">
                                <Heart className="w-3 h-3 fill-rose-500" />
                                Match: {log.teams}
                              </div>
                            )}
                            {activeTab === 'liked' && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <User className="w-3 h-3" />
                                by {log.owner?.name || "Unknown"}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 pl-0 sm:pl-4">
                           {activeTab === 'created' && (
                             <div className="text-center sm:text-right">
                               <div className="text-sm font-bold text-slate-700">{log.likes || 0}</div>
                               <div className="text-[10px] text-slate-400 uppercase">Likes</div>
                             </div>
                           )}
                           <button className="p-2 text-slate-300 hover:text-[#1A237E] rounded-full hover:bg-slate-50 transition-colors">
                             <ArrowRight className="w-5 h-5" />
                           </button>
                        </div>
                      </div>
                    </motion.div>
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

        </div>
      </main>
    </div>
  );
}
