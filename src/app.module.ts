import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from '@libs/db';
import { TestRedisModule } from './test-redis/test-redis.module';
import { RedisModule } from './../libs/redis/src/index';

@Module({
  imports: [DbModule, TestRedisModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
