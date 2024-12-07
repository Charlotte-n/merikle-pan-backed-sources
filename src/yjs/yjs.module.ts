import { Module } from '@nestjs/common';
import { YjsService } from './yjs.service';
import { YjsController } from './yjs.controller';
import { YjsGateway } from './yjs.gateway';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [YjsController],
  providers: [YjsService, YjsGateway],
})
export class YjsModule {}
