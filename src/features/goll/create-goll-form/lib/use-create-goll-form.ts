import { useState, useEffect, useMemo } from 'react';
import { Log } from '@/entities/goll/model/types';
import { InitialLogFormData, SPORTS_CATEGORIES, MOCK_LOGS } from '../model/types';
import { fetchExistingLogs } from '../api';

export const useCreateLogForm = (initialData?: InitialLogFormData) => {
  const isEditMode = !!initialData;

  // -- State Initialization --
  const [title, setTitle] = useState(initialData?.title || "");
  const [sport, setSport] = useState(initialData?.sport || SPORTS_CATEGORIES[0]);
  const [date, setDate] = useState(initialData?.date || "");
  const [time, setTime] = useState(initialData?.time || "");
  const [venue, setVenue] = useState(initialData?.venue || "");
  const [description, setDescription] = useState(initialData?.description || "");
  
  // Multiple Links State
  const [previewLinks, setPreviewLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");

  // Match Participants State
  const [matchType, setMatchType] = useState<'vs' | 'multi'>(initialData?.matchType || 'vs');
  const [participantUnit, setParticipantUnit] = useState<'individual' | 'team'>(initialData?.participantUnit || 'individual');
  
  // VS Mode Participants
  const [competitorA, setCompetitorA] = useState("");
  const [competitorB, setCompetitorB] = useState("");
  
  // Multi Mode / List Participants
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");

  const [existingAllLogs, setExistingAllLogs] = useState<Log[]>([]); // Renamed to avoid confusion with similarLogs
  const [similarLogs, setSimilarLogs] = useState<Log[]>([]);
  
  // Preview Mode State
  const [showPreview, setShowPreview] = useState(false);

  // -- Effect: Fetch Existing Logs for Duplicate Detection --
  useEffect(() => {
    const loadExistingLogs = async () => {
      const logs = await fetchExistingLogs();
      setExistingAllLogs(logs);
    };
    loadExistingLogs();
  }, []);

  // -- Effect: Load Initial Data (Deep Check) --
  useEffect(() => {
    if (initialData) {
      // Basic fields
      setTitle(initialData.title || "");
      setSport(initialData.sport || SPORTS_CATEGORIES[0]);
      setDate(initialData.date || "");
      setTime(initialData.time || "");
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

      // Load Participants
      if (initialData.participants && Array.isArray(initialData.participants)) {
        if (initialData.matchType === 'vs' && initialData.participants.length >= 2) {
          setCompetitorA(initialData.participants[0].name);
          setCompetitorB(initialData.participants[1].name);
        } else {
          setParticipants(initialData.participants.map((p: any) => p.name));
        }
      }
    }
  }, [initialData]);

  // Helper to get the display string for participants
  const getTeamsString = useMemo(() => {
    if (matchType === 'multi') {
      return participants.length > 0 ? participants.join(", ") : "Multi-entry event";
    }
    return `${competitorA} vs ${competitorB}`;
  }, [matchType, participants, competitorA, competitorB]);

  // Helper to format data for Preview Detail Screen
  const getPreviewData = useMemo(() => {
    let formattedParticipants = [];
    
    if (matchType === 'vs') {
      formattedParticipants = [
        { id: 'p1', name: competitorA || 'Player A', type: participantUnit, votes: 0 },
        { id: 'p2', name: competitorB || 'Player B', type: participantUnit, votes: 0 }
      ];
    } else {
      formattedParticipants = participants.map((p, idx) => ({
        id: `p${idx}`,
        name: p,
        type: participantUnit,
        votes: 0
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
      date,
      time,
      venue,
      matchType,
      participants: formattedParticipants,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      owner: {
        name: "You (Preview)",
        role: "Log Creator",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100"
      },
      description: description, // Changed from content to description
      media: formattedMedia,
      stats: { likes: initialData?.stats?.likes || 0, views: initialData?.stats?.views || 0 }
    };
  }, [sport, title, date, time, venue, matchType, participantUnit, competitorA, competitorB, participants, previewLinks, initialData, description]);

  // Smart detection logic for similar logs
  useEffect(() => {
    // Skip if we don't have minimum info
    if (!sport || (!date && title.length < 2)) {
      setSimilarLogs([]);
      return;
    }

    const matches = existingAllLogs.filter(log => {
      // Don't match with self if editing
      if (initialData && log.id === initialData.id) return false;

      const sportMatch = log.sport === sport;
      const dateMatch = date ? log.date === date : false;
      const titleMatch = title.length > 2 && log.title?.toLowerCase().includes(title.toLowerCase());
      
      // Match if: Same Sport AND (Same Date OR Similar Title)
      return sportMatch && (dateMatch || titleMatch);
    });
    setSimilarLogs(matches);
  }, [sport, date, title, existingAllLogs, initialData]);

  const handleAddParticipant = () => {
    if (newParticipant.trim()) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant("");
    }
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
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
    let formattedParticipants = [];
    if (matchType === 'vs') {
      formattedParticipants = [
        { id: 'p1', name: competitorA || 'Player A', type: participantUnit, votes: 0 },
        { id: 'p2', name: competitorB || 'Player B', type: participantUnit, votes: 0 }
      ];
    } else {
      formattedParticipants = participants.map((p, idx) => ({
        id: `p${idx}`,
        name: p,
        type: participantUnit,
        votes: 0
      }));
    }

    return {
      // Preserve ID if editing
      ...(initialData?.id ? { id: initialData.id } : {}),
      title,
      sport,
      date,
      time,
      venue,
      teams: getTeamsString, // Use the memoized value
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
    similarLogs,
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
