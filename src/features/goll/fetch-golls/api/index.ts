import { api } from '@/shared/api';
import { Log } from '@/entities/goll/model/types';

export const getLogs = async (): Promise<Log[]> => {
  try {
    const data = await api.getLogs();
    if (data && data.length > 0) {
      // Transform backend data to UI format if needed
      const formattedLogs = data.map((item: any) => ({
        ...item,
        // Ensure compatibility with existing fields
        preview: item.description || item.preview,
        hasLink: item.previewLinks && item.previewLinks.length > 0,
        hasVideo: item.previewLinks && item.previewLinks.some((l: string) => l.includes('youtube') || l.includes('youtu.be')),
        owner: item.owner || {
          name: "Ji-sung Kim", // Default/Mock owner
          avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100"
        }
      }));
      return formattedLogs;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    // In a real app, you might want to throw the error 
    // or return a result object like { success: false, error }
    return []; 
  }
};
