import apiClient from './client';
import MockAdapter from 'axios-mock-adapter';
import { Goll } from '@/entities/goll/model/types';
import { GollFormData } from '@/features/goll/create-goll-form/model/types';

// --- MOCK SETUP ---
const mock = new MockAdapter(apiClient, { delayResponse: 500 });

const MOCK_USER_1 = {
  name: "Ji-sung Kim",
  avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100",
  role: "Pro Analyst"
};

const MOCK_USER_2 = {
  name: "Arena Enthusiast",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100",
  role: "Fan"
};

let MOCK_GOLLS: Goll[] = [
    // ... (Your existing mock goll data)
];

// Mock API endpoints
mock.onGet('/golls').reply(200, MOCK_GOLLS);

mock.onPost('/golls').reply((config) => {
  const gollData = JSON.parse(config.data) as GollFormData;
  const newId = Math.max(0, ...MOCK_GOLLS.map(g => g.id)) + 1;
  const newGoll: Goll = {
      ...gollData,
      id: newId,
      owner: MOCK_USER_1,
      stats: { likes: 0, views: 0 },
      likes: 0,
      createdAt: new Date().toISOString(),
      isArchived: false,
      preview: gollData.description?.substring(0, 100) || "No preview",
      media: (gollData.previewLinks || []).map((link, idx) => ({
          type: link.includes('youtube') ? 'video' : 'article',
          title: `Linked Resource ${idx + 1}`,
          url: link,
          thumbnail: ''
      })),
      hasLink: (gollData.previewLinks || []).length > 0,
      hasVideo: (gollData.previewLinks || []).some(link => link.includes('youtube')),
  };
  MOCK_GOLLS.unshift(newGoll);
  return [201, newGoll];
});

// Mock for Auth endpoints
mock.onPost('/auth/google-login').reply(200, {
  accessToken: `mock-jwt-token-initial.${btoa(JSON.stringify({ user: 'mock-user', iat: Date.now() }))}`
});

mock.onPost('/auth/refresh').reply(() => {
    console.log("Mock API: /auth/refresh called");
    const newAccessToken = `mock-jwt-token-refreshed.${btoa(JSON.stringify({ user: 'mock-user', iat: Date.now() }))}`;
    return [200, { accessToken: newAccessToken }];
});

mock.onPost('/auth/logout').reply(() => {
    console.log("Mock API: /auth/logout called");
    return [200, { message: 'Logged out successfully' }];
});

mock.onGet('/auth/me').reply((config) => {
    console.log("Mock API: /auth/me called");
    if (config.headers?.Authorization) {
        // In a real app, the backend would validate the token.
        // Here, we just check for its presence.
        const user = {
            id: 'mock-user-id-from-me-endpoint',
            name: 'Mock User',
            email: 'mock@example.com',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200'
        };
        const newAccessToken = `mock-jwt-token-from-startup-check.${btoa(JSON.stringify({ user: 'mock-user', iat: Date.now() }))}`;
        return [200, { user, accessToken: newAccessToken }];
    }
    return [401, { message: 'Not authenticated' }];
});

mock.onPut(/\/auth\/profile\/(.+)/).reply((config) => {
    console.log("Mock API: /auth/profile/:userId called");
    if (config.headers?.Authorization) {
        const userId = config.url?.split('/').pop();
        const updatedData = JSON.parse(config.data);
        const updatedUser = { id: userId, ...updatedData };
        return [200, updatedUser];
    }
    return [401, { message: 'Not authenticated' }];
});


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
    mock.onPut(`/golls/${id}`).replyOnce((config) => {
        const data = JSON.parse(config.data);
        const index = MOCK_GOLLS.findIndex(g => g.id == id);
        if (index > -1) {
            MOCK_GOLLS[index] = { ...MOCK_GOLLS[index], ...data };
            return [200, MOCK_GOLLS[index]];
        }
        return [404, { message: 'Goll not found' }];
    });
    const response = await apiClient.put<Goll>(`/golls/${id}`, gollData);
    return response.data;
  },

  likeGoll: async (id: string | number): Promise<{likes: number}> => {
    mock.onPost(`/golls/${id}/like`).replyOnce(() => {
        const index = MOCK_GOLLS.findIndex(g => g.id == id);
        if (index > -1) {
            const newLikes = (MOCK_GOLLS[index].stats?.likes || 0) + 1;
            MOCK_GOLLS[index].stats!.likes = newLikes;
            MOCK_GOLLS[index].likes = newLikes;
            return [200, { likes: newLikes }];
        }
        return [404, { message: 'Goll not found' }];
    });
    const response = await apiClient.post<{likes: number}>(`/golls/${id}/like`);
    return response.data;
  },
  
  signup: async (userData: any) => {
    console.log("Mock API: signup called with", userData);
    await new Promise(res => setTimeout(res, 500));
    return { user: { id: 'mock-user-id', ...userData }, session: {} };
  }
};