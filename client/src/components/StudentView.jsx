import React from 'react';
import { CodeSlide } from './CodeSlide';

export const StudentView = ({ slides, currentSlide, socket }) => {
  const slide = slides[currentSlide];

  // This component now renders the slide content directly without any chrome
  return (
    <div className="p-4 sm:p-6 lg:p-8"> {/* Add back some padding for the overall view */}
      {slide.type === 'content' && (
        <>
          <h2 className="text-3xl font-bold mb-4">{slide.title}</h2> {/* Re-add title */}
          <div className="prose prose-invert max-w-none text-text">
            {slide.content}
          </div>
        </>
      )}

      {slide.type === 'code' && (
        <CodeSlide
          slide={slide}
          slideId={currentSlide}
          socket={socket}
          isPresenter={false}
          // showTitle prop is now omitted, defaulting to true
        />
      )}
    </div>
  );
};