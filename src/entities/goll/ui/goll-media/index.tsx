import { Goll } from '@/entities/goll/model/types';
import { ExternalLink, Link as LinkIcon, Video } from 'lucide-react';
import React from 'react';

type GollMediaProps = {
  media: Goll['media'];
};

export const GollMedia = ({ media }: GollMediaProps) => {
  if (!media || media.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
      {media.map((item: any, index: number) => (
        <a 
          key={index}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-[#1A237E] hover:shadow-md transition-all"
        >
          <div className="relative h-40 overflow-hidden">
            <img 
              src={item.thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400&h=225"} 
              alt={item.title} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            <div className="absolute bottom-2 right-2 bg-black/60 text-white p-1.5 rounded-full backdrop-blur-sm">
              {item.type === 'video' ? <Video className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
            </div>
          </div>
          <div className="p-4">
            <h4 className="font-bold text-slate-800 line-clamp-2 group-hover:text-[#1A237E] transition-colors">
              {item.title || "External Link"}
            </h4>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <LinkIcon className="w-3 h-3" />
              {(() => {
                try {
                  return item.url ? new URL(item.url).hostname : "link.com";
                } catch (e) {
                  return "link.com";
                }
              })()}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};
