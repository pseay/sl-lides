import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

export const CodeSlide = ({ slide, slideId, socket, isPresenter }) => {
  const [code, setCode] = useState(slide.initialCode || '');
  const editorRef = useRef(null);

  useEffect(() => {
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

  const handleCodeChange = (value) => {
    setCode(value);
    if (isPresenter) {
      socket.emit('codeChange', { slideId, code: value });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
      
      {slide.description && (
        <div className="mb-4 text-text-secondary">
          {slide.description}
        </div>
      )}

      <div className="flex-1 grid grid-cols-2 gap-6 min-h-[450px]">
        <div className="border border-border rounded-md overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage={slide.language || 'javascript'}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              readOnly: !isPresenter,
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              padding: { top: 16 },
            }}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
          />
        </div>

        {slide.showOutput && (
          <div className="bg-background border border-border rounded-md p-4 overflow-auto">
            <h3 className="font-bold mb-2 text-green-400">Output:</h3>
            <pre className="text-text-secondary whitespace-pre-wrap">{code}</pre>
          </div>
        )}

        {slide.showExample && (
          <div className="bg-background border border-border rounded-md p-4 overflow-auto">
            <h3 className="font-bold mb-2 text-blue-400">Example:</h3>
            <pre className="text-text-secondary whitespace-pre-wrap">{slide.example}</pre>
          </div>
        )}
      </div>
    </div>
  );
};