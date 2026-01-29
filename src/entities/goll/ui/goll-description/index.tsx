import React from 'react';

type LogDescriptionProps = {
  description: string;
};

export const LogDescription = ({ description }: LogDescriptionProps) => {
  return (
    <div className="prose prose-slate max-w-none">
      <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
        {description || "No content provided."}
      </p>
    </div>
  );
};
