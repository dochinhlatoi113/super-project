const User = require('../models/User');

class UserController {
  // GET /api/users - Lấy danh sách users (admin only)
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      
      const query = search ? {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      } : {};

      const users = await User.find(query)
        .select('-password -refreshTokens')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      });

    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách users'
      });
    }
  }

  // GET /api/users/:id - Lấy thông tin user theo ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findById(id).select('-password -refreshTokens');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User không tồn tại'
        });
      }

      res.json({
        success: true,
        user
      });

    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin user'
      });
    }
  }

  // PUT /api/users/:id - Cập nhật user (admin only)
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { fullName, username, isActive } = req.body;

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User không tồn tại'
        });
      }

      // Kiểm tra username có bị trùng không (nếu có thay đổi)
      if (username && username.toLowerCase() !== user.username) {
        const existingUser = await User.findOne({ 
          username: username.toLowerCase(),
          _id: { $ne: id }
        });

        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'Username đã được sử dụng'
          });
        }

        user.username = username.toLowerCase();
      }

      if (fullName !== undefined) user.fullName = fullName;
      if (isActive !== undefined) user.isActive = isActive;

      await user.save();

      res.json({
        success: true,
        message: 'Cập nhật user thành công',
        user: user.toJSON()
      });

    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật user'
      });
    }
  }

  // DELETE /api/users/:id - Xóa user (admin only)
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Không cho phép xóa chính mình
      if (id === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa tài khoản của chính mình'
        });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User không tồn tại'
        });
      }

      await User.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Xóa user thành công'
      });

    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa user'
      });
    }
  }

  // POST /api/users/:id/toggle-status - Bật/tắt trạng thái user
  async toggleUserStatus(req, res) {
    try {
      const { id } = req.params;

      // Không cho phép thay đổi trạng thái chính mình
      if (id === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Không thể thay đổi trạng thái tài khoản của chính mình'
        });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User không tồn tại'
        });
      }

      user.isActive = !user.isActive;
      await user.save();

      // Nếu vô hiệu hóa user, xóa tất cả refresh tokens
      if (!user.isActive) {
        await user.removeAllRefreshTokens();
      }

      res.json({
        success: true,
        message: `${user.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} user thành công`,
        user: user.toJSON()
      });

    } catch (error) {
      console.error('Toggle user status error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi thay đổi trạng thái user'
      });
    }
  }

  // GET /api/users/stats - Thống kê users
  async getUserStats(req, res) {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isActive: true });
      const inactiveUsers = await User.countDocuments({ isActive: false });
      
      const recentUsers = await User.find()
        .select('-password -refreshTokens')
        .sort({ createdAt: -1 })
        .limit(5);

      const usersByMonth = await User.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': -1, '_id.month': -1 }
        },
        {
          $limit: 12
        }
      ]);

      res.json({
        success: true,
        stats: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          recentUsers,
          usersByMonth
        }
      });

    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thống kê users'
      });
    }
  }
}

module.exports = new UserController();