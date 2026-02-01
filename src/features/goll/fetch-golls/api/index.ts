import { api, Page } from '@/shared/api';
import { Goll } from '@/entities/goll/model/types';

export const getGolls = async (page?: number, size?: number): Promise<Page<Goll>> => {
  try {
    const pageData = await api.getGolls(page, size);
    if (pageData && pageData.content.length > 0) {
      // Transform backend data to UI format
      const formattedGolls = pageData.content.map((item: any) => ({
        ...item,
        matchDate: item.matchDate, 
        participants: item.participants,
        owner: {
          name: item.owner?.name,
          profileImageUrl: item.owner?.profileImageUrl || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100", // Default/Mock avatar
          description: item.owner?.description, 
        },
        preview: item.description || "No preview available",
        hasLink: item.previewLinks && item.previewLinks.length > 0,
        hasVideo: item.previewLinks && item.previewLinks.some((l: string) => l.includes('youtube') || l.includes('youtu.be')),
      }));

      return { ...pageData, content: formattedGolls };
    }
    return pageData;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    // In case of error, re-throw it so the hook can catch it
    throw error;
  }
};
