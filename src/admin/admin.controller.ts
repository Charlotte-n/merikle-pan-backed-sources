import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { updateInitialSpaceDto } from './dto/updateInitialSpace';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  /**
   * 查找所有用户
   */
  @Get('findAllUser')
  async findAllUser() {
    return await this.adminService.findAllUser();
  }

  /**
   * 模糊搜索用户名
   */
  @Post('searchUser')
  async searchUserApi(@Body() body: SearchUserDto) {
    return await this.adminService.searchUser(body);
  }

  /**
   * 删除用户
   * @param body
   */
  @Post('deleteUser')
  async deleteUser(@Body() body: DeleteUserDto) {
    return await this.adminService.deleteUser(body);
  }

  @Post('changeUserSpace')
  async changeUserSpace(@Body() body: any) {
    return await this.adminService.changeUserSpace(body);
  }

  @Post('initialization')
  async InitialSpace(@Body() body: updateInitialSpaceDto) {
    return await this.adminService.InitialSpace(body);
  }
}
