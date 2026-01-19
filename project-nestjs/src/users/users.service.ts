import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(query: any = {}) {
    const { page = 1, limit = 10, search = '' } = query;

    const searchQuery = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await this.userModel
      .find(searchQuery)
      .select('-password -refreshTokens')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.userModel.countDocuments(searchQuery).exec();

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  async findById(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('-password -refreshTokens')
      .exec();

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    return user;
  }

  async update(id: string, updateData: any) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    // Kiểm tra email trùng lặp nếu có thay đổi
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userModel.findOne({
        email: updateData.email,
        _id: { $ne: id }
      }).exec();

      if (existingUser) {
        throw new ConflictException('Email đã được sử dụng');
      }
    }

    Object.assign(user, updateData);
    return user.save();
  }

  async delete(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    return user;
  }

  async toggleStatus(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    user.isActive = !user.isActive;
    return user.save();
  }

  async getStats() {
    const totalUsers = await this.userModel.countDocuments().exec();
    const activeUsers = await this.userModel.countDocuments({ isActive: true }).exec();
    const inactiveUsers = totalUsers - activeUsers;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers
    };
  }
}