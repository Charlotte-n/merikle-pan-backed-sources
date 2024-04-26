import { Module } from '@nestjs/common';
import { CommonExcelService } from './common-excel.service';
import { CommonExcelController } from './common-excel.controller';

@Module({
  controllers: [CommonExcelController],
  providers: [CommonExcelService],
})
export class CommonExcelModule {}
