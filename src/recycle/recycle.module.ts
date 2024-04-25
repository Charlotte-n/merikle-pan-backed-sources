import { Module } from '@nestjs/common';
import { RecycleService } from './recycle.service';
import { RecycleController } from './recycle.controller';

@Module({
  controllers: [RecycleController],
  providers: [RecycleService],
})
export class RecycleModule {}
