import { Goll } from '@/entities/goll/model/types';
import React from 'react';

type GollOwnerProps = {
  owner?: Goll['owner'];
};

export const GollOwner = ({ owner }: GollOwnerProps) => {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <img 
        src={owner?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100"} 
        alt={owner?.name || "Owner"} 
        className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
      />
      <div className="flex-1">
        <h3 className="font-bold text-slate-900 text-lg">{owner?.name || "You"}</h3>
        <p className="text-slate-500 text-sm">{owner?.role || "Log Creator"}</p>
      </div>
      <button className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
        View Profile
      </button>
    </div>
  );
};
