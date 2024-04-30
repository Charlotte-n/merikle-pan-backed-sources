import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { User } from '../../libs/db/models/user.model';
import { Model } from 'mongoose';
import { CommonFile } from '../../libs/db/models/commonFile.model';
import { InjectModel } from '@nestjs/mongoose';
import { SearchUserType } from './dto/search-user.dto';
import { DeleteUserType } from './dto/delete-user.dto';
import { UpdateInititalSpaceType } from './dto/updateInitialSpace';

@Injectable()
export class AdminService {
  @InjectModel(User.name)
  private readonly User: Model<User>;

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  /**
   * 查找所有用户
   */
  async findAllUser() {
    try {
      const res = await this.User.find();
      const result = res.map((item) => {
        return {
          id: item._id,
          avatar: item.qq_avatar,
          nickName: item.nick_name,
          email: item.email,
          useSpace: item.useSpace.toFixed(2),
          joinTime: item.create_time,
        };
      });
      return {
        code: 0,
        msg: '获取成功',
        data: result,
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 模糊查询
   */
  async searchUser(body: SearchUserType) {
    try {
      const searchValue = body.nickName; // 从应用程序中接收到的值
      const regex = new RegExp(searchValue, 'i');
      const res = await this.User.find({ nick_name: { $regex: regex } });
      const result = res.map((item) => {
        return {
          id: item._id,
          avatar: item.qq_avatar,
          email: item.email,
          joinTime: item.create_time,
          nickName: item.nick_name,
          useSpace: item.useSpace,
        };
      });
      if (res) {
        return {
          code: 0,
          msg: '查询成功',
          data: result,
        };
      } else {
        return {
          code: 0,
          msg: '没有该用户',
          data: [],
        };
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 删除用户
   * @param body
   */
  async deleteUser(body: DeleteUserType) {
    const { id } = body;
    try {
      const res = await this.User.deleteOne({
        _id: id,
      });
      if (res) {
        return {
          code: 0,
          msg: '删除成功',
        };
      } else {
        return {
          code: 1,
          msg: '删除失败',
        };
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 修改用户的总的使用空间
   * @param body
   */

  async changeUserSpace(body: any) {
    const { id, space } = body;
    try {
      await this.User.updateOne(
        { _id: id },
        {
          totalSpace: space,
        },
      );
      return {
        code: 0,
        msg: '更新成功',
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 初始化空间
   * @param body
   * @constructor
   */
  async InitialSpace(body: UpdateInititalSpaceType) {
    const { space } = body;
    try {
      const res = await this.User.updateMany(
        { delete: 0 },
        {
          totalSpace: space,
        },
      );
      if (res) {
        return {
          code: 0,
          msg: '更新成功',
        };
      } else {
        return {
          code: 1,
          msg: '更新失败',
        };
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
