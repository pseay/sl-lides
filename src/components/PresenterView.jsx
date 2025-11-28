import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import PropTypes from 'prop-types';
import { SlideDeck } from './SlideDeck';
import { SlideContent } from './SlideContent';

export const PresenterView = ({ slides, currentSlide, onNext, onPrev, channel, codeState, whiteboardState, currentStep }) => {
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
        onNext();
      } else if (event.key === 'ArrowLeft') {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide, onNext, onPrev]);

  const isCodeWithSolution = slide.type === 'code' && slide.solution;

  return (
    <div className="flex flex-col w-full h-full">
      {isCodeWithSolution ? (
        <div className="flex gap-4 w-full">
          <div className="flex-1 min-w-0">
            <SlideDeck
              slides={slides}
              currentSlide={currentSlide}
            >
              <SlideContent
                slide={slide}
                slideId={currentSlide}
                channel={channel}
                isPresenter={true}
                codeState={codeState}
                whiteboardState={whiteboardState}
                currentStep={currentStep}
              />
            </SlideDeck>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="max-w-7xl mx-auto w-full">
                <div className="bg-surface rounded-lg border border-border shadow-2xl aspect-video overflow-hidden relative w-full flex flex-col">
                    <div className="p-4 border-b border-border shrink-0 bg-surface z-10">
                        <h2 className="text-xl font-bold text-blue-400">Solution</h2>
                    </div>
                    <div className="flex-grow relative">
                        <Editor
                            key={slide.language}
                            height="100%"
                            language={slide.language || 'javascript'}
                            value={slide.solution}
                            theme="vs-dark"
                            options={{ 
                                readOnly: true,
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: 'on',
                                padding: { top: 16 },
                                lineNumbers: 'on',
                            }}
                        />
                    </div>
                </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <SlideDeck
            slides={slides}
            currentSlide={currentSlide}
          >
            <SlideContent
              slide={slide}
              slideId={currentSlide}
              channel={channel}
              isPresenter={true}
              codeState={codeState}
              whiteboardState={whiteboardState}
              currentStep={currentStep}
            />
          </SlideDeck>

          {slide.solution && (
            <div className="max-w-7xl mx-auto mt-8 w-full">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">Solution</h2>
              <div className="border border-border rounded-md overflow-hidden h-[400px]">
                <Editor
                  key={slide.language}
                  height="100%"
                  language={slide.language || 'javascript'}
                  value={slide.solution}
                  theme="vs-dark"
                  options={{ 
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    padding: { top: 16 },
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

PresenterView.propTypes = {
  slides: PropTypes.array.isRequired,
  currentSlide: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  channel: PropTypes.object.isRequired,
  codeState: PropTypes.object.isRequired,
  whiteboardState: PropTypes.object.isRequired,
  currentStep: PropTypes.number,
};
