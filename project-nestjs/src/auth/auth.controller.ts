import { Controller, Post, Body, Res, Req, HttpStatus, Get, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any, @Req() req: any, @Res() res: any) {
    try {
      const { username, email, password, fullName } = body;

      // Lấy tên file avatar nếu có upload
      const avatar = req.file ? req.file.filename : null;

      const result = await this.authService.register({
        username,
        email,
        password,
        fullName,
        avatar
      });

      // Thêm avatar URL vào response
      const userResponse = result.user.toJSON() as any;
      if (avatar) {
        userResponse.avatarUrl = result.user.getAvatarUrl(req);
      } else if (result.user.avatar) {
        userResponse.avatarUrl = result.user.getAvatarUrl(req);
      }

      res.status(HttpStatus.CREATED).json({
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

      const message = this.authService.getErrorMessage(error);
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;

      res.status(status).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: any) {
    try {
      const { email, password } = body;

      const result = await this.authService.login(email, password);

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

      const message = this.authService.getErrorMessage(error);
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;

      res.status(status).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  @Get('me')
  async getProfile(@Req() req: any, @Res() res: any) {
    // TODO: Add JWT guard
    res.json({
      success: true,
      user: req.user
    });
  }

  @Put('profile')
  async updateProfile(@Body() body: any, @Req() req: any, @Res() res: any) {
    // TODO: Implement update profile logic
    res.json({
      success: true,
      message: 'Cập nhật profile thành công'
    });
  }

  @Put('change-password')
  async changePassword(@Body() body: any, @Req() req: any, @Res() res: any) {
    // TODO: Implement change password logic
    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  }

  @Post('logout')
  async logout(@Req() req: any, @Res() res: any) {
    // TODO: Implement logout logic
    res.json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  }

  @Post('logout-all')
  async logoutAll(@Req() req: any, @Res() res: any) {
    // TODO: Implement logout all logic
    res.json({
      success: true,
      message: 'Đăng xuất tất cả thiết bị thành công'
    });
  }

  @Post('refresh')
  async refreshToken(@Body() body: any, @Res() res: any) {
    // TODO: Implement refresh token logic
    res.json({
      success: true,
      message: 'Refresh token thành công'
    });
  }
}