// src/features/log/create-log-form/model/types.ts

// Type for a single participant in the form
export type ParticipantInput = { id?: string; name: string; type: 'individual' | 'team'; votes: number };

// Type for the form data structure
export interface LogFormData {
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
  participants: ParticipantInput[];
  media?: Array<{ type: string; title: string; url: string; thumbnail: string; }>; // Added optional media
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

// Type for the initial data passed to the form (can be partial)
export type InitialLogFormData = Partial<LogFormData>;

// Type for the categories (assuming they are fixed strings)
export const SPORTS_CATEGORIES = [
  "Short Track",
  "Figure Skating",
  "Curling",
  "Speed Skating",
  "Ice Hockey",
  "Alpine Skiing",
  "Snowboard",
  "Skeleton",
  "Luge",
  "Bobsleigh",
  "Ski Jumping",
  "Biathlon",
  "Cross Country",
  "Freestyle Skiing",
  "Nordic Combined"
];

// Type for the mock logs (if still needed)
export const MOCK_LOGS = [
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
