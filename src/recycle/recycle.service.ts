import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File } from '../../libs/db/models/file_info.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class RecycleService {
  @InjectModel(File.name)
  private File: Model<File>;

  /**
   * 获取回收站的东西
   * @param userId
   */
  async getRecycleList(userId: string) {
    try {
      const res = await this.File.find({
        del_flag: 1,
        user: userId,
      });
      const result = res.map((item) => {
        return {
          id: item._id,
          deleteTime: item.del_time,
          size: item.file_size,
          name: item.file_name,
          path: item.file_name,
          fileType: item.file_type,
          folderType: item.folder_type,
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
   * 彻底删除
   * @param ids
   */
  async completeDelete(ids: string[]) {
    try {
      for (const id of ids) {
        await this.File.deleteOne({ _id: id });
        //更新用户空间
      }

      return {
        code: 0,
        msg: '彻底删除成功',
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 还原文件
   * @param ids
   */
  async revertFile(ids: string[]) {
    try {
      for (const item of ids) {
        await this.File.updateOne({ _id: item }, { del_flag: 0 });
      }
      return {
        code: 0,
        msg: '还原成功',
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
