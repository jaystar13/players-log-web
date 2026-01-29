export interface Goll {
  id: number;
  sport: string;
  title: string;
  date: string;
  venue: string;
  teams: string;
  owner: {
    name: string;
    avatar: string;
    role?: string; // Added role
  };
  preview: string;
  description?: string;
  likes: number;
  hasVideo: boolean;
  hasLink: boolean;
  previewLinks?: string[];
  time?: string; // Added
  matchType?: 'vs' | 'multi'; // Added
  participants?: Array<{ id?: string; name: string; type: 'individual' | 'team'; votes: number }>; // Added
  createdAt?: string; // Added
  stats?: { likes: number; views: number }; // Added
  isArchived?: boolean; // Added
  media?: Array<{ type: string; title: string; url: string; thumbnail: string; }>; // Added
}

// Type for a single participant in the form
export type ParticipantInput = { id?: string; name: string; type: 'individual' | 'team'; votes: number };

// Type for the form data structure
