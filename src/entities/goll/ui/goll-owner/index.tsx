import { Goll } from '@/entities/goll/model/types';
import { Screen } from '@/shared/lib/navigation';
import React from 'react';

type GollOwnerProps = {
  owner?: Goll['owner'];
  onNavigate: (screen: Screen, params?: any) => void;
};

export const GollOwner = ({ owner, onNavigate }: GollOwnerProps) => {
  const handleViewProfile = () => {
    if (owner?.id) {
      onNavigate('mypage', { userId: owner.id });
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <img
        src={owner?.profileImageUrl || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100"}
        alt={owner?.name || "Owner"}
        className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
      />
      <div className="flex-1">
        <h3 className="font-bold text-slate-900 text-lg">{owner?.name || "You"}</h3>
        <p className="text-slate-500 text-sm">{owner?.description || "Log Creator"}</p>
      </div>
      <button
        onClick={handleViewProfile}
        disabled={!owner?.id}
        className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        View Profile
      </button>
    </div>
  );
};
