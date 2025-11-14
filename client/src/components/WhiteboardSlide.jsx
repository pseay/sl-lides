import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const WhiteboardSlide = ({ socket, isPresenter }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  // Refs for drawing parameters to avoid re-triggering the main useEffect
  const toolRef = useRef('pen');
  const colorRef = useRef('#000000');
  const lineWidthRef = useRef(5);

  // State for updating the UI controls
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

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

    const draw = (x0, y0, x1, y1, drawTool, drawColor, drawLineWidth, emit) => {
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

      if (!emit) return;

      const { width, height } = canvas;
      socket.emit('drawing', {
        x0: x0 / width,
        y0: y0 / height,
        x1: x1 / width,
        y1: y1 / height,
        tool: drawTool,
        color: drawColor,
        lineWidth: drawLineWidth,
      });
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

    const handleDrawingEvent = (data) => {
      const { width, height } = canvas;
      draw(
        data.x0 * width,
        data.y0 * height,
        data.x1 * width,
        data.y1 * height,
        data.tool,
        data.color,
        data.lineWidth,
        false
      );
    };

    const handleClearEvent = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleBackgroundColorChangeEvent = (newColor) => {
      setBackgroundColor(newColor);
    };

    socket.on('drawing', handleDrawingEvent);
    socket.on('clearCanvas', handleClearEvent);
    socket.on('backgroundColorChange', handleBackgroundColorChangeEvent);

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
      socket.off('drawing', handleDrawingEvent);
      socket.off('clearCanvas', handleClearEvent);
      socket.off('backgroundColorChange', handleBackgroundColorChangeEvent);
    };
  }, [isPresenter, socket]);

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
    setBackgroundColor(newColor);
    socket.emit('backgroundColorChange', newColor);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clearCanvas');
  };

  return (
    <div className="w-full h-full flex flex-col">
      {isPresenter && (
        <div className="p-2 bg-gray-100 border-b border-gray-300 flex items-center gap-4 flex-wrap">
          <button onClick={() => handleToolChange('pen')} className={`px-3 py-1 text-sm rounded ${tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Pen</button>
          <button onClick={() => handleToolChange('eraser')} className={`px-3 py-1 text-sm rounded ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Eraser</button>
          
          <input type="color" value={color} onChange={(e) => handleColorChange(e.target.value)} disabled={tool === 'eraser'} className="w-8 h-8 p-0 border-none" />
          <input type="color" value={backgroundColor} onChange={(e) => handleBackgroundColorChange(e.target.value)} className="w-8 h-8 p-0 border-none" />

          <div className="flex items-center gap-2">
            <label className="text-sm">Size:</label>
            <input type="range" min="1" max="50" value={lineWidth} onChange={(e) => handleLineWidthChange(e.target.value)} />
            <span className="text-sm w-4">{lineWidth}</span>
          </div>

          <button onClick={handleClear} className="px-3 py-1 text-sm rounded bg-red-500 text-white ml-auto">Clear</button>
        </div>
      )}
      <div className="w-full h-[calc(100vh-200px)] flex-grow" style={{background: backgroundColor}}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
};

WhiteboardSlide.propTypes = {
  socket: PropTypes.object.isRequired,
  isPresenter: PropTypes.bool.isRequired,
};

export default WhiteboardSlide;