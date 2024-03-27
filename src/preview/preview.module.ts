import { Module } from '@nestjs/common';
import { PreviewService } from './preview.service';
import { PreviewController } from './preview.controller';

@Module({
  controllers: [PreviewController],
  providers: [PreviewService],
})
export class PreviewModule {}
