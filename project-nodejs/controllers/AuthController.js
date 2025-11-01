const AuthService = require('../services/AuthService');

class AuthController {
  // POST /api/auth/register - Đăng ký tài khoản
  async register(req, res) {
    try {
      const { username, email, password, fullName } = req.body;
      
      // Lấy tên file avatar nếu có upload
      const avatar = req.file ? req.file.filename : null;

      const result = await AuthService.register({
        username,
        email,
        password,
        fullName,
        avatar
      });

      // Thêm avatar URL vào response
      const userResponse = result.user.toJSON();
      if (avatar) {
        userResponse.avatarUrl = result.user.getAvatarUrl(req);
      }

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        user: userResponse,
        tokens: {
          ...result.tokens,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message === 'EMAIL_EXISTS' || error.message === 'USERNAME_EXISTS') {
        return res.status(409).json({
          success: false,
          message: AuthService.getErrorMessage(error)
        });
      }

      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đăng ký',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/auth/login - Đăng nhập
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        user: result.user.toJSON(),
        tokens: {
          ...result.tokens,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
        }
      });

    } catch (error) {
      console.error('Login error:', error);

      if (['USER_NOT_FOUND', 'ACCOUNT_DISABLED', 'INVALID_PASSWORD'].includes(error.message)) {
        return res.status(401).json({
          success: false,
          message: AuthService.getErrorMessage(error)
        });
      }

      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đăng nhập'
      });
    }
  }

  // POST /api/auth/refresh - Làm mới access token
  async refresh(req, res) {
    try {
      const { refreshToken } = req;
      const { id } = req.refreshTokenPayload;

      const tokens = await AuthService.refreshToken(refreshToken, id);

      res.json({
        success: true,
        message: 'Token đã được làm mới',
        tokens: {
          ...tokens,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
        }
      });

    } catch (error) {
      console.error('Token refresh error:', error);

      if (['INVALID_REFRESH_TOKEN', 'ACCOUNT_DISABLED'].includes(error.message)) {
        return res.status(401).json({
          success: false,
          message: AuthService.getErrorMessage(error)
        });
      }

      res.status(500).json({
        success: false,
        message: 'Lỗi server khi làm mới token'
      });
    }
  }

  // POST /api/auth/logout - Đăng xuất
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      const user = req.user;

      await AuthService.logout(user, refreshToken);

      res.json({
        success: true,
        message: 'Đăng xuất thành công'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đăng xuất'
      });
    }
  }

  // POST /api/auth/logout-all - Đăng xuất tất cả thiết bị
  async logoutAll(req, res) {
    try {
      const user = req.user;

      await AuthService.logoutAll(user);

      res.json({
        success: true,
        message: 'Đã đăng xuất khỏi tất cả thiết bị'
      });

    } catch (error) {
      console.error('Logout all error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đăng xuất'
      });
    }
  }

  // GET /api/auth/me - Lấy thông tin user hiện tại
  async getCurrentUser(req, res) {
    try {
      res.json({
        success: true,
        user: req.user.toJSON()
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin user'
      });
    }
  }

  // PUT /api/auth/profile - Cập nhật thông tin cá nhân
  async updateProfile(req, res) {
    try {
      const { fullName, username } = req.body;
      const user = req.user;

      const updatedUser = await AuthService.updateProfile(user, { fullName, username });

      res.json({
        success: true,
        message: 'Cập nhật thông tin thành công',
        user: updatedUser.toJSON()
      });

    } catch (error) {
      console.error('Profile update error:', error);

      if (error.message === 'USERNAME_EXISTS') {
        return res.status(409).json({
          success: false,
          message: AuthService.getErrorMessage(error)
        });
      }

      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật thông tin'
      });
    }
  }

  // PUT /api/auth/avatar - Cập nhật avatar
  async updateAvatar(req, res) {
    try {
      const user = req.user;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn file ảnh để upload'
        });
      }

      // Xóa avatar cũ nếu có
      if (user.avatar) {
        const { deleteOldAvatar, avatarsDir } = require('../middleware/upload');
        const oldAvatarPath = require('path').join(avatarsDir, user.avatar);
        deleteOldAvatar(oldAvatarPath);
      }

      // Cập nhật avatar mới
      user.avatar = req.file.filename;
      await user.save();

      const userResponse = user.toJSON();
      userResponse.avatarUrl = user.getAvatarUrl(req);

      res.json({
        success: true,
        message: 'Cập nhật avatar thành công',
        user: userResponse
      });

    } catch (error) {
      console.error('Update avatar error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật avatar'
      });
    }
  }

  // PUT /api/auth/change-password - Đổi mật khẩu
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = req.user;

      // Validation đã được xử lý bởi middleware
      await AuthService.changePassword(user, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.'
      });

    } catch (error) {
      console.error('Change password error:', error);

      if (error.message === 'INVALID_CURRENT_PASSWORD') {
        return res.status(401).json({
          success: false,
          message: AuthService.getErrorMessage(error)
        });
      }

      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đổi mật khẩu'
      });
    }
  }
}

module.exports = new AuthController();