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
    layout: {
      direction: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      gap: '1rem'
    },
    elements: [
      {
        id: '1-1',
        type: 'text',
        content: 'Preston Seay',
        style: { fontSize: '20px' }
      },
      {
        id: '1-2',
        type: 'text',
        content: 'Presentation Plan',
        style: { fontSize: '24px', fontWeight: 'bold', marginTop: '1rem' }
      },
      {
        id: '1-3',
        type: 'list',
        items: [
          'The game',
          'The problem',
          'The Solution',
          'Why?',
          'Bonus???'
        ],
        style: { fontSize: '20px' }
      }
    ]
  },
  {
    id: '2',
    type: 'content',
    title: 'Mexican Train',
    layout: {
      direction: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem'
    },
    elements: [
      {
        id: '2-1',
        type: 'image',
        content: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.thirtyhandmadedays.com%2Fwp-content%2Fuploads%2F2020%2F05%2Fhow-to-play-mexican-train.jpg&f=1&nofb=1&ipt=66e756a5b42f17129130e00b835741bf1462b1766664521172ab55e6106af619',
        style: { width: '400px' }
      },
      {
        id: '2-2',
        type: 'image',
        content: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F3%2F38%2FMexican_Train.jpg%2F660px-Mexican_Train.jpg&f=1&nofb=1&ipt=ad076fa6ee1a071377502a1ca4ebde0894f7b3e87c29f652683bf20c1e9e1d62',
        style: { width: '400px' }
      }
    ]
  },
  {
    id: '3',
    type: 'content',
    title: 'Mexican Train',
    layout: {
      direction: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem'
    },
    elements: [
      {
        id: '3-1',
        type: 'image',
        content: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi2.wp.com%2Fwww.glowingeyegames.com%2Fwp-content%2Fuploads%2F2018%2F07%2FMTDC-iPad-shot01.jpeg&f=1&nofb=1&ipt=3c157f620b28feb4fbbc58680501038080c19e93689dcd216af2c2ed4a98be34',
        style: { width: '500px' }
      }
    ]
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
    layout: {
      direction: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: '1rem'
    },
    elements: [
      {
        id: '6-1',
        type: 'text',
        content: 'Input: A list of dominos.\nOutput: The dominos of our longest train, in order.',
        style: { fontSize: '24px' }
      },
      {
        id: '6-2',
        type: 'text',
        content: 'Vector<Domino> calculateLongestTrain(Vector<Domino>& tiles, Domino starter);',
        style: { fontFamily: 'monospace', fontSize: '19px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px' }
      }
    ]
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
    layout: {
      direction: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      gap: '1rem'
    },
    elements: [
      {
        id: '8-1',
        type: 'list',
        items: [
          'This was the first recursion problem I solved...',
          'I solved it in 6th grade...',
          'But I didn\'t use recursion...',
          'I used 15 nested loops.',
          '106B students should know better!',
          'BONUS: This will lead well into the Puzzle problem. Very similar with question: "What are all of the options we can consider next?"'
        ],
        style: { fontSize: '24px' }
      }
    ]
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
    layout: {
      direction: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem'
    },
    elements: [
      {
        id: '10-1',
        type: 'text',
        content: 'What questions do you have?',
        style: { fontSize: '32px' }
      }
    ]
  }
];

const countSteps = (slide) => {
  if (!slide) return 0;
  if (slide.type === 'content') {
    if (slide.elements) {
      let count = 0;
      slide.elements.forEach(el => {
        if (el.type === 'list' && Array.isArray(el.items)) {
          count += el.items.length;
        }
      });
      return count;
    }
    if (typeof slide.content === 'string') {
      const matches = slide.content.match(/<li/g);
      return matches ? matches.length : 0;
    }
  }
  return 0;
};

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [slides, setSlides] = useState([]);
  const [codeState, setCodeState] = useState({});
  const [whiteboardState, setWhiteboardState] = useState({
    backgroundColor: '#ffffff',
    drawings: [], 
  });

  // Initialize slides from localStorage or default
  useEffect(() => {
    const savedSlides = localStorage.getItem('sling-slides-data-v2');
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
    localStorage.setItem('sling-slides-data-v2', JSON.stringify(newSlides));
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
          setCurrentStep(0);
          break;
        case 'stepChange':
          setCurrentStep(payload);
          break;
        case 'requestSync':
          bc.postMessage({
            type: 'doSync',
            payload: {
              currentSlide: currentSlide,
              currentStep: currentStep,
              codeState: codeState,
              whiteboardState: whiteboardState,
            },
            senderId: bc.name,
          });
          break;
        case 'doSync':
          if (event.data.senderId !== bc.name) { 
            setCurrentSlide(payload.currentSlide);
            setCurrentStep(payload.currentStep || 0);
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
  }, [currentSlide, currentStep, codeState, whiteboardState]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    setCurrentStep(0);
    bc.postMessage({ type: 'slideChange', payload: index });
  };

  const goToNext = () => {
    const slide = slides[currentSlide];
    const steps = countSteps(slide);
    if (currentStep < steps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      bc.postMessage({ type: 'stepChange', payload: nextStep });
    } else if (currentSlide < slides.length - 1) {
      handleSlideChange(currentSlide + 1);
    }
  };

  const goToPrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      bc.postMessage({ type: 'stepChange', payload: prevStep });
    } else if (currentSlide > 0) {
      handleSlideChange(currentSlide - 1);
    }
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
                onClick={goToPrev}
                className="px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium text-text-secondary hover:text-text hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentSlide === 0 && currentStep === 0}
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
                onClick={goToNext}
                disabled={currentSlide === slides.length - 1 && currentStep >= countSteps(slides[currentSlide])}
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
              onNext={goToNext}
              onPrev={goToPrev}
              channel={bc}
              codeState={codeState}
              whiteboardState={whiteboardState}
              currentStep={currentStep}
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
            currentStep={currentStep}
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
