import React from 'react';
import { CodeSlide } from './CodeSlide';
import WhiteboardSlide from './WhiteboardSlide';

export const SlideContent = ({ slide, slideId, socket, isPresenter }) => {
  if (!slide) return null;

  return (
    <>
      {slide.type === 'content' && (
        <div style={{padding: "2em"}}>
          <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
          <div className="prose prose-invert max-w-none text-text">
            {slide.content}
          </div>
        </div>
      )}

      {slide.type === 'code' && (
        <CodeSlide
          slide={slide}
          slideId={slideId}
          socket={socket}
          isPresenter={isPresenter}
        />
      )}

      {slide.type === 'whiteboard' && (
        <WhiteboardSlide
          socket={socket}
          isPresenter={isPresenter}
        />
      )}
    </>
  );
};
