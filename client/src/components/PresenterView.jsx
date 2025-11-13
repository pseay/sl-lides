import React, { useEffect } from 'react';
import { SlideDeck } from './SlideDeck';
import { CodeSlide } from './CodeSlide';

export const PresenterView = ({ slides, currentSlide, onSlideChange, socket }) => {
  const slide = slides[currentSlide];

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Do nothing if the user is typing in an input, textarea, or the code editor
      const activeElement = document.activeElement;
      if (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.closest('.monaco-editor')
      ) {
        return;
      }

      if (event.key === 'ArrowRight') {
        onSlideChange(Math.min(slides.length - 1, currentSlide + 1));
      } else if (event.key === 'ArrowLeft') {
        onSlideChange(Math.max(0, currentSlide - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide, slides.length, onSlideChange]);

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