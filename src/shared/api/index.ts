import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { createClient } from '@supabase/supabase-js';
import { Log } from '@/entities/log/model/types';
import { LogFormData } from '@/features/log/create-log-form/model/types';

// --- Supabase Client (Auth) ---
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// --- MOCK BACKEND API (Data) ---

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

let MOCK_LOGS: Log[] = [
  {
    id: 1,
    sport: "Short Track",
    title: "Men's 1000m Final",
    date: "2026-02-15",
    time: "19:30",
    venue: "Gangneung Ice Arena",
    teams: "Korea vs. Netherlands",
    participants: [
        { id: 'p1', name: 'Hwang Dae-heon', type: 'individual', votes: 1250 },
        { id: 'p2', name: 'Sjinkie Knegt', type: 'individual', votes: 890 }
    ],
    matchType: 'vs',
    // participantUnit: 'individual',
    owner: MOCK_USER_1,
    preview: "An intense final race for the gold medal.",
    description: "An intense final race for the gold medal. Both skaters are at the top of their game. The key will be the start and who can maintain the inner track.",
    stats: { likes: 2300, views: 15400 },
    likes: 2300,
    media: [
        { type: 'video', title: "Official Race Replay", url: "https://youtube.com/watch?v=123", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400&h=225" },
        { type: 'article', title: "Analysis of the final lap", url: "https://sports.example.com/analysis", thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400&h=225" }
    ],
    createdAt: "2026-02-14T11:00:00Z",
    isArchived: false,
    hasLink: true,
    hasVideo: true,
  },
  {
    id: 2,
    sport: "Figure Skating",
    title: "Women's Single Free Skating",
    date: "2026-02-20",
    time: "20:00",
    venue: "Gangneung Ice Arena",
    teams: "Multi-entry event",
    participants: [
      { id: 'p3', name: 'Yuna Kim', type: 'individual', votes: 3400 },
      { id: 'p4', name: 'Alina Zagitova', type: 'individual', votes: 2100 },
      { id: 'p5', name: 'Rika Kihira', type: 'individual', votes: 1800 },
    ],
    matchType: 'multi',
    // participantUnit: 'individual',
    owner: MOCK_USER_2,
    preview: "The culmination of the women's singles competition.",
    description: "The culmination of the women's singles competition. Expect breathtaking artistry and technical skill.",
    stats: { likes: 5100, views: 32000 },
    likes: 5100,
    media: [],
    createdAt: "2026-02-19T18:00:00Z",
    isArchived: false,
    hasLink: false,
    hasVideo: false,
  },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  getLogs: async (): Promise<Log[]> => {
    console.log("Mock API: getLogs called");
    await delay(500);
    return JSON.parse(JSON.stringify(MOCK_LOGS));
  },
  
  createLog: async (logData: LogFormData): Promise<Log> => {
    console.log("Mock API: createLog called with", logData);
    await delay(500);
    const newId = Math.max(0, ...MOCK_LOGS.map(l => l.id)) + 1;
    const newLog: Log = {
      ...logData,
      id: newId,
      owner: MOCK_USER_1, // Assume current user is the owner
      stats: { likes: 0, views: 0 },
      likes: 0,
      createdAt: new Date().toISOString(),
      isArchived: false,
      preview: logData.description?.substring(0, 100) || "No preview",
      media: (logData.previewLinks || []).map((link, idx) => ({
        type: link.includes('youtube') ? 'video' : 'article',
        title: `Linked Resource ${idx + 1}`,
        url: link,
        thumbnail: ''
      })),
      hasLink: (logData.previewLinks || []).length > 0,
      hasVideo: (logData.previewLinks || []).some(link => link.includes('youtube')),
    };
    MOCK_LOGS.unshift(newLog);
    return JSON.parse(JSON.stringify(newLog));
  },

  updateLog: async (id: string | number, logData: LogFormData): Promise<Log> => {
    console.log(`Mock API: updateLog called for id ${id} with`, logData);
    await delay(500);
    const logIndex = MOCK_LOGS.findIndex(l => l.id == id);
    if (logIndex === -1) {
      throw new Error("Log not found");
    }
    const updatedLog: Log = {
      ...MOCK_LOGS[logIndex],
      ...logData,
      id: Number(id),
      preview: logData.description?.substring(0, 100) || "No preview",
      media: (logData.previewLinks || []).map((link, idx) => ({
        type: link.includes('youtube') ? 'video' : 'article',
        title: `Linked Resource ${idx + 1}`,
        url: link,
        thumbnail: ''
      })),
      hasLink: (logData.previewLinks || []).length > 0,
      hasVideo: (logData.previewLinks || []).some(link => link.includes('youtube')),
    };
    MOCK_LOGS[logIndex] = updatedLog;
    return JSON.parse(JSON.stringify(updatedLog));
  },

  likeLog: async (id: string | number): Promise<{likes: number}> => {
    console.log(`Mock API: likeLog called for id ${id}`);
    await delay(200);
    const logIndex = MOCK_LOGS.findIndex(l => l.id == id);
    if (logIndex === -1) {
      throw new Error("Log not found");
    }
    const newLikes = (MOCK_LOGS[logIndex].stats?.likes || 0) + 1;
    MOCK_LOGS[logIndex].stats!.likes = newLikes;
    MOCK_LOGS[logIndex].likes = newLikes;
    return { likes: newLikes };
  },
  
  signup: async (userData: any) => {
    console.log("Mock API: signup called with", userData);
    await delay(500);
    return { user: { id: 'mock-user-id', ...userData }, session: {} };
  }
};
