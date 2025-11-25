import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const WhiteboardSlide = ({ channel, isPresenter, whiteboardState }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  // Refs for drawing parameters to avoid re-triggering the main useEffect
  const toolRef = useRef('pen');
  const colorRef = useRef('#000000');
  const lineWidthRef = useRef(5);

  // State for updating the UI controls (only for presenter)
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  // backgroundColor is now controlled by whiteboardState from props

  // useCallback to memoize draw function
  const draw = useCallback((x0, y0, x1, y1, drawTool, drawColor, drawLineWidth, emit) => {
    const context = contextRef.current;
    if (!context) return;

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = drawLineWidth;

    if (drawTool === 'pen') {
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = drawColor;
    } else if (drawTool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
    }
    
    context.stroke();
    context.closePath();

    if (!emit) return; // Only emit if triggered by local action (presenter)

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas;
    channel.postMessage({
      type: 'drawing',
      payload: {
        x0: x0 / width,
        y0: y0 / height,
        x1: x1 / width,
        y1: y1 / height,
        tool: drawTool,
        color: drawColor,
        lineWidth: drawLineWidth,
      }
    });
  }, [channel]); // Only re-create if channel changes

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    contextRef.current = context;
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.drawImage(canvas, 0, 0);
      
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      
      context.drawImage(tempCanvas, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const getPosition = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if (e.touches && e.touches.length > 0) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY,
        };
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const handleStart = (e) => {
      if (!isPresenter) return;
      e.preventDefault();
      drawingRef.current = true;
      lastPositionRef.current = getPosition(e);
    };

    const handleMove = (e) => {
      if (!isPresenter || !drawingRef.current) return;
      e.preventDefault();
      const currentPosition = getPosition(e);
      draw(
        lastPositionRef.current.x,
        lastPositionRef.current.y,
        currentPosition.x,
        currentPosition.y,
        toolRef.current,
        colorRef.current,
        lineWidthRef.current,
        true
      );
      lastPositionRef.current = currentPosition;
    };

    const handleEnd = (e) => {
      if (!isPresenter) return;
      e.preventDefault();
      drawingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseout', handleEnd);
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);
    canvas.addEventListener('touchcancel', handleEnd);

    // No local messageHandler for channel.onmessage here, App.jsx handles it

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('mouseout', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
      canvas.removeEventListener('touchcancel', handleEnd);
    };
  }, [isPresenter, draw]); // Added draw as dependency

  // Effect to re-draw history when whiteboardState.drawings changes (for students) or on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    // Clear canvas before re-drawing, effectively handling clearCanvas too
    context.clearRect(0, 0, canvas.width, canvas.height);

    whiteboardState.drawings.forEach(data => {
      draw(
        data.x0 * canvas.width,
        data.y0 * canvas.height,
        data.x1 * canvas.width,
        data.y1 * canvas.height,
        data.tool,
        data.color,
        data.lineWidth,
        false // Do not emit, just draw
      );
    });
  }, [whiteboardState.drawings, draw]); // Re-draw when drawing history updates




  const handleToolChange = (newTool) => {
    toolRef.current = newTool;
    setTool(newTool);
  };

  const handleColorChange = (newColor) => {
    colorRef.current = newColor;
    setColor(newColor);
  };

  const handleLineWidthChange = (newLineWidth) => {
    lineWidthRef.current = newLineWidth;
    setLineWidth(newLineWidth);
  };

  const handleBackgroundColorChange = (newColor) => {
    channel.postMessage({ type: 'backgroundColorChange', payload: newColor });
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;

    // Clear locally for the presenter's view
    if (isPresenter && context && canvas) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Always post message to clear other tabs (students)
    channel.postMessage({ type: 'clearCanvas', payload: {} });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {isPresenter && (
        <div className="p-2 bg-gray-100 border-b border-gray-300 flex items-center gap-4 flex-wrap text-black">
          <div className='border border-black'>
            <button onClick={() => handleToolChange('pen')} className={`px-3 py-1 text-sm ${tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>Pen</button>
            <button onClick={() => handleToolChange('eraser')} className={`px-3 py-1 text-sm ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>Eraser</button>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm">Tool:</label>
            <input type="color" value={color} onChange={(e) => handleColorChange(e.target.value)} disabled={tool === 'eraser'} className="w-8 h-8 p-0 border-none disabled:cursor-not-allowed" />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Background:</label>
            <input type="color" value={whiteboardState.backgroundColor} onChange={(e) => handleBackgroundColorChange(e.target.value)} className="w-8 h-8 p-0 border-none" />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Size:</label>
            <input type="range" min="1" max="50" value={lineWidth} onChange={(e) => handleLineWidthChange(e.target.value)} />
            <span className="text-sm w-4">{lineWidth}</span>
          </div>

          <button onClick={handleClear} className="px-3 py-1 text-sm rounded bg-red-500 text-white ml-auto">Clear</button>
        </div>
      )}
      <div className={`flex-grow ${isPresenter ? "w-full" : "w-4/5 mx-auto my-5"}`} >
        <div className="relative w-full" style={{ paddingTop: '56.25%', background: whiteboardState.backgroundColor }}>
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default WhiteboardSlide;