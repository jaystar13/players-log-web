import apiClient from './client';
import { Goll } from '@/entities/goll/model/types';
import { GollFormData } from '@/features/goll/create-goll-form/model/types';


// --- API Abstraction Layer ---

export const api = {
  getGolls: async (): Promise<Goll[]> => {
    const response = await apiClient.get<Goll[]>('/golls');
    return response.data;
  },
  
  createGoll: async (gollData: GollFormData): Promise<Goll> => {
    const response = await apiClient.post<Goll>('/golls', gollData);
    return response.data;
  },

  updateGoll: async (id: string | number, gollData: GollFormData): Promise<Goll> => {
    const response = await apiClient.put<Goll>(`/golls/${id}`, gollData);
    return response.data;
  },

  likeGoll: async (id: string | number): Promise<{likes: number}> => {
    const response = await apiClient.post<{likes: number}>(`/golls/${id}/like`);
    return response.data;
  },
  
  signup: async (userData: any) => {
    // This function will now make a real API call.
    const response = await apiClient.post('/auth/signup', userData); // Assuming '/auth/signup' is the correct endpoint
    return response.data;
  }
};