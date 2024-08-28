import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommonFileService } from './common-file.service';
import { CreateCommonFileDto } from './dto/create-common-file.dto';
import { UpdateCommonFileDto } from './dto/update-common-file.dto';
import { UpdateCommonFileNameDto } from './dto/update-common-file-name.dto';
import { UpdateCommonFilePrivialDto } from './dto/update-common-file-privial.dto';

@Controller('commonFile')
export class CommonFileController {
  constructor(private readonly commonFileService: CommonFileService) {}

  //上传文件的内容
  @Post('/uploadFileContent')
  async uploadFileContent(@Body() body: CreateCommonFileDto) {
    return await this.commonFileService.uploadFileContent(body);
  }

  //获取文档列表
  @Get('/getFileList/:userId')
  async getFileList(@Param('userId') userId: string) {
    return await this.commonFileService.getFileList(userId);
  }
  //更新文件内容
  @Post('/updateFileContent')
  async updateFileContent(@Body() body: UpdateCommonFileDto) {
    return await this.commonFileService.updateFileContent(body);
  }
  //获取文档内容
  @Get('/getFileContent')
  async getFileContent(@Query('id') id: string) {
    return await this.commonFileService.getFileContent(id);
  }
  //获取文档的其他信息
  @Get('/getFileInfo')
  async getFileInfo(@Query('id') id: string) {
    return await this.commonFileService.getFileInfo(id);
  }
  //修改文档名字
  @Post('/changeFileName')
  async updateFileName(@Body() body: UpdateCommonFileNameDto) {
    return await this.commonFileService.updateFileName(body);
  }
  @Post('/updateFilePrivial')
  async updateFilePrivial(@Body() body: UpdateCommonFilePrivialDto) {
    return await this.commonFileService.updateFilePrivial(body);
  }
}
