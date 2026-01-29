import React from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Info,
  Clock,
  User,
  Swords,
  Trophy,
  X,
  Plus,
  Shield,
  Eye,
  Trash2,
  CheckCircle2,
  Search,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/shared/ui/utils'; // Assuming cn utility
import GollDetailPage from '@/pages/goll-detail/ui';
import { useCreateGollForm } from '../../lib/use-create-goll-form';
import { InitialGollFormData } from '../../model/types';

interface CreateGollFormProps {
  initialData?: InitialGollFormData;
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export const CreateGollForm = ({ initialData, onSubmit, onBack }: CreateGollFormProps) => {
  const {
    isEditMode,
    title, setTitle,
    sport, setSport,
    date, setDate,
    time, setTime,
    venue, setVenue,
    description, setDescription,
    previewLinks, setNewLink, newLink, removeLink, handleAddLink, handleKeyDownLink,
    matchType, setMatchType,
    participantUnit, setParticipantUnit,
    competitorA, setCompetitorA,
    competitorB, setCompetitorB,
    participants, setNewParticipant, newParticipant, removeParticipant, handleAddParticipant, handleKeyDownParticipant,
    similarGolls: similarGolls,
    showPreview, setShowPreview,
    getPreviewData,
    getFormDataForSubmit,
    SPORTS_CATEGORIES
  } = useCreateGollForm(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(getFormDataForSubmit());
  };

  if (showPreview) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        <GollDetailPage 
          onBack={() => setShowPreview(false)} 
          previewData={getPreviewData}
        />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-7 space-y-8">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Log Identity */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#1A237E]" />
                Log Identity
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Sport Category</label>
                  <div className="relative">
                    <select 
                      value={sport}
                      onChange={(e) => setSport(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none cursor-pointer font-medium"
                    >
                      {SPORTS_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronLeft className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 -rotate-90 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Log Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Men's 1000m Final"
                    className="w-full text-lg px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Match Details */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#1A237E]" />
                Match Details
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg pl-10 pr-3 py-3 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg pl-10 pr-3 py-3 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Match Venue</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="e.g. Gangneung Ice Arena"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                    />
                  </div>
                </div>

                {/* Refined Participants Section */}
                <div className="pt-2 border-t border-slate-100 mt-2">
                  <label className="block text-sm font-bold text-slate-800 mb-4 mt-4">Participant Registration</label>
                  
                  <div className="space-y-4">
                    {/* Step 1: Match Type */}
                    <div className="grid grid-cols-2 gap-3">
                       <button
                         type="button"
                         onClick={() => setMatchType('vs')}
                         className={cn(
                           "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                           matchType === 'vs'
                             ? "border-[#1A237E] bg-[#E1F5FE] text-[#1A237E]"
                             : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                         )}
                       >
                         <Swords className="w-6 h-6 mb-2" />
                         <span className="text-sm font-bold">VS (Duel)</span>
                         <span className="text-[10px] opacity-70 mt-0.5">1 on 1 Match</span>
                       </button>
                       <button
                         type="button"
                         onClick={() => setMatchType('multi')}
                         className={cn(
                           "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                           matchType === 'multi'
                             ? "border-[#1A237E] bg-[#E1F5FE] text-[#1A237E]"
                             : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                         )}
                       >
                         <Trophy className="w-6 h-6 mb-2" />
                         <span className="text-sm font-bold">Multi-Entry</span>
                         <span className="text-[10px] opacity-70 mt-0.5">Ranked / Many Participants</span>
                       </button>
                    </div>

                    {/* Step 2: Participant Unit */}
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-xs font-bold text-slate-500 ml-2">Unit:</span>
                      <div className="flex gap-1 flex-1">
                        <button
                          type="button"
                          onClick={() => setParticipantUnit('individual')}
                          className={cn(
                            "flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
                            participantUnit === 'individual'
                              ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200"
                              : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          <User className="w-3 h-3" />
                          Individual
                        </button>
                        <button
                          type="button"
                          onClick={() => setParticipantUnit('team')}
                          className={cn(
                            "flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
                            participantUnit === 'team'
                              ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200"
                              : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          <Shield className="w-3 h-3" />
                          Team
                        </button>
                      </div>
                    </div>

                    {/* Step 3: Dynamic Inputs */}
                    <div className="bg-white p-1 rounded-xl">
                      {matchType === 'multi' ? (
                        <div className="space-y-3">
                           <div className="flex gap-2">
                            <div className="relative flex-1">
                              {participantUnit === 'individual' ? <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /> : <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
                              <input 
                                type="text"
                                value={newParticipant}
                                onChange={(e) => setNewParticipant(e.target.value)}
                                onKeyDown={handleKeyDownParticipant}
                                placeholder={participantUnit === 'individual' ? "Add player name..." : "Add team name..."}
                                className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleAddParticipant}
                              className="px-4 py-2 bg-[#1A237E] hover:bg-[#151b60] text-white rounded-lg transition-colors shadow-md shadow-blue-900/10"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                           </div>
                           
                           {/* Participants List */}
                           <div className="flex flex-wrap gap-2 min-h-[40px] bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
                              {participants.length > 0 ? participants.map((p, idx) => (
                                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-sm">
                                  {participantUnit === 'individual' ? <User className="w-3 h-3 mr-1.5 text-slate-400" /> : <Shield className="w-3 h-3 mr-1.5 text-slate-400" />}
                                  {p}
                                  <button onClick={() => removeParticipant(idx)} className="ml-2 text-slate-300 hover:text-red-500 transition-colors">
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              )) : (
                                <div className="w-full flex items-center justify-center text-slate-400 text-xs italic py-2">
                                  No participants added yet
                                </div>
                              )}
                           </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1">
                              {participantUnit === 'individual' ? "Player A" : "Home Team"}
                            </label>
                            <div className="relative">
                              {participantUnit === 'individual' ? <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /> : <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
                              <input 
                                type="text"
                                value={competitorA}
                                onChange={(e) => setCompetitorA(e.target.value)}
                                placeholder={participantUnit === 'individual' ? "Name" : "Team Name"}
                                className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                              />
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center pt-5">
                            <span className="text-xs font-black text-slate-400 italic">VS</span>
                          </div>

                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1">
                              {participantUnit === 'individual' ? "Player B" : "Away Team"}
                            </label>
                            <div className="relative">
                              {participantUnit === 'individual' ? <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /> : <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
                              <input 
                                type="text"
                                value={competitorB}
                                onChange={(e) => setCompetitorB(e.target.value)}
                                placeholder={participantUnit === 'individual' ? "Name" : "Team Name"}
                                className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            </section>

            {/* Section 3: Preview */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[#1A237E]" />
                Preview & Media
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Owner's Personal Opinion</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write your preview, key points to watch, or cheering message..."
                    className="w-full h-40 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg p-4 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Multiple News/Video URLs Section */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">News or Video URLs (Multiple)</label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="url"
                          value={newLink}
                          onChange={(e) => setNewLink(e.target.value)}
                          onKeyDown={handleKeyDownLink}
                          placeholder="https://..."
                          className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddLink}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Links List */}
                    {previewLinks.length > 0 && (
                      <div className="space-y-2">
                        {previewLinks.map((link, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <LinkIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1A237E] hover:underline truncate">
                                {link}
                              </a>
                            </div>
                            <button onClick={() => removeLink(idx)} className="text-slate-400 hover:text-red-500 ml-2">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4">
              {/* Preview Button */}
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#1A237E] text-[#1A237E] font-bold hover:bg-[#E1F5FE] transition-colors"
              >
                <Eye className="w-5 h-5" />
                Preview Log
              </button>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={onBack}
                  className="px-6 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#1A237E] hover:bg-[#151b60] text-white font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                >
                  {isEditMode ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Register Log
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
          
        {/* RIGHT COLUMN: Smart Similarity Sidebar */}
        <aside className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-[#F8FAFC] border-b border-slate-100 p-4">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#1A237E]" />
                  Are you looking for these logs?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  We found similar existing logs based on your input.
                </p>
              </div>

              <div className="p-4 bg-slate-50/50 min-h-[300px]">
                <AnimatePresence mode="popLayout">
                  {similarGolls.length > 0 ? (
                    <div className="space-y-3">
                      {similarGolls.map(goll => (
                        <motion.div 
                          key={goll.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-[#1A237E] hover:shadow-md transition-all group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-[#1A237E] bg-[#E1F5FE] px-2 py-0.5 rounded">
                              {goll.sport}
                            </span>
                            <span className="text-xs text-slate-400">{goll.date}</span>
                          </div>
                          
                          <h4 className="font-bold text-slate-800 text-sm mb-1">{goll.title}</h4>
                          
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                            <User className="w-3 h-3" />
                            <span>{goll.owner?.name || "Unknown"}</span>
                            <span className="mx-1">•</span>
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">{goll.venue}</span>
                          </div>

                          <button className="w-full py-2 bg-slate-100 hover:bg-[#1A237E] hover:text-white text-slate-600 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                            Join this log instead
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full py-12 text-center px-4"
                    >
                      <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                      <h4 className="font-bold text-slate-700 text-sm mb-1">No similar logs yet</h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                        You are the first to record this match! Go ahead and publish your log.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </aside>

      </div>
    </main>
  );
};