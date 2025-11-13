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
        <div className="mb-4 text-gray-300">
          {slide.description}
        </div>
      )}

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-[400px]">
        <div className="border border-gray-600 rounded">
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
            }}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
          />
        </div>

        {slide.showOutput && (
          <div className="bg-gray-900 border border-gray-600 rounded p-4 overflow-auto">
            <h3 className="font-bold mb-2 text-green-400">Output:</h3>
            <pre className="text-gray-300 whitespace-pre-wrap">{code}</pre>
          </div>
        )}

        {slide.showExample && (
          <div className="bg-gray-900 border border-gray-600 rounded p-4 overflow-auto">
            <h3 className="font-bold mb-2 text-blue-400">Example:</h3>
            <pre className="text-gray-300 whitespace-pre-wrap">{slide.example}</pre>
          </div>
        )}
      </div>
    </div>
  );
};