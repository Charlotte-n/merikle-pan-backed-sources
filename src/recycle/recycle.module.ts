import { Module } from '@nestjs/common';
import { RecycleService } from './recycle.service';
import { RecycleController } from './recycle.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from '../../libs/db/models/file_info.model';

@Module({
  controllers: [RecycleController],
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  providers: [RecycleService],
})
export class RecycleModule {}
