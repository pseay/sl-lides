import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { PresenterView } from './components/PresenterView';
import { StudentView } from './components/StudentView';
import { SlideEditor } from './components/SlideEditor';

const bc = new BroadcastChannel('sling-slides');

const defaultSlides = [
  {
    id: '1',
    type: 'content',
    title: 'A new section problem - Dominoes!',
    content: `
      <div>
        <p>Preston Seay</p>
        <br>
        <h3 class="text-xl mb-4">Presentation Plan</h3>
        <ul class="list-disc list-inside space-y-2 text-lg">
          <li>The game</li>
          <li>The problem</li>
          <li>The Solution</li>
          <li>Why?</li>
          <li>Bonus???</li>
        </ul>
      </div>
    `
  },
  {
    id: '2',
    type: 'content',
    title: 'Mexican Train',
    content: `
      <div class='flex flex-row justify-center' style='gap: 2em'>
        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.thirtyhandmadedays.com%2Fwp-content%2Fuploads%2F2020%2F05%2Fhow-to-play-mexican-train.jpg&f=1&nofb=1&ipt=66e756a5b42f17129130e00b835741bf1462b1766664521172ab55e6106af619" alt="How to play Mexican Train" width="30%" />
        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F3%2F38%2FMexican_Train.jpg%2F660px-Mexican_Train.jpg&f=1&nofb=1&ipt=ad076fa6ee1a071377502a1ca4ebde0894f7b3e87c29f652683bf20c1e9e1d62" alt="Playing Mexican Train" width="30%" />
      </div>
    `
  },
  {
    id: '3',
    type: 'content',
    title: 'Mexican Train',
    content: `
      <div class='flex flex-row justify-center' style='gap: 2em'>
        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi2.wp.com%2Fwww.glowingeyegames.com%2Fwp-content%2Fuploads%2F2018%2F07%2FMTDC-iPad-shot01.jpeg&f=1&nofb=1&ipt=3c157f620b28feb4fbbc58680501038080c19e93689dcd216af2c2ed4a98be34" alt="The rule for us" width="30%" />
      </div>
    `
  },
  {
    id: '4',
    type: 'code',
    title: 'The Domino Class',
    language: 'cpp',
    initialCode: `// domino.h
class Domino {
public:
    Domino(int left, int right);
    bool canFollow(Domino first) const;
    void flip();
private:
    // We don't care. We'll just use the class.
}`
  },
  {
    id: '5',
    type: 'code',
    title: 'Using the Domino Class',
    language: 'cpp',
    initialCode: `// demo.cpp
#include "domino.h"
#include <iostream>
using namespace std;

int main() {
    Domino oneTwo(1, 2);
    Domino twoThree(2, 3);
    cout << twoThree.canFollow(oneTwo) << endl;
    cout << oneTwo.canFollow(twoThree) << endl;

    oneTwo.flip();
}`
  },
  {
    id: '6',
    type: 'content',
    title: 'Our Problem - Finding the longest train',
    content: `
      <p>Input: A list of dominos.</p>
      <p>Output: The dominos of our longest train, in order.</p>
      <pre lang='cpp'>Vector<Domino> calculateLongestTrain(Vector<Domino>& tiles, Domino starter);</pre>
    `
  },
  {
    id: '7',
    type: 'code',
    title: 'The solution',
    language: 'cpp',
    initialCode: `Vector<Domino> calculateLongestTrain(Vector<Domino>& tiles, Domino starter) {
    // Get the longest train here.
}`,
    solution: `void longTrainHelper(Vector<Domino>& tiles, Vector<Domino> soFar, Vector<Domino>& best) {
    // We've found it!
    if (soFar.size() > best.size) {
      best = soFar;
    }
    
    // Try all possible dominos & rotations.
    for (int i = 0; i < tiles.size(); i++) {
      // Choose tile.
      Domino cur = tiles.remove(i);

      for (int j = 0; j < 2; j++) {
        Domino& end = soFar[soFar.size() - 1];
        if (cur.canFollow(end)) {
          // Explore.
          longTrainHelper(tiles, soFar + cur, best)
        }
        cur.flip();
      }

      // Unchoose tile.
      tiles.insert(cur, i);
    }
}
Vector<Domino> calculateLongestTrain(Vector<Domino>& tiles, Domino starter) {
    Vector<Domino> starterTrain = { starter };
    Vector<Domino> best = { starter };
    longTrainHelper(tiles, starterTrain, best);
    return best;
}`
  },
  {
    id: '8',
    type: 'content',
    title: 'Why?',
    content: `
      <p>This was the first recursion problem I solved...</p>
      <p>I solved it in 6th grade...</p>
      <p>But I didn't use recursion...</p>
      <p>I used 15 nested loops.</p>
      <p>106B students should know better!</p>
      <p>BONUS: This will lead well into the Puzzle problem. Very similar with question: "What are all of the options we can consider next?"</p>
    `
  },
  {
    id: '9',
    type: 'whiteboard',
    title: 'Demo'
  },
  {
    id: '10',
    type: 'content',
    title: 'Questions?',
    content: '<p class="text-2xl">What questions do you have?</p>'
  }
];

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [codeState, setCodeState] = useState({});
  const [whiteboardState, setWhiteboardState] = useState({
    backgroundColor: '#ffffff',
    drawings: [], 
  });

  // Initialize slides from localStorage or default
  useEffect(() => {
    const savedSlides = localStorage.getItem('sling-slides-data');
    if (savedSlides) {
      try {
        setSlides(JSON.parse(savedSlides));
      } catch (e) {
        console.error("Failed to parse slides from localStorage", e);
        setSlides(defaultSlides);
      }
    } else {
      setSlides(defaultSlides);
    }
  }, []);

  const saveSlides = (newSlides) => {
    setSlides(newSlides);
    localStorage.setItem('sling-slides-data', JSON.stringify(newSlides));
    // Reset current slide if it goes out of bounds
    if (currentSlide >= newSlides.length) {
      setCurrentSlide(Math.max(0, newSlides.length - 1));
    }
  };

  useEffect(() => {
    const messageHandler = (event) => {
      const { type, payload } = event.data;

      switch (type) {
        case 'slideChange':
          setCurrentSlide(payload);
          break;
        case 'requestSync':
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
    bc.postMessage({ type: 'requestSync', payload: {}, senderId: bc.name });

    return () => {
      bc.onmessage = null;
    };
  }, [currentSlide, codeState, whiteboardState]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    bc.postMessage({ type: 'slideChange', payload: index });
  };

  const PresenterLayout = () => {
    if (slides.length === 0) return <div>Loading slides...</div>;
    
    return (
      <div className="h-screen flex flex-col">
        <header className="p-2 bg-surface border-b border-border flex-shrink-0">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Link to="/" className="text-xl font-bold text-text-default hover:text-primary transition-colors">Sling Slides</Link>
              <span className="text-text-secondary text-sm px-2 py-1 bg-surface-hover rounded">Presenter View</span>
            </div>
            
            <div className="flex items-center justify-between w-1/2">
              <button
                onClick={() => handleSlideChange(Math.max(0, currentSlide - 1))}
                className="px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium text-text-secondary hover:text-text hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentSlide === 0}
              >
                Previous
              </button>

              <div className="flex gap-2 overflow-hidden px-2">
                 {/* Simplified pagination for now */}
                 <span className="text-text-default font-mono">
                   {currentSlide + 1} / {slides.length}
                 </span>
              </div>

              <button
                onClick={() => handleSlideChange(Math.min(slides.length - 1, currentSlide + 1))}
                disabled={currentSlide === slides.length - 1}
                className="px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium text-secondary hover:text-default hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="flex gap-2">
               <Link
                to="/"
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-gray-600 text-white hover:bg-gray-700"
              >
                Edit Slides
              </Link>
              <Link
                to="/presentation"
                target="_blank"
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-primary text-white hover:bg-primary-hover"
              >
                Student View
              </Link>
            </div>
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
  };

  return (
    <Routes>
      <Route path="/" element={
        <SlideEditor 
          slides={slides} 
          setSlides={setSlides} 
          onSave={saveSlides} 
        />
      } />
      <Route path="/presenter" element={<PresenterLayout />} />
      <Route path="/presentation" element={
        slides.length > 0 ? (
          <StudentView
            slides={slides}
            currentSlide={currentSlide}
            channel={bc}
            codeState={codeState}
            whiteboardState={whiteboardState}
            key={currentSlide}
          />
        ) : (
          <div className="flex items-center justify-center h-screen text-white">Loading presentation...</div>
        )
      } />
    </Routes>
  );
}

export default App;
