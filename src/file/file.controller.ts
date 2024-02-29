import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UploadFileDto } from './dto/update-file.dto';
import { Pagation } from '../pagation/pagation.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.fileService.create(createFileDto);
  }

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
    @Res({ passthrough: true }) res: any,
  ) {
    console.log(fileSize, user_id, filename, totalCount, fileHash);
    const result = await this.fileService.verifyExit(
      fileSize,
      user_id,
      fileHash,
      totalCount,
      filename,
    );
    console.log(result);
    return result;
  }

  @Get('merge')
  mergeFile(fileHash: string, filename: string) {
    this.fileService.mergeFile(fileHash, filename);
  }
  /**
   * 获取文件列表
   */
  @Get('list')
  findAll(@Pagation() pagation: { page: number; pageSize: number }) {
    //进行分页查询
    this.fileService.findAll(pagation);
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
