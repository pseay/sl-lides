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