import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RecycleService } from './recycle.service';
import { DeleteRecycleDto } from './dto/delete-recycle.dto';
import { RevertRecycleDto } from './dto/revert-recycle.dto';

@Controller('recycle')
export class RecycleController {
  constructor(private readonly recycleService: RecycleService) {}

  /**
   * 获取回收站列表
   * @param userId
   */
  @Get('list')
  async recycleList(@Query('userId') userId: string) {
    return await this.recycleService.getRecycleList(userId);
  }

  /**
   * 彻底删除文件
   * @param body
   */
  @Post('delete')
  async completeDelete(@Body() body: DeleteRecycleDto) {
    const { ids } = body;
    return await this.recycleService.completeDelete(ids);
  }

  /**
   * 还原文件
   * @param body
   */
  @Post('revert')
  async revertFile(@Body() body: RevertRecycleDto) {
    const { ids } = body;
    return await this.recycleService.revertFile(ids);
  }
}
