import { api } from '@/shared/api';
import { Goll } from '@/entities/goll/model/types';
import { GollFormData } from '../model/types'; // Import from centralized model

export const createGoll = async (data: GollFormData): Promise<Goll> => {
  // api.createGoll already expects GollFormData, so we can pass it directly
  // after ensuring id is not sent for creation.
  const { id, ...gollToCreate } = data;
  const createdGoll = await api.createGoll(gollToCreate as GollFormData);
  return createdGoll;
};

export const updateGoll = async (id: number | string | undefined, data: GollFormData): Promise<Goll> => {
  if (id === undefined) {
    throw new Error("Goll ID is required for update operation.");
  }
  const gollToUpdate = {
    ...data,
    id: id, // Ensure ID is present for update
  };
  
  const updatedGoll = await api.updateGoll(id, gollToUpdate);
  return updatedGoll;
};

export const fetchExistingGolls = async (): Promise<Goll[]> => {
  try {
    // Fetch a large page size to get most/all golls for duplicate checking
    const gollsPage = await api.getGolls(0, 1000); 
    return gollsPage.content || [];
  } catch (error) {
    console.error("Failed to fetch golls for checking duplicates:", error);
    return []; // Return empty array on error
  }
};
