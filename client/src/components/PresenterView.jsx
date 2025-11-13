import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { SlideDeck } from './SlideDeck';
import { SlideContent } from './SlideContent';

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
    <>
      <SlideDeck
        slides={slides}
        currentSlide={currentSlide}
        onSlideChange={onSlideChange}
      >
        <SlideContent
          slide={slide}
          slideId={currentSlide}
          socket={socket}
          isPresenter={true}
        />
      </SlideDeck>

      {slide.solution && (
        <div className="max-w-7xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">Solution</h2>
          <div className="border border-border rounded-md overflow-hidden h-[400px]">
            <Editor
              height="100%"
              language={slide.language || 'javascript'}
              value={slide.solution}
              theme="vs-dark"
              options={{ 
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};