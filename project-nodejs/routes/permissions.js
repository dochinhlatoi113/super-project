const express = require('express');
const router = express.Router();
const PermissionController = require('../controllers/PermissionController');

// CRUD quyền
router.post('/', PermissionController.create); // Tạo quyền
router.get('/', PermissionController.getAll); // Lấy danh sách quyền
router.get('/:id', PermissionController.getById); // Lấy chi tiết quyền
router.put('/:id', PermissionController.update); // Cập nhật quyền
router.delete('/:id', PermissionController.delete); // Xóa quyền

module.exports = router;