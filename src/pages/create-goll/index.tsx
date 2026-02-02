import React from 'react';
import { Header } from '@/widgets/header/ui';
import { CreateGollForm } from '@/features/goll/create-goll-form/ui/create-goll-form';
import { createGoll } from '@/features/goll/create-goll-form/api';
import { GollFormData } from '@/features/goll/create-goll-form/model/types';
import { Screen } from '@/shared/lib/navigation';
import { UserProfile } from '@/entities/user/model/types';
import { toast } from 'sonner';

interface CreateGollPageProps {
  onBack: () => void;
  onNavigate: (screen: Screen, params?: any) => void;
  userProfile: UserProfile | null;
}

export default function CreateGollPage({ onBack, onNavigate, userProfile }: CreateGollPageProps) {
  const handleSubmit = async (formData: GollFormData) => {
    try {
      const newGoll = await createGoll(formData);
      toast.success("Match Log Registered Successfully!");
      onNavigate('feed'); // Navigate to feed after successful creation
      return newGoll;
    } catch (error) {
      console.error("Failed to register log:", error);
      toast.error("Failed to register log. Please try again.");
      throw error; // Re-throw to indicate failure if needed
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header onNavigate={onNavigate} userProfile={userProfile} />
      <CreateGollForm
        onSubmit={handleSubmit}
        onBack={onBack}
        onNavigate={onNavigate}
      />
    </div>
  );
}