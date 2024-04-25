import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * 获取用户信息
   * @param userId
   */
  @Get('info')
  async findUserInfo(@Query('userId') userId: string) {
    const result = await this.userService.findUserInfo(userId);
    return {
      data: {
        _id: result._id,
        email: result.email,
        qq_open_id: result.qq_open_id,
        nick_name: result.nick_name,
        create_time: result.create_time,
        avatar: result.qq_avatar,
      },
      message: '成功',
      code: 0,
    };
  }

  /**x
   * 获取用户可用空间
   * @param userId
   * @param fileSize
   * @param type
   */
  @Get('space')
  async getSpace(
    @Query('userId') userId: string,
    @Query('fileSize') fileSize?: number[],
    @Query('type') type?: number,
  ) {
    return await this.userService.getSpace(userId, type, fileSize);
  }
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'public/uploaded',
    }),
  )
  @Patch('upload/avatar')
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Query('userId') userId: string,
  ) {
    //保存到数据库里面
    if (!userId) {
      throw new HttpException(
        '没有上传userId,更新失败',
        HttpStatus.BAD_REQUEST,
      );
    }
    const res = await this.userService.uploadAvatar(userId, file);
    if (res) {
      return { message: '上传成功', code: 0 };
    } else {
      return { message: '上传失败', code: 1 };
    }
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
