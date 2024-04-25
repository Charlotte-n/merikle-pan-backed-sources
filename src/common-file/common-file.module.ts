import { Module } from '@nestjs/common';
import { CommonFileService } from './common-file.service';
import { CommonFileController } from './common-file.controller';

@Module({
  controllers: [CommonFileController],
  providers: [CommonFileService],
})
export class CommonFileModule {}
