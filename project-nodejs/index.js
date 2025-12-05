require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const session = require('express-session');
const cors = require('cors');

// Import configurations
const passport = require('./config/passport');

// Import models to ensure they are registered
require('./models/User');
require('./models/Admin');
require('./models/Role');
require('./models/Department');
require('./models/Permission');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const departmentRoutes = require('./routes/departments');
const permissionRoutes = require('./routes/permissions');
const adminRoutes = require('./routes/admin'); // Thêm import admin routes
const conversationRoutes = require('./routes/conversationRoutes'); // Thêm conversation routes

// Import middleware
const { authenticateToken } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ Kết nối MongoDB thành công');
})
.catch((err) => {
  console.error('❌ Lỗi kết nối MongoDB:', err.message);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve static files (avatars)
app.use('/uploads', express.static('uploads'));

// Debug middleware
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//   console.log('Content-Type:', req.headers['content-type']);
//   // console.log('Body:', req.body);
//   next();
// });


// Session middleware
app.use(require('express-session')({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Show full Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Xin chào! Server Express.js với Authentication đang chạy thành công! 🚀',
    timestamp: new Date().toISOString(), 
    endpoints: {
      auth: {
        register: 'POST /api/auth/register (multipart/form-data for avatar)',
        login: 'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh',
        logout: 'POST /api/auth/logout',
        logoutAll: 'POST /api/auth/logout-all',
        profile: 'GET /api/auth/me',
        updateProfile: 'PUT /api/auth/profile',
        updateAvatar: 'PUT /api/auth/avatar (multipart/form-data)',
        changePassword: 'PUT /api/auth/change-password'
      },
      users: {
        getAllUsers: 'GET /api/users (admin only)',
        getUserStats: 'GET /api/users/stats (admin only)',
        getUserById: 'GET /api/users/:id',
        updateUser: 'PUT /api/users/:id (admin only)',
        deleteUser: 'DELETE /api/users/:id (admin only)',
        toggleStatus: 'POST /api/users/:id/toggle-status (admin only)'
      },
      protected: {
        hello: 'GET /api/hello (requires authentication)',
        profile: 'GET /api/profile (requires authentication)'
      }
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/admin', adminRoutes); // Thêm admin routes
app.use('/api/conversations', conversationRoutes); // Thêm conversation routes

// Protected route example
app.get('/api/hello', authenticateToken, (req, res) => {
  res.json({
    message: `Xin chào ${req.user.fullName}! Đây là route được bảo vệ.`,
    user: req.user.toJSON(),
    timestamp: new Date().toISOString()
  });
});

// Protected route - User profile
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user.toJSON()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route không tồn tại',
    requestedPath: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Khởi động server
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
  console.log(`📝 API Docs tại http://localhost:${port}/`);
  console.log(`🔍 Health check tại http://localhost:${port}/api/health`);
});