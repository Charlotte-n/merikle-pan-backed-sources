import { Inject, Injectable } from '@nestjs/common';
import { CreateTestRediDto } from './dto/create-test-redi.dto';
import { UpdateTestRediDto } from './dto/update-test-redi.dto';
import { RedisService } from '../../libs/redis/src/redis.service';

@Injectable()
export class TestRedisService {
  @Inject(RedisService)
  private redisServices: RedisService;
  create(createTestRediDto: CreateTestRediDto) {
    return 'This action adds a new testRedi';
  }

  findAll() {
    return `This action returns all testRedis`;
  }

  async findOne(id: number) {
    const name = await this.redisServices.get('name');
    console.log(name);
    return `This action findOne a #${id} testRedi`;
  }

  update(id: number, updateTestRediDto: UpdateTestRediDto) {
    this.redisServices.set('name', 'Merikle');
    return `This action updates a #${id} testRedi`;
  }

  remove(id: number) {
    return `This action removes a #${id} testRedi`;
  }
}
