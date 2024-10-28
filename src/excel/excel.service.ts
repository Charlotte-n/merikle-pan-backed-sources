import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class ExcelService {
  @Get('/commonExcel/fetchExcelData')
  findOne(id: number) {
    return `This action returns a #${id} excel`;
  }
}
