import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonFile } from '../../libs/db/models/commonFile.model';
import { CreateCommonFileType } from './dto/create-common-file.dto';
import { ObjectId } from 'mongodb';
import { UpdateCommonFileType } from './dto/update-common-file.dto';
import { UpdateCommonFileNameType } from './dto/update-common-file-name.dto';
import { UpdateCommonFilePrivialType } from './dto/update-common-file-privial.dto';

@Injectable()
export class CommonFileService {
  //导入CommonFile模型
  @InjectModel(CommonFile.name)
  private readonly ConFile: Model<CommonFile>;
  async uploadFileContent(body: CreateCommonFileType) {
    const { userId, content, category } = body;
    console.log(userId);
    try {
      await this.ConFile.create({
        isPrivate: false,
        createTime: new Date(),
        isEdit: true,
        EditCount: 0,
        isDelete: false,
        content: [],
        userId: userId,
        user: new ObjectId(userId),
        category: category,
        name: '无名文档',
        editTime: new Date(),
      });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      code: 0,
      msg: '成功创建文档',
    };
  }

  //获取文档列表
  async getFileList(userId: string) {
    try {
      const result = await this.ConFile.find({
        userId: userId,
      }).populate('user');
      const rs = result.map((item, index) => {
        return {
          id: item._id,
          key: index,
          name: item.name,
          owner: (item.user as any).nick_name,
          edit: item.editTime,
          category: item.category,
        };
      });
      return {
        msg: '获取成功',
        data: rs,
        code: 0,
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  //更新上传文件(文档)内容
  async updateFileContent(body: UpdateCommonFileType) {
    const { id, content, name } = body;
    try {
      await this.ConFile.updateOne(
        {
          _id: id,
        },
        {
          content: content,
          name: name,
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
  //获取文件内容
  async getFileContent(id: string) {
    try {
      const res = await this.ConFile.findOne({
        _id: id,
      });
      return {
        code: 0,
        data: {
          content: res.content,
          title: res.name,
          edit: res.isEdit,
        },
        msg: '获取成功',
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  //改变文件title
  async updateFileName(body: UpdateCommonFileNameType) {
    const { id, name } = body;
    try {
      await this.ConFile.updateOne(
        {
          _id: id,
        },
        {
          name: name,
        },
      );
      const res = await this.ConFile.findOne({
        _id: id,
      });
      return {
        code: 0,
        msg: '更新文档名字成功',
        data: {
          title: res.name,
        },
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async updateFilePrivial(body: UpdateCommonFilePrivialType) {
    const { id, edit } = body;
    try {
      await this.ConFile.updateOne(
        {
          _id: id,
        },
        {
          isEdit: edit !== 0,
        },
      );
      return {
        msg: '更新成功',
        code: 0,
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
