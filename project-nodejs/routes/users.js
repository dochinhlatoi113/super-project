//admin
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateUserUpdate } = require('../validation/user');
const { validatePagination } = require('../validation/common');

// GET /api/users - Lấy danh sách users (admin only)
router.get('/', authenticateToken, requireAdmin, validatePagination, UserController.getAllUsers);

// GET /api/users/stats - Thống kê users (admin only)
router.get('/stats', authenticateToken, requireAdmin, UserController.getUserStats);

// GET /api/users/:id - Lấy thông tin user theo ID
router.get('/:id', authenticateToken, UserController.getUserById);

// PUT /api/users/:id - Cập nhật user (admin only)
router.put('/:id', authenticateToken, requireAdmin, validateUserUpdate, UserController.updateUser);

// DELETE /api/users/:id - Xóa user (admin only)
router.delete('/:id', authenticateToken, requireAdmin, UserController.deleteUser);

// POST /api/users/:id/toggle-status - Bật/tắt trạng thái user (admin only)
router.post('/:id/toggle-status', authenticateToken, requireAdmin, UserController.toggleUserStatus);

module.exports = router;