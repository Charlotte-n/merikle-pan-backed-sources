import { Controller, Get, Post, Body, Query, Patch } from '@nestjs/common';
import { DirectoryService } from './directory.service';
import { MoveDirectoryDto } from './dto/move-directory.dto';

@Controller('directory')
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  /**
   * 获取用户的folder
   * @param userId
   * @param filePid
   */
  @Get('allDirectory')
  async getAllDirectory(
    @Query('userId') userId: string,
    @Query('filePid') filePid: number | string,
  ) {
    return await this.directoryService.getAllDirectory(userId, filePid);
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
