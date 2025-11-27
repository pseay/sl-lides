import React from 'react';
import PropTypes from 'prop-types';
import { CodeSlide } from './CodeSlide';
import WhiteboardSlide from './WhiteboardSlide';

export const SlideContent = ({ slide, slideId, channel, isPresenter, codeState, whiteboardState }) => {
  if (!slide) return null;

  return (
    <>
      {slide.type === 'content' && (
        <div style={{padding: "2em", height: '100%', display: 'flex', flexDirection: 'column'}}>
          <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
          <div className="flex-grow relative">
            {slide.elements ? (
               <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: slide.layout?.direction || 'row',
                    alignItems: slide.layout?.alignItems || 'flex-start',
                    justifyContent: slide.layout?.justifyContent || 'space-evenly',
                    gap: slide.layout?.gap || '1rem',
                  }}
               >
                  {slide.elements.map(el => (
                      <div 
                          key={el.id} 
                          style={{
                              maxWidth: '100%',
                              ...el.style
                          }}
                      >
                          {el.type === 'text' && <div style={{ whiteSpace: 'pre-wrap' }}>{el.content}</div>}
                          {el.type === 'image' && <img src={el.content} alt="" style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', ...el.style}} />}
                      </div>
                  ))}
               </div>
            ) : (
              <div className="prose prose-invert max-w-none text-text">
                {typeof slide.content === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: slide.content }} />
                ) : (
                  slide.content
                )}
              </div>
            )}
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
