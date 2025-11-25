import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Editor from '@monaco-editor/react';

export const CodeSlide = ({ slide, slideId, channel, isPresenter, showTitle = true, codeState }) => {
  const storageKey = `slide-${slideId}-code`;
  // Presenter manages code locally and broadcasts. Students get code from centralized codeState.
  const [localCode, setLocalCode] = useState(() => {
    if (isPresenter) {
      const savedCode = sessionStorage.getItem(storageKey);
      return savedCode !== null ? savedCode : slide.initialCode || '';
    }
    return codeState[slideId] || slide.initialCode || '';
  });

  const editorRef = useRef(null);

  // Update local code if presenter changes or if student and codeState updates
  useEffect(() => {
    if (!isPresenter) {
      setLocalCode(codeState[slideId] || slide.initialCode || '');
    } else {
      // For presenter, ensure local code reflects sessionStorage on mount/remount
      const savedCode = sessionStorage.getItem(storageKey);
      setLocalCode(savedCode !== null ? savedCode : slide.initialCode || '');
    }
  }, [slideId, isPresenter, codeState, slide.initialCode, storageKey]);


  // Presenter code change handler
  const handleCodeChange = (value) => {
    setLocalCode(value);
    sessionStorage.setItem(storageKey, value);
    if (isPresenter) {
      channel.postMessage({ type: 'codeChange', payload: { slideId, code: value } });
    }
  };

  const editorOptions = {
    readOnly: !isPresenter,
    minimap: { enabled: false },
    fontSize: 14,
    wordWrap: 'on',
    padding: { top: 16 },
  };

  const currentCode = isPresenter ? localCode : (codeState[slideId] || slide.initialCode || '');

  return (
    <div className={`h-full flex flex-col ${!showTitle ? 'p-4 sm:p-6 h-screen' : ''}`}>
      {showTitle && <h2 className="m-4 text-3xl font-bold mb-4">{slide.title}</h2>}
      
      {isPresenter && slide.description && (
        <div className="mb-4 text-text-secondary">
          {slide.description}
        </div>
      )}

      <div className={`flex flex-1 gap-6 mx-4 ${isPresenter ? "min-h-[450px]" : "min-h-[80svh]"}`}>
        <div className="flex-1 border border-border rounded-md overflow-hidden">
          <Editor
            height="100%"
            language={slide.language || 'javascript'}
            value={currentCode}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={editorOptions}
            onMount={(editor) => (editorRef.current = editor)}
          />
        </div>
        {slide.showOutput && slide.showExample &&
          <div className="flex flex-col">
            {slide.showOutput && (
              <div className="bg-background border border-border rounded-md p-4 overflow-auto h-full">
                <h3 className="font-bold mb-2 text-green-400">Output:</h3>
                <pre className="text-text-secondary whitespace-pre-wrap">{currentCode}</pre>
              </div>
            )}
            {slide.showExample && (
              <div className="bg-background border border-border rounded-md p-4 overflow-auto h-full mt-4">
                <h3 className="font-bold mb-2 text-blue-400">Example:</h3>
                <pre className="text-text-secondary whitespace-pre-wrap">{slide.example}</pre>
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
};

CodeSlide.propTypes = {
  slide: PropTypes.object.isRequired,
  slideId: PropTypes.number.isRequired,
  channel: PropTypes.object.isRequired,
  isPresenter: PropTypes.bool.isRequired,
  showTitle: PropTypes.bool,
  codeState: PropTypes.object.isRequired,
};