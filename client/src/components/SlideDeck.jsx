import { SlideContainer } from './SlideContainer';

export const SlideDeck = ({ slides, currentSlide, onSlideChange, children }) => {
  return (
    <>
      <SlideContainer>{children}</SlideContainer>

      {/* Navigation Controls */}
      <div className="mt-6 flex justify-between items-center max-w-7xl mx-auto">
        {/* Previous Button */}
        <button
          onClick={() => onSlideChange(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium text-text-secondary hover:text-text-default hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => onSlideChange(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index
                  ? 'bg-primary'
                  : 'bg-border hover:bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >{index}</button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onSlideChange(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
          className="px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium text-text-secondary hover:text-text-default hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </>
  );
};