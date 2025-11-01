const express = require('express');
const router = express.Router();
const DepartmentController = require('../controllers/DepartmentController');

// CRUD phòng ban
router.post('/', DepartmentController.create); // Tạo phòng ban
router.get('/', DepartmentController.getAll); // Lấy danh sách phòng ban
router.get('/:id', DepartmentController.getById); // Lấy chi tiết phòng ban
router.put('/:id', DepartmentController.update); // Cập nhật phòng ban
router.delete('/:id', DepartmentController.delete); // Xóa phòng ban

module.exports = router;