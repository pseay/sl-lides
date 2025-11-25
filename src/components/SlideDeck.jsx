import { SlideContainer } from './SlideContainer';

export const SlideDeck = ({ slides, currentSlide, onSlideChange, children }) => {
  return (
    <>
      <SlideContainer>{children}</SlideContainer>
    </>
  );
};