const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { authenticateToken, requireSuperAdmin, requireVipOrSuperAdmin } = require('../middleware/auth');
const { validateAdminRegister, validateLogin } = require('../validation/auth');
const { handleAvatarUpload, cleanupUploadedFile } = require('../middleware/upload');

// Only superadmin can create new admin
router.post('/register', authenticateToken, requireSuperAdmin, handleAvatarUpload, cleanupUploadedFile, validateAdminRegister, AdminController.register);

// Test route without auth for testing Kafka
router.post('/register-test', handleAvatarUpload, cleanupUploadedFile, validateAdminRegister, AdminController.register);

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Admin routes working' });
});

// All admins can login
router.post('/login', validateLogin, AdminController.login);

// Vipadmin and superadmin can assign permissions to users
router.post('/users/:id/permissions', authenticateToken, requireVipOrSuperAdmin, AdminController.assignPermissionsToUser);

module.exports = router;