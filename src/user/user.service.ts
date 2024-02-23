import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../libs/db/models/user.model';
import { Model } from 'mongoose';
import { onErrorResumeNextWith } from 'rxjs';

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

  async uploadAvatar(userId: string, file: any) {
    console.log(file.path);
    const avatar = file.path;
    try {
      return await this.User.updateOne({ _id: userId }, { qq_avatar: avatar });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
