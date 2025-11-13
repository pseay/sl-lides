import React from 'react';
import { SlideDeck } from './SlideDeck';
import { CodeSlide } from './CodeSlide';

export const PresenterView = ({ slides, currentSlide, onSlideChange, socket }) => {
  const slide = slides[currentSlide];

  return (
    <SlideDeck
      slides={slides}
      currentSlide={currentSlide}
      onSlideChange={onSlideChange}
    >
      {slide.type === 'content' && (
        <div>
          <h2 className="text-3xl font-bold mb-6">{slide.title}</h2>
          <div className="prose prose-invert max-w-none">
            {slide.content}
          </div>
        </div>
      )}

      {slide.type === 'code' && (
        <CodeSlide
          slide={slide}
          slideId={currentSlide}
          socket={socket}
          isPresenter={true}
        />
      )}
    </SlideDeck>
  );
};