import React from 'react';

export const SlideContainer = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="bg-surface rounded-lg border border-border shadow-2xl aspect-video overflow-hidden relative w-full">
        {children}
      </div>
    </div>
  );
};
