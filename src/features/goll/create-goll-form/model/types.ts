// src/features/goll/create-goll-form/model/types.ts

// Type for a single participant in the form
export type ParticipantInput = { id?: string; name: string; type: 'individual' | 'team'; votes: number; displayOrder: number };

// Type for the form data structure
export interface GollFormData {
  id?: number | string;
  title: string;
  sport: string;
  // matchDate: string;
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
export type InitialGollFormData = Partial<GollFormData>;

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

