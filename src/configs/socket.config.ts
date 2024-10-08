import { io } from 'socket.io-client';

// The WebSocket server is running on localhost:4000
const URL = 'http://localhost:3001';

export const socket = io(URL);

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});