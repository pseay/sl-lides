import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import io from 'socket.io-client';
import { PresenterView } from './components/PresenterView';
import { StudentView } from './components/StudentView';
import slides from './slides/dominoSlides';

const socket = io('http://localhost:3001');

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Listen for slide changes from the server
    socket.on('slideChange', (index) => {
      setCurrentSlide(index);
    });

    // Request initial state on connect
    socket.on('connect', () => {
      // This could be an explicit event from the server if needed
    });

    return () => {
      socket.off('slideChange');
      socket.off('connect');
    };
  }, []);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    socket.emit('changeSlide', index);
  };

  const PresenterLayout = () => (
    <div className="h-screen flex flex-col">
      <header className="p-2 bg-surface border-b border-border flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-text-default">Sling Slides</h1>
          {/* Slide Navigation */}
          <div className="flex items-center gap-4">
            {/* Previous Button */}
            <button
              onClick={() => handleSlideChange(Math.max(0, currentSlide - 1))}
              className="px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium text-text-secondary hover:text-text hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Slide Indicators */}
            <div className="flex gap-2">
              {slides.map((_, index) => (
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
              ))}
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
            socket={socket}
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
          socket={socket}
          key={currentSlide}
        />
      } />
    </Routes>
  );
}

export default App;