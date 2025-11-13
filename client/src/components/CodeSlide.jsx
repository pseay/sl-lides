import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

export const CodeSlide = ({ slide, slideId, socket, isPresenter, showTitle = true }) => {
  const [code, setCode] = useState(slide.initialCode || '');
  const editorRef = useRef(null);

  useEffect(() => {
    // Student listeners
    if (!isPresenter) {
      const handler = (codeUpdate) => {
        if (codeUpdate[slideId] !== undefined) {
          setCode(codeUpdate[slideId]);
        }
      };
      socket.on('codeUpdate', handler);
      return () => socket.off('codeUpdate', handler);
    }
  }, [socket, slideId, isPresenter]);

  // Presenter code change handler
  const handleCodeChange = (value) => {
    setCode(value);
    if (isPresenter) {
      socket.emit('codeChange', { slideId, code: value });
    }
  };

  const editorOptions = (isReadOnly) => ({
    readOnly: isReadOnly,
    minimap: { enabled: false },
    fontSize: 14,
    wordWrap: 'on',
    padding: { top: 16 },
  });

  // Presenter view with solution
  const renderPresenterSolutionView = () => (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[450px]">
      {/* Column 1: Solution */}
      <div className="flex flex-col">
        <h3 className="font-bold mb-2 text-blue-400">Solution (Presenter Only)</h3>
        <div className="flex-1 border border-border rounded-md overflow-hidden">
          <Editor
            height="100%"
            language={slide.language || 'javascript'}
            value={slide.solution}
            theme="vs-dark"
            options={editorOptions(true)}
          />
        </div>
      </div>

      {/* Column 2: Live Code */}
      <div className="flex flex-col">
        <h3 className="font-bold mb-2 text-green-400">Live Code (Student View)</h3>
        <div className="flex-1 border border-border rounded-md overflow-hidden">
          <Editor
            height="100%"
            language={slide.language || 'javascript'}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={editorOptions(false)}
            onMount={(editor) => (editorRef.current = editor)}
          />
        </div>
      </div>

      {/* Column 3: Output/Example */}
      <div className="flex flex-col">
        {slide.showOutput && (
          <div className="bg-background border border-border rounded-md p-4 overflow-auto h-full">
            <h3 className="font-bold mb-2 text-yellow-400">Output:</h3>
            <pre className="text-text-secondary whitespace-pre-wrap">{code}</pre>
          </div>
        )}
        {slide.showExample && (
           <div className="bg-background border border-border rounded-md p-4 overflow-auto h-full">
            <h3 className="font-bold mb-2 text-yellow-400">Example:</h3>
            <pre className="text-text-secondary whitespace-pre-wrap">{slide.example}</pre>
          </div>
        )}
      </div>
    </div>
  );

  // Standard student or simple code slide view
  const renderStandardView = () => (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[450px]">
      <div className="border border-border rounded-md overflow-hidden">
        <Editor
          height="100%"
          language={slide.language || 'javascript'}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={editorOptions(!isPresenter)}
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
          <div className="bg-background border border-border rounded-md p-4 overflow-auto h-full">
            <h3 className="font-bold mb-2 text-blue-400">Example:</h3>
            <pre className="text-text-secondary whitespace-pre-wrap">{slide.example}</pre>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`h-full flex flex-col ${!showTitle ? 'p-4 sm:p-6 h-screen' : ''}`}>
      {showTitle && <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>}
      
      {isPresenter && slide.description && (
        <div className="mb-4 text-text-secondary">
          {slide.description}
        </div>
      )}

      {isPresenter && slide.solution ? renderPresenterSolutionView() : renderStandardView()}
    </div>
  );
};