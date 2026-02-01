export interface UserProfile {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string;
  description: string;
  role: 'USER' | 'ADMIN'; // Assuming Role is an enum on the backend
  stats: {
    created: number;
    liked: number;
    cheers: number;
  };
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    threads?: string;
    x?: string;
  };
}
