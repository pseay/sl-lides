import React from 'react';
import PropTypes from 'prop-types';
import { CodeSlide } from './CodeSlide';
import WhiteboardSlide from './WhiteboardSlide';

export const SlideContent = ({ slide, slideId, channel, isPresenter, codeState, whiteboardState }) => {
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
          channel={channel}
          isPresenter={isPresenter}
          codeState={codeState}
        />
      )}

      {slide.type === 'whiteboard' && (
        <WhiteboardSlide
          channel={channel}
          isPresenter={isPresenter}
          whiteboardState={whiteboardState}
        />
      )}
    </>
  );
};

SlideContent.propTypes = {
  slide: PropTypes.object,
  slideId: PropTypes.number.isRequired,
  channel: PropTypes.object.isRequired,
  isPresenter: PropTypes.bool.isRequired,
  codeState: PropTypes.object.isRequired,
  whiteboardState: PropTypes.object.isRequired,
};
