import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;
  //封装一些方法
  //获取值
  async get(key: string) {
    let value = await this.redisClient.get(key);
    try {
      value = JSON.parse(value);
    } catch (error) {}
    return value;
  }
  /**
   * 设置值
   * @param key {string} key
   * @param value 值
   * @param second 过期时间 秒
   * @returns Promise<any>
   */
  async set(key: string, value: any, second?: number) {
    value = JSON.stringify(value);
    console.log(value);
    return await this.redisClient.set(key, value, { EX: second });
  }
  //删除值
  async del(key: string) {
    return await this.redisClient.del(key);
  }
  //清除缓存
  async flushAll() {
    return await this.redisClient.flushAll();
  }
}
