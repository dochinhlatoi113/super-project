// user
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { 
  authenticateToken, 
  authenticateRefreshToken
} = require('../middleware/auth');
const { validateRegister, validateLogin, validateUpdateProfile, validateChangePassword
} = require('../validation/auth');
const { handleAvatarUpload, cleanupUploadedFile } = require('../middleware/upload');

// POST /api/auth/register - Đăng ký tài khoản (có thể upload avatar)
router.post('/register', handleAvatarUpload, cleanupUploadedFile, validateRegister, AuthController.register);

// POST /api/auth/login - Đăng nhập
router.post('/login', (req, res) => {
  res.json({ success: true, message: 'Login route working' });
});

// POST /api/auth/refresh - Làm mới access token
router.post('/refresh', authenticateRefreshToken, AuthController.refresh);

// POST /api/auth/logout - Đăng xuất
router.post('/logout', authenticateToken, AuthController.logout);

// POST /api/auth/logout-all - Đăng xuất tất cả thiết bị
router.post('/logout-all', authenticateToken, AuthController.logoutAll);

// GET /api/auth/me - Lấy thông tin user hiện tại
router.get('/me', authenticateToken, AuthController.getCurrentUser);

// PUT /api/auth/profile - Cập nhật thông tin cá nhân
router.put('/profile', authenticateToken, validateUpdateProfile, AuthController.updateProfile);

// PUT /api/auth/avatar - Cập nhật avatar
router.put('/avatar', authenticateToken, handleAvatarUpload, cleanupUploadedFile, AuthController.updateAvatar);

// PUT /api/auth/change-password - Đổi mật khẩu
router.put('/change-password', authenticateToken, validateChangePassword, AuthController.changePassword);

module.exports = router;