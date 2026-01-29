import { api } from '@/shared/api';
import { Goll } from '@/entities/goll/model/types'; // Assuming Log type is consistent

interface GollFormData {
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

export const createGoll = async (data: GollFormData): Promise<Goll> => {
  // api.createLog likely expects a structure similar to Log,
  // but we'll strip out any derived/UI-only fields if necessary
  const gollToCreate = {
    ...data,
    // Ensure `id` is not sent for creation
    id: undefined, 
    // Additional fields that might be handled by backend
  };
  const createdGoll = await api.createGoll(gollToCreate);
  return createdGoll;
};

export const updateGoll = async (id: number, data: GollFormData): Promise<Goll> => {
  const gollToUpdate = {
    ...data,
    id: id, // Ensure ID is present for update
  };
  const updatedGoll = await api.updateGoll(id, gollToUpdate);
  return updatedGoll;
};

export const fetchExistingGolls = async (): Promise<Goll[]> => {
  try {
    const golls = await api.getGolls();
    if (Array.isArray(golls)) {
      return golls;
    }
    // Fallback Mock, consider removing this in production
    return [
      { 
        id: 101, 
        title: "Men's 1000m Qualifier", 
        sport: "Short Track",
        // author: "Official_KR", 
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
        // author: "Official_KR", 
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
