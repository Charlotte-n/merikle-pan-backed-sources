import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  Body,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Pagation } from '../pagation/pagation.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddFileOrFolderDto, mergeParam } from './dto/post-file.dto';
import { RenameFileDto } from './dto/rename-file.dto';
import {
  DeleteFileorFolderDto,
  MultipleDeleteDto,
} from './dto/delete-file.dto';
import { UploadedCommonFile } from './dto/update-file.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * 上传切片
   * @param file
   * @param filename
   * @param fileHash
   * @param chunkIndex
   */
  @Post('upload/chunk')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'public/chunk',
    }),
  )
  async uploadChunk(
    @UploadedFile() file: Express.Multer.File,
    @Query('filename') filename: string,
    @Query('fileHash') fileHash: string,
    @Query('chunkIndex') chunkIndex: number,
  ) {
    return await this.fileService.uploadChunk(
      file,
      filename,
      chunkIndex,
      fileHash,
    );
  }

  /**
   * 判断文件的状态:来实现秒传和断点续传
   * @param fileSize
   * @param user_id
   * @param fileHash
   * @param totalCount //分为几块
   * @param filename
   * @param file_type
   * @param filePid
   */

  @Get('upload/isExit')
  async verifyExit(
    @Query('fileSize') fileSize: number,
    @Query('user_id') user_id: any,
    @Query('fileHash') fileHash: string,
    @Query('totalCount') totalCount: number,
    @Query('filename') filename: string,
    @Query('file_type') file_type: string,
    @Query('filePid') filePid: string | number,
    @Query('ext') ext: string,
  ) {
    const result = await this.fileService.verifyExit(
      fileSize,
      user_id,
      fileHash,
      totalCount,
      filename,
      file_type,
      filePid,
      ext,
    );
    return result;
  }

  @Get('/isExitFile')
  async isExistFile(
    @Query('hash') hash: string,
    @Query('userId') userId: string,
  ) {
    const result = await this.fileService.isExistFile(hash, userId);
    return result;
  }

  @Post('upload/file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'upload/',
        filename: (req, file, callback) => {
          // 从请求体中获取文件哈希值
          const { hash } = req.query;

          // 确保 fileInfo 是 JSON 格式并解析它
          const fileHash = hash;

          // 使用哈希值作为文件名
          const fileExtName = extname(file.originalname);
          const newFilename = `${fileHash}${fileExtName}`;
          callback(null, newFilename);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() fileInfo: any,
  ) {
    const fileInfoCommon = JSON.parse(fileInfo.fileInfo) as UploadedCommonFile;
    return await this.fileService.uploadFile({
      fileHash: fileInfoCommon.fileHash,
      filePid: fileInfoCommon.filePid,
      fileType: fileInfoCommon.fileType,
      fileSize: fileInfoCommon.fileSize,
      filename: fileInfoCommon.filename,
      userId: fileInfoCommon.userId,
      originalname: file.originalname,
      filePath: fileInfoCommon.filePath,
    });
  }

  /**
   * 增加文件夹
   * @param body
   */
  @Post('addNewFolder')
  async addNewFolderOrFile(@Body() body: AddFileOrFolderDto) {
    //新建目录
    const { fileId, filePid, name, user_id } = body;
    console.log(user_id);
    return await this.fileService.addNewFolderOrFile(
      fileId,
      filePid,
      name,
      user_id,
    );
  }

  /**
   * 删除文件
   * @param body
   */
  @Post('deleteFolder')
  async deleteFolder(@Body() body: DeleteFileorFolderDto) {
    const { fileId, time } = body;
    return await this.fileService.deleteFolder(fileId, time);
  }

  /**
   * 批量删除
   * @param body
   */
  @Post('multipleDelete')
  async multipleDelete(@Body() body: MultipleDeleteDto) {
    const { ids, time } = body;
    return await this.fileService.multipleDelete(ids, time);
  }

  /**
   * 重命名
   * @param body
   * @constructor
   */
  @Post('rename')
  async Rename(@Body() body: RenameFileDto) {
    const { filename, _id } = body;
    return await this.fileService.renameFile(filename, _id);
  }

  /**
   * 合并文件夹
   * @param body
   */
  @Post('merge')
  mergeFile(@Body() body: mergeParam) {
    const { fileHash, filename, fileSize, user_id, file_type, filePid, ext } =
      body;
    return this.fileService.mergeFile(
      fileHash,
      filename,
      fileSize,
      user_id,
      file_type,
      filePid,
      ext,
    );
  }

  /**
   * 获取图片
   * @param _id
   */
  @Get('image')
  async getImage(@Query('_id') _id: string) {
    return await this.fileService.getImage(_id);
  }

  /**
   * 获取文件列表
   */
  @Get('list')
  async findAll(
    @Pagation() pagation: { page: number; pageSize: number },
    @Query('fileType') fileType: number,
    @Query('fileId') fileId: string,
    @Query('title') title?: string,
  ) {
    //进行分页查询x
    return await this.fileService.findAll(pagation, fileType, fileId, title);
  }

  /**
   * 获取文件信息
   * @param id
   */
  @Get('fileInfo')
  async findFileInfo(@Query() id: string) {
    return await this.fileService.findFileInfo(id);
  }

  //添加文件信息
  @Post('addFile')
  async addFile(@Body() addFileBody: UploadedCommonFile) {
    return await this.fileService.addFile(addFileBody);
  }
}
