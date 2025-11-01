const Permission = require('../models/Permission');

module.exports = {
  // Tạo quyền mới
  async create(req, res) {
    try {
      const permission = new Permission(req.body);
      await permission.save();
      res.status(201).json({ success: true, data: permission });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Lấy danh sách quyền
  async getAll(req, res) {
    try {
      const permissions = await Permission.find();
      res.json({ success: true, data: permissions });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Lấy chi tiết quyền
  async getById(req, res) {
    try {
      const permission = await Permission.findById(req.params.id);
      if (!permission) return res.status(404).json({ success: false, message: 'Không tìm thấy quyền' });
      res.json({ success: true, data: permission });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Cập nhật quyền
  async update(req, res) {
    try {
      const permission = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!permission) return res.status(404).json({ success: false, message: 'Không tìm thấy quyền' });
      res.json({ success: true, data: permission });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Xóa quyền
  async delete(req, res) {
    try {
      const permission = await Permission.findByIdAndDelete(req.params.id);
      if (!permission) return res.status(404).json({ success: false, message: 'Không tìm thấy quyền' });
      res.json({ success: true, message: 'Đã xóa quyền' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};