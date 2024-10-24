import { Module } from '@nestjs/common';
import { YjsService } from './yjs.service';
import { YjsController } from './yjs.controller';
import { YjsGateway } from './yjs.gateway';

@Module({
  controllers: [YjsController],
  providers: [YjsService, YjsGateway],
})
export class YjsModule {}
