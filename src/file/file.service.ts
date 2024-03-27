import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  getFileType(value: string) {
    const category = [
      'folder',
      'video',
      'music',
      'image',
      'pdf',
      'word',
      'sheet',
      'txt',
      'code',
      'zip',
      'others',
    ];
    for (let i = 0; i < category.length; i++) {
      if (!value) {
        return 10;
      }
      if (value.includes(category[i])) {
        return i;
      }
    }
  }
  /**
   * 合并文件
   * @param fileHash
   * @param filename
   * @param fileSize
   * @param user_id
   * @param file_type
   * @param filePid
   */
  async mergeFile(
    fileHash: string,
    filename: string,
    fileSize: number,
    user_id: string,
    file_type: string,
    filePid: string | number,
  ) {
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
    try {
      const id = await this.getUserId(user_id);
      //将文件的数据插入到file里面
      await this.File.create({
        file_name: filename,
        file_path: 'upload/' + filename,
        file_id: fileHash + new Date().getSeconds(),
        file_size: this.getDanWei(Number(fileSize)),
        file_md5: fileHash,
        create_time: new Date().getTime(),
        file_type: this.getFileType(file_type),
        folder_type: 0,
        user: id,
        file_cover: filename,
        del_flag: 0,
        file_pid: filePid,
      });
      //获取用户的space
      let useSpace = await this.getUseSpace(user_id);
      useSpace = useSpace ? useSpace : 0;
      //更新数据
      await this.User.updateOne(
        { _id: user_id },
        { useSpace: useSpace + this.getDanWei(Number(fileSize)) },
      );
    } catch (e) {
      return {
        message: '已经创建了该文件不能重复创建',
        code: 1,
      };
    }
    return {
      message: '合并成功',
      code: 0,
    };
  }
  async getUserId(user_id: string) {
    const user = await this.User.findOne({ _id: user_id });
    return user._id;
  }
  async getUseSpace(user_id: string) {
    const user = await this.User.findOne({ _id: user_id });
    return user.useSpace;
  }

  getDanWei(fileSize: number) {
    return Number(fileSize / Math.pow(2, 30));
  }
  /**
   * 判断文件状态和是否可以进行秒传、断点上传，总而言之就是判断此时文件上传的状态
   * @param fileSize
   * @param user_id
   * @param fileHash
   * @param totalCount
   * @param filename
   * @param file_type
   * @param filePid
   */
  async verifyExit(
    fileSize: number,
    user_id: any,
    fileHash: string,
    totalCount: number,
    filename: string,
    file_type: string,
    filePid: string | number,
  ) {
    const dirPath = 'upload/chunks' + '_' + fileHash; //存放的chunk的目录
    const filePath = dirPath + '/' + filename; //存放chunk的地址,这个filename前端要进行修改生成有hash值且有索引的名字
    const reg = /(.+)\-\d+$/;
    const name = filename.match(reg)[1];
    //判断文件的大小
    const user = await this.User.findOne({
      _id: user_id,
    });
    const totalSpace = user.totalSpace;
    const useSpace = user.useSpace === undefined || null ? 0 : user.useSpace;
    if (!(this.getDanWei(Number(fileSize)) + useSpace < totalSpace)) {
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
      res = [];
      message = '秒传';
      code = 0;
      //更新数据库,先查找该文件，之后进行上传
      await this.File.create({
        create_time: new Date().getTime(),
        file_size: this.getDanWei(Number(fileSize)),
        file_md5: fileHash,
        file_id: fileHash,
        file_name: name,
        file_path: filePath,
        file_type: this.getFileType(file_type),
        folder_type: 0,
        user: user._id,
        del_flag: 0,
        file_cover: name,
        file_pid: filePid,
      });
      await this.File.findOne({
        file_id: fileHash,
      }).populate('user');
      //获取用户的useSpace
      let useSpace = await this.getUseSpace(user_id);
      useSpace = useSpace ? useSpace : 0;
      //然后修改useSpace
      await this.User.updateOne(
        { _id: user_id },
        { useSpace: this.getDanWei(Number(fileSize)) + useSpace },
      );
    } catch (e) {
      //文件不存在,文件夹存在
      console.log(e);
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
          }
          // } else {
          //   //没有进行合并，进行一下合并
          //   await this.mergeFile(fileHash, name, fileSize, user_id, file_type);
          //   res = [];
          //   message = '合并成功';
          //   code = 0;
          // }
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
      code: code, //0为秒传，1为上传成功，2为
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
  async getImage(_id: string) {
    const res = await this.File.findOne({ _id });
    return {
      code: 0,
      data: {
        image: res.file_path,
      },
      message: '成功',
    };
  }

  /**
   * 文件列表
   * @param value
   * @param fileType
   * @param fileId
   * @param title
   */
  async findAll(
    value: { page: number; pageSize: number },
    fileType: number,
    fileId: string,
    title?: string,
  ) {
    const { page, pageSize } = value;
    //进行文件查询
    try {
      //判断是否有fileId:此时获取的是文件夹里面的内容
      if (fileId) {
        let res;
        //判断是否有title
        if (title) {
          res = await this.File.find({
            del_flag: 0,
            file_pid: fileId,
            file_name: { $regex: title, $options: 'i' },
          })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        } else {
          res = await this.File.find({ del_flag: 0, file_pid: fileId })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        }
        return {
          data: res,
          message: '获取成功',
          code: 0,
        };
      }
      //根据文件的类型来进行查找相关的文件
      if (fileType >= 0) {
        let res;
        if (title) {
          res = await this.File.find({
            del_flag: 0,
            file_type: fileType,
            file_name: { $regex: title, $options: 'i' },
          })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        } else {
          res = await this.File.find({
            del_flag: 0,
            file_type: fileType,
          })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        }
        return {
          data: res,
          message: '获取成功',
          code: 0,
        };
      } else {
        const res = await this.File.find({ del_flag: 0 })
          .skip((page - 1) * pageSize)
          .limit(pageSize);
        return {
          data: res,
          message: '获取成功',
          code: 0,
        };
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 获取文件信息
   * @param id
   */
  async findFileInfo(id: string) {
    try {
      const res = await this.File.find({ _id: id });
      return {
        data: res,
        message: '文件信息获取成功',
        code: 0,
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  //获取使用空间
  async getSpace(userId: string) {
    try {
      const res = await this.User.findOne({
        _id: userId,
      });
      console.log(res);
      return {
        message: '获取成功',
        data: {
          useSpace: res.useSpace,
          totalSpace: res.totalSpace,
        },
      };
    } catch (e) {}
  }
  /**
   * 创建目录
   * @param fileId
   * @param filePid
   * @param filename
   * @param user_id
   */
  async addNewFolderOrFile(
    fileId: string,
    filePid: string,
    filename: string,
    user_id: string,
  ) {
    try {
      await this.File.create({
        file_name: filename,
        file_id: fileId,
        file_pid: filePid,
        create_time: new Date().getTime(),
        folder_type: 1,
        user: await this.getUserId(user_id),
        del_flag: 0,
      });
      return {
        data: '',
        message: '创建成功',
        code: 0,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException('已经创建了该文件', HttpStatus.OK);
    }
  }

  async renameFile(filename: string, _id: string) {
    try {
      await this.File.updateOne({ _id }, { file_name: filename });
      return {
        message: '重命名成功',
        code: 0,
      };
    } catch (e) {
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 删除文件夹
   * @param fileId
   * @param filePid
   * @param filename
   * @param user_id
   */
  async deleteFolder(fileId: string) {
    try {
      await this.File.updateOne(
        {
          _id: fileId,
        },
        { del_flag: 1 },
      );
      return {
        message: '删除成功',
        code: 0,
      };
    } catch (e) {
      new HttpException('删除成功', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 批量删除
   * @param ids
   */
  async multipleDelete(ids: string[]) {
    try {
      //of得到value，in得到key
      for (const item of ids) {
        console.log(item, '删除');
        await this.File.updateOne({ _id: item }, { del_flag: 1 });
      }
      return {
        message: '删除成功',
        code: 0,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
