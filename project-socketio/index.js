require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Import configurations
const connectDB = require('./config/database');

// Import middleware
const socketAuthMiddleware = require('./middleware/socketAuth');

// Import routes
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Import socket handlers
const setupChatSocket = require('./socket/chatSocket');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:1402', // Next.js port
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());

// ============================================
// ROUTES
// ============================================
app.get('/', (req, res) => {
  res.send('<h1>Socket.IO Server - Chat & Notifications</h1>');
});

// Chat API routes
app.use('/api/chat', chatRoutes);

// Notification API routes (for Kafka service)
app.use('/api/notifications', notificationRoutes);

// ============================================
// INITIALIZE DATABASE
// ============================================
connectDB();

// ============================================
// SOCKET.IO SETUP
// ============================================
// Apply authentication middleware
io.use(socketAuthMiddleware);

// Setup chat socket handlers
setupChatSocket(io);

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO Server listening on port ${PORT}`);
  console.log(`📡 Chat & Notifications ready`);
});