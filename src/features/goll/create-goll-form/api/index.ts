import { api } from '@/shared/api';
import { Log } from '@/entities/goll/model/types'; // Assuming Log type is consistent

interface LogFormData {
  id?: number;
  title: string;
  sport: string;
  date: string;
  time: string;
  venue: string;
  teams: string; // Derived from participants
  matchType: 'vs' | 'multi';
  participantUnit: 'individual' | 'team';
  previewLinks: string[];
  description: string;
  participants: Array<{ id?: string; name: string; type: 'individual' | 'team'; votes: number }>;
  createdAt?: string;
  owner?: {
    name: string;
    avatar: string;
    role?: string;
  };
  stats?: {
    likes: number;
    views: number;
  };
  isArchived?: boolean;
}

export const createLog = async (data: LogFormData): Promise<Log> => {
  // api.createLog likely expects a structure similar to Log,
  // but we'll strip out any derived/UI-only fields if necessary
  const logToCreate = {
    ...data,
    // Ensure `id` is not sent for creation
    id: undefined, 
    // Additional fields that might be handled by backend
  };
  const createdLog = await api.createLog(logToCreate);
  return createdLog;
};

export const updateLog = async (id: number, data: LogFormData): Promise<Log> => {
  const logToUpdate = {
    ...data,
    id: id, // Ensure ID is present for update
  };
  const updatedLog = await api.updateLog(id, logToUpdate);
  return updatedLog;
};

export const fetchExistingLogs = async (): Promise<Log[]> => {
  try {
    const logs = await api.getLogs();
    if (Array.isArray(logs)) {
      return logs;
    }
    // Fallback Mock, consider removing this in production
    return [
      { 
        id: 101, 
        title: "Men's 1000m Qualifier", 
        sport: "Short Track",
        author: "Official_KR", 
        date: "2026-01-20", 
        venue: "Ice Arena A",
        teams: "Team A vs Team B",
        owner: { name: "Official_KR", avatar: ""},
        preview: "Mock preview",
        likes: 0,
        hasVideo: false,
        hasLink: false
      }
    ];
  } catch (error) {
    console.error("Failed to fetch logs for checking duplicates:", error);
    // Fallback Mock, consider removing this in production
    return [
      { 
        id: 101, 
        title: "Men's 1000m Qualifier", 
        sport: "Short Track",
        author: "Official_KR", 
        date: "2026-01-20", 
        venue: "Ice Arena A",
        teams: "Team A vs Team B",
        owner: { name: "Official_KR", avatar: ""},
        preview: "Mock preview",
        likes: 0,
        hasVideo: false,
        hasLink: false
      }
    ];
  }
};
