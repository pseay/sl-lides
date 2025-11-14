import React from 'react';

export const SlideContainer = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-surface rounded-lg border border-border shadow-2xl p-2 sm:p-12 min-h-[60vh] flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
};
