import { Controller, Get, Put, Delete, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(@Query() query: any) {
    const result = await this.usersService.findAll(query);
    return {
      success: true,
      ...result
    };
  }

  @Get('stats')
  async getUserStats() {
    const stats = await this.usersService.getStats();
    return {
      success: true,
      stats
    };
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return {
      success: true,
      user
    };
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateData: any) {
    const user = await this.usersService.update(id, updateData);
    return {
      success: true,
      message: 'Cập nhật user thành công',
      user
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.delete(id);
    return {
      success: true,
      message: 'Xóa user thành công'
    };
  }

  @Post(':id/toggle-status')
  async toggleUserStatus(@Param('id') id: string) {
    const user = await this.usersService.toggleStatus(id);
    return {
      success: true,
      message: `User đã được ${user.isActive ? 'kích hoạt' : 'vô hiệu hóa'}`,
      user
    };
  }
}