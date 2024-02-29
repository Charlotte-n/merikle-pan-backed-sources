import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { InjectModel } from '@nestjs/mongoose';
import { File } from '../../libs/db/models/file_info.model';
import { Model } from 'mongoose';
import fs from 'fs';
import { User } from '../../libs/db/models/user.model';

@Injectable()
export class FileService {
  @InjectModel(File.name)
  private File: Model<File>;

  @InjectModel(User.name)
  private User: Model<User>;
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  /**
   * 合并文件
   * @param fileHash
   * @param filename
   */
  mergeFile(fileHash: string, filename: string) {
    const dirPath = 'upload/chunks' + '_' + fileHash; //存放的chunk的目录
    const files = fs.readdirSync(dirPath);
    let startPos = 0;
    files.map((file) => {
      const filePath = dirPath + '/' + file;
      const stream = fs.createReadStream(filePath);
      stream.pipe(
        fs.createWriteStream('upload/' + filename, {
          start: startPos,
        }),
      );
      startPos += fs.statSync(filePath).size;
    });
    return {
      data: ' 2abd43c4a364fab87a06a7f1291d985e',
      message: '合并成功',
      code: 0,
    };
  }

  /**
   * 判断文件状态和是否可以进行秒传、断点上传，总而言之就是判断此时文件上传的状态
   * @param fileSize
   * @param user_id
   * @param fileHash
   * @param totalCount
   * @param filename
   */
  async verifyExit(
    fileSize: number,
    user_id: any,
    fileHash: string,
    totalCount: number,
    filename: string,
  ) {
    const dirPath = 'upload/chunks' + '_' + fileHash; //存放的chunk的目录
    const filePath = dirPath + '/' + filename; //存放chunk的地址,这个filename前端要进行修改生成有hash值且有索引的名字
    const reg = /(.+)\-\d+$/;
    const name = filename.match(reg)[0];
    //判断文件的大小
    const result = await this.User.findOne({
      _id: user_id,
    });
    const totalSpace = 1024 * result.totalSpace;
    const useSpace =
      result.useSpace === undefined || null
        ? 0
        : result.useSpace * Math.pow(10, -6);
    if (!(Number(fileSize) * Math.pow(10, -6) + useSpace < totalSpace)) {
      return {
        data: '',
        message: '剩余的内存不够',
        code: 4,
      };
    }
    //标记返回的文件索引
    let res = Array(Number(totalCount))
      .fill(0)
      .map((_, index) => index);
    let message = '';
    let code = 0;
    try {
      //读取文件状态,秒传,读取有没有该文件
      fs.statSync(filePath);
      //读取成功，秒传
      return { data: [], message: '上传成功', code: 0 };
    } catch (e) {
      //文件不存在,文件夹存在
      try {
        fs.statSync(dirPath);
        fs.readdir(dirPath, async (error, files) => {
          if (error) {
            //都需要上传
            message = '转码失败';
            code = 2;
          }
          //读取文件,如果这些分片少于总的分片说明没有上传全，继续返回需要上传的文件,将需要上传的文件名称返回回去
          if (files.length < totalCount) {
            res = res.filter((index) => {
              return !files.includes(filename + '-' + index);
            });
            message = '继续上传';
            code = 1;
          } else {
            //没有进行合并，进行一下合并
            this.mergeFile(fileHash, name);
            res = [];
            message = '合并成功';
            code = 0;
          }
        });
      } catch (e) {
        return {
          data: res,
          message: '传输中',
          code: 1,
        };
      }
    }
    return {
      data: res,
      message: message,
      code: code,
    };
  }

  /**
   * 上传分片
   * @param chunk //chunk文件
   * @param filename
   * @param chunkIndex
   * @param fileHash
   */
  async uploadChunk(
    chunk: Express.Multer.File,
    filename: string,
    chunkIndex: number,
    fileHash: string,
  ) {
    try {
      const dirPath = 'upload/chunks' + '_' + fileHash; //存放的chunk的目录
      const chunkPath = dirPath + '/' + filename; //存放chunk的地址,这个filename前端要进行修改生成有hash值且有索引的名字
      //查看是否有这个目录
      const hasDir = fs.existsSync(dirPath);
      if (hasDir) {
        //查看是否有这个文件
        const hasChunk = fs.existsSync(chunkPath);
        if (hasChunk) return; //不必上传了
        fs.cpSync(chunk.path, chunkPath);
        fs.rmSync(chunk.path);
      } else {
        //没有就创建文件
        new Promise((resolve, reject) => {
          fs.mkdir(
            dirPath,
            {
              recursive: true,
            },
            (err) => {
              if (err) {
                reject(false);
              } else {
                resolve(true);
              }
            },
          );
        }).then(() => {
          //成功创建了目录的话就写入文件
          fs.cpSync(chunk.path, chunkPath);
          fs.rmSync(chunkPath);
        });
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
      //解释这里出现了错误
    }
    return {
      data: '',
      code: 0,
      message: '上传成功',
    };
  }

  findAll(value: { page: number; pageSize: number }) {
    const { page, pageSize } = value;
    //进行文件查询
    try {
      const res = this.File.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      return res;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
