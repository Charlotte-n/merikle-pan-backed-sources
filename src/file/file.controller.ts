import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
  Body,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Pagation } from '../pagation/pagation.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddFileOrFolderDto, mergeParam } from './dto/post-file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * 上传切片
   * @param file
   * @param filename
   * @param fileHash
   * @param chunkIndex
   * @param res
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Res({ passthrough: true }) res: any,
  ) {
    console.log(file, '我是文件', filename, fileHash, chunkIndex);
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
   */

  @Get('upload/isExit')
  async verifyExit(
    @Query('fileSize') fileSize: number,
    @Query('user_id') user_id: any,
    @Query('fileHash') fileHash: string,
    @Query('totalCount') totalCount: number,
    @Query('filename') filename: string,
    @Query('file_type') file_type: string,
    @Res({ passthrough: true }) res: any,
  ) {
    console.log(fileSize, user_id, filename, totalCount, fileHash);
    const result = await this.fileService.verifyExit(
      fileSize,
      user_id,
      fileHash,
      totalCount,
      filename,
      file_type,
    );
    console.log(result);
    return result;
  }

  /**
   * 增加文件夹
   * @param body
   * @param res
   */
  @Post('addNewFolder')
  async addNewFolderOrFile(
    @Body() body: AddFileOrFolderDto,
    @Res({ passthrough: true }) res: any,
  ) {
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
   * 删除文件夹
   * @param body
   * @param res
   */
  @Post('deleteFolder')
  async deleteFolder(
    @Body() body: AddFileOrFolderDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const { fileId, filePid, name } = body;
    return await this.fileService.deleteFolder(fileId, filePid, name);
  }
  @Post('rename')
  async Rename() {}

  @Post('merge')
  mergeFile(@Body() body: mergeParam) {
    const { fileHash, filename, fileSize, user_id, file_type } = body;
    return this.fileService.mergeFile(
      fileHash,
      filename,
      fileSize,
      user_id,
      file_type,
    );
  }
  /**
   * 获取文件列表
   */
  @Get('list')
  async findAll(
    @Pagation() pagation: { page: number; pageSize: number },
    @Res({ passthrough: true }) res: any,
  ) {
    //进行分页查询
    return await this.fileService.findAll(pagation);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
