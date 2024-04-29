import { Controller, Get, Post, Body, Res, Query } from '@nestjs/common';
import { CommonExcelService } from './common-excel.service';

@Controller('commonExcel')
export class CommonExcelController {
  constructor(private readonly commonExcelService: CommonExcelService) {}

  @Post('saveExcelData')
  async saveExcelData() {}

  @Post('fetchExcelData')
  async fetchExcelData(@Query('id') id: string, @Res() res: any) {
    const result = await this.commonExcelService.fetchExcelData(id);
    res.send(result.data);
  }
}
