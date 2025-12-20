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
require('./models/Conversations');
require('./models/Messages');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const departmentRoutes = require('./routes/departments');
const permissionRoutes = require('./routes/permissions');
const adminRoutes = require('./routes/admin'); // Thêm import admin routes
const conversationRoutes = require('./routes/conversationRoutes'); // Thêm conversation routes
const chatRoutes = require('./routes/chat'); // Thêm chat routes
const friendRoutes = require('./routes/friends'); // Thêm friends routes
const devRoutes = require('./routes/dev'); // Dev-only helpers

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

// Social login routes
// GOOGLE
app.get('/api/v1/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
const jwt = require('jsonwebtoken');
const User = require('./models/User'); 
app.get('/api/v1/login/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async (req, res) => {
    try {
      const googleProfile = req.user;
      console.log('Google profile:', googleProfile);
      // Tìm user theo googleId hoặc email
      let user = await User.findOne({ googleId: googleProfile.id }) || await User.findOne({ email: googleProfile.emails[0].value });
      console.log('User found:', user);
      if (!user) {
        // Nếu chưa có, tạo mới
        user = await User.create({
          googleId: googleProfile.id,
          name: googleProfile.displayName,
          email: googleProfile.emails[0].value,
          avatar: googleProfile.photos && googleProfile.photos[0] ? googleProfile.photos[0].value : undefined,
          provider: 'google',
        });
        console.log('User created:', user);
      }
      // Tạo JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' });
      // Redirect về frontend hoặc trả về token và user info
      res.json({
        success: true,
        token,
        user: user.toJSON()
      });
    } catch (err) {
      console.error('Google login error:', err);
      res.status(500).json({ success: false, message: 'Lỗi xử lý Google login', error: err.message });
    }
  }
);
// FACEBOOK
app.get('/api/v1/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/api/v1/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Xử lý sau khi đăng nhập thành công
    res.json({ user: req.user });
  }
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/admin', adminRoutes); // Thêm admin routes
app.use('/api/conversations', conversationRoutes); // Thêm conversation routes
app.use('/api/chat', chatRoutes); // Thêm chat routes
app.use('/api/friends', friendRoutes); // Thêm friends routes
// Dev-only routes (only mount in non-production)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/dev', devRoutes);
}


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