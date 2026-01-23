import { io } from 'socket.io-client';
import process from 'process';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8000';
const TOKEN = process.env.JWT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWtwNjg2b3IwMDAwdWYzc3NiajU2ZzM0IiwiZW1haWwiOiJ0aGFuaGJpbmhua2RAZ21haWwuY29tIiwiaWF0IjoxNzY5MDY5NDIxLCJleHAiOjE3NjkwNzMwMjF9.VkLKsTMkn6CetcOd2uYa4mgFchlVh6Vb5TbEJ3PdRj4';

if (TOKEN === 'YOUR_JWT_TOKEN_HERE') {
  console.error('Please set JWT_TOKEN environment variable or update the script');
  console.error('Usage: JWT_TOKEN=your_token node test-websocket.js');
  process.exit(1);
}

console.log('Connecting to:', SERVER_URL);
console.log('Using token:', TOKEN.substring(0, 20) + '...');

const socket = io(SERVER_URL, {
  auth: {
    token: TOKEN
  },
  path: '/socket.io',
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('\n✓ Connected successfully!');
  console.log('Socket ID:', socket.id);
});

socket.on('connected', (data) => {
  console.log('\n✓ Server confirmed connection:');
  console.log('  User ID:', data.userId);
  console.log('  Socket ID:', data.socketId);
  console.log('\nWaiting for notifications...');
  console.log('(Send a notification from another user to test)\n');
});

socket.on('notification:new', (notification) => {
  console.log('\n📬 New notification received:');
  console.log('  ID:', notification.id);
  console.log('  Type:', notification.type);
  console.log('  Title:', notification.title);
  console.log('  Message:', notification.message);
  console.log('  Entity Type:', notification.entityType);
  console.log('  Entity ID:', notification.entityId);
  console.log('  Is Read:', notification.isRead);
  console.log('  Created At:', notification.createdAt);
  console.log('');
});

socket.on('notification:read', (data) => {
  console.log('\n✓ Notification marked as read:', data.id);
});

socket.on('notification:read_all', (data) => {
  console.log('\n✓ All notifications marked as read');
});

socket.on('notification:deleted', (data) => {
  console.log('\n✓ Notification deleted:', data.id);
});

socket.on('connect_error', (error) => {
  console.error('\n✗ Connection error:', error.message);
  if (error.message.includes('Authentication')) {
    console.error('  Check your JWT token');
  }
});

socket.on('disconnect', (reason) => {
  console.log('\n✗ Disconnected:', reason);
});

socket.on('error', (error) => {
  console.error('\n✗ Socket error:', error);
});

process.on('SIGINT', () => {
  console.log('\n\nDisconnecting...');
  socket.disconnect();
  process.exit(0);
});

console.log('Press Ctrl+C to exit\n');



