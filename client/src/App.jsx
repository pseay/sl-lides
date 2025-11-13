import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { PresenterView } from './components/PresenterView';
import { StudentView } from './components/StudentView';
import slides from './slides/linkedListSlides';

const socket = io('http://localhost:3001');

function App() {
  const [isPresenter, setIsPresenter] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    socket.on('slideChange', (index) => {
      setCurrentSlide(index);
    });

    return () => socket.off('slideChange');
  }, []);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    socket.emit('changeSlide', index);
  };

  return (
    <div className="min-h-screen">
      <header className="p-4 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-text-default">Sling Slides</h1>
          <button
            onClick={() => setIsPresenter(!isPresenter)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isPresenter 
                ? 'bg-primary text-white hover:bg-primary-hover' 
                : 'bg-surface text-text-secondary hover:text-text-default'
            }`}
          >
            {isPresenter ? 'Presenter Mode' : 'Student Mode'}
          </button>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        {isPresenter ? (
          <PresenterView
            slides={slides}
            currentSlide={currentSlide}
            onSlideChange={handleSlideChange}
            socket={socket}
            key={currentSlide}
          />
        ) : (
          <StudentView
            slides={slides}
            currentSlide={currentSlide}
            socket={socket}
            key={currentSlide}
          />
        )}
      </main>
    </div>
  );
}

export default App;