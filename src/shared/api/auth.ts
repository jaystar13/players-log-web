import apiClient from './client';

// Define a type for the user profile for consistency
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  // Add other profile fields here as needed
  nickname?: string;
  bio?: string;
  socials?: {
    instagram?: string;
    youtube?: string;
    threads?: string;
    twitter?: string;
  };
}

/**
 * Exchanges a temporary authorization code for an access token.
 * @param code The temporary code received from the backend OAuth2 redirect.
 * @returns A promise that resolves with the application's access token.
 */
export const exchangeCodeForToken = async (code: string): Promise<{ accessToken: string }> => {
  console.log("Calling backend /auth/token/exchange with temporary code");
  const response = await apiClient.post<{ accessToken: string }>('/auth/token/exchange', {
    code: code,
  });
  return response.data;
};

/**
 * Calls the backend to get a new access token using the refresh token cookie.
 * @returns A promise that resolves with a new access token.
 */
export const refreshToken = async (): Promise<{ accessToken: string }> => {
    console.log("Calling backend /auth/refresh to get a new access token");
    const response = await apiClient.post<{ accessToken: string }>('/auth/refresh');
    return response.data;
};

/**
 * Calls the backend to sign out.
 */
export const logout = async (): Promise<void> => {
    console.log("Calling backend /auth/logout");
    await apiClient.post('/auth/logout');
};

/**
 * Fetches the current user's profile if a valid session exists.
 * @returns A promise that resolves with the user profile and a new access token.
 */
export const checkAuthStatus = async (): Promise<{ accessToken: string; user: UserProfile }> => {
    console.log("Calling backend /auth/me to check auth status");
    const response = await apiClient.get<{ accessToken: string; user: UserProfile }>('/auth/me');
    return response.data;
};

/**
 * Calls the backend to update the user's profile.
 * @param userId The ID of the user to update.
 * @param profileData The partial profile data to update.
 * @returns A promise that resolves with the updated user profile.
 */
export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> => {
    console.log(`Calling backend /auth/profile/${userId} to update profile`, profileData);
    // In a real app, you'd send a PUT or PATCH request with the profileData
    // For now, we'll mock a successful response.
    const response = await apiClient.put<UserProfile>(`/auth/profile/${userId}`, profileData);
    return response.data;
};