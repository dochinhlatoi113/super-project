const AdminService = require('../services/AdminService');

class AdminController {

  // Register admin
  async register(req, res) {
    const adminData = {
      ...req.body,
      creatorRole: req.user?.role?.name || req.user?.role  // Pass creator's role
    };
    const result = await AdminService.register(adminData);
    res.status(result.success ? 201 : 400).json(result);
  }

  // Admin login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AdminService.login(email, password);
      res.status(result.success ? 200 : 401).json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred'
      });
    }
  }

  // Assign permissions to user
  async assignPermissionsToUser(req, res) {
    const { id: userId } = req.params;
    const { permissions } = req.body;
    const adminId = req.user.id;

    const result = await AdminService.assignPermissionsToUser(adminId, userId, permissions);
    res.status(result.success ? 200 : 400).json(result);
  }


  // Get all admins for chat
  async getAllAdmins(req, res) {
    try {
      const admins = await AdminService.getAllAdminsForChat();
      res.json({ success: true, data: admins });
    } catch (error) {
      console.error('Get all admins error:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
}

module.exports = new AdminController();