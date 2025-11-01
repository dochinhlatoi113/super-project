const Department = require('../models/Department');
const User = require('../models/User');

module.exports = {
  // Tạo phòng ban mới
  async create(req, res) {
    try {
      const { name, adminIds, userIds } = req.body;
      const department = new Department({ name, admins: adminIds || [], users: userIds || [] });
      await department.save();
      res.status(201).json({ success: true, data: department });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Lấy danh sách phòng ban
  async getAll(req, res) {
    try {
      const departments = await Department.find().populate('admins users');
      res.json({ success: true, data: departments });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Lấy chi tiết phòng ban
  async getById(req, res) {
    try {
      const department = await Department.findById(req.params.id).populate('admins users');
      if (!department) return res.status(404).json({ success: false, message: 'Không tìm thấy phòng ban' });
      res.json({ success: true, data: department });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Cập nhật phòng ban
  async update(req, res) {
    try {
      const { name, adminIds, userIds } = req.body;
      const department = await Department.findByIdAndUpdate(
        req.params.id,
        { name, admins: adminIds, users: userIds },
        { new: true }
      );
      if (!department) return res.status(404).json({ success: false, message: 'Không tìm thấy phòng ban' });
      res.json({ success: true, data: department });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Xóa phòng ban
  async delete(req, res) {
    try {
      const department = await Department.findByIdAndDelete(req.params.id);
      if (!department) return res.status(404).json({ success: false, message: 'Không tìm thấy phòng ban' });
      res.json({ success: true, message: 'Đã xóa phòng ban' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};