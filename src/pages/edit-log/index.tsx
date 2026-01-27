import React from 'react';
import { Header } from '@/widgets/header/ui';
import { CreateLogForm } from '@/features/log/create-log-form/ui/create-log-form';
import { updateLog } from '@/features/log/create-log-form/api'; // Import the API function for updating
import { InitialLogFormData, LogFormData } from '@/features/log/create-log-form/model/types'; // Import form data types
import { Screen } from '@/shared/lib/navigation';

interface EditLogPageProps {
  onBack: () => void;
  onNavigate: (screen: Screen, params?: any) => void;
  initialData: InitialLogFormData; // The log data to be edited
}

export default function EditLogPage({ onBack, onNavigate, initialData }: EditLogPageProps) {
  const handleSubmit = async (formData: LogFormData) => {
    try {
      if (!formData.id) throw new Error("Log ID is missing for update operation.");
      await updateLog(formData.id, formData);
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
      <CreateLogForm 
        initialData={initialData} // Pass the initial data for editing
        onSubmit={handleSubmit} 
        onBack={onBack} 
      />
    </div>
  );
}
