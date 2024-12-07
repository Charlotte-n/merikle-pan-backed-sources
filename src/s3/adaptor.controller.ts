import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StorageService } from './adaptor.service';
import { uploadDto } from './dto/upload.dto';

@Controller('adaptor')
export class StorageController {
  constructor(private readonly adaptorServices: StorageService) {}

  @Get('getSignature')
  async getSignature(@Query('id') id: string) {
    try {
      const res = await this.adaptorServices.getSignature(id);
      if (res) {
        return {
          code: 0,
          msg: '获取成功',
          data: res,
        };
      }
    } catch (err) {
      return {
        err: err,
      };
    }
  }

  /**
   *普通上传
   * @param simpleUpload
   */
  @Post('simpleUpload')
  async simpleUpload(@Body() simpleUpload: uploadDto) {
    const { name, filePath } = simpleUpload;
    const res = await this.adaptorServices.simpleUpload(name, filePath);
    if (res) {
      return {
        code: 0,
        msg: '上传成功',
        data: [],
      };
    }
  }
}
