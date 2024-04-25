import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ShareService } from './share.service';
import { CreateShareData, CreateShareDto } from './dto/create-share.dto';
import { CancelFileDto } from './dto/cancel-file.dto';

@Controller('share')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  //创建分享链接
  @Post('link')
  async createShareLink(@Body() body: CreateShareDto) {
    return await this.shareService.createShareLink(body as CreateShareData);
  }
  //获取分享的列表
  @Get('list')
  async getShareFile(@Query('userId') userId: number) {
    return await this.shareService.getShareFile(userId);
  }
  //取消分享
  @Post('cancel')
  async cancelShareFile(@Body() body: CancelFileDto) {
    const { ids } = body;
    return await this.shareService.cancelShareFile(ids);
  }

  @Get('getShare')
  async getShareInfo(@Query('fileId') fileId: string) {
    return await this.shareService.getShareInfo(fileId);
  }

  @Get('getShareList')
  async getShareList(@Query('fileId') fileId: string) {
    return await this.shareService.getShareList(fileId);
  }
}
