import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../libs/db/models/user.model';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  //导入User模型
  @InjectModel(User.name)
  private readonly User: Model<User>;

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

  async getSpace(userId: string, type?: number, fileSize?: number[]) {
    try {
      if (fileSize && fileSize.length) {
        let result;
        if (type == 1) {
          //更新用户使用的空间
          //进行循环
          for (const size of fileSize) {
            result = await this.User.updateOne(
              { _id: userId },
              { $inc: { useSpace: size } },
              { upsert: true },
            );
          }
        } else {
          //更新用户使用的空间
          for (const size of fileSize) {
            result = await this.User.updateOne(
              { _id: userId },
              { $desc: { useSpace: -1 * size } },
              { upsert: true },
            );
          }
        }

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

  async uploadAvatar(userId: any, file: Express.Multer.File) {
    const avatar = file.filename;
    const res = await this.User.updateOne(
      { _id: userId },
      { qq_avatar: avatar },
    );
    console.log(res);
    return res;
  }
}
