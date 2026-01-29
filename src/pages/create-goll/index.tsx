import React from 'react';
import { Header } from '@/widgets/header/ui';
import { CreateLogForm } from '@/features/goll/create-goll-form/ui/create-goll-form';
import { createLog } from '@/features/goll/create-goll-form/api'; // Import the API function
import { LogFormData } from '@/features/goll/create-goll-form/model/types'; // Import form data type
import { Screen } from '@/shared/lib/navigation';

interface CreateLogPageProps {
  onBack: () => void;
  onNavigate: (screen: Screen, params?: any) => void;
}

export default function CreateLogPage({ onBack, onNavigate }: CreateLogPageProps) {
  const handleSubmit = async (formData: LogFormData) => {
    try {
      const newLog = await createLog(formData);
      alert("Match Log Registered Successfully!");
      onNavigate('feed'); // Navigate to feed after successful creation
      return newLog;
    } catch (error) {
      console.error("Failed to register log:", error);
      alert("Failed to register log. Please try again.");
      throw error; // Re-throw to indicate failure if needed
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header onNavigate={onNavigate} /> {/* Assuming header takes onNavigate prop */}
      <CreateLogForm 
        onSubmit={handleSubmit} 
        onBack={onBack} 
      />
    </div>
  );
}
