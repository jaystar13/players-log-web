export interface Participant {
  id?: number | string;
  name: string;
  type: 'individual' | 'team';
  votes?: number;
  isVotedByUser?: boolean;
  displayOrder?: number;
}

export interface Goll {
  id: number | string;
  sport: string;
  title: string;
  matchDate: string;
  venue: string;
  owner: {
    id: number;
    name: string;
    profileImageUrl: string;
    role?: string;
    description?: string;
  };
  description?: string;
  likes: number;
  isLiked?: boolean; // Add isLiked for Goll likes
  userVoteId?: number | string | null; // Add userVoteId for participant votes
  hasVideo: boolean;
  hasLink: boolean;
  previewLinks?: string[];
  matchType?: 'vs' | 'multi';
  participants?: Participant[]; // Use the exported Participant type
  createdAt?: string;
  stats?: { likes: number; views: number };
  status?: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  isOwner?: boolean;
  media?: Array<{ type: string; title: string; url: string; thumbnail: string; }>;
}

// Type for a single participant in the form
export type ParticipantInput = { id?: string; name: string; type: 'individual' | 'team'; votes?: number; displayOrder: number };

export interface GollSearchResponse {
  id: number;
  title: string;
  sport: string;
  matchDate: string;
  ownerName: string;
  venue: string;
}
