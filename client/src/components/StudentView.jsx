import React from 'react';
import { SlideContent } from './SlideContent';

export const StudentView = ({ slides, currentSlide, socket }) => {
  const slide = slides[currentSlide];

  return (
    <SlideContent 
      slide={slide}
      slideId={currentSlide}
      socket={socket}
      isPresenter={false}
    />
  );
};