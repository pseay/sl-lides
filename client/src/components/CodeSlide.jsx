import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

export const CodeSlide = ({ slide, slideId, socket, isPresenter, showTitle = true }) => {
  const storageKey = `slide-${slideId}-code`;
  const [code, setCode] = useState(() => {
    const savedCode = sessionStorage.getItem(storageKey);
    return savedCode !== null ? savedCode : slide.initialCode || '';
  });
  const editorRef = useRef(null);

  useEffect(() => {
    // Student listeners
    if (!isPresenter) {
      const handler = (codeUpdate) => {
        if (codeUpdate[slideId] !== undefined) {
          const newCode = codeUpdate[slideId];
          setCode(newCode);
          sessionStorage.setItem(storageKey, newCode);
        }
      };
      socket.on('codeUpdate', handler);
      return () => socket.off('codeUpdate', handler);
    }
  }, [socket, slideId, isPresenter, storageKey]);

  // Presenter code change handler
  const handleCodeChange = (value) => {
    setCode(value);
    sessionStorage.setItem(storageKey, value);
    if (isPresenter) {
      socket.emit('codeChange', { slideId, code: value });
    }
  };

  const editorOptions = {
    readOnly: !isPresenter,
    minimap: { enabled: false },
    fontSize: 14,
    wordWrap: 'on',
    padding: { top: 16 },
  };

  return (
    <div className={`h-full flex flex-col ${!showTitle ? 'p-4 sm:p-6 h-screen' : ''}`}>
      {showTitle && <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>}
      
      {isPresenter && slide.description && (
        <div className="mb-4 text-text-secondary">
          {slide.description}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[450px]">
        <div className="border border-border rounded-md overflow-hidden">
          <Editor
            height="100%"
            language={slide.language || 'javascript'}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={editorOptions}
            onMount={(editor) => (editorRef.current = editor)}
          />
        </div>
        <div className="flex flex-col">
          {slide.showOutput && (
            <div className="bg-background border border-border rounded-md p-4 overflow-auto h-full">
              <h3 className="font-bold mb-2 text-green-400">Output:</h3>
              <pre className="text-text-secondary whitespace-pre-wrap">{code}</pre>
            </div>
          )}
          {slide.showExample && (
            <div className="bg-background border border-border rounded-md p-4 overflow-auto h-full mt-4">
              <h3 className="font-bold mb-2 text-blue-400">Example:</h3>
              <pre className="text-text-secondary whitespace-pre-wrap">{slide.example}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};