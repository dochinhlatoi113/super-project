import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Generate tokens
  generateTokens(user: any) {
    // @ts-ignore
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_ACCESS_SECRET || 'your-access-secret',
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
    );

    // @ts-ignore
    const refreshToken = jwt.sign(
      {
        id: user._id,
        // @ts-ignore
        token: jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret')
      },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  // Register new user
  async register(userData: any) {
    const { username, email, password, fullName, avatar } = userData;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [
        { email: email?.toLowerCase() },
        { username: username?.toLowerCase() }
      ]
    }).exec();

    if (existingUser) {
      if (existingUser.email === email?.toLowerCase()) {
        throw new ConflictException('EMAIL_EXISTS');
      }
      if (existingUser.username === username?.toLowerCase()) {
        throw new ConflictException('USERNAME_EXISTS');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new this.userModel({
      username: username?.toLowerCase(),
      email: email?.toLowerCase(),
      password: hashedPassword,
      name: fullName,
      avatar: avatar || null
    });

    await newUser.save();

    // Generate tokens
    const tokens = this.generateTokens(newUser);

    return {
      user: newUser,
      tokens
    };
  }

  // Login
  async login(email: string, password: string) {
    // Find user by email
    const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    // Check if account is active
    if (user.isActive === false) {
      throw new UnauthorizedException('ACCOUNT_DISABLED');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password || '');

    if (!isMatch) {
      throw new UnauthorizedException('INVALID_PASSWORD');
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user,
      tokens
    };
  }

  getErrorMessage(error: any) {
    if (error.message === 'EMAIL_EXISTS') return 'Email đã tồn tại';
    if (error.message === 'USERNAME_EXISTS') return 'Username đã tồn tại';
    if (error.message === 'USER_NOT_FOUND') return 'Tài khoản không tồn tại';
    if (error.message === 'ACCOUNT_DISABLED') return 'Tài khoản đã bị vô hiệu hóa';
    if (error.message === 'INVALID_PASSWORD') return 'Mật khẩu không đúng';
    return 'Lỗi không xác định';
  }
}