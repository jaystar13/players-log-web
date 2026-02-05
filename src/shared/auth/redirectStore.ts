import { Screen } from '@/shared/lib/navigation';

const REDIRECT_INFO_KEY = 'redirect_info_after_login';

interface RedirectInfo {
  screen: Screen;
  params?: any;
}

export const redirectStore = {
  set: (screen: Screen, params?: any) => {
    const info: RedirectInfo = { screen, params };
    localStorage.setItem(REDIRECT_INFO_KEY, JSON.stringify(info));
  },
  getAndClear: (): RedirectInfo | null => {
    const infoString = localStorage.getItem(REDIRECT_INFO_KEY);
    if (!infoString) return null;
    
    localStorage.removeItem(REDIRECT_INFO_KEY);
    try {
      return JSON.parse(infoString);
    } catch (e) {
      console.error("Failed to parse redirect info:", e);
      return null;
    }
  }
};
