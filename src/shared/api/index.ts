import apiClient from './client';
import { Goll } from '@/entities/goll/model/types';
import { GollFormData } from '@/features/goll/create-goll-form/model/types';
import { UserProfile } from '@/entities/user/model/types';

// Represents the Page object returned by Spring Data JPA
export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

type UpdateProfilePayload = {
  nickname: string;
  bio: string;
  socials: {
    instagram: string;
    youtube: string;
    threads: string;
    twitter: string;
  };
};

interface VoteResponse {
  votedParticipantId: number | null;
  voteCounts: Record<string, number>;
}

// --- API Abstraction Layer ---
export const api = {
  getGolls: async (page = 0, size = 20): Promise<Page<Goll>> => {
    const response = await apiClient.get<Page<Goll>>('/golls', {
      params: { page, size, sort: 'createdAt,desc' }
    });
    return response.data;
  },

  getGollById: async (gollId: number | string): Promise<Goll> => {
    const response = await apiClient.get<Goll>(`/golls/${gollId}`);
    return response.data;
  },
  
  createGoll: async (gollData: Partial<GollFormData> & { matchDate?: string }): Promise<Goll> => {
    // Ensure date and time are available, parsing from matchDate if necessary
    const date = gollData.date || (gollData.matchDate ? gollData.matchDate.split('T')[0] : '');
    const time = gollData.time || (gollData.matchDate ? gollData.matchDate.split('T')[1]?.substring(0, 5) || '' : '');

    const requestData = {
      title: gollData.title,
      sport: gollData.sport,
      date: date,
      time: time,
      venue: gollData.venue,
      description: gollData.description,
      matchType: gollData.matchType,
      participantUnit: gollData.participantUnit,
      participants: gollData.participants?.map(p => ({ name: p.name, type: p.type, displayOrder: p.displayOrder })) || [],
      previewLinks: gollData.previewLinks || []
    };
    const response = await apiClient.post<Goll>('/golls', requestData);
    return response.data;
  },

  updateGoll: async (id: string | number, gollData: GollFormData): Promise<Goll> => {
    const response = await apiClient.put<Goll>(`/golls/${id}`, gollData);
    return response.data;
  },

  likeGoll: async (id: string | number): Promise<{likes: number; liked: boolean;}> => {
    const response = await apiClient.post<{likes: number; liked: boolean;}>(`/golls/${id}/like`);
    return response.data;
  },
  
  signup: async (userData: any) => {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  },

  getCurrentUserProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/users/me');
    return response.data;
  },

  updateCurrentUserProfile: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    const requestData = {
      name: payload.nickname,
      description: payload.bio,
      socialLinks: {
        instagram: payload.socials.instagram,
        youtube: payload.socials.youtube,
        threads: payload.socials.threads,
        x: payload.socials.twitter,
      }
    };
    const response = await apiClient.put<UserProfile>('/users/me', requestData);
    return response.data;
  },

  voteForParticipant: async (gollId: number | string, participantId: number | string): Promise<VoteResponse> => {
    const response = await apiClient.post<VoteResponse>(`/golls/${gollId}/participants/${participantId}/vote`);
    return response.data;
  },
};