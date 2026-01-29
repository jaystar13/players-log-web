import React from 'react';

type GollDescriptionProps = {
  description: string;
};

export const GollDescription = ({ description }: GollDescriptionProps) => {
  return (
    <div className="prose prose-slate max-w-none">
      <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
        {description || "No content provided."}
      </p>
    </div>
  );
};
