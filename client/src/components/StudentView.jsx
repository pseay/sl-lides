import React from 'react';
import { SlideContainer } from './SlideContainer';
import { CodeSlide } from './CodeSlide';

export const StudentView = ({ slides, currentSlide, socket }) => {
  const slide = slides[currentSlide];

  return (
    <SlideContainer>
      {slide.type === 'content' && (
        <div>
          <h2 className="text-3xl font-bold mb-6">{slide.title}</h2>
          <div className="prose prose-invert max-w-none text-text">
            {slide.content}
          </div>
        </div>
      )}

      {slide.type === 'code' && (
        <CodeSlide
          slide={slide}
          slideId={currentSlide}
          socket={socket}
          isPresenter={false}
        />
      )}
    </SlideContainer>
  );
};