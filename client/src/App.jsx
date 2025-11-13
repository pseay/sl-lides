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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Coding Class Slideshow</h1>
          <button
            onClick={() => setIsPresenter(!isPresenter)}
            className={`px-4 py-2 rounded ${
              isPresenter 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isPresenter ? 'Presenter Mode' : 'Student Mode'}
          </button>
        </div>
      </div>

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
    </div>
  );
}

export default App;