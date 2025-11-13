import React from 'react';

export const SlideDeck = ({ slides, currentSlide, onSlideChange, children }) => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-4 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className={`px-3 py-1 rounded ${
              currentSlide === index
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl p-8 min-h-[600px]">
        {children}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => onSlideChange(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-400">
          Slide {currentSlide + 1} of {slides.length}
        </span>
        <button
          onClick={() => onSlideChange(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};