import { Module } from '@nestjs/common';
import { TestRedisService } from './test-redis.service';
import { TestRedisController } from './test-redis.controller';

@Module({
  controllers: [TestRedisController],
  providers: [TestRedisService],
})
export class TestRedisModule {}
