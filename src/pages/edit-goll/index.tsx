import React from 'react';
import { Header } from '@/widgets/header/ui';
import { CreateGollForm } from '@/features/goll/create-goll-form/ui/create-goll-form';
import { updateGoll } from '@/features/goll/create-goll-form/api'; // Import the API function for updating
import { InitialGollFormData, GollFormData } from '@/features/goll/create-goll-form/model/types'; // Import form data types
import { Screen } from '@/shared/lib/navigation';

interface EditGollPageProps {
  onBack: () => void;
  onNavigate: (screen: Screen, params?: any) => void;
  initialData: InitialGollFormData; // The log data to be edited
}

export default function EditGollPage({ onBack, onNavigate, initialData }: EditGollPageProps) {
  const handleSubmit = async (formData: GollFormData) => {
    try {
      if (!formData.id) throw new Error("Log ID is missing for update operation.");
      await updateGoll(formData.id, formData);
      alert("Match Log Updated Successfully!");
      onNavigate('detail', { id: formData.id }); // Navigate to detail page of the updated log
    } catch (error) {
      console.error("Failed to update log:", error);
      alert("Failed to update log. Please try again.");
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header onNavigate={onNavigate} />
      <CreateGollForm 
        initialData={initialData} // Pass the initial data for editing
        onSubmit={handleSubmit} 
        onBack={onBack} 
      />
    </div>
  );
}
