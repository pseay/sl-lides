import React from 'react';
import PropTypes from 'prop-types';
import { SlideContent } from './SlideContent';

export const StudentView = ({ slides, currentSlide, channel, codeState, whiteboardState }) => {
  const slide = slides[currentSlide];

  return (
    <div className='bg-surface h-[100svh]'>
      <SlideContent 
        slide={slide}
        slideId={currentSlide}
        channel={channel}
        isPresenter={false}
        codeState={codeState}
        whiteboardState={whiteboardState}
      />
    </div>
  );
};

StudentView.propTypes = {
  slides: PropTypes.array.isRequired,
  currentSlide: PropTypes.number.isRequired,
  channel: PropTypes.object.isRequired,
  codeState: PropTypes.object.isRequired,
  whiteboardState: PropTypes.object.isRequired,
};