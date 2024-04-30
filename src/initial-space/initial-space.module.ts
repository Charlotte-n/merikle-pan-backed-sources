import { Module } from '@nestjs/common';
import { InitialSpaceService } from './initial-space.service';
import { InitialSpaceController } from './initial-space.controller';

@Module({
  controllers: [InitialSpaceController],
  providers: [InitialSpaceService],
})
export class InitialSpaceModule {}
