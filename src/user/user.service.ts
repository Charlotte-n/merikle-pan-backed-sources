import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../libs/db/models/user.model';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

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
    try {
      await this.User.updateOne(
        { _id: userId },
        { $inc: { useSpace: fileSize } },
        { upsert: true },
      );
      return await this.User.findOne({ _id: userId });
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
