// storage.module.ts
import { Module } from '@nestjs/common';
import { StorageService } from './adaptor.service';
import { AliOSSAdapter } from './ali/ali.adaptor';
import { StorageController } from './adaptor.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [StorageController],
  providers: [
    {
      provide: 'StorageAdapter',
      useFactory: (configService: ConfigService) => {
        const isUsingAliOSS = true; // 根据你的业务逻辑决定使用哪个适配器
        if (isUsingAliOSS) {
          return new AliOSSAdapter({
            region: configService.get('REGION'),
            accessKeyId: configService.get('ACCESS_KEY'),
            accessKeySecret: configService.get('ACCESS_KEY_SECRET'),
            bucket: configService.get('BUCKET'),
            roleArn: configService.get('ROLE_ARN'),
          });
        }
      },
      inject: [ConfigService],
    },
    {
      provide: StorageService,
      useExisting: 'StorageAdapter',
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
