import { useState, useEffect, useMemo } from 'react';
import { Goll } from '@/entities/goll/model/types';
import { InitialGollFormData, SPORTS_CATEGORIES, ParticipantInput } from '../model/types'; // Import ParticipantInput
import { fetchExistingGolls } from '../api';

export const useCreateGollForm = (initialData?: InitialGollFormData) => {
  const isEditMode = !!initialData;

  const getInitialDate = (isoString?: string) => isoString ? isoString.split('T')[0] : "";
  const getInitialTime = (isoString?: string) => isoString ? isoString.split('T')[1]?.substring(0, 5) || "" : "";

  // -- State Initialization --
  const [title, setTitle] = useState(initialData?.title || "");
  const [sport, setSport] = useState(initialData?.sport || SPORTS_CATEGORIES[0]);
  const [date, setDate] = useState(initialData?.date);
  const [time, setTime] = useState(initialData?.time);
  const [venue, setVenue] = useState(initialData?.venue || "");
  const [description, setDescription] = useState(initialData?.description || "");
  
  // Multiple Links State
  const [previewLinks, setPreviewLinks] = useState<string[]>(initialData?.previewLinks || []);
  const [newLink, setNewLink] = useState("");

  // Match Participants State
  const [matchType, setMatchType] = useState<'vs' | 'multi'>(initialData?.matchType || 'vs');
  const [participantUnit, setParticipantUnit] = useState<'individual' | 'team'>(initialData?.participantUnit || 'individual');
  
  // VS Mode Participants
  const [competitorA, setCompetitorA] = useState(initialData?.matchType === 'vs' && initialData.participants?.[0]?.name || "");
  const [competitorB, setCompetitorB] = useState(initialData?.matchType === 'vs' && initialData.participants?.[1]?.name || "");
  
  // Multi Mode / List Participants
  const [participants, setParticipants] = useState<ParticipantInput[]>(
    initialData?.matchType === 'multi' && initialData.participants
      ? initialData.participants.map(p => ({...p, votes: p.votes || 0, displayOrder: p.displayOrder || 0})) // Ensure displayOrder is present
      : []
  );
  const [newParticipant, setNewParticipant] = useState("");

  const [existingAllGolls, setExistingAllGolls] = useState<Goll[]>([]); // Renamed to avoid confusion with similarLogs
  const [similarGolls, setSimilarGolls] = useState<Goll[]>([]);
  
  // Preview Mode State
  const [showPreview, setShowPreview] = useState(false);

  // -- Effect: Fetch Existing Logs for Duplicate Detection --
  useEffect(() => {
    const loadExistingGolls = async () => {
      const golls = await fetchExistingGolls();
      setExistingAllGolls(golls);
    };
    loadExistingGolls();
  }, []);

  // -- Effect: Load Initial Data (Deep Check) --
  useEffect(() => {
    if (initialData) {
      // Basic fields
      setTitle(initialData.title || "");
      setSport(initialData.sport || SPORTS_CATEGORIES[0]);
      setDate(initialData.date);
      setTime(initialData.time);
      setVenue(initialData.venue || "");
      setDescription(initialData.description || "");
      setMatchType(initialData.matchType || 'vs');
      setParticipantUnit(initialData.participantUnit || 'individual');

      // Load Links
      if (initialData.media && Array.isArray(initialData.media)) {
        setPreviewLinks(initialData.media.map((m: any) => m.url));
      } else if (initialData.previewLinks) {
        setPreviewLinks(initialData.previewLinks);
      }

      // Load Participants (already handled in useState init)
    }
  }, [initialData]);

  // Helper to get the display string for participants
  const getTeamsString = useMemo(() => {
    if (matchType === 'multi') {
      return participants.length > 0 ? participants.map(p => p.name).join(", ") : "Multi-entry event";
    }
    return `${competitorA} vs ${competitorB}`;
  }, [matchType, participants, competitorA, competitorB]);

  // Helper to format data for Preview Detail Screen
  const getPreviewData = useMemo(() => {
    let formattedParticipants: ParticipantInput[] = [];
    
    if (matchType === 'vs') {
      formattedParticipants = [
        { id: 'p0', name: competitorA || 'Player A', type: participantUnit, votes: 0, displayOrder: 0 },
        { id: 'p1', name: competitorB || 'Player B', type: participantUnit, votes: 0, displayOrder: 1 }
      ];
    } else {
      formattedParticipants = participants.map((p) => ({
        ...p,
        id: p.id || `p${p.displayOrder}`, // Ensure ID for React key
        votes: p.votes || 0 // Ensure votes default
      }));
    }

    const formattedMedia = previewLinks.map((link, idx) => ({
      type: link.includes('youtube') || link.includes('youtu.be') ? 'video' : 'article',
      title: `Attached Link ${idx + 1}`,
      url: link,
      thumbnail: link.includes('youtube') || link.includes('youtu.be') 
        ? "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400&h=225"
        : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400&h=225"
    }));

    return {
      sport,
      title: title || "Untitled Log",
      matchDate: `${date}T${time || '00:00'}:00`, // Combine date and time
      venue,
      matchType,
      participants: formattedParticipants,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      owner: {
        name: "You (Preview)",
        role: "Log Creator",
        description: "This is a preview of your bio.",
        profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100"
      },
      description: description,
      media: formattedMedia,
      stats: { likes: initialData?.stats?.likes || 0, views: initialData?.stats?.views || 0 }
    };
  }, [sport, title, date, time, venue, matchType, participantUnit, competitorA, competitorB, participants, previewLinks, initialData, description]);

  // Smart detection logic for similar logs
  useEffect(() => {
    // Skip if we don't have minimum info
    if (!sport || (!date && title.length < 2)) {
      setSimilarGolls([]);
      return;
    }

    const matches = existingAllGolls.filter(goll => {
      // Don't match with self if editing
      if (initialData && goll.id === initialData.id) return false;

      const sportMatch = goll.sport === sport;
      const dateMatch = date ? goll.matchDate === date : false;
      const titleMatch = title.length > 2 && goll.title?.toLowerCase().includes(title.toLowerCase());
      
      // Match if: Same Sport AND (Same Date OR Similar Title)
      return sportMatch && (dateMatch || titleMatch);
    });
    setSimilarGolls(matches);
  }, [sport, date, title, existingAllGolls, initialData]);

  const handleAddParticipant = () => {
    if (newParticipant.trim()) {
      const newOrder = participants.length;
      setParticipants(prev => [...prev, { name: newParticipant.trim(), type: participantUnit, votes: 0, displayOrder: newOrder }]);
      setNewParticipant("");
    }
  };

  const removeParticipant = (indexToRemove: number) => {
    setParticipants(prevParticipants => 
      prevParticipants
        .filter((_, i) => i !== indexToRemove)
        .map((p, idx) => ({ ...p, displayOrder: idx })) // Re-index displayOrder after removal
    );
  };

  const handleAddLink = () => {
    if (newLink.trim()) {
      setPreviewLinks([...previewLinks, newLink.trim()]);
      setNewLink("");
    }
  };

  const removeLink = (index: number) => {
    setPreviewLinks(previewLinks.filter((_, i) => i !== index));
  };

  const handleKeyDownParticipant = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddParticipant();
    }
  };

  const handleKeyDownLink = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLink();
    }
  };

  const getFormDataForSubmit = () => {
    // Construct structured participants data
    let formattedParticipants: ParticipantInput[] = [];
    if (matchType === 'vs') {
      formattedParticipants = [
        { name: competitorA || '', type: participantUnit, votes: 0, displayOrder: 0 },
        { name: competitorB || '', type: participantUnit, votes: 0, displayOrder: 1 }
      ];
    } else {
      formattedParticipants = participants; // Already ParticipantInput[] with displayOrder
    }

    return {
      // Preserve ID if editing
      ...(initialData?.id ? { id: initialData.id } : {}),
      title,
      sport,
      date,
      time,
      venue,
      // teams: getTeamsString, // No longer needed for backend
      matchType,
      participantUnit,
      previewLinks,
      description,
      participants: formattedParticipants,
      // Preserve other fields
      createdAt: initialData?.createdAt,
      owner: initialData?.owner,
      stats: initialData?.stats,
      isArchived: initialData?.isArchived
    };
  };

  return {
    isEditMode,
    title, setTitle,
    sport, setSport,
    date, setDate,
    time, setTime,
    venue, setVenue,
    description, setDescription,
    previewLinks, setPreviewLinks,
    newLink, setNewLink,
    matchType, setMatchType,
    participantUnit, setParticipantUnit,
    competitorA, setCompetitorA,
    competitorB, setCompetitorB,
    participants, setParticipants,
    newParticipant, setNewParticipant,
    similarGolls: similarGolls,
    showPreview, setShowPreview,
    getTeamsString,
    getPreviewData,
    handleAddParticipant,
    removeParticipant,
    handleAddLink,
    removeLink,
    handleKeyDownParticipant,
    handleKeyDownLink,
    getFormDataForSubmit,
    SPORTS_CATEGORIES // Expose categories for the UI
  };
};
