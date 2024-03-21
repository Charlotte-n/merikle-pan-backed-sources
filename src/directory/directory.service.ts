import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../libs/db/models/user.model';
import { File } from '../../libs/db/models/file_info.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class DirectoryService {
  @InjectModel(File.name)
  private File: Model<File>;

  @InjectModel(User.name)
  private User: Model<User>;

  async getUserId(userId: string) {
    return ((await this.User.findOne({ _id: userId })) as any)._id;
  }

  /**
   * 获取所有目录
   * @param userId
   * @param filePid
   */
  async getAllDirectory(userId: string, filePid: string | number) {
    try {
      let res;
      //存在父级目录的话进行筛选
      const id = await this.getUserId(userId);
      if (filePid != 0) {
        res = await this.File.find({
          user: id,
          del_flag: 0,
          folder_type: 1,
          _id: {
            $ne: filePid,
          },
        });
      } else {
        //找到全部
        res = await this.File.find({
          user: id,
          folder_type: 1,
          del_flag: 0,
        });
      }
      return {
        message: '获取成功',
        code: 0,
        data: res,
      };
    } catch (e) {
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getNavigation(path: string) {
    const result = [];
    let pathArray = [];
    if (path.indexOf('/') !== -1) {
      pathArray = path.split('/');
    } else {
      pathArray.push(path);
    }
    //查找数据库相应的id获取相应的文件夹名字
    try {
      for (const _id of pathArray) {
        const folder = await this.File.findOne({ _id, del_flag: 0 });
        result.push(folder.file_name);
      }
    } catch (e) {
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      data: {
        path: result.join('/'),
      },
      message: '获取成功',
      code: 0,
    };
  }

  /**
   * 移动目录
   * @constructor
   */
  async MoveDirectory(ids: string[], filePid: string | number) {
    try {
      //进行循环移动
      for (let i = 0; i < ids.length; i++) {
        await this.File.updateOne({ _id: ids[i] }, { file_pid: filePid });
      }
    } catch (e) {
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      message: '移动成功',
      code: 0,
    };
  }
}
