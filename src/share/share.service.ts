import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Share } from '../../libs/db/models/share.model';
import { File } from '../../libs/db/models/file_info.model';
import { CreateShareData } from './dto/create-share.dto';
import { ObjectId } from 'mongodb';
const randomString = (length) => {
  const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i)
    result += str[Math.floor(Math.random() * str.length)];
  return result;
};

@Injectable()
export class ShareService {
  //导入User模型
  @InjectModel(Share.name)
  private readonly Share: Model<Share>;
  @InjectModel(File.name)
  private readonly File: Model<File>;
  /**
   * 创建分享链接
   * @param body
   */
  async createShareLink(body: CreateShareData) {
    const { fileId, userId, validTime } = body;
    //进行查找数据库里是否有该数据
    // const file = await this.Share.findOne({ file_id: fileId });
    // if (file) {
    //   await this.Share.updateOne(
    //     { file_id: fileId },
    //     {
    //       code: body.code ? body.code : randomString(4),
    //     },
    //   );
    // } else {
    if (body.code) {
      await this.Share.create({
        file_id: fileId,
        user_id: userId,
        valid_type: validTime,
        code: body.code,
        file: new ObjectId(fileId),
      });
    } else {
      await this.Share.create({
        file_id: fileId,
        user_id: userId,
        valid_type: validTime,
        code: randomString(3),
        file: new ObjectId(fileId),
      });
    }
    // }
    const res = await this.Share.findOne({ file_id: fileId });
    const id = res._id;
    const code = res.code;
    //返回创建的提取码
    return {
      code: 0,
      msg: '创建链接成功',
      data: {
        id,
        code,
      },
    };
  }

  /**
   * 获取分享列表
   * @param userId
   */
  async getShareFile(userId: number) {
    //通过FileId来进行查询相关的File信息
    const file = await this.Share.find({ user_id: userId })
      .populate('file')
      .exec();
    const response = file.map((item) => {
      return {
        id: item?._id,
        code: item?.code,
        validTime: item?.valid_type,
        folderType: (item.file as any)?.folder_type || 0,
        fileType: (item.file as any)?.file_type,
        createTime: (item.file as any)?.create_time,
        viewCount: item.show_count ? item.show_count : 0,
        fileName: (item.file as any)?.file_name,
        filePath: (item.file as any)?.file_cover,
        fileId: item?.file_id,
      };
    });

    //根据id查询
    return {
      msg: '获取成功',
      code: 0,
      data: response,
    };
  }

  //取消分享
  async cancelShareFile(ids: string[]) {
    try {
      //进行取消分享
      for (let i = 0; i < ids.length; i++) {
        await this.Share.deleteOne({ _id: ids[i] });
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      code: 0,
      msg: '取消成功',
    };
  }

  /**
   * 获取分享信息
   * @param fileId
   */
  async getShareInfo(fileId: string) {
    try {
      const res = await this.Share.findOne({
        file_id: fileId,
      })
        .populate('file')
        .exec();
      return {
        code: 0,
        msg: '获取成功',
        data: {
          fileName: (res.file as any).file_name,
          folderType: (res.file as any).folder_type,
          fileType: (res.file as any).file_type,
          time: (res.file as any).create_time,
          code: res.code,
          id: res._id,
          userId: res.user_id,
          fileId: (res.file as any).file_id,
        },
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  //获取分享文件列表
  async getShareList(fileId: string) {
    try {
      const res = await this.File.find({
        _id: fileId,
        del_flag: 0,
      });
      const result = res.map((item) => {
        return {
          name: item.file_name,
          size: item.file_size,
          time: item.create_time,
          id: item._id,
          fileType: item.file_type,
          folderType: item.folder_type,
          filePath: item.file_cover,
        };
      });
      return {
        code: 0,
        msg: '获取分享文件列表',
        data: result,
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
