import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const WhiteboardSlide = ({ socket, isPresenter }) => {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Resize canvas to fit container
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 5;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = (x0, y0, x1, y1, emit) => {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.closePath();

      if (!emit) {
        return;
      }

      const { width, height } = canvas;
      socket.emit('drawing', {
        x0: x0 / width,
        y0: y0 / height,
        x1: x1 / width,
        y1: y1 / height,
      });
    };

    const handleMouseDown = (e) => {
      if (!isPresenter) return;
      drawingRef.current = true;
      lastPositionRef.current = { x: e.offsetX, y: e.offsetY };
    };

    const handleMouseMove = (e) => {
      if (!isPresenter || !drawingRef.current) return;
      draw(lastPositionRef.current.x, lastPositionRef.current.y, e.offsetX, e.offsetY, true);
      lastPositionRef.current = { x: e.offsetX, y: e.offsetY };
    };

    const handleMouseUp = () => {
      if (!isPresenter) return;
      drawingRef.current = false;
    };
    
    const handleMouseOut = () => {
        if (!isPresenter) return;
        drawingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseOut);

    const handleDrawingEvent = (data) => {
      const { width, height } = canvas;
      draw(data.x0 * width, data.y0 * height, data.x1 * width, data.y1 * height, false);
    };

    socket.on('drawing', handleDrawingEvent);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseout', handleMouseOut);
      socket.off('drawing', handleDrawingEvent);
    };
  }, [isPresenter, socket]);


  return (
    <div className="w-full h-[calc(100vh-200px)]" style={{background: "white"}}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

WhiteboardSlide.propTypes = {
  socket: PropTypes.object.isRequired,
  isPresenter: PropTypes.bool.isRequired,
};

export default WhiteboardSlide;
