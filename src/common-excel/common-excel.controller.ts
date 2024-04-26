import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { CommonExcelService } from './common-excel.service';

@Controller('commonExcel')
export class CommonExcelController {
  constructor(private readonly commonExcelService: CommonExcelService) {}

  @Post('saveExcelData')
  async saveExcelData() {}

  @Post('fetchExcelData')
  async fetchExcelData(@Body() body: any, @Res() res: any) {
    const result = await this.commonExcelService.fetchExcelData(body);
    res.send(result.data);
  }
}
