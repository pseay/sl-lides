import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { PresenterView } from './components/PresenterView';
import { StudentView } from './components/StudentView';
import slides from './slides/dominoSlides';

const bc = new BroadcastChannel('sling-slides'); // Direct instantiation

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [codeState, setCodeState] = useState({}); // Stores code for all slides { slideId: code }
  const [whiteboardState, setWhiteboardState] = useState({ // Stores whiteboard state for all slides
    backgroundColor: '#ffffff',
    drawings: [], 
  });

  useEffect(() => {
    // Handler for all incoming messages
    const messageHandler = (event) => {
      const { type, payload } = event.data;

      switch (type) {
        case 'slideChange':
          setCurrentSlide(payload);
          break;
        case 'requestSync':
          // Respond with current state
          bc.postMessage({
            type: 'doSync',
            payload: {
              currentSlide: currentSlide,
              codeState: codeState,
              whiteboardState: whiteboardState,
            },
            senderId: bc.name,
          });
          break;
        case 'doSync':
          // Only update if current tab isn't the one that initiated the sync
          if (event.data.senderId !== bc.name) { 
            setCurrentSlide(payload.currentSlide);
            setCodeState(payload.codeState || {});
            setWhiteboardState(payload.whiteboardState || { backgroundColor: '#ffffff', drawings: [] });
          }
          break;
        case 'codeChange':
          setCodeState(prev => ({ ...prev, [payload.slideId]: payload.code }));
          break;
        case 'backgroundColorChange':
          setWhiteboardState(prev => ({ ...prev, backgroundColor: payload }));
          break;
        case 'clearCanvas':
          setWhiteboardState(prev => ({ ...prev, drawings: [] }));
          break;
        case 'drawing':
          setWhiteboardState(prev => ({
            ...prev,
            drawings: [...prev.drawings, payload]
          }));
          break;
        default:
          break;
      }
    };

    bc.onmessage = messageHandler;

    // When this tab loads, request state from other tabs
    bc.postMessage({ type: 'requestSync', payload: {}, senderId: bc.name });

    return () => {
      bc.onmessage = null; // Clean up the message handler
    };
  }, [currentSlide, codeState, whiteboardState]); // Added dependencies for state syncing

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    bc.postMessage({ type: 'slideChange', payload: index });
  };

  const PresenterLayout = () => (
    <div className="h-screen flex flex-col">
      <header className="p-2 bg-surface border-b border-border flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-text-default">Sling Slides</h1>
          {/* Slide Navigation */}
          <div className="flex items-center justify-between w-1/2">
            {/* Previous Button */}
            <button
              onClick={() => handleSlideChange(Math.max(0, currentSlide - 1))}
              className="px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium text-text-secondary hover:text-text hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Slide Indicators */}
            <div className="flex gap-2">
              {slides.length <= 8 ? (
                slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlideChange(index)}
                    className={`h-8 w-8 rounded-full transition-colors ${
                      currentSlide === index
                        ? 'bg-primary'
                        : 'bg-border hover:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  >{index}</button>
                ))
              ) : (
                <>
                  {/* Always show first slide */}
                  <button
                    key={0}
                    onClick={() => handleSlideChange(0)}
                    className={`h-8 w-8 rounded-full transition-colors ${
                      currentSlide === 0
                        ? 'bg-primary'
                        : 'bg-border hover:bg-gray-600'
                    }`}
                    aria-label={`Go to slide 1`}
                  >0</button>

                  {/* Ellipsis if currentSlide is far from the beginning */}
                  {currentSlide > 3 && <span className="text-text-secondary">...</span>}

                  {/* Slides around current slide */}
                  {slides.map((_, index) => {
                    if (
                      (index >= currentSlide - 2 && index <= currentSlide + 2) &&
                      index !== 0 &&
                      index !== slides.length - 1
                    ) {
                      return (
                        <button
                          key={index}
                          onClick={() => handleSlideChange(index)}
                          className={`h-8 w-8 rounded-full transition-colors ${
                            currentSlide === index
                              ? 'bg-primary'
                              : 'bg-border hover:bg-gray-600'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        >{index}</button>
                      );
                    }
                    return null;
                  })}

                  {/* Ellipsis if currentSlide is far from the end */}
                  {currentSlide < slides.length - 4 && <span className="text-text-secondary">...</span>}

                  {/* Always show last slide */}
                  {slides.length > 1 && (
                    <button
                      key={slides.length - 1}
                      onClick={() => handleSlideChange(slides.length - 1)}
                      className={`h-8 w-8 rounded-full transition-colors ${
                        currentSlide === slides.length - 1
                          ? 'bg-primary'
                          : 'bg-border hover:bg-gray-600'
                      }`}
                      aria-label={`Go to slide ${slides.length}`}
                    >{slides.length - 1}</button>
                  )}
                </>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handleSlideChange(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              className="px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium text-secondary hover:text-default hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <Link
            to="/presentation"
            target="_blank"
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-primary text-white hover:bg-primary-hover"
          >
            Open Presentation View
          </Link>
        </div>
      </header>
      <main className="flex-grow overflow-y-auto">
        <div className="p-2">
          <PresenterView
            slides={slides}
            currentSlide={currentSlide}
            onSlideChange={handleSlideChange}
            channel={bc}
            codeState={codeState}
            whiteboardState={whiteboardState}
          />
        </div>
      </main>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<PresenterLayout />} />
      <Route path="/presentation" element={
        <StudentView
          slides={slides}
          currentSlide={currentSlide}
          channel={bc}
          codeState={codeState}
          whiteboardState={whiteboardState}
          key={currentSlide}
        />
      } />
    </Routes>
  );
}

export default App;