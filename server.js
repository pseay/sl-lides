const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

let currentSlide = 0;
let slideCode = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Send current state to newly connected client
  socket.emit('slideChange', currentSlide);
  socket.emit('codeUpdate', slideCode);

  // Handle slide navigation
  socket.on('changeSlide', (slideIndex) => {
    currentSlide = slideIndex;
    io.emit('slideChange', slideIndex);
  });

  // Handle live code updates
  socket.on('codeChange', ({ slideId, code }) => {
    slideCode[slideId] = code;
    socket.broadcast.emit('codeUpdate', { [slideId]: code });
  });

  // Handle whiteboard drawing
  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  // Handle clear canvas
  socket.on('clearCanvas', () => {
    io.emit('clearCanvas'); // Broadcast to all clients
  });

  socket.on('backgroundColorChange', (newColor) => {
    socket.broadcast.emit('backgroundColorChange', newColor);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});