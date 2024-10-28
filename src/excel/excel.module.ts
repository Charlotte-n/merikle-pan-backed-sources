import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ExcelGateway } from './excel.gateway';

@Module({
  providers: [ExcelGateway, ExcelService],
})
export class ExcelModule {}
