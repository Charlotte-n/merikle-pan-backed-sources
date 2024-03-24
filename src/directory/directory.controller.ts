import { Controller, Get, Post, Body, Query, Patch } from '@nestjs/common';
import { DirectoryService } from './directory.service';
import { MoveDirectoryDto } from './dto/move-directory.dto';
import { AllDirectoryDto } from './dto/all-direcoty.dto';

@Controller('directory')
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get('subDirectory')
  async getSubDirectory(@Query('fileId') fileId: string) {
    return await this.directoryService.getSubDirectory(fileId);
  }

  /**
   * 获取用户的folder
   * @param body
   */
  @Post('allDirectory')
  async getAllDirectory(@Body() body: AllDirectoryDto) {
    return await this.directoryService.getAllDirectory(body.filePid);
  }

  /**
   * 获取目录导航地址
   * @param path
   */
  @Get('getNavigation')
  async getNavigation(@Query('path') path: string) {
    return await this.directoryService.getNavigation(path);
  }

  @Patch('move')
  async MoveDirectory(@Body() body: MoveDirectoryDto) {
    const { ids, filePid } = body;
    return await this.directoryService.MoveDirectory(ids, filePid);
  }
}
