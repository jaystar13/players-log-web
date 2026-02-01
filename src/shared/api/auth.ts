import apiClient from './client';

/**
 * Exchanges a temporary authorization code for an access token.
 * @param code The temporary code received from the backend OAuth2 redirect.
 * @returns A promise that resolves with the application's access token.
 */
export const exchangeCodeForToken = async (code: string): Promise<{ accessToken: string }> => {
  const response = await apiClient.post<{ accessToken: string }>('/auth/token/exchange', {
    code: code,
  });
  return response.data;
};

/**
 * Calls the backend to get a new access token using the refresh token cookie.
 * @returns A promise that resolves with a new access token.
 */
export const refreshToken = async (): Promise<{ accessToken:string }> => {
    const response = await apiClient.post<{ accessToken: string }>('/auth/refresh');
    return response.data;
};

/**
 * Calls the backend to sign out.
 */
export const logout = async (): Promise<void> => {
    await apiClient.post('/auth/logout');
};