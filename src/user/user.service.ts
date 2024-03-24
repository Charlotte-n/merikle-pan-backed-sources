import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../libs/db/models/user.model';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  //导入User模型
  @InjectModel(User.name)
  private readonly User: Model<User>;
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  /**
   * 获取用户信息
   * @param userId
   */

  async findUserInfo(userId: string) {
    try {
      const _id = userId.trim();
      return await this.User.findOne({
        _id: _id,
      });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSpace(userId: string, fileSize: number) {
    console.log(userId);
    try {
      if (fileSize) {
        //更新用户使用的空间
        const result = await this.User.updateOne(
          { _id: userId },
          { $inc: { useSpace: fileSize } },
          { upsert: true },
        );
        return {
          data: result,
          message: '成功',
          code: 0,
        };
      } else {
        //获取用户空间
        const res = await this.User.findOne({ _id: userId.trim() });
        return {
          data: {
            useSpace: res.useSpace,
            totalSpace: res.totalSpace,
          },
          message: '获取成功',
          code: 0,
        };
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async uploadAvatar(userId: any, file: Express.Multer.File) {
    console.log(file);
    const avatar = file.filename;
    console.log(userId);
    const res = await this.User.updateOne(
      { _id: userId },
      { qq_avatar: avatar },
    );
    console.log(res);
    return res;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
