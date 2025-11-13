import React from 'react';
import { CodeSlide } from './CodeSlide';

export const StudentView = ({ slides, currentSlide, socket }) => {
  const slide = slides[currentSlide];

  // This component now renders the slide content directly without any chrome
  return (
    <>
      {slide.type === 'content' && (
        <div className="prose prose-invert max-w-none text-text p-8 sm:p-12">
          {slide.content}
        </div>
      )}

      {slide.type === 'code' && (
        <CodeSlide
          slide={slide}
          slideId={currentSlide}
          socket={socket}
          isPresenter={false}
          showTitle={false}
        />
      )}
    </>
  );
};