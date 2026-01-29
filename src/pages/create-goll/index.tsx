import React from 'react';
import { Header } from '@/widgets/header/ui';
import { CreateGollForm } from '@/features/goll/create-goll-form/ui/create-goll-form';
import { createGoll } from '@/features/goll/create-goll-form/api'; // Import the API function
import { GollFormData } from '@/features/goll/create-goll-form/model/types'; // Import form data type
import { Screen } from '@/shared/lib/navigation';

interface CreateGollPageProps {
  onBack: () => void;
  onNavigate: (screen: Screen, params?: any) => void;
}

export default function CreateGollPage({ onBack, onNavigate }: CreateGollPageProps) {
  const handleSubmit = async (formData: GollFormData) => {
    try {
      const newGoll = await createGoll(formData);
      alert("Match Log Registered Successfully!");
      onNavigate('feed'); // Navigate to feed after successful creation
      return newGoll;
    } catch (error) {
      console.error("Failed to register log:", error);
      alert("Failed to register log. Please try again.");
      throw error; // Re-throw to indicate failure if needed
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header onNavigate={onNavigate} /> {/* Assuming header takes onNavigate prop */}
      <CreateGollForm 
        onSubmit={handleSubmit} 
        onBack={onBack} 
      />
    </div>
  );
}
