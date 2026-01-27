import { projectId, publicAnonKey } from '/utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

// --- Supabase Client (Auth) ---
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// --- Backend API (Data) ---
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-4f4cc037`;

export const api = {
  // Generic Fetch
  request: async (endpoint: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || response.statusText);
    }

    return response.json();
  },

  // Log Methods
  getLogs: () => api.request('/logs'),
  
  createLog: (logData: any) => api.request('/logs', {
    method: 'POST',
    body: JSON.stringify(logData),
  }),

  updateLog: (id: string | number, logData: any) => api.request(`/logs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(logData),
  }),

  likeLog: (id: string | number) => api.request(`/logs/${id}/like`, {
    method: 'POST',
  }),

  // Auth Helper (calls backend /signup if needed, though client-side is preferred usually)
  // We used backend /signup in the server file as requested by prompt instructions
  signup: (userData: any) => api.request('/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
};
